import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ShieldCheck, Wallet } from 'lucide-react';
import type { Translations } from '../i18n/translations';

interface PromoCarouselProps {
  slides: Translations['slides'];
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    } else if (distance < -40) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const slideIcons = [BookOpen, Wallet, ShieldCheck];

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-sm select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => {
          const WatermarkIcon = slideIcons[idx % slideIcons.length];
          return (
            <div
              key={idx}
              className="w-full shrink-0 relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white px-4 py-4 overflow-hidden"
            >
              {/* Subtle architectural line graphic */}
              <WatermarkIcon
                aria-hidden="true"
                className="absolute -right-3 -bottom-3 w-28 h-28 text-white/10 pointer-events-none stroke-[1.5]"
              />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[10px] font-bold tracking-wider text-white">
                  {slide.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/25 text-[11px] font-semibold tabular-nums text-white/95">
                  {activeIndex + 1}/{slides.length}
                </span>
              </div>

              <h2 className="font-display text-[17px] leading-[1.25] font-extrabold text-white pr-10 mb-2 text-balance">
                {slide.title}
              </h2>

              <div className="flex items-center gap-1.5 text-[12px] text-blue-100 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">{slide.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive dot indicators */}
      <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
