import React, { useState } from 'react';
import {
  BadgeCheck,
  CalendarClock,
  GraduationCap,
  LogOut,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { Language, MeetupRequest, Product, Profile, UniversityCode } from '../types';
import type { Translations } from '../i18n/translations';
import { formatKgs, isSupabaseConfigured, supabase } from '../lib/supabase';
import { SafeImage } from './SafeImage';

interface ProfileViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentUserId: string | null;
  profile: Profile | null;
  myProducts: Product[];
  meetups: MeetupRequest[];
  onAuthSuccess: () => void;
  onSelectProduct: (product: Product) => void;
  onGoToSell: () => void;
  onDeleteProduct: (productId: string) => Promise<void>;
}

const SIGNUP_UNIVERSITIES: Exclude<UniversityCode, 'ALL'>[] = [
  'KNU',
  'AUCA',
  'Manas University',
  'KRSU',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  setLanguage,
  t,
  currentUserId,
  profile,
  myProducts,
  meetups,
  onAuthSuccess,
  onSelectProduct,
  onGoToSell,
  onDeleteProduct,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState<Exclude<UniversityCode, 'ALL'>>('KNU');
  const [major, setMajor] = useState('');

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'meetups'>('listings');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setAuthError(t.supabaseNoticeDesc);
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      onAuthSuccess();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setAuthError(t.supabaseNoticeDesc);
      return;
    }

    if (!nickname.trim() || !major.trim()) {
      setAuthError(
        language === 'ru'
          ? 'Заполните имя и факультет/курс.'
          : 'Please enter your nickname and major/year.'
      );
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nickname: nickname.trim(),
            university,
            major: major.trim(),
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email.trim(),
          nickname: nickname.trim(),
          university,
          major: major.trim(),
          manner_temp: 98.5,
        });
        if (profileError) {
          console.error('Profile insert error:', profileError);
        }
      }

      if (data.session) {
        onAuthSuccess();
      } else {
        setAuthMessage(t.signupSuccessCheckEmail);
        setAuthMode('login');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    onAuthSuccess();
  };

  return (
    <div className="pb-24 bg-[#F8FAFC] min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <h1 className="font-display text-lg font-extrabold text-slate-900">{t.profileTitle}</h1>

        {/* RU | EN Switcher */}
        <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setLanguage('ru')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              language === 'ru' ? 'bg-[#2563EB] text-white' : 'text-slate-600'
            }`}
          >
            RU
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              language === 'en' ? 'bg-[#2563EB] text-white' : 'text-slate-600'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        {!isSupabaseConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
            <p className="font-display font-extrabold text-amber-900">{t.supabaseNoticeTitle}</p>
            <p className="text-amber-800 leading-relaxed">{t.supabaseNoticeDesc}</p>
          </div>
        )}

        {!currentUserId || !profile ? (
          /* Real Supabase Auth Card */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                CampusMarket KG
              </h2>
              <p className="text-xs text-slate-500">{t.verifiedStudentsBadge}</p>
            </div>

            {/* Segmented Login / Sign Up Switch */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.loginTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.signupTab}
              </button>
            </div>

            {authMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {authMessage}
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aibek@knu.kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.passwordLabel}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-sm cursor-pointer"
                >
                  {authLoading ? t.authLoading : t.loginBtn}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.nicknameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Aibek"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.universityLabel}
                  </label>
                  <select
                    value={university}
                    onChange={(e) =>
                      setUniversity(e.target.value as Exclude<UniversityCode, 'ALL'>)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    {SIGNUP_UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>
                        {t.universities[u]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.majorLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder={t.majorPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aibek@auca.kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.passwordLabel}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-sm cursor-pointer"
                >
                  {authLoading ? t.authLoading : t.signupBtn}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Signed-in Student Profile */
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0">
                    {profile.nickname.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display text-base font-extrabold text-slate-900 truncate">
                        {profile.nickname}
                      </h2>
                      <BadgeCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      {profile.university} · {profile.major}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 shrink-0 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logoutBtn}</span>
                </button>
              </div>

              {/* Manner Temp Box */}
              <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Manner Temp
                  </span>
                  <span className="font-mono text-base font-extrabold text-emerald-600 tabular-nums">
                    {Number(profile.manner_temp || 98.5).toFixed(1)}°C
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-emerald-500"
                    style={{ width: `${Math.min(100, Number(profile.manner_temp || 98.5))}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.verifiedStudentsBadge}</span>
                </div>
              </div>
            </div>

            {/* Profile Sub-Tabs: My Listings / Meetups */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'listings'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.myListingsTab} ({myProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('meetups')}
                className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'meetups'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.myMeetupsTab} ({meetups.length})
              </button>
            </div>

            {activeTab === 'listings' ? (
              myProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center space-y-3">
                  <p className="text-xs font-semibold text-slate-500">{t.noListingsYet}</p>
                  <button
                    type="button"
                    onClick={onGoToSell}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.postFirstItem}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myProducts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
                    >
                      <SafeImage
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 cursor-pointer"
                      />
                      <div
                        onClick={() => onSelectProduct(item)}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-sm font-extrabold text-[#2563EB] tabular-nums mt-0.5">
                          {formatKgs(item.price)}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{item.safe_zone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(item.id)}
                        aria-label={t.deleteItem}
                        className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : meetups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center">
                <p className="text-xs font-semibold text-slate-500">{t.noMeetupsYet}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {meetups.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-extrabold text-slate-900 line-clamp-1">
                        {req.product_title}
                      </p>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold shrink-0">
                        {req.status === 'accepted'
                          ? t.statusAccepted
                          : req.status === 'completed'
                            ? t.statusCompleted
                            : t.statusPending}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span>{req.safe_zone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{req.proposed_time}</span>
                      </div>
                    </div>
                    {req.note && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5">
                        {req.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
