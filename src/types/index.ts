export interface FinnSearch {
  id: string;
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
  price: string;
  url: string;
  image_url: string;
  created_at: string;
}

export interface PriceWatch {
  id: string;
  search_term: string;
  max_price: number | null;
  is_active: boolean;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  watch_id: string;
  product_name: string;
  store: string;
  price: number;
  url: string;
  image_url: string;
  created_at: string;
}
