export type Language = 'ru' | 'en';

export type UniversityCode = 'ALL' | 'KNU' | 'AUCA' | 'Manas University' | 'KRSU';

export type CategoryCode = 'All' | 'Textbooks' | 'Electronics' | 'Dorm/Living' | 'Clothing';

export type SortOrder = 'newest' | 'price_asc' | 'popular';

export interface Profile {
  id: string;
  email: string;
  nickname: string;
  university: Exclude<UniversityCode, 'ALL'>;
  major: string;
  manner_temp: number;
  created_at?: string;
}

export interface Product {
  id: string;
  user_id?: string | null;
  title: string;
  title_en?: string;
  price: number;
  retail_price?: number | null;
  category: Exclude<CategoryCode, 'All'>;
  university: Exclude<UniversityCode, 'ALL'>;
  safe_zone: string;
  safe_zone_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  seller_name: string;
  seller_major: string;
  seller_major_en?: string;
  likes: number;
  views: number;
  urgency_tag?: string;
  urgency_tag_en?: string;
  is_seed?: boolean;
  created_at: string;
}

export interface MeetupRequest {
  id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  buyer_id?: string | null;
  buyer_name: string;
  seller_name: string;
  safe_zone: string;
  proposed_time: string;
  note?: string;
  status: 'pending' | 'accepted' | 'completed';
  created_at: string;
}
