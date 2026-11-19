import React, { useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  Coffee,
  Eye,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';
import type { Language, Product } from '../types';
import type { Translations } from '../i18n/translations';
import { formatKgs } from '../lib/supabase';
import { SafeImage } from './SafeImage';

interface ProductDetailViewProps {
  product: Product;
  language: Language;
  t: Translations;
  isLiked: boolean;
  onToggleLike: (product: Product, e: React.MouseEvent) => void;
  onBack: () => void;
  onOpenMeetupModal: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  language,
  t,
  isLiked,
  onToggleLike,
  onBack,
  onOpenMeetupModal,
}) => {
  const [copied, setCopied] = useState(false);

  const title = language === 'en' && product.title_en ? product.title_en : product.title;
  const safeZone =
    language === 'en' && product.safe_zone_en ? product.safe_zone_en : product.safe_zone;
  const description =
    language === 'en' && product.description_en ? product.description_en : product.description;
  const major =
    language === 'en' && product.seller_major_en ? product.seller_major_en : product.seller_major;

  const retailPrice =
    product.retail_price && product.retail_price > product.price
      ? product.retail_price
      : Math.round(product.price * 2.4);
  const savings = Math.max(0, retailPrice - product.price);
  const discountPct = Math.round((savings / retailPrice) * 100);

  const initials = product.seller_name.slice(0, 2).toUpperCase();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-24 bg-[#F8FAFC] min-h-dvh">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 py-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-display text-sm font-extrabold text-slate-900 truncate">
          {t.listingHeader}
        </h1>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[10px] font-extrabold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.verifiedTag}</span>
        </div>
      </header>

      <div className="px-4 pt-3 space-y-3.5">
        {/* Verified Student Strip + Share/Heart */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <BadgeCheck className="w-4 h-4 text-[#2563EB]" />
            <span>
              {t.verifiedStudentOf} · {t.universityShort[product.university]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={(e) => onToggleLike(product, e)}
              aria-label="Save item"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
              />
            </button>
          </div>
        </div>

        {copied && (
          <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-1.5">
            {t.shareCopied}
          </div>
        )}

        {/* Main Product Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 shadow-xs">
          <SafeImage src={product.image_url} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {product.university} {t.verifiedTag}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[11px] font-semibold tabular-nums">
            1 / 1 {t.photosCounter}
          </div>
        </div>

        {/* Loss Aversion Savings Banner */}
        {savings > 0 && (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-400/25 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 fill-amber-600 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 leading-snug">
                  {t.savePrefix} {formatKgs(savings)} {t.saveMiddle}
                </p>
                <p className="text-[11px] text-amber-900/80 leading-snug mt-0.5">
                  {t.saveQuestion}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-extrabold whitespace-nowrap shrink-0 tabular-nums">
              {discountPct}% {t.discountBadge}
            </span>
          </div>
        )}

        {/* Title, Category & Price */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB]">
              {t.categories[product.category]}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
              {product.university}
            </span>
          </div>

          <h2 className="font-display text-[21px] font-extrabold text-slate-900 leading-tight text-balance">
            {title}
          </h2>

          <div className="flex items-baseline gap-2.5 pt-0.5">
            <span className="font-display text-2xl font-extrabold text-[#2563EB] tabular-nums">
              {formatKgs(product.price)}
            </span>
            <span className="text-xs text-slate-400 line-through tabular-nums">
              {formatKgs(retailPrice)} {t.retailSuffix}
            </span>
          </div>
        </div>

        {/* Urgency Social Proof Strip */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-[11px] font-bold text-rose-700">
          <Eye className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            {t.viewingNowPrefix} {product.likes} {t.viewingNowSuffix}
          </span>
        </div>

        {/* Seller Card with Manner Temp 98.5°C */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                <BadgeCheck className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-extrabold text-slate-900 truncate">
                {product.seller_name}
              </p>
              <p className="text-xs text-slate-600 truncate">{major}</p>
              <p className="text-[11px] font-bold text-emerald-700 mt-0.5">{t.studentIdActive}</p>
            </div>
          </div>

          {/* Manner Temp Meter */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="leading-tight">Manner Temp 98.5°C</span>
              </div>
              <span className="font-mono text-base font-extrabold text-emerald-600 tabular-nums shrink-0">
                98.5°C
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-teal-500 to-emerald-500"
                style={{ width: '98.5%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
              <span>34 {t.handoffsLabel}</span>
              <span>0 {t.lateLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.replyTimeLabel}</span>
          </div>
        </div>

        {/* Campus Peace of Mind Card + Embedded Safe-Zone Meetup Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-display text-sm font-extrabold text-slate-900">{t.peaceTitle}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">{t.peace1Title}</p>
                <p className="text-slate-600 text-[11px] leading-snug">{t.peace1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Wallet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">{t.peace2Title}</p>
                <p className="text-slate-600 text-[11px] leading-snug">{t.peace2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Video className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">{t.peace3Title}</p>
                <p className="text-slate-600 text-[11px] leading-snug">{t.peace3Desc}</p>
              </div>
            </div>
          </div>

          {/* Embedded Safe-Zone Meetup Box */}
          <div className="rounded-xl bg-blue-50/75 border border-blue-100 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5 text-xs font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>
                  {t.meetupSpotLabel} {safeZone}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB] text-[9px] font-extrabold whitespace-nowrap shrink-0">
                {t.underCameras}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong className="text-slate-800">{t.meetupHoursLabel}</strong> {t.meetupHoursValue}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Coffee className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{t.meetupTip}</span>
            </div>
          </div>
        </div>

        {/* Why Selling / Description Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 shadow-2xs">
          <h3 className="font-display text-sm font-extrabold text-slate-900">{t.whySellingTitle}</h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
      </div>

      {/* Fixed Sticky Bottom CTA Bar inside 430px container */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="shrink-0">
          <p className="text-[11px] text-slate-500 font-medium">{t.totalLabel}</p>
          <p className="font-display text-lg font-extrabold text-slate-900 tabular-nums">
            {formatKgs(product.price)}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMeetupModal}
          className="flex-1 py-3.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer text-center"
        >
          {t.proposeMeetupBtn}
        </button>
      </div>
    </div>
  );
};
