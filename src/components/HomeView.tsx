import React from 'react';
import {
  Armchair,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  GraduationCap,
  Heart,
  Laptop,
  LayoutGrid,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { CategoryCode, Language, Product, SortOrder, UniversityCode } from '../types';
import type { Translations } from '../i18n/translations';
import { formatKgs } from '../lib/supabase';
import { PromoCarousel } from './PromoCarousel';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  products: Product[];
  loading: boolean;
  selectedUniversity: UniversityCode;
  setSelectedUniversity: (u: UniversityCode) => void;
  selectedCategory: CategoryCode;
  setSelectedCategory: (c: CategoryCode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (s: SortOrder) => void;
  likedIds: Set<string>;
  onToggleLike: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

const UNIVERSITY_OPTIONS: UniversityCode[] = [
  'ALL',
  'KNU',
  'AUCA',
  'Manas University',
  'KRSU',
];

const CATEGORY_OPTIONS: { code: CategoryCode; icon: React.ComponentType<{ className?: string }> }[] = [
  { code: 'All', icon: LayoutGrid },
  { code: 'Textbooks', icon: BookOpen },
  { code: 'Electronics', icon: Laptop },
  { code: 'Dorm/Living', icon: Armchair },
  { code: 'Clothing', icon: Shirt },
];

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  setLanguage,
  t,
  products,
  loading,
  selectedUniversity,
  setSelectedUniversity,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  likedIds,
  onToggleLike,
  onSelectProduct,
}) => {
  const cycleSort = () => {
    if (sortOrder === 'newest') setSortOrder('price_asc');
    else if (sortOrder === 'price_asc') setSortOrder('popular');
    else setSortOrder('newest');
  };

  const sortLabel =
    sortOrder === 'newest'
      ? t.sortNewest
      : sortOrder === 'price_asc'
        ? t.sortCheapest
        : t.sortPopular;

  return (
    <div className="pb-24">
      {/* Top Sticky App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-3 pb-2.5 space-y-2.5">
        {/* Row 1: Brand + RU | EN Switcher */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-display text-[19px] font-extrabold tracking-tight text-slate-900 truncate">
              CampusMarket
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-extrabold tracking-wide shrink-0">
              {t.brandSuffix}
            </span>
          </div>

          {/* Working RU | EN Switcher */}
          <div
            className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/80 shrink-0"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLanguage('ru')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                language === 'ru'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Row 2: University Filter Dropdown + 100% Student Verified Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1 min-w-0">
            <GraduationCap className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value as UniversityCode)}
              aria-label={t.universityLabel}
              className="w-full appearance-none pl-8 pr-7 py-2 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 truncate focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
            >
              {UNIVERSITY_OPTIONS.map((univ) => (
                <option key={univ} value={univ}>
                  {t.universities[univ]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-2 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[11px] font-bold whitespace-nowrap shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.verifiedStudentsBadge}</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 space-y-3.5">
        {/* Quick Bishkek Campus Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0 pr-1">
            <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{t.bishkekLabel}</span>
          </div>
          {UNIVERSITY_OPTIONS.map((univ) => {
            const active = selectedUniversity === univ;
            return (
              <button
                key={univ}
                type="button"
                onClick={() => setSelectedUniversity(univ)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.universityShort[univ]}
              </button>
            );
          })}
        </div>

        {/* Real-Time Search Bar + Sort Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={cycleSort}
            title={sortLabel}
            aria-label={sortLabel}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-[#2563EB] flex items-center justify-center shadow-2xs hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Slide Promotional Carousel */}
        <PromoCarousel slides={t.slides} />

        {/* Horizontal Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORY_OPTIONS.map(({ code, icon: Icon }) => {
            const active = selectedCategory === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedCategory(code)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-600/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#2563EB]'}`} />
                <span>{t.categories[code]}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <h2 className="font-display text-[15px] font-extrabold text-slate-900 truncate">
                {t.freshTitle}
              </h2>
              <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                ({products.length} {t.freshCountLabel})
              </span>
            </div>
            <button
              type="button"
              onClick={cycleSort}
              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2563EB] shrink-0 cursor-pointer"
            >
              <span>{sortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.freshSubtitle}</p>
        </div>

        {/* 2-Column Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center space-y-3">
            <p className="font-display text-sm font-bold text-slate-900">{t.emptyFeedTitle}</p>
            <p className="text-xs text-slate-500">{t.emptyFeedDesc}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedUniversity('ALL');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const isLiked = likedIds.has(product.id);
              const title =
                language === 'en' && product.title_en ? product.title_en : product.title;
              const safeZone =
                language === 'en' && product.safe_zone_en
                  ? product.safe_zone_en
                  : product.safe_zone;
              const major =
                language === 'en' && product.seller_major_en
                  ? product.seller_major_en
                  : product.seller_major;
              const urgency =
                language === 'en' && product.urgency_tag_en
                  ? product.urgency_tag_en
                  : product.urgency_tag;

              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <SafeImage
                      src={product.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Urgency / Trust Pill Top-Left */}
                    {urgency && (
                      <span className="absolute top-2 left-2 max-w-[125px] truncate px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-xs">
                        {urgency}
                      </span>
                    )}

                    {/* Favorite Heart Button Top-Right */}
                    <button
                      type="button"
                      onClick={(e) => onToggleLike(product, e)}
                      aria-label="Favorite"
                      className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
                    <div className="space-y-1.5">
                      {/* Safe Zone Chip */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] max-w-full">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="text-[10px] font-bold truncate">{safeZone}</span>
                      </div>

                      {/* 2-line Product Title */}
                      <h3 className="text-[13px] font-bold text-slate-900 leading-[1.25] line-clamp-2">
                        {title}
                      </h3>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      {/* Price & Optional Retail Strikethrough */}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-display text-[15px] font-extrabold text-[#2563EB] tabular-nums">
                          {formatKgs(product.price)}
                        </span>
                        {product.retail_price && product.retail_price > product.price && (
                          <span className="text-[10px] text-slate-400 line-through tabular-nums">
                            {formatKgs(product.retail_price)}
                          </span>
                        )}
                      </div>

                      {/* Bottom Seller & Stats Row */}
                      <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="truncate font-medium">
                          {product.seller_name} · {major.split('·')[0].trim()}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 tabular-nums">
                          <span className="inline-flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5 text-rose-400" />
                            {product.likes}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5 text-slate-400" />
                            {product.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Campus Safety Assurance Footer Card */}
        <button
          type="button"
          onClick={() => setSelectedUniversity('ALL')}
          className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900">{t.safetyBannerTitle}</p>
            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{t.safetyBannerBody}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};
