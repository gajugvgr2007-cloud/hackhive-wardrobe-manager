# Smart Outfit Planner - Feature Documentation

## Overview

The Smart Outfit Planner is a **deterministic, non-AI clothing recommendation engine** that uses real-time weather data from OpenWeatherMap API to suggest appropriate outfits. It combines weather conditions with user-selected occasion preferences to filter wardrobe items intelligently.

## How It Works

### Deterministic Filtering Logic

The planner uses **strict if/then rules** with no machine learning or AI. Every recommendation is based on transparent, rule-based logic:

#### Rule 1: Hot Weather Filter
```
IF temperature > 25°C
THEN show only items tagged with "Hot"
```
- When it's warm, only clothing designed for hot weather is suggested
- Excludes heavy coats, long sleeves, and warm layers

#### Rule 2: Cold Weather Filter
```
IF temperature ≤ 15°C
THEN show only items tagged with "Cold"
```
- When it's cold, only items tagged for cold weather are suggested
- Excludes light shirts, shorts, and summer wear

#### Rule 3: Mild Weather Filter
```
IF 15°C < temperature ≤ 25°C
THEN show flexible items (all weather tags acceptable)
```
- In mild weather, items with any weather tag can be shown
- Provides more options without restricting by temperature

#### Rule 4: Rainy Condition Filter
```
IF weather condition includes "Rain"
THEN show only items tagged with "Rainy"
```
- When rain is detected, only rain-appropriate items are shown
- Must have explicit "Rainy" tag to be recommended

#### Rule 5: Occasion Filter
```
FOR each item:
  IF item.occasions includes selectedOccasion
  AND weather rules are satisfied
  THEN show item
```
- Occasion is always applied (Casual, Formal, or Workout)
- Weather rules are applied independently

### Order of Operations

1. **Fetch weather** from OpenWeatherMap API using geolocation
2. **Apply weather rules** based on temperature and conditions
3. **Apply occasion filter** based on user selection
4. **Return all items** that satisfy both weather AND occasion criteria

## Features

### Weather Integration

- **Real-time API**: Fetches current weather from OpenWeatherMap
- **Geolocation**: Automatically detects user's location
- **Auto-refresh**: Updates every 10 minutes
- **Fallback**: Provides default weather if API fails
- **Displays**: Temperature, conditions, humidity, wind speed, location

### Occasion Segmented Control

Three quick-toggle buttons to switch occasions:
- **Casual**: Everyday wear (t-shirts, jeans, casual dresses)
- **Formal**: Dressy occasions (blazers, dress pants, formal wear)
- **Workout**: Athletic activities (tank tops, leggings, gym wear)

Each click instantly re-filters the wardrobe.

### Smart Filtering Display

Shows all active filtering rules:
- Current temperature and its impact
- Weather condition analysis
- Occasion selection
- Number of matching items

### Visual Indicators

Each item card shows:
- **Weather match badges**: Indicates if item is perfect match (green) or just acceptable (gray)
- **Occasion tags**: Shows which occasions the item is suitable for
- **Perfect match indicator**: Shows when item matches both weather and occasion
- **Image with hover zoom**: 1.1x scale on hover

### Empty State

When no items match criteria:
- Clear message explaining why
- Suggestion to try different occasion or wait for weather change

## Data Structure

### ClothingItem Interface

```typescript
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  occasions: string[];           // ["Casual", "Formal", "Workout"]
  weather_types: string[];       // ["Hot", "Cold", "Rainy"]
  created_at?: string;
}
```

### WeatherData Interface

```typescript
interface WeatherData {
  temp: number;                  // Current temperature (°C)
  description: string;           // "Rainy", "Sunny", "Cloudy", etc.
  humidity: number;              // 0-100%
  wind_speed: number;            // m/s
  location: string;              // City name
}
```

## Temperature Thresholds

| Range | Category | Filter | Use Case |
|-------|----------|--------|----------|
| > 25°C | Hot | Only "Hot" tagged items | Summer, tropical weather |
| 15-25°C | Mild | All flexible items | Spring, fall, pleasant weather |
| ≤ 15°C | Cold | Only "Cold" tagged items | Winter, cold weather |

## Weather Condition Mapping

| Condition | Filter | Examples |
|-----------|--------|----------|
| Contains "Rain" | Only "Rainy" tagged | Rainy, Drizzle, Thunderstorm |
| Contains "Clear" | No special filter | Clear, Sunny |
| Contains "Cloud" | No special filter | Cloudy, Overcast |
| Contains "Snow" | Implied "Cold" | Snow (rare, uses cold filter) |

## Component Structure

### OutfitPlanner Component

**Location**: `components/pages/OutfitPlanner.tsx`

**State Management**:
- `weather`: Current weather data from API
- `loading`: Loading state during API call
- `error`: Error message if API fails
- `selectedOccasion`: Currently selected occasion (Casual, Formal, Workout)

**Key Functions**:
- `fetchWeather()`: Gets weather from OpenWeatherMap API
- `filteredItems` (useMemo): Applies deterministic filtering logic
- `getWeatherIcon()`: Returns icon based on weather condition
- `getFilteringRules()`: Displays active filtering rules to user

**Rendering**:
- Weather card with conditions and rules
- Occasion segmented control
- Results count display
- Masonry grid of filtered items
- Empty state message if no matches
- Filtering logic documentation box

## Integration Points

### API Integration

```typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
);
```

