export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  sub_type?: string;
  color?: string;
  size?: string;
  brand?: string;
  image_url?: string;
  occasions: string[];
  weather_types: string[];
  times_worn: number;
  created_at: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  rating: number;
  occasions: string[];
  created_at: string;
  updated_at: string;
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  item_id: string;
  created_at: string;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  outfit_id?: string;
  event_name: string;
  event_date: string;
  event_time?: string;
  weather_condition?: string;
  temperature?: number;
  created_at: string;
  updated_at: string;
}

export interface OutfitWearLog {
  id: string;
  user_id: string;
  outfit_id: string;
  worn_date: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  daily_plan_id?: string;
  remind_at: string;
  message: string;
  is_sent: boolean;
  created_at: string;
}
