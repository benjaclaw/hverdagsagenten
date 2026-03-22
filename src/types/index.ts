export interface FinnSearch {
  id: string;
  user_id: string;
  name: string;
  url: string;
  is_active: boolean;
  created_at: string;
}

export interface FinnResult {
  id: string;
  search_id: string;
  finn_id: string;
  title: string;
  price: string | null;
  url: string;
  image_url: string | null;
  created_at: string;
}

export interface PriceWatch {
  id: string;
  user_id: string;
  search_term: string;
  max_price: number | null;
  is_active: boolean;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  watch_id: string;
  product_name: string;
  store: string | null;
  price: number;
  url: string | null;
  image_url: string | null;
  created_at: string;
}

export interface PushToken {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
}
