import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, MapPin, MessageSquare, ShieldCheck, X } from 'lucide-react';
import type { Language, Product, Profile } from '../types';
import type { Translations } from '../i18n/translations';
import { formatKgs, isSupabaseConfigured, supabase } from '../lib/supabase';
import { SafeImage } from './SafeImage';

interface MeetupModalProps {
  product: Product;
  language: Language;
  t: Translations;
  currentUserProfile: Profile | null;
  currentUserId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const MeetupModal: React.FC<MeetupModalProps> = ({
  product,
  language,
  t,
  currentUserProfile,
  currentUserId,
  onClose,
  onSuccess,
}) => {
  const defaultZone =
    language === 'en' && product.safe_zone_en ? product.safe_zone_en : product.safe_zone;

  const [selectedZone, setSelectedZone] = useState(defaultZone);
  const [selectedSlot, setSelectedSlot] = useState(t.timeSlots[0]);
  const [customTime, setCustomTime] = useState('');
  const [buyerName, setBuyerName] = useState(currentUserProfile?.nickname || '');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const productTitle =
    language === 'en' && product.title_en ? product.title_en : product.title;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalTime = customTime.trim() || selectedSlot;
    const finalBuyerName =
      buyerName.trim() ||
      currentUserProfile?.nickname ||
      (language === 'ru' ? 'Студент кампуса' : 'Campus Student');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(t.supabaseNoticeDesc);
      return;
    }

    setSubmitting(true);
    try {
      const fullPayload = {
        product_id: product.id,
        product_title: productTitle,
        product_price: product.price,
        buyer_id: currentUserId,
        buyer_name: finalBuyerName,
        seller_name: product.seller_name,
        safe_zone: selectedZone,
        proposed_time: finalTime,
        note: note.trim() || null,
        status: 'pending',
      };

      let { error } = await supabase.from('meetup_requests').insert(fullPayload);

      if (error && (error.code === 'PGRST204' || error.code === '42703')) {
        const { product_price: _omit, ...basePayload } = fullPayload;
        const retry = await supabase.from('meetup_requests').insert(basePayload);
        error = retry.error;
      }

      if (error) {
        throw error;
      }

      setIsDone(true);
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send meetup request';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meetup-modal-title"
    >
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90dvh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3
              id="meetup-modal-title"
              className="font-display text-lg font-extrabold text-slate-900 leading-snug"
            >
              {t.meetupModalTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.meetupModalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-slate-900">
                {t.meetupSuccessTitle}
              </h4>
              <p className="text-sm text-slate-600 mt-1">{t.meetupSuccessDesc}</p>
            </div>
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{selectedZone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarClock className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{customTime.trim() || selectedSlot}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {t.closeModal}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            {/* Mini Product Summary */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <SafeImage
                src={product.image_url}
                alt={productTitle}
                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{productTitle}</p>
                <p className="text-sm font-extrabold text-[#2563EB] tabular-nums mt-0.5">
                  {formatKgs(product.price)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {product.seller_name} · {product.university}
                </p>
              </div>
            </div>

            {!currentUserProfile && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.nicknameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder={language === 'ru' ? 'Твое имя (напр., Айдана)' : 'Your name (e.g., Aidana)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
              </div>
            )}

            {/* Safe Zone Selector */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.selectSafeZone}
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              >
                <option value={defaultZone}>{defaultZone}</option>
                {t.safeZones.map((zone) => {
                  const label = language === 'en' ? zone.en : zone.ru;
                  if (label === defaultZone) return null;
                  return (
                    <option key={zone.id} value={label}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.selectTimeSlot}
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {t.timeSlots.map((slot) => {
                  const active = selectedSlot === slot && !customTime.trim();
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setCustomTime('');
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder={t.customTimePlaceholder}
                className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Note to seller */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.messageSellerLabel}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.messageSellerPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
              />
            </div>

            {/* Safety Reminder */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.meetupSafetyNote}</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.99] cursor-pointer"
            >
              {submitting ? t.sendingMeetupBtn : t.confirmMeetupBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
