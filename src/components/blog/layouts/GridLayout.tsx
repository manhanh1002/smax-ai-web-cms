"use client";
import React, { useState } from "react";
import { BlogCard } from "../BlogCard";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface GridLayoutProps {
  posts: any[];
  categories: any[];
  initialCategory?: string;
  showSearch?: boolean;
}

export function GridLayout({ posts, categories, initialCategory = "all", showSearch = true }: GridLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => {
    // If we have an initialCategory (not "all"), filter by it
    const matchesCategory = initialCategory === "all" || post.categories?.slug === initialCategory;
    
    // Search query matching
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      {showSearch && (
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-[32px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-lg font-medium shadow-sm"
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-black uppercase tracking-widest">
            {searchQuery ? `Không tìm thấy bài viết cho "${searchQuery}"` : "Chưa có bài viết nào"}
          </p>
        </div>
      )}
    </div>
  );
}