**Required**:
- `NEXT_PUBLIC_OPENWEATHER_API_KEY` environment variable
- Browser geolocation permission

**Data Used**:
- `data.main.temp` - Temperature in Celsius
- `data.weather[0].main` - Weather condition
- `data.main.humidity` - Humidity percentage
- `data.wind.speed` - Wind speed in m/s
- `data.name` - Location name

### Wardrobe Data

Currently uses sample data, but can be connected to:
- React state (from wardrobe page)
- Supabase database
- LocalStorage
- Any JSON API

## Performance

- **Filtering**: O(n) - Iterates through wardrobe once
- **Memoization**: Uses `useMemo` to prevent unnecessary recalculations
- **API**: Fetches once on mount, updates every 10 minutes
- **Rendering**: Smooth animations with Framer Motion

## Animations

- **Page entrance**: Fade in (0.4s)
- **Weather card**: Slide up (0.3s)
- **Occasion buttons**: Scale on hover/tap
- **Items grid**: Staggered entrance (50ms delay)
- **Empty state**: Fade and slide
- **Filtering rules**: List fade-in with stagger

## UI/UX Features

### Visual Hierarchy

1. **Header**: Large title and description
2. **Weather Card**: Prominent, colorful, shows current conditions
3. **Occasion Control**: Easy to use segmented buttons
4. **Results Summary**: Shows count of matching items
5. **Item Grid**: Main content area with filtered results
6. **Logic Documentation**: Explains filtering rules

### Accessibility

- Clear labels for all sections
- Semantic HTML
- Color-coded indicators
- Text-based explanations alongside icons
- Keyboard navigable

### Responsive Design

- Mobile: Single column grid
- Tablet: 2 columns
- Laptop: 3 columns
- Desktop: 4 columns

## Example Filtering Scenarios

### Scenario 1: Hot Summer Day

**Weather**: 28°C, Sunny, Casual occasion selected

**Rules Applied**:
1. Temperature > 25°C → Filter to "Hot" tagged items
2. Occasion = Casual → Filter to "Casual" items
3. No rain condition

**Result**: Shows t-shirts, shorts, sandals, light dresses tagged as Casual + Hot

### Scenario 2: Cold Rainy Day

**Weather**: 10°C, Rainy, Formal occasion selected

**Rules Applied**:
1. Temperature ≤ 15°C → Filter to "Cold" tagged items
2. Condition includes "Rain" → Filter to "Rainy" tagged items
3. Occasion = Formal → Filter to "Formal" items

**Result**: Shows formal coats, long pants, rain jackets tagged as Formal + Cold + Rainy

### Scenario 3: Mild Workout Day

**Weather**: 20°C, Partly Cloudy, Workout occasion selected

**Rules Applied**:
1. 15°C < 20°C ≤ 25°C → Show flexible items (all weather tags)
2. No rain condition
3. Occasion = Workout → Filter to "Workout" items

**Result**: Shows athletic wear, gym clothes, sneakers tagged as Workout (all weather types acceptable)

## Testing the Feature

### Setup

1. Navigate to "Smart Planner" in sidebar
2. Allow browser geolocation access
3. Wait for weather API to fetch data

### User Testing

1. **Test weather rules**:
   - Change system time to different season
   - Verify filtering changes appropriately

2. **Test occasion switching**:
   - Click Casual, Formal, Workout buttons
   - Verify items update instantly

3. **Test empty states**:
   - Select occasion with no matching items
   - Verify empty state message

4. **Test responsive**:
   - Resize window
   - Verify grid adjusts columns

5. **Test API failure**:
   - Disable internet
   - Verify fallback weather is used

## Code Examples

### Using the Filtering Logic

```typescript
const filteredItems = useMemo(() => {
  if (!weather) return [];

  return SAMPLE_WARDROBE.filter(item => {
    // Check occasion match
    if (!item.occasions.includes(selectedOccasion)) {
      return false;
    }

    // Apply weather rules
    if (weather.temp > 25) {
      if (!item.weather_types.includes('Hot')) return false;
    }
    
    if (weather.temp <= 15) {
      if (!item.weather_types.includes('Cold')) return false;
    }
    
    if (weather.description.toLowerCase().includes('rain')) {
      if (!item.weather_types.includes('Rainy')) return false;
    }

    return true;
  });
}, [weather, selectedOccasion]);
```

### Displaying Active Rules

```typescript
const getFilteringRules = () => {
  const rules = [];

  if (weather.temp > 25) {
    rules.push({
      icon: <Sun />,
      text: `Hot weather → Showing "Hot" items`
    });
  }
  // ... more rules

  return rules;
};
```

## Future Enhancements

1. **Multi-select occasions**: Choose multiple occasions at once
2. **Time-based filtering**: Different recommendations for day vs. evening
3. **Activity intensity**: Different filtering for intense vs. light workouts
4. **Seasonal categories**: Spring, Summer, Fall, Winter filtering
5. **User preferences**: Let users save their own filtering rules
6. **Outfit combinations**: Show items that go well together
7. **Trend integration**: Consider trending colors/styles
8. **UV index**: Factor in sun protection needs
9. **Humidity-based**: Additional comfort filtering
10. **Timezone awareness**: Account for time of day

## Browser Support

- Chrome 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support
- Mobile browsers: Full support

## Related Documentation

- See `README.md` for project overview
- See `DIGITAL_WARDROBE.md` for wardrobe management
- See `SETUP.md` for installation
