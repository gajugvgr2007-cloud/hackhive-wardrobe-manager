# Digital Wardrobe - Feature Guide

## Overview

The Digital Wardrobe is a stunning, interactive clothing management system that allows users to upload and organize their fashion collection with intelligent tagging and filtering.

## Features

### 1. Image Upload
- Click "Upload Item" button to open the upload modal
- Select an image from your device
- Real-time preview of selected image
- Supports all common image formats (JPG, PNG, WebP, etc.)

### 2. Masonry Grid Layout
- Responsive grid that adapts to screen size:
  - Mobile (1 column)
  - Tablet (2 columns)
  - Laptop (3 columns)
  - Desktop (4 columns)
- Smooth animations when items are added/removed
- Auto-rows-max for natural masonry layout
- Flexible height cards that size to content

### 3. Clothing Item Cards
Each card displays:
- **Image**: Full aspect-square coverage with smooth zoom on hover (1.1x scale)
- **Edit/Delete Buttons**: Appear on hover with smooth overlay
- **Tags**: Occasion and Weather badges overlay on the image
- **Item Details**: Name, category, and date added at bottom
- **Hover Effects**: 1.05x scale with -8px y movement and shadow glow

### 4. Tag System

#### Occasion Tags (Purple/Pink/Orange gradients)
- **Formal**: For formal events, dress codes
  - Gradient: `from-purple-500 to-pink-500`
- **Casual**: For everyday wear
  - Gradient: `from-blue-500 to-cyan-500`
- **Workout**: For athletic/gym activities
  - Gradient: `from-orange-500 to-red-500`

#### Weather Tags (Yellow/Cyan/Slate gradients)
- **Hot**: For warm/summer weather
  - Gradient: `from-yellow-500 to-orange-500`
- **Cold**: For cool/winter weather
  - Gradient: `from-cyan-500 to-blue-500`
- **Rainy**: For wet/rainy conditions
  - Gradient: `from-slate-500 to-blue-500`

### 5. Category Filtering
Filter items by:
- All (show all items)
- Tops
- Bottoms
- Shoes
- Outerwear
- Accessories
- Dresses

Each filter is interactive with smooth transitions.

### 6. Upload Modal

The upload modal includes:
- **Image Upload Area**: Clickable upload zone with preview
- **Item Name**: Text input field
- **Category Selector**: Dropdown with all categories
- **Occasion Tags**: Multi-select buttons
- **Weather Tags**: Multi-select buttons
- **Validation**: Ensures all fields are filled
- **Success Messages**: Feedback on successful upload
- **Error Handling**: Clear error messages if something fails

## Component Architecture

### WardrobeItem Component
Located: `components/cards/WardrobeItem.tsx`

```typescript
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  occasions: string[];
  weather_types: string[];
  created_at?: string;
}
```

**Props:**
- `item`: ClothingItem object
- `onDelete`: Callback for delete action
- `onEdit`: Callback for edit action

**Features:**
- Spring animation on mount (stiffness: 300)
- Scale up 1.05x on hover
- Smooth image zoom (1.1x)
- Tag overlay with fade-in on hover
- Gradient backgrounds for tags
- Glowing shadows on cards

### Wardrobe Page Component
Located: `components/pages/Wardrobe.tsx`

**State Management:**
- `items`: Array of ClothingItem objects
- `selectedCategory`: Currently filtered category
- `showModal`: Upload modal visibility
- `imagePreview`: Preview URL of selected image
- `loading`: Loading state during upload
- `message`: Success/error message display
- `formData`: Form state (name, category, tags, image)

**Key Functions:**
- `handleImageSelect()`: Processes image selection
- `toggleTag()`: Toggles occasion/weather tags
- `handleSubmit()`: Submits new clothing item
- `handleDelete()`: Removes item from wardrobe

## Styling Details

### Color Scheme
- **Background**: Slate 900/950
- **Borders**: White 10% opacity
- **Primary**: Cyan (hover states)
- **Accent**: Gradients (purple, orange, yellow, blue)

### Animations
- **Page Entry**: Fade in (0.4s)
- **Card Hover**: Scale 1.05, y -8px (0.3s spring)
- **Image Hover**: Scale 1.1 (0.4s)
- **Tag Appear**: Scale up from 0.8 (animated)
- **Modal**: Scale 0.9→1 (0.3s)

