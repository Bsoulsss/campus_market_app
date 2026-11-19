import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Store, User } from 'lucide-react';
import type {
  CategoryCode,
  Language,
  MeetupRequest,
  Product,
  Profile,
  SortOrder,
  UniversityCode,
} from './types';
import { translations } from './i18n/translations';
import { isSupabaseConfigured, SEED_PRODUCTS, supabase } from './lib/supabase';
import { HomeView } from './components/HomeView';
import { ProductDetailView } from './components/ProductDetailView';
import { SellView } from './components/SellView';
import { ProfileView } from './components/ProfileView';
import { MeetupModal } from './components/MeetupModal';

type ActiveTab = 'home' | 'sell' | 'profile';

function inferUniversity(row: Partial<Product>): Exclude<UniversityCode, 'ALL'> {
  if (
    row.university === 'KNU' ||
    row.university === 'AUCA' ||
    row.university === 'Manas University' ||
    row.university === 'KRSU'
  ) {
    return row.university;
  }
  const haystack = `${row.safe_zone || ''} ${row.seller_major || ''}`.toLowerCase();
  if (haystack.includes('ауца') || haystack.includes('auca')) return 'AUCA';
  if (haystack.includes('манас') || haystack.includes('manas')) return 'Manas University';
  if (haystack.includes('крсу') || haystack.includes('krsu')) return 'KRSU';
  return 'KNU';
}

