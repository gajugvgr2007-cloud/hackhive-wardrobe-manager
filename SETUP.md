# Crypto Fashion - Setup Guide

## Project Overview

Crypto Fashion is a premium, glassmorphic fashion wardrobe manager built with Next.js, React, Tailwind CSS, shadcn/ui, and Framer Motion. The application features real-time weather integration, intelligent outfit suggestions, and a sleek, minimalist dark-mode interface.

## Features

- **Glassmorphism UI**: Elegant backdrop-blur effects with subtle gradients
- **Real-time Weather Integration**: OpenWeatherMap API integration for live weather data
- **Wardrobe Management**: Organize and track your clothing collection
- **Outfit Planner**: Create and manage outfit combinations
- **Daily Planner**: Plan outfits for upcoming events
- **Weather-Based Suggestions**: Get outfit recommendations based on current weather
- **Smooth Animations**: Framer Motion-powered micro-interactions
- **Supabase Integration**: Secure data storage with Row Level Security

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenWeatherMap API key

## Installation

1. **Clone and Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Weather API
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# App Config
NEXT_PUBLIC_APP_NAME=Crypto Fashion
```

### Getting Your Keys

**Supabase:**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy your Project URL and Anon Key

**OpenWeatherMap:**
1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Generate an API key from your account
3. Add it to your `.env.local`

3. **Set Up Database**

The database schema is automatically created when you run migrations:

```bash
npm run db:migrate
```

Or manually apply the migration at `migrations/001_create_wardrobe_tables.sql` through the Supabase dashboard.

4. **Run Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── TopNav.tsx      # Top navigation bar
│   ├── pages/
│   │   ├── Dashboard.tsx   # Dashboard view
│   │   ├── Wardrobe.tsx    # Wardrobe management
│   │   ├── Outfits.tsx     # Outfit management
│   │   └── DailyPlanner.tsx# Daily planner
│   ├── cards/
│   │   ├── StatsCard.tsx   # Statistics cards
│   │   ├── OutfitCard.tsx  # Outfit display card
│   │   └── WardrobeItem.tsx# Wardrobe item card
│   ├── widgets/
│   │   └── WeatherWidget.tsx # Weather display
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   └── client.ts       # Supabase client
│   ├── services/
│   │   └── wardrobeService.ts # Data operations
│   ├── types/
│   │   └── wardrobe.ts     # TypeScript types
│   └── utils.ts            # Utility functions
└── .env.local              # Environment variables
```

## Database Schema

### Tables

**wardrobe_items**
- Stores individual clothing items
- Fields: id, user_id, name, category, color, size, brand, image_url, times_worn
- Has RLS for user privacy

**outfits**
- Stores outfit combinations
- Fields: id, user_id, name, description, rating, occasions
- Has RLS for user privacy

**outfit_items**
- Join table connecting outfits to wardrobe items
- Maintains many-to-many relationship

**daily_plans**
- Stores planned outfits for specific dates
- Fields: id, user_id, outfit_id, event_name, event_date, event_time, weather_condition, temperature
- Has RLS for user privacy

All tables include timestamps (created_at, updated_at) and Row Level Security policies.

## Key Components

### Sidebar Navigation
- Smooth animations with Framer Motion
- Active state indicators
- Gradient backgrounds and hover effects
- Logo with animated icon

### Weather Widget
- Real-time temperature display
- Expandable detailed weather information
- Geolocation-based weather fetching
- Weather icons based on conditions
- Fallback data for API errors

### Dashboard
- Statistics cards showing wardrobe metrics
- Today's outfit suggestions
- Weather-based recommendations
- Animated transitions

### Wardrobe Manager
- Grid view of clothing items
- Category filtering
- Item details (times worn, color, category)
- Edit and delete actions
- Add new item functionality

### Outfit Planner
- Create and manage outfit combinations
- Star ratings for outfits
- Occasion tags
- Visual item breakdown
- Like/favorite system

### Daily Planner
- Calendar-based planning
- Event scheduling
- Outfit assignment
- Weather display
- Time management

## Styling

The project uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Glass Morphism**: Backdrop blur effects with rgba colors
- **Gradient Backgrounds**: Cyan to blue gradients throughout
- **Dark Mode**: Full dark color palette (slate-900 to slate-950)
- **Smooth Transitions**: 300ms duration animations
- **Color Scheme**: Cyan, Blue, and Slate tones

## Animations

Framer Motion provides:
- Page transitions and staggered animations
- Hover scale effects on interactive elements
- Smooth layout animations
- Modal and drawer animations
- Button tap feedback
- Icon rotation effects

## API Integration

### Weather Widget
```typescript
// Uses OpenWeatherMap API
GET https://api.openweathermap.org/data/2.5/weather
Parameters: lat, lon, appid, units=metric
```

### Supabase
All data operations use Supabase client with:
- Authentication via Supabase Auth
- Row Level Security for data isolation
- Real-time subscriptions ready
- Automatic timestamp management

## Best Practices

1. **Always enable RLS** on new tables for security
2. **Use Supabase client** from `lib/supabase/client.ts`
3. **Follow the component structure** for maintainability
4. **Add Framer Motion** to new interactive components
5. **Test with different screen sizes** (responsive design)
6. **Validate API responses** before using data
7. **Handle loading and error states** gracefully

## Performance Optimization

- Code splitting at route level
- Image optimization with Next.js
- CSS-in-JS with Tailwind (no extra requests)
- Efficient RLS queries with indexes
- Debounced API calls (weather updates every 10 minutes)

## Security

- All data operations use RLS policies
- API keys stored in environment variables
- No sensitive data in client-side code
- HTTPS required for production
- CORS configured for API requests

## Troubleshooting

**Weather not loading?**
- Check API key in `.env.local`
- Verify geolocation permissions in browser
- Check browser console for errors

**Database connection issues?**
- Verify Supabase credentials
- Check if tables are created (run migration)
- Ensure RLS policies are enabled

**Components not rendering?**
- Check "use client" directive for client components
- Verify import paths
- Clear Next.js cache: `rm -rf .next`

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
Ensure environment variables are set in your hosting platform's settings.

## Future Enhancements

- Image upload with Supabase Storage
- Social sharing of outfits
- AI-powered outfit recommendations
- Mobile app version
- Integration with fashion retailers
- Seasonal trend analysis
- Weather forecasting integration
- User collaboration features

## Support

For issues or questions, check:
1. Supabase documentation: https://supabase.com/docs
2. Framer Motion: https://www.framer.com/motion
3. Next.js: https://nextjs.org/docs

## License

This project is built for educational and personal use.