### Responsive Breakpoints
```css
grid-cols-1          /* Mobile (default) */
sm:grid-cols-2       /* Small tablets */
lg:grid-cols-3       /* Large tablets/laptops */
xl:grid-cols-4       /* Desktops */
```

## Data Storage

### Local State Management
Currently, items are stored in React state (localStorage can be added). Each item includes:
- Unique ID (timestamp-based)
- User input (name, category)
- Image (stored as base64 data URL)
- Tags (occasion and weather arrays)
- Metadata (created_at timestamp)

### Future: Supabase Integration
To persist data to Supabase:

1. Update database schema to include image storage
2. Use Supabase Storage for image files
3. Store metadata in `wardrobe_items` table
4. Implement authentication checks
5. Add RLS policies for user isolation

## Usage Examples

### Adding an Item
1. Click "Upload Item" button
2. Select image from device
3. Enter item name (e.g., "Black T-Shirt")
4. Select category ("Tops")
5. Choose occasions (e.g., "Casual")
6. Choose weather types (e.g., "Hot")
7. Click "Add to Wardrobe"

### Filtering Items
1. Click category button (e.g., "Shoes")
2. Grid automatically filters to show only shoes
3. Click "All" to show entire wardrobe

### Removing Items
1. Hover over any item card
2. Click the delete (trash) button
3. Item is removed immediately

## Interactive Features

### Hover Effects
- **Cards**: Scale up with shadow glow
- **Images**: Zoom in smoothly
- **Tags**: Fade in and scale
- **Buttons**: Scale and color changes

### Visual Feedback
- Loading states during upload
- Success/error messages
- Disabled state during processing
- Real-time preview of images

## Accessibility

- Semantic HTML structure
- Keyboard navigation support (coming)
- Focus indicators on buttons
- Alt text on images
- Clear labels for form inputs

## Performance Optimizations

- `AnimatePresence` for smooth exits
- Layout animations using Framer Motion
- Image optimization ready (Pexels links)
- Efficient filtering with JavaScript
- No unnecessary re-renders

## Future Enhancements

1. **Drag & Drop Upload**: Drop images anywhere
2. **Bulk Upload**: Upload multiple items at once
3. **Image Cropping**: Trim images before saving
4. **Color Detection**: Auto-detect dominant color
5. **AI Suggestions**: Smart outfit recommendations
6. **Share Outfits**: Social sharing features
7. **Style Insights**: Wear frequency analytics
8. **Virtual Try-On**: AR try-on features

## Code Examples

### Adding a New Clothing Item
```typescript
const newItem: ClothingItem = {
  id: Date.now().toString(),
  name: 'Blue Denim',
  category: 'Bottoms',
  image_url: 'data:image/...',
  occasions: ['Casual'],
  weather_types: ['Hot', 'Cold'],
  created_at: new Date().toISOString(),
};

setItems(prev => [newItem, ...prev]);
```

### Filtering by Category
```typescript
const filteredItems = selectedCategory === 'all'
  ? items
  : items.filter(item => 
      item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
```

### Toggling Tags
```typescript
const toggleTag = (tag: string, type: 'occasion' | 'weather') => {
  setFormData(prev => {
    const key = type === 'occasion' ? 'occasions' : 'weather_types';
    const current = prev[key] as string[];
    return {
      ...prev,
      [key]: current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    };
  });
};
```

## Troubleshooting

### Images Not Showing
- Check browser console for errors
- Ensure image file is valid format
- Try with a different image

### Tags Not Appearing
- Verify at least one occasion selected
- Verify at least one weather type selected
- Check browser zoom level

### Modal Not Opening
- Clear browser cache
- Check console for JavaScript errors
- Refresh the page

### Performance Issues
- Limit to 50+ items before pagination
- Consider lazy loading for large galleries
- Optimize image sizes

## Browser Support

- Chrome/Edge 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support
- Mobile browsers: Full support with responsive layout

## File Locations

- **Component**: `components/cards/WardrobeItem.tsx`
- **Page**: `components/pages/Wardrobe.tsx`
- **Types**: `lib/types/wardrobe.ts`

## Related Documentation

- See `README.md` for project overview
- See `SETUP.md` for installation
- See `HACKATHON_README.md` for submission details
