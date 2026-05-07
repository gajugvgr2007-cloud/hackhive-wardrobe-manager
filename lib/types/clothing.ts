// Comprehensive clothing type system for Crypto Fashion

export type ClothingCategory = 'Tops' | 'Bottoms' | 'Footwear' | 'Outerwear' | 'Accessories' | 'Dresses';

export type ClothingSubType =
  // Tops
  | 'T-Shirt' | 'Long Sleeve Shirt' | 'Polo' | 'Tank Top' | 'Sweater' | 'Hoodie' | 'Blouse' | 'Button-Up'
  // Bottoms
  | 'Jeans' | 'Shorts' | 'Pants' | 'Chinos' | 'Leggings' | 'Skirt' | 'Joggers'
  // Footwear
  | 'Sneakers' | 'Running Shoes' | 'Loafers' | 'Heels' | 'Boots' | 'Sandals' | 'Formal Shoes'
  // Outerwear
  | 'Jacket' | 'Coat' | 'Blazer' | 'Rain Jacket' | 'Windbreaker'
  // Accessories
  | 'Watch' | 'Necklace' | 'Earrings' | 'Bracelet' | 'Ring' | 'Hat' | 'Scarf' | 'Bag'
  // Dresses
  | 'Casual Dress' | 'Formal Dress' | 'Summer Dress' | 'Maxi Dress';

export type Occasion = 'Casual' | 'Formal' | 'Workout';
export type WeatherType = 'Hot' | 'Cold' | 'Rainy';
export type CanvasSlot = 'top' | 'bottom' | 'footwear';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subType: ClothingSubType;
  image_url: string;
  occasions: Occasion[];
  weather_types: WeatherType[];
  color: string;
  created_at?: string;
}

export interface OutfitCanvasItem {
  slot: CanvasSlot;
  item: ClothingItem | null;
}

export interface SavedOutfit {
  id: string;
  name: string;
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  footwear: ClothingItem | null;
  occasion: Occasion;
  created_at: string;
  locked: boolean;
}

// Helper function to get valid clothing for each slot
export const getValidCategoriesForSlot = (slot: CanvasSlot): ClothingCategory[] => {
  switch (slot) {
    case 'top':
      return ['Tops', 'Outerwear'];
    case 'bottom':
      return ['Bottoms', 'Dresses'];
    case 'footwear':
      return ['Footwear'];
    default:
      return [];
  }
};

// Helper to check if item fits in slot
export const isValidForSlot = (item: ClothingItem, slot: CanvasSlot): boolean => {
  return getValidCategoriesForSlot(slot).includes(item.category);
};

export const getCategoryLabel = (category: ClothingCategory): string => {
  const labels: Record<ClothingCategory, string> = {
    'Tops': 'Tops & Shirts',
    'Bottoms': 'Bottoms',
    'Footwear': 'Footwear',
    'Outerwear': 'Jackets & Coats',
    'Accessories': 'Accessories',
    'Dresses': 'Dresses',
  };
  return labels[category];
};
