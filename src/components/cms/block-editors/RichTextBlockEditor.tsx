"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/toc-utils";
import { cn } from "@/lib/utils";
import { MediaPicker } from "../MediaPicker";
import { Toggle } from "@/components/ui/Toggle";
import { 
  Bold, Italic, List, ListOrdered, 
  Image as ImageIcon, Link as LinkIcon, 
  Quote, Eraser, 
  Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Baseline, Highlighter, Table2, Video, 
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon, 
  CheckSquare, Minus, Code, ChevronDown
} from "lucide-react";

interface RichTextBlockEditorProps {
  data: {
    content: string;
    darkMode?: boolean;
  };
  onChange: (data: any) => void;
}

export function RichTextBlockEditor({ data, onChange }: RichTextBlockEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlightColor, setShowHighlightColor] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadFile = async (file: File | Blob): Promise<string | null> => {
    try {
      console.log('🚀 [Editor] Uploading...', file.type);
      const fileExt = file.type.split('/')[1] || 'png';
      const fileName = `pasted_${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) {
        console.error('❌ [Editor] Upload Error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      console.log('✅ [Editor] Upload Success:', publicUrl);

      // Register pasted direct image in media_assets database table to display in Media Picker
      const originalName = (file as File).name || `pasted-image-${Date.now()}.${fileExt}`;
      const { data: dbData, error: dbError } = await supabase
        .from("media_assets")
        .insert({
          name: fileName,
          original_name: originalName,
          file_path: filePath,
          public_url: publicUrl,
          mime_type: file.type || `image/${fileExt}`,
          file_type: "image",
          size_bytes: file.size,
          folder_id: null,
          folder: "/",
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ [Editor] Database insert failed for direct paste:', dbError);
      } else {
        console.log('✅ [Editor] Database entry created for direct paste:', dbData.id);
      }

      return publicUrl;
    } catch (err) {
      console.error('❌ [Editor] Exception:', err);
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-[32px] border border-slate-100 shadow-lg my-8 max-w-full h-auto' },
      }),
      Placeholder.configure({
        placeholder: 'Dán nội dung từ WordPress hoặc bắt đầu viết...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-[32px] border border-slate-100 my-8 max-w-full shadow-lg',
        },
      }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: data.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[450px] w-full p-10 bg-white border border-slate-200 rounded-[32px] outline-none focus:border-primary transition-all shadow-inner bg-slate-50/30 prose prose-slate max-w-none prose-headings:font-black prose-h2:text-2xl prose-h3:text-xl prose-table:border-collapse prose-table:w-full',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const file = items[i].getAsFile();
              if (file) {
                uploadFile(file).then(url => {
                  if (url) {
                    const node = view.state.schema.nodes.image.create({ src: url });
                    const transaction = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                  }
                });
                return true;
              }
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html.includes('<h2') || html.includes('<h3') || html.includes('<h4')) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('h2, h3, h4').forEach(h => {
          const id = slugify(h.textContent || "");
          if (h.id !== id) h.id = id;
        });
        onChange({ ...data, content: doc.body.innerHTML });
      } else {
        onChange({ ...data, content: html });
      }
    },
  });

  // Improved background image migration using server-side API to bypass CORS
  useEffect(() => {
    if (!editor) return;

    const migrateImages = async () => {
      const html = editor.getHTML();
      if (!html.includes('src="http') || html.includes('supabase.co')) return;

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const externalImages = Array.from(doc.querySelectorAll('img')).filter(img => {
        const src = img.getAttribute('src');
        return src && src.startsWith('http') && !src.includes('supabase.co');
      });

      if (externalImages.length === 0) return;

      console.log(`🔍 [Editor] Found ${externalImages.length} images to migrate`);

      for (const img of externalImages) {
        const src = img.getAttribute('src')!;
        try {
          const response = await fetch("/api/media/upload-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: src }),
          });

          if (!response.ok) throw new Error('Migration API failed');
          const result = await response.json();
          const url = result.publicUrl;
          
          if (url) {
            editor.commands.command(({ tr }) => {
              tr.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === src) {
                  tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: url });
                }
              });
              return true;
            });
            console.log('✅ [Editor] Migrated external image:', src, '->', url);
          }
        } catch (e) {
          console.error('❌ [Editor] Migration failed for:', src, e);
        }
      }
    };

    const timer = setTimeout(migrateImages, 2000);
    return () => clearTimeout(timer);
  }, [editor, editor?.getHTML()]);

  if (!isMounted || !editor) return <div className="min-h-[450px] bg-slate-50 animate-pulse rounded-[32px]" />;

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertYoutube = () => {
    const url = window.prompt("Nhập URL video YouTube:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="space-y-4">
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h2 { font-size: 1.75rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; color: #0f172a; }
        .ProseMirror h3 { font-size: 1.4rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e293b; }
        .ProseMirror h4 { font-size: 1.15rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #334155; }
        .ProseMirror blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; font-style: italic; margin: 1.5rem 0; color: #475569; background-color: #f8fafc; padding: 1rem 1.5rem; border-radius: 0 16px 16px 0; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .ProseMirror a { color: #3b82f6; text-decoration: underline; cursor: pointer; }
        .ProseMirror strike { text-decoration: line-through; }
        .ProseMirror code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 6px; font-family: monospace; font-size: 0.9em; color: #e11d48; }
        
        /* Table Styles */
        .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 2rem 0; overflow: hidden; border-radius: 12px; border: 1px solid #e2e8f0; }
        .ProseMirror table td, .ProseMirror table th { min-width: 1em; border: 1px solid #e2e8f0; padding: 0.75rem 1rem; vertical-align: top; box-sizing: border-box; position: relative; }
        .ProseMirror table th { font-weight: bold; text-align: left; background-color: #f8fafc; color: #0f172a; }
        .ProseMirror table .selectedCell:after { z-index: 2; position: absolute; content: ""; left: 0; right: 0; top: 0; bottom: 0; background: rgba(59, 130, 246, 0.08); pointer-events: none; }
        .ProseMirror table .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: #3b82f6; pointer-events: none; }
        
        /* Task List Styles */
        .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0.5rem; }
        .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; }
        .ProseMirror ul[data-type="taskList"] li > label { flex: 0 0 auto; user-select: none; margin-top: 0.25rem; }
        .ProseMirror ul[data-type="taskList"] li > div { flex: 1 1 auto; }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] { cursor: pointer; width: 1.1rem; height: 1.1rem; accent-color: #3b82f6; border-radius: 4px; border: 1px solid #cbd5e1; }
        
        /* Alignments */
        .ProseMirror [style*="text-align: center"] { text-align: center; }
        .ProseMirror [style*="text-align: right"] { text-align: right; }
        .ProseMirror [style*="text-align: justify"] { text-align: justify; }
        .ProseMirror [style*="text-align: left"] { text-align: left; }
      `}} />

      {/* Bubble Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-[320px]">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('bold') && "bg-primary text-white")}><Bold className="w-3.5 h-3.5" /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('italic') && "bg-primary text-white")}><Italic className="w-3.5 h-3.5" /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('underline') && "bg-primary text-white")}><UnderlineIcon className="w-3.5 h-3.5" /></button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('strike') && "bg-primary text-white")}><span className="text-xs font-bold leading-none px-0.5 text-white">S</span></button>
          
          <div className="w-px h-4 bg-slate-700 mx-0.5" />
          
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive({ textAlign: 'left' }) && "bg-primary")}><AlignLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive({ textAlign: 'center' }) && "bg-primary")}><AlignCenter className="w-3.5 h-3.5" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive({ textAlign: 'right' }) && "bg-primary")}><AlignRight className="w-3.5 h-3.5" /></button>
          
          <div className="w-px h-4 bg-slate-700 mx-0.5" />
          
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('blockquote') && "bg-primary")}><Quote className="w-3.5 h-3.5" /></button>
          <button onClick={() => { const url = window.prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className={cn("p-1.5 rounded-lg text-white hover:bg-slate-700", editor.isActive('link') && "bg-primary")}><LinkIcon className="w-3.5 h-3.5" /></button>
        </div>
      </BubbleMenu>

      {/* Modern, Premium Toolbar */}
      <div className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-3xl sticky top-0 z-10 shadow-sm transition-all duration-200">
        
        {/* Row 1: Core Formats, Colors, Lists, Alignments & Objects */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Typography Dropdown */}
          <div className="flex items-center gap-1">
            <select 
              value={
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                editor.isActive('heading', { level: 4 }) ? 'h4' : 'p'
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') editor.chain().focus().setParagraph().run();
                else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <option value="p">Đoạn văn (Paragraph)</option>
              <option value="h2">Tiêu đề lớn (Heading H2)</option>
              <option value="h3">Tiêu đề trung (Heading H3)</option>
              <option value="h4">Tiêu đề nhỏ (Heading H4)</option>
            </select>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* Standard Styles */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => editor.chain().focus().toggleBold().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('bold') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Chữ đậm"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('italic') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Chữ nghiêng"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleUnderline().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('underline') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Gạch chân"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleStrike().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('strike') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Gạch ngang"
            >
              <span className="text-xs font-black px-1 leading-none text-slate-600">S</span>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleCode().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('code') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Mã code dòng"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Subscript / Superscript */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => editor.chain().focus().toggleSubscript().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('subscript') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Chỉ số dưới"
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleSuperscript().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('superscript') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Chỉ số trên"
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* Alignments */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => editor.chain().focus().setTextAlign('left').run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive({ textAlign: 'left' }) ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900")}
              title="Căn trái"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('center').run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive({ textAlign: 'center' }) ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900")}
              title="Căn giữa"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('right').run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive({ textAlign: 'right' }) ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900")}
              title="Căn phải"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive({ textAlign: 'justify' }) ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900")}
              title="Căn đều"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* Text Color Popover */}
          <div className="relative">
            <button 
              onClick={() => { setShowTextColor(!showTextColor); setShowHighlightColor(false); }} 
              className={cn(
                "p-2 hover:bg-slate-50 rounded-xl text-slate-600 flex items-center gap-1 border border-slate-200 cursor-pointer transition-colors",
                showTextColor && "bg-slate-100"
              )}
              title="Màu chữ"
            >
              <Baseline className="w-4 h-4" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#0f172a' }} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showTextColor && (
              <div className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-30 flex flex-col min-w-[170px] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { color: '#0f172a', label: 'Slate' },
                    { color: '#3b82f6', label: 'Blue' },
                    { color: '#ef4444', label: 'Red' },
                    { color: '#10b981', label: 'Green' },
                    { color: '#f59e0b', label: 'Orange' },
                    { color: '#8b5cf6', label: 'Purple' },
                    { color: '#ec4899', label: 'Pink' },
                    { color: '#06b6d4', label: 'Cyan' },
                    { color: '#64748b', label: 'Muted' },
                    { color: '#ffffff', label: 'White' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => {
                        if (c.color === '#0f172a') {
                          editor.chain().focus().unsetColor().run();
                        } else {
                          editor.chain().focus().setColor(c.color).run();
                        }
                        setShowTextColor(false);
                      }}
                      className="w-6 h-6 rounded-lg border border-slate-200 hover:scale-110 hover:shadow-sm transition-all cursor-pointer"
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
                {/* Custom Color Input */}
                <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tự chọn:</span>
                  <input 
                    type="color" 
                    value={editor.getAttributes('textStyle').color || '#0f172a'}
                    onChange={(e) => {
                      editor.chain().focus().setColor(e.target.value).run();
                    }}
                    className="w-8 h-6 rounded-md border border-slate-200 cursor-pointer bg-transparent"
                    title="Chọn màu chữ tùy biến"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Highlight/Background Color Popover */}
          <div className="relative">
            <button 
              onClick={() => { setShowHighlightColor(!showHighlightColor); setShowTextColor(false); }} 
              className={cn(
                "p-2 hover:bg-slate-50 rounded-xl text-slate-600 flex items-center gap-1 border border-slate-200 cursor-pointer transition-colors",
                showHighlightColor && "bg-slate-100"
              )}
              title="Tô nền văn bản"
            >
              <Highlighter className="w-4 h-4" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent' }} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showHighlightColor && (
              <div className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-30 flex flex-col min-w-[170px] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { color: 'transparent', label: 'Không nền' },
                    { color: '#fef08a', label: 'Vàng nhạt' },
                    { color: '#bbf7d0', label: 'Lục nhạt' },
                    { color: '#bfdbfe', label: 'Lam nhạt' },
                    { color: '#fecaca', label: 'Đỏ nhạt' },
                    { color: '#e9d5ff', label: 'Tím nhạt' },
                    { color: '#fbcfe8', label: 'Hồng nhạt' },
                    { color: '#fed7aa', label: 'Cam nhạt' },
                    { color: '#e2e8f0', label: 'Xám nhạt' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => {
                        if (c.color === 'transparent') {
                          editor.chain().focus().unsetHighlight().run();
                        } else {
                          editor.chain().focus().setHighlight({ color: c.color }).run();
                        }
                        setShowHighlightColor(false);
                      }}
                      className={cn(
                        "w-6 h-6 rounded-lg border border-slate-200 hover:scale-110 hover:shadow-sm transition-all cursor-pointer relative",
                        c.color === 'transparent' && "bg-slate-50 after:absolute after:inset-0 after:bg-red-500 after:w-px after:h-full after:rotate-45 after:mx-auto"
                      )}
                      style={{ backgroundColor: c.color !== 'transparent' ? c.color : undefined }}
                      title={c.label}
                    />
                  ))}
                </div>
                {/* Custom Highlight Input */}
                <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tự chọn:</span>
                  <input 
                    type="color" 
                    value={editor.getAttributes('highlight').color || '#fef08a'}
                    onChange={(e) => {
                      editor.chain().focus().setHighlight({ color: e.target.value }).run();
                    }}
                    className="w-8 h-6 rounded-md border border-slate-200 cursor-pointer bg-transparent"
                    title="Chọn màu nền tùy biến"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* List group */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => editor.chain().focus().toggleBulletList().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('bulletList') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Danh sách dấu chấm"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleOrderedList().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('orderedList') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Danh sách số"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleTaskList().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('taskList') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Danh sách công việc"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* Objects insertion (Table, Video, Link, HR, Quote) */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <MediaPicker 
              onSelect={(url) => editor.chain().focus().setImage({ src: url }).run()} 
              trigger={<button className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer" title="Chèn ảnh từ Media"><ImageIcon className="w-4 h-4" /></button>} 
            />
            <button 
              onClick={insertTable} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('table') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Chèn bảng biểu (3x3)"
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button 
              onClick={insertYoutube} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-slate-900")}
              title="Nhúng video YouTube"
            >
              <Video className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { const url = window.prompt('Nhập link liên kết:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('link') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Tạo liên kết"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleBlockquote().run()} 
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", editor.isActive('blockquote') ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}
              title="Trích dẫn"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().setHorizontalRule().run()} 
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Đường phân cách ngang"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          {/* Cleaners & Tools */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} 
              className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Xóa mọi định dạng văn bản"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Dark Mode switcher at right end */}
          <div className="ml-auto flex items-center gap-2 pl-4 border-l border-slate-200">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Dark Mode</span>
            <Toggle checked={!!data.darkMode} onChange={(v) => onChange({ ...data, darkMode: v })} />
          </div>

        </div>

        {/* Row 2: Contextual Table Toolbar (Displays dynamically when inside a table cell) */}
        {editor.isActive('table') && (
          <div className="flex flex-wrap items-center gap-1 bg-blue-50/75 border border-blue-150 p-1.5 rounded-2xl animate-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest px-2.5 mr-1 select-none">Công cụ Bảng:</span>
            <div className="flex flex-wrap items-center gap-1">
              <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Thêm cột trái</button>
              <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Thêm cột phải</button>
              <button onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2.5 py-1 text-[11px] font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl transition-all cursor-pointer">Xóa cột</button>
              
              <div className="w-px h-4 bg-blue-200 mx-1.5" />
              
              <button onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Thêm hàng trên</button>
              <button onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Thêm hàng dưới</button>
              <button onClick={() => editor.chain().focus().deleteRow().run()} className="px-2.5 py-1 text-[11px] font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl transition-all cursor-pointer">Xóa hàng</button>
              
              <div className="w-px h-4 bg-blue-200 mx-1.5" />
              
              <button onClick={() => editor.chain().focus().mergeCells().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Gộp ô</button>
              <button onClick={() => editor.chain().focus().splitCell().run()} className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer">Tách ô</button>
              
              <div className="w-px h-4 bg-blue-200 mx-1.5" />
              
              <button onClick={() => editor.chain().focus().deleteTable().run()} className="px-3 py-1 text-[11px] font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all cursor-pointer">Xóa bảng</button>
            </div>
          </div>
        )}

      </div>

      {/* Editor Content Area */}
      <div className="relative group">
        <EditorContent editor={editor} className="tiptap-container" />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-4">
        <p className="italic">
          TipTap Premium Editor: Hỗ trợ dán từ WordPress cực tốt, tự động tối ưu ảnh và gán mục lục.
        </p>
      </div>
    </div>
  );
}
