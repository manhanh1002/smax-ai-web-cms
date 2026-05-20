"use client";
import React from "react";
import { BlogCard } from "../BlogCard";

interface MagazineLayoutProps {
  posts: any[];
}

export function MagazineLayout({ posts }: MagazineLayoutProps) {
  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="space-y-16">
      <BlogCard post={featuredPost} layout="featured" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
