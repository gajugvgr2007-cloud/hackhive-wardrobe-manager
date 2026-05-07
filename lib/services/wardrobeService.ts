import { createClient } from '@/lib/supabase/client';
import type { WardrobeItem, Outfit, DailyPlan, OutfitWearLog, Reminder } from '@/lib/types/wardrobe';

const getSupabase = () => createClient();

// Wardrobe Items
export async function getWardrobeItems(): Promise<WardrobeItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wardrobe items:', error);
    return [];
  }
  return (data || []) as WardrobeItem[];
}

export async function addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'times_worn'>): Promise<WardrobeItem | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('wardrobe_items')
    .insert([item])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding wardrobe item:', error);
    return null;
  }
  return data as WardrobeItem;
}

export async function deleteWardrobeItem(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting wardrobe item:', error);
    return false;
  }
  return true;
}

// Outfits
export async function getOutfits(): Promise<Outfit[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching outfits:', error);
    return [];
  }
  return (data || []) as Outfit[];
}

export async function addOutfit(outfit: Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Outfit | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('outfits')
    .insert([outfit])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding outfit:', error);
    return null;
  }
  return data as Outfit;
}

export async function deleteOutfit(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting outfit:', error);
    return false;
  }
  return true;
}

// Daily Plans
export async function getDailyPlans(): Promise<DailyPlan[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('daily_plans')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching daily plans:', error);
    return [];
  }
  return (data || []) as DailyPlan[];
}

export async function addDailyPlan(plan: Omit<DailyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DailyPlan | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('daily_plans')
    .insert([plan])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding daily plan:', error);
    return null;
  }
  return data as DailyPlan;
}

export async function deleteDailyPlan(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('daily_plans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting daily plan:', error);
    return false;
  }
  return true;
}

// Outfit Wear Log
export async function getOutfitWearLog(): Promise<OutfitWearLog[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('outfit_wear_log')
    .select('*')
    .order('worn_date', { ascending: false });

  if (error) {
    console.error('Error fetching wear log:', error);
    return [];
  }
  return (data || []) as OutfitWearLog[];
}

export async function logOutfitWear(outfitId: string, wornDate?: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('outfit_wear_log')
    .insert([{
      outfit_id: outfitId,
      worn_date: wornDate || new Date().toISOString().split('T')[0],
    }]);

  if (error) {
    console.error('Error logging outfit wear:', error);
    return false;
  }
  return true;
}

// Reminders
export async function getReminders(): Promise<Reminder[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('remind_at', { ascending: true });

  if (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
  return (data || []) as Reminder[];
}

export async function addReminder(reminder: Omit<Reminder, 'id' | 'user_id' | 'is_sent' | 'created_at'>): Promise<Reminder | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminder])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding reminder:', error);
    return null;
  }
  return data as Reminder;
}

export async function deleteReminder(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
  return true;
}
