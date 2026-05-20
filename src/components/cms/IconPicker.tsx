"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X, Smile } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  color?: string;
}

export function IconPicker({ value, onChange, color = "primary" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      (key) => typeof (LucideIcons as any)[key] === "function" || typeof (LucideIcons as any)[key] === "object"
    );
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search) return allIcons.slice(0, 100); // Limit initial view for performance
    return allIcons.filter((name) => 
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 100);
  }, [allIcons, search]);

  // @ts-ignore
  const SelectedIcon = (typeof value === 'string' && LucideIcons[value]) ? LucideIcons[value] : X;

  const getColorClass = (c: string) => {
    switch (c) {
      case 'primary': return 'text-primary';
      case 'blue-500': return 'text-blue-600';
      case 'green-500': return 'text-green-600';
      case 'purple-500': return 'text-purple-600';
      case 'orange-500': return 'text-orange-600';
      case 'red-500': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-between px-3 h-10"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center bg-gray-100 ${getColorClass(color)}`}>
            <SelectedIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-gray-700">{typeof value === 'string' ? value : "Select Icon"}</span>
        </div>
        <Search className="w-3 h-3 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Select Icon</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  className="pl-10" 
                  placeholder="Search icons..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:bg-red-50 hover:border-red-200 group ${!value ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-gray-100'}`}
                title="No Icon"
              >
                <X className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${!value ? 'text-red-600' : 'text-gray-400'}`} />
                <span className="text-[10px] text-gray-500 truncate w-full text-center">None</span>
              </button>

              {filteredIcons.map((name) => {
                // @ts-ignore
                const Icon = LucideIcons[name];
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:bg-primary/5 hover:border-primary group ${value === name ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100'}`}
                    title={name}
                  >
                    <Icon className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${value === name ? getColorClass(color) : 'text-gray-400'}`} />
                    <span className="text-[10px] text-gray-500 truncate w-full text-center">{name}</span>
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                  No icons found for "{search}"
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 text-center">
              Showing {filteredIcons.length} of {allIcons.length} icons
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
