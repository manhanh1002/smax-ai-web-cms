"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BentoCard {
  title: string;
  description: string;
  image?: string;
}

export interface BentoGridBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards: BentoCard[];
  darkMode?: boolean;
}

function BentoCardInner({
  card,
  imageClass = "h-48",
  delay = 0,
  isDark = false,
}: {
  card: BentoCard;
  imageClass?: string;
  delay?: number;
  isDark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-300",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
      )}
    >
      <div className={cn(
        "w-full flex items-center justify-center p-6", 
        imageClass,
        isDark ? "bg-white/5" : "bg-[#f4f7ff]"
      )}>
        {card.image && (
          <img src={card.image} alt={card.title} className="max-w-full max-h-full object-contain" />
        )}
      </div>
      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <h4 className={cn(
          "text-base font-black mb-2",
          isDark ? "text-white" : "text-[#0F1836]"
        )}>{card.title}</h4>
        <p className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>{card.description}</p>
      </div>
    </motion.div>
  );
}

function BigCard({ card, delay = 0, isDark = false }: { card: BentoCard; delay?: number; isDark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-300",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
      )}
    >
      <div className={cn(
        "w-full flex items-center justify-center p-6 h-56",
        isDark ? "bg-white/5" : "bg-[#f4f7ff]"
      )}>
        {card.image && (
          <img src={card.image} alt={card.title} className="max-w-full max-h-full object-contain" />
        )}
      </div>
      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <h4 className={cn(
          "text-base font-black mb-2",
          isDark ? "text-white" : "text-[#0F1836]"
        )}>{card.title}</h4>
        <p className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>{card.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoGridBlock({ data }: { data: BentoGridBlockData }) {
  const isDark = data.darkMode === true;
  const cards = data.cards || [];

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0B1229] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
              isDark ? "bg-white/10 border-white/10 text-[#fa6e5b]" : "bg-white border-slate-200 text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-3">
              {data.title}{" "}
              {data.titleHighlight && (
                <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
              )}
            </h2>
          )}
          {data.subtitle && (
            <p className={cn(
              "text-sm",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>{data.subtitle}</p>
          )}
        </div>

        {cards.length >= 7 ? (
          <>
            {/* ROW 1: big-left (col-span-2) + small-right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div className="md:col-span-2 h-full">
                <BigCard card={cards[0]} delay={0} isDark={isDark} />
              </div>
              <BentoCardInner card={cards[1]} imageClass="h-56" delay={0.1} isDark={isDark} />
            </div>

            {/* ROW 2: 3 equal small cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <BentoCardInner card={cards[2]} delay={0} isDark={isDark} />
              <BentoCardInner card={cards[3]} delay={0.1} isDark={isDark} />
              <BentoCardInner card={cards[4]} delay={0.2} isDark={isDark} />
            </div>

            {/* ROW 3: small-left + big-right (col-span-2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1 h-full">
                <BentoCardInner card={cards[5]} delay={0} imageClass="h-56" isDark={isDark} />
              </div>
              <div className="md:col-span-2 h-full">
                <BigCard card={cards[6]} delay={0.1} isDark={isDark} />
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card, i) => (
              <BentoCardInner key={i} card={card} delay={i * 0.1} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