export default function App() {
  const [language, setLanguage] = useState<Language>('ru');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMeetupModal, setShowMeetupModal] = useState(false);

  // Filters
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityCode>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CategoryCode>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Data state
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(isSupabaseConfigured);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Auth & Profile state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meetups, setMeetups] = useState<MeetupRequest[]>([]);

  const t = translations[language];

  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setProducts(SEED_PRODUCTS);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase products fetch error:', error);
        setProducts(SEED_PRODUCTS);
        return;
      }

      if (!data || data.length === 0) {
        // Table is empty -> display the 4 realistic Bishkek campus seed cards
        setProducts(SEED_PRODUCTS);
      } else {
        const normalized: Product[] = data.map((row) => ({
          id: String(row.id),
          user_id: row.user_id ?? null,
          title: row.title,
          price: Number(row.price) || 0,
          retail_price: row.retail_price ? Number(row.retail_price) : null,
          category: (row.category as Product['category']) || 'Textbooks',
          university: inferUniversity(row),
          safe_zone: row.safe_zone || 'KNU Main Library',
          description: row.description || '',
          image_url: row.image_url || '',
          seller_name: row.seller_name || 'Student',
          seller_major: row.seller_major || 'KNU',
          likes: Number(row.likes) || 0,
          views: Number(row.views) || 0,
          created_at: row.created_at || new Date().toISOString(),
        }));
        setProducts(normalized);
      }
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchUserContext = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setCurrentUserId(null);
      setProfile(null);
      setMeetups([]);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user ?? null;

    if (!user) {
      setCurrentUserId(null);
      setProfile(null);
      setMeetups([]);
      return;
    }

    setCurrentUserId(user.id);

    // Fetch profile from public.profiles
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData as Profile);
    } else {
      const meta = user.user_metadata || {};
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        nickname: meta.nickname || user.email?.split('@')[0] || 'Student',
        university: meta.university || 'KNU',
        major: meta.major || 'Student',
        manner_temp: 98.5,
      };
      setProfile(fallbackProfile);
      await supabase.from('profiles').upsert(fallbackProfile);
    }

    // Fetch meetup requests
    const { data: meetupData } = await supabase
      .from('meetup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (meetupData) {
      setMeetups(meetupData as MeetupRequest[]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchUserContext();

    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserContext();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchProducts, fetchUserContext]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchesUniv =
        selectedUniversity === 'ALL' || item.university === selectedUniversity;
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.title_en && item.title_en.toLowerCase().includes(q)) ||
        item.safe_zone.toLowerCase().includes(q) ||
        item.seller_name.toLowerCase().includes(q) ||
        item.seller_major.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesUniv && matchesCategory && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortOrder === 'price_asc') return a.price - b.price;
      if (sortOrder === 'popular') return b.likes + b.views - (a.likes + a.views);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedUniversity, selectedCategory, searchQuery, sortOrder]);

  const myProducts = useMemo(() => {
    if (!currentUserId) return [];
    return products.filter(
      (p) => p.user_id === currentUserId || (profile && p.seller_name === profile.nickname)
    );
  }, [products, currentUserId, profile]);

  const handleToggleLike = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedIds.has(product.id);
    const nextLikes = Math.max(0, product.likes + (alreadyLiked ? -1 : 1));

    setLikedIds((prev) => {
      const copy = new Set(prev);
      if (alreadyLiked) copy.delete(product.id);
      else copy.add(product.id);
      return copy;
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, likes: nextLikes } : p))
    );
    if (selectedProduct?.id === product.id) {
      setSelectedProduct((prev) => (prev ? { ...prev, likes: nextLikes } : null));
    }

    if (isSupabaseConfigured && supabase && !product.is_seed) {
      await supabase.from('products').update({ likes: nextLikes }).eq('id', product.id);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    const nextViews = product.views + 1;
    const updated = { ...product, views: nextViews };
    setSelectedProduct(updated);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, views: nextViews } : p))
    );

    if (isSupabaseConfigured && supabase && !product.is_seed) {
      await supabase.from('products').update({ views: nextViews }).eq('id', product.id);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleItemPublished = async () => {
    await fetchProducts();
    setSelectedProduct(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-dvh w-full bg-[#F1F5F9] flex justify-center">
      {/* Centered Mobile Viewport (max-width 430px on desktop, full width on mobile) */}
      <div className="w-full max-w-[430px] min-h-dvh bg-[#F8FAFC] relative shadow-xl border-x border-slate-200/70">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            language={language}
            t={t}
            isLiked={likedIds.has(selectedProduct.id)}
            onToggleLike={handleToggleLike}
            onBack={() => setSelectedProduct(null)}
            onOpenMeetupModal={() => setShowMeetupModal(true)}
          />
        ) : activeTab === 'sell' ? (
          <SellView
            language={language}
            t={t}
            currentUserId={currentUserId}
            currentUserProfile={profile}
            onBack={() => setActiveTab('home')}
            onGoToProfile={() => setActiveTab('profile')}
            onItemPublished={handleItemPublished}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView
            language={language}
            setLanguage={setLanguage}
            t={t}
            currentUserId={currentUserId}
            profile={profile}
            myProducts={myProducts}
            meetups={meetups}
            onAuthSuccess={fetchUserContext}
            onSelectProduct={handleSelectProduct}
            onGoToSell={() => setActiveTab('sell')}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <HomeView
            language={language}
            setLanguage={setLanguage}
            t={t}
            products={filteredProducts}
            loading={loadingProducts}
            selectedUniversity={selectedUniversity}
            setSelectedUniversity={setSelectedUniversity}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Fixed 3-Tab Bottom Navigation Bar (Home, Floating +, My Page) */}
        {!selectedProduct && (
          <nav
            aria-label="Bottom Navigation"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-6 h-16 grid grid-cols-3 items-center"
          >
            {/* Tab 1: Home / Главная */}
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-tight">{t.navHome}</span>
            </button>

            {/* Tab 2: Center Floating "+" Sell Button */}
            <div className="flex flex-col items-center justify-center -mt-5">
              <button
                type="button"
                onClick={() => setActiveTab('sell')}
                aria-label={t.navSell}
                className="w-12 h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-600/35 flex items-center justify-center transition-transform active:scale-95 ring-4 ring-white cursor-pointer"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
              <span
                className={`text-[10px] font-bold mt-0.5 ${
                  activeTab === 'sell' ? 'text-[#2563EB]' : 'text-slate-500'
                }`}
              >
                {t.navSell}
              </span>
            </div>

            {/* Tab 3: My Page / Профиль */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-tight">{t.navProfile}</span>
            </button>
          </nav>
        )}

        {/* Screen 4: Propose Meetup Centered Dimmed Modal Overlay */}
        {showMeetupModal && selectedProduct && (
          <MeetupModal
            product={selectedProduct}
            language={language}
            t={t}
            currentUserProfile={profile}
            currentUserId={currentUserId}
            onClose={() => setShowMeetupModal(false)}
            onSuccess={() => {
              fetchUserContext();
            }}
          />
        )}
      </div>
    </div>
  );
}
