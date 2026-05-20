"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  tag?: string;
  title: string;
  points?: string[];
  stat?: string;
  image?: string;
  reversed?: boolean;
}

export interface FeaturesBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  items: FeatureItem[];
  darkMode?: boolean;
}

export function FeaturesBlock({ data }: { data: FeaturesBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white"
    )}>
      <div className="max-w-6xl mx-auto px-6 text-center mb-14">
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
            isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
          )}>
            {data.badge}
          </span>
        )}
        {(data.title || data.titleHighlight) && (
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {data.titleHighlight && (
              <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
            )}{" "}
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className={cn(
            "max-w-2xl mx-auto text-sm",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>{data.subtitle}</p>
        )}
      </div>

      <div className="space-y-24">
        {data.items?.map((feature, i) => {
          const isItemReversed = feature.reversed !== undefined ? feature.reversed : i % 2 !== 0;

          return (
            <div key={i} className="max-w-6xl mx-auto px-6">
              <div
                className={cn(
                  "flex flex-col gap-10 md:gap-16 items-center",
                  isItemReversed ? "md:flex-row-reverse" : "md:flex-row"
                )}
              >
                <motion.div
                  initial={{ opacity: 0, x: isItemReversed ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 space-y-4"
                >
                  {feature.tag && (
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-widest",
                      isDark ? "text-slate-400" : "text-slate-400"
                    )}>
                      {feature.tag}
                    </p>
                  )}
                  <h3 className="text-2xl md:text-3xl font-black leading-snug">{feature.title}</h3>
                  {feature.points && feature.points.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {feature.points.map((point, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <svg className="mt-0.5 shrink-0 w-5 h-5 text-[#fa6e5b]" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                          </svg>
                          <p className={cn(
                            "text-sm",
                            isDark ? "text-slate-300" : "text-slate-600"
                          )}>{point}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {feature.stat && (
                    <div className={cn(
                      "mt-6 p-5 rounded-xl border-l-4 border-[#fa6e5b]",
                      isDark ? "bg-white/5" : "bg-slate-50"
                    )}>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          isDark ? "text-slate-300" : "text-slate-700"
                        )}
                        dangerouslySetInnerHTML={{ __html: feature.stat }}
                      />
                    </div>
                  )}
                </motion.div>

                {feature.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-1"
                  >
                    <img src={feature.image} alt={feature.title} className="w-full h-auto" />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
