# Haath Saga - Vizag Palette Color Theme Guide

## Vizag Palette - Primary Brand Colors

| Color Name | Hex Value | Description | Usage |
|------------|------------|-------------|-------|
| brand-primary | #1F305E | Deep Indigo (The Sea / Ink) | Primary brand color, main CTAs, headings |
| brand-secondary | #CC5500 | Rust Terracotta (The Earth / Rocks) | Secondary brand color, accents, highlights |
| brand-accent | #C5A059 | Temple Gold (Jewelry / Luxury details) | Accent color, special highlights, badges |
| brand-kora | #F5F5DC | Unbleached Kora (Sand / Raw Cotton) | Background color, soft elements |

## Extended Color Palette

| Color Name | Hex Value | Usage |
|------------|------------|-------|
| brand-gold | #C5A059 | Gold accents, special elements, borders (same as brand-accent) |
| brand-red | #ef4444 | Error states, sale badges, warnings |
| brand-green | #10b981 | Success states, in-stock indicators |

## Neutral Colors

| Color Name | Hex Value | Light Mode | Dark Mode |
|------------|------------|------------|-----------|
| white | #FFFFFF | Text on dark backgrounds | Background |
| black | #000000 | Text | Text on light backgrounds |
| gray-50 | #F9FAFB | Backgrounds | - |
| gray-100 | #F3F4F6 | Cards, hover states | - |
| gray-200 | #E5E7EB | Borders | - |
| gray-300 | #D1D5DB | Disabled elements | - |
| gray-400 | #9CA3AF | Placeholders | - |
| gray-500 | #6B7280 | Secondary text | - |
| gray-600 | #4B5563 | Muted text | - |
| gray-700 | #374151 | Text | - |
| gray-800 | #1F2937 | - | Hover states |
| gray-900 | #111827 | - | Cards, backgrounds |

## Theme Implementation Guidelines

### 1. Use Tailwind Classes with Custom Colors
Always use the custom brand colors defined in tailwind.config:
- `text-brand-primary` (Deep Indigo)
- `bg-brand-secondary` (Rust Terracotta)
- `border-brand-accent` (Temple Gold)
- `bg-brand-kora` (Unbleached Kora background)
- `hover:bg-brand-primary`

### 2. Inline Styles (When Necessary)
When inline styles are unavoidable, use CSS variables:
```css
style={{ color: 'var(--brand-primary)' }}
```

### 3. Dark Mode Implementation
Always provide dark mode alternatives:
```jsx
className={`${theme === 'dark' ? 'text-white bg-gray-900' : 'text-gray-900 bg-brand-kora'}`}
```

### 4. Component Color Patterns

#### Buttons
- Primary: `bg-brand-primary hover:bg-brand-secondary text-white`
- Secondary: `border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white`
- Accent: `bg-brand-accent hover:bg-yellow-500 text-black`
- Soft: `bg-brand-kora hover:bg-gray-200 text-brand-primary`

#### Cards
- Background: `theme === 'dark' ? 'bg-gray-800' : 'bg-white'` or `theme === 'dark' ? 'bg-gray-800' : 'bg-brand-kora'`
- Border: `theme === 'dark' ? 'border-gray-700' : 'border-gray-200'`
- Text: `theme === 'dark' ? 'text-white' : 'text-gray-900'`

#### Links
- Default: `text-brand-primary hover:text-brand-secondary`
- Inverted: `text-white hover:text-gray-200`

#### Status Indicators
- Success: `text-green-500 bg-green-50`
- Error: `text-red-500 bg-red-50`
- Warning: `text-yellow-500 bg-yellow-50`

### 5. Vizag Palette Specific Guidelines

#### Color Combinations
- **Primary Combinations**: Deep Indigo + Unbleached Kora for elegant contrast
- **Accent Combinations**: Temple Gold + Deep Indigo for luxury feel
- **Earth Tones**: Rust Terracotta + Unbleached Kora for natural, organic feel
- **Full Palette**: All four colors can be used together for rich, vibrant designs

#### Accessibility Considerations
- Deep Indigo (#1F305E) provides excellent contrast with white text
- Rust Terracotta (#CC5500) works well with both white and Unbleached Kora backgrounds
- Temple Gold (#C5A059) has sufficient contrast with Deep Indigo backgrounds
- Unbleached Kora (#F5F5DC) should not be used with light text

## Common Color Issues to Avoid

1. **Hard-coded hex values** - Always use theme variables or Tailwind classes
2. **Missing dark mode support** - Ensure all components work in both themes
3. **Inconsistent color usage** - Use brand-primary consistently for primary actions
4. **Poor contrast** - Ensure text is readable on backgrounds in both themes
5. **Too many colors** - Stick to the defined Vizag Palette for consistency
6. **Ignoring the Kora background** - Utilize brand-kora for soft, natural backgrounds

## Implementation Checklist

When updating or creating components:

- [ ] Use Vizag Palette colors from the defined palette
- [ ] Implement dark mode support
- [ ] Ensure proper contrast ratios (especially with brand-kora backgrounds)
- [ ] Test hover and focus states
- [ ] Verify color consistency across similar elements
- [ ] Avoid hard-coded hex values
- [ ] Consider using brand-kora for soft, natural background elements
- [ ] Test color combinations to ensure they reflect the Vizag aesthetic

## Vizag Palette Brand Identity

The Vizag Palette reflects the essence of Haath Saga's connection to traditional craftsmanship:

- **Deep Indigo** represents the sea and ink, symbolizing depth and tradition
- **Rust Terracotta** connects to the earth and rocks, representing stability and craftsmanship
- **Unbleached Kora** reflects sand and raw cotton, representing natural materials
- **Temple Gold** signifies jewelry and luxury details, representing premium quality

This palette creates a cohesive brand identity that honors traditional Indian craftsmanship while maintaining a contemporary, premium feel.