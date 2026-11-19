import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'seed-knu-economics-10',
    user_id: null,
    title: 'Экономика — Принципы (10 изд., как новый)',
    title_en: 'Principles of Economics (10th Ed., Like New)',
    price: 1200,
    retail_price: 4000,
    category: 'Textbooks',
    university: 'KNU',
    safe_zone: 'Холл главной библиотеки КНУ',
    safe_zone_en: 'KNU Main Library Hall',
    description:
      'Закрыл Эк101 на отлично (A) в прошлом семестре! Книга в идеале, без пометок и заломов. Отдаю дешевле, чтобы помочь однокурсникам сдать сессию.',
    description_en:
      'Passed Econ 101 with an A last semester! Book is in mint condition with clean pages. Selling at a student price so fellow students can ace midterms.',
    image_url: '/src/assets/images/seed_economics_book_1795076645207.jpg',
    seller_name: 'Aibek',
    seller_major: '3 курс · Прикладная математика (КНУ)',
    seller_major_en: 'Junior · Applied Math (KNU)',
    likes: 14,
    views: 89,
    urgency_tag: 'Уйдет быстро · 1 шт!',
    urgency_tag_en: 'Going fast · 1 left!',
    is_seed: true,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'seed-krsu-casio-fx991ex',
    user_id: null,
    title: 'Калькулятор Casio fx-991EX (Идеал)',
    title_en: 'Casio fx-991EX Scientific Calculator (Mint)',
    price: 950,
    retail_price: 2200,
    category: 'Electronics',
    university: 'KRSU',
    safe_zone: 'Столовая 2 корпуса КРСУ',
    safe_zone_en: 'KRSU Building 2 Cafeteria',
    description:
      'Оригинальный ClassWiz fx-991EX с крышкой-слайдером. Разрешен на экзаменах по матану, физике и теормеху. Батарейка и солнечная панель работают идеально.',
    description_en:
      'Authentic ClassWiz fx-991EX with slide-on cover. Exam-approved for calculus, physics, and engineering. Solar + battery both work flawlessly.',
    image_url: '/src/assets/images/seed_casio_calculator_1795076644073.jpg',
    seller_name: 'Timur',
    seller_major: '2 курс · Инженерия (КРСУ)',
    seller_major_en: 'Sophomore · Engineering (KRSU)',
    likes: 28,
    views: 142,
    urgency_tag: 'Студ. цена · Забирай',
    urgency_tag_en: 'Student deal · Grab fast',
    is_seed: true,
    created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: 'seed-auca-xiaomi-lamp',
    user_id: null,
    title: 'Настольная лампа Xiaomi LED',
    title_en: 'Xiaomi LED Foldable Desk Lamp',
    price: 800,
    retail_price: 1850,
    category: 'Dorm/Living',
    university: 'AUCA',
    safe_zone: 'Атриум АУЦА (1 этаж)',
    safe_zone_en: 'AUCA Atrium (1st Floor)',
    description:
      'Компактная лампа для общаги и ночной подготовки к дедлайнам. 3 режима яркости, не мерцает, питание от USB-C. Состояние чистое, как из коробки.',
    description_en:
      'Minimalist foldable desk lamp for dorm study sessions. 3 brightness modes, flicker-free warm/cool LED, USB-C powered. Super clean condition.',
    image_url: '/src/assets/images/seed_xiaomi_lamp_1795076644160.jpg',
    seller_name: 'Nurgul',
    seller_major: '2 курс · Software Eng (АУЦА)',
    seller_major_en: 'Sophomore · Software Eng (AUCA)',
    likes: 9,
    views: 64,
    urgency_tag: 'Чистая · Работает 100%',
    urgency_tag_en: 'Clean · 100% Working',
    is_seed: true,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'seed-manas-anker-hub',
    user_id: null,
    title: 'Хаб Anker 7-в-1 + фетровый чехол',
    title_en: 'Anker 7-in-1 USB-C Hub + Felt Sleeve',
    price: 1500,
    retail_price: 3400,
    category: 'Electronics',
    university: 'Manas University',
    safe_zone: 'У фонтана кампуса Манас',
    safe_zone_en: 'Manas Campus Fountain',
    description:
      'Выпустилась и перешла на стационарный монитор. Хаб с HDMI 4K, SD-ридером и PD-зарядкой 100W — незаменим для MacBook и презентаций на парах. В подарок фетровый чехол 14".',
    description_en:
      'Graduated and upgraded my desk setup. Anker hub with 4K HDMI, SD reader, and 100W PD pass-through, plus a 14" felt laptop sleeve included.',
    image_url: '/src/assets/images/seed_anker_hub_1795076644134.jpg',
    seller_name: 'Bermet',
    seller_major: '4 курс · CS & Finance (Манас)',
    seller_major_en: 'Senior · CS & Finance (Manas)',
    likes: 19,
    views: 110,
    urgency_tag: 'Продаёт выпускник',
    urgency_tag_en: 'Graduating senior',
    is_seed: true,
    created_at: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
  },
];

export function formatKgs(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(amount))} сом`;
}
