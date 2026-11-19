import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { CategoryCode, Language, Profile, UniversityCode } from '../types';
import type { Translations } from '../i18n/translations';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface SellViewProps {
  language: Language;
  t: Translations;
  currentUserId: string | null;
  currentUserProfile: Profile | null;
  onBack: () => void;
  onGoToProfile: () => void;
  onItemPublished: () => void;
}

const SELL_CATEGORIES: Exclude<CategoryCode, 'All'>[] = [
  'Textbooks',
  'Electronics',
  'Dorm/Living',
  'Clothing',
];

const UNIVERSITIES: Exclude<UniversityCode, 'ALL'>[] = [
  'KNU',
  'AUCA',
  'Manas University',
  'KRSU',
];

export const SellView: React.FC<SellViewProps> = ({
  language,
  t,
  currentUserId,
  currentUserProfile,
  onBack,
  onGoToProfile,
  onItemPublished,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<CategoryCode, 'All'>>('Textbooks');
  const [university, setUniversity] = useState<Exclude<UniversityCode, 'ALL'>>(
    currentUserProfile?.university || 'KNU'
  );
  const [price, setPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [safeZone, setSafeZone] = useState(
    language === 'en' ? t.safeZones[0].en : t.safeZones[0].ru
  );
  const [description, setDescription] = useState('');
  const [agreedSafeMeetup, setAgreedSafeMeetup] = useState(true);

  const [draftNotice, setDraftNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setErrorMsg(null);
  };

  const handleSaveDraft = () => {
    setDraftNotice(true);
    setTimeout(() => setDraftNotice(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUserId || !currentUserProfile) {
      setErrorMsg(t.authRequiredToSellDesc);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(t.supabaseNoticeDesc);
      return;
    }

    if (!photoFile) {
      setErrorMsg(
        language === 'ru'
          ? 'Пожалуйста, выберите реальное фото товара.'
          : 'Please select a real photo of your item.'
      );
      return;
    }

    const numericPrice = parseInt(price.replace(/\D/g, ''), 10);
    if (!title.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMsg(
        language === 'ru'
          ? 'Укажите название товара и честную цену в сомах.'
          : 'Please enter a valid item title and price in сом.'
      );
      return;
    }

    if (!agreedSafeMeetup) {
      setErrorMsg(
        language === 'ru'
          ? 'Подтвердите согласие на безопасную встречу в кампусе.'
          : 'Please confirm the campus safe-zone meetup agreement.'
      );
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload image to Supabase Storage bucket `product-images`
      const ext = photoFile.name.split('.').pop() || 'jpg';
      const filePath = `${currentUserId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;
      const numericRetail = retailPrice ? parseInt(retailPrice.replace(/\D/g, ''), 10) : null;

      // 3. Insert into public.products (with graceful fallback if optional columns aren't in schema)
      const fullPayload = {
        user_id: currentUserId,
        title: title.trim(),
        price: numericPrice,
        retail_price: numericRetail && numericRetail > numericPrice ? numericRetail : null,
        category,
        university,
        safe_zone: safeZone,
        description:
          description.trim() ||
          (language === 'ru'
            ? 'Передача в кампусе между парами.'
            : 'Available for campus handoff between classes.'),
        image_url: imageUrl,
        seller_name: currentUserProfile.nickname,
        seller_major: `${currentUserProfile.major} (${currentUserProfile.university})`,
        likes: 0,
        views: 1,
      };

      let { error: insertError } = await supabase.from('products').insert(fullPayload);

      if (insertError && (insertError.code === 'PGRST204' || insertError.code === '42703')) {
        const basePayload = {
          title: fullPayload.title,
          price: fullPayload.price,
          category: fullPayload.category,
          safe_zone: fullPayload.safe_zone,
          description: fullPayload.description,
          image_url: fullPayload.image_url,
          seller_name: fullPayload.seller_name,
          seller_major: fullPayload.seller_major,
          likes: 0,
          views: 1,
        };
        const retry = await supabase.from('products').insert(basePayload);
        insertError = retry.error;
      }

      if (insertError) {
        throw insertError;
      }

      onItemPublished();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to publish item';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28 bg-[#F8FAFC] min-h-dvh">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 py-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-display text-sm font-extrabold text-slate-900 truncate">
          {t.sellHeaderTitle}
        </span>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[10px] font-extrabold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.verifiedTag}</span>
        </div>
      </header>

      <div className="px-4 pt-3 space-y-4">
        {/* Subheader Row */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-extrabold text-slate-900 leading-tight">
              {t.sellHeaderTitle}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.sellHeaderSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-xs font-bold text-[#2563EB] hover:underline shrink-0 cursor-pointer"
          >
            {draftNotice ? t.draftSaved : t.saveDraft}
          </button>
        </div>

        {/* Auth Gate Notice if not signed in */}
        {!currentUserId && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
            <p className="font-display text-sm font-extrabold text-slate-900">
              {t.authRequiredToSellTitle}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">{t.authRequiredToSellDesc}</p>
            <button
              type="button"
              onClick={onGoToProfile}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-xs hover:bg-[#1D4ED8] cursor-pointer"
            >
              {t.goToProfileAuth}
            </button>
          </div>
        )}

        {/* Royal Blue Motivational Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white p-4 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-sm font-extrabold leading-snug text-balance">
              {t.sellHeroTitle}
            </h3>
            <p className="text-[11px] text-blue-100 leading-relaxed">{t.sellHeroSubtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Real Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900">{t.addPhotosLabel}</label>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                {t.requiredBadge}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-4 text-center cursor-pointer hover:bg-blue-50/70 transition-colors"
            >
              {photoPreview ? (
                <div className="space-y-2.5">
                  <img
                    src={photoPreview}
                    alt="Selected item preview"
                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-xs font-bold text-[#2563EB]">
                    <Camera className="w-3.5 h-3.5" />
                    {t.changePhoto}
                  </span>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="font-display text-sm font-extrabold text-slate-900">
                    {t.photoBoxTitle} ({photoFile ? '1/1' : '0/1'})
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[270px] mx-auto leading-snug">
                    {t.photoBoxDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {t.photoTip1Title}
                        </p>
                        <p className="text-[10px] text-emerald-700">{t.photoTip1Sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {t.photoTip2Title}
                        </p>
                        <p className="text-[10px] text-emerald-700">{t.photoTip2Sub}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Item Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900">{t.titleLabel}</label>
              <span className="text-[11px] text-slate-400">{t.titleLimit}</span>
            </div>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-900">{t.categoryLabel}</label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {SELL_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-200'
                    }`}
                  >
                    {t.categories[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* University Chips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-900">
              {t.universityLabel}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {UNIVERSITIES.map((univ) => {
                const active = university === univ;
                return (
                  <button
                    key={univ}
                    type="button"
                    onClick={() => setUniversity(univ)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {t.universityShort[univ]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Price Input & Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-900">{t.priceLabel}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#2563EB] pr-2.5 border-r border-slate-200">
                сом
              </span>
              <input
                type="number"
                required
                min={50}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t.pricePlaceholder}
                className="w-full pl-14 pr-14 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                KGS
              </span>
            </div>

            <div className="flex items-center gap-2">
              {['500', '1000', '1500'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPrice(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer tabular-nums ${
                    price === preset
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset} сом
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{t.priceHint}</span>
            </div>

            {/* Optional Retail Price for Loss Aversion badge */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.retailOptionalLabel}
              </label>
              <input
                type="number"
                min={0}
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                placeholder={t.retailPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Safe-Zone Dropdown */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-slate-900">{t.safeZoneLabel}</label>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.safeZoneVerifiedTag}
              </span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={safeZone}
                onChange={(e) => setSafeZone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              >
                {t.safeZones.map((zone) => {
                  const label = language === 'en' ? zone.en : zone.ru;
                  return (
                    <option key={zone.id} value={label}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-900">
              {t.descriptionLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
            />
          </div>

          {/* Campus Commitment Checkbox */}
          <button
            type="button"
            onClick={() => setAgreedSafeMeetup((prev) => !prev)}
            className="w-full text-left flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer"
          >
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreedSafeMeetup
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-slate-300 bg-white'
              }`}
            >
              {agreedSafeMeetup && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </span>
            <span className="text-[11px] text-slate-700 leading-snug">{t.commitmentText}</span>
          </button>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Publish CTA */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{submitting ? t.publishingBtn : t.publishBtn}</span>
            </button>
            <p className="text-center text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.zeroFeeFooter}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
