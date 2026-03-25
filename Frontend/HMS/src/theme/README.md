# HMS Theme - Elegant Professional

Sophisticated, elegant, and professional healthcare interface theme for the Hospital Management System.

## 📁 Structure

```
theme/
├── _variables.scss    # All theme variables (colors, typography, spacing, etc.)
├── _mixins.scss       # Reusable mixins and utilities
├── index.scss         # Main entry point (imports variables and mixins)
└── README.md          # This file
```

## 🎨 Usage

### Import in Component Styles

```scss
@use 'theme/index' as *;

.my-component {
  background: $primary-base;
  color: $white;
  padding: $space-4;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  
  &:hover {
    @include hover-lift;
  }
}
```

### Using Variables

```scss
// Colors
$primary-base      // Main brand color (Vibrant Blue)
$primary-dark      // Darker variant (Deep Indigo)
$primary-light     // Lighter variant (Light Blue)
$primary-lighter   // Pale blue - backgrounds
$gray-50 to $gray-900  // Grayscale palette
$success-base      // Success color
$error-base        // Error color
$warning-base      // Warning color

// Typography
$font-primary      // Primary font family (Inter)
$text-base         // Base font size (16px)
$font-medium       // Medium font weight

// Spacing
$space-4           // 16px spacing
$space-6           // 24px spacing

// Borders & Radius
$radius-md         // Medium border radius (12px)
$border-color-base // Base border color

// Shadows
$shadow-sm         // Small shadow
$shadow-md         // Medium shadow
$shadow-lg         // Large shadow
```

### Using Mixins

```scss
// Responsive breakpoints
@include respond-to('md') {
  // Styles for medium screens and up
}

// Flexbox utilities
@include flex-center;      // Center content
@include flex-between;    // Space between

// Text utilities
@include truncate;        // Single line truncate
@include line-clamp(3);   // Multi-line truncate (3 lines)

// Components
@include card;            // Card styling
@include hover-lift;      // Hover lift effect
@include button-base;     // Button base styles
@include input-base;      // Input base styles

// Focus styles
@include focus-ring;      // Focus ring for accessibility
```

## 🎯 Color Palette

### Primary Colors (Elegant Indigo Blue)
- `$primary-dark`: #1E3A8A - Deep indigo
- `$primary-base`: #3B82F6 - Vibrant blue (main brand color)
- `$primary-light`: #60A5FA - Light blue
- `$primary-lighter`: #DBEAFE - Pale blue
- `$primary-lightest`: #EFF6FF - Very pale blue

### Semantic Colors
- Success: `$success-base` (#10B981)
- Warning: `$warning-base` (#F59E0B)
- Error: `$error-base` (#EF4444)
- Info: `$info-base` (#3B82F6)

### Medical Status Colors
- `$critical`: #DC2626
- `$stable`: #10B981
- `$moderate`: #F59E0B
- `$emergency`: #B91C1C

## 📐 Spacing System

Based on 8px grid system:
- `$space-1`: 4px
- `$space-2`: 8px
- `$space-4`: 16px
- `$space-6`: 24px
- `$space-8`: 32px
- `$space-12`: 48px
- `$space-16`: 64px

## 🔤 Typography

### Font Families
- `$font-primary`: Inter (primary)
- `$font-secondary`: SF Pro Display
- `$font-mono`: JetBrains Mono

### Font Sizes
- `$text-xs`: 12px
- `$text-sm`: 14px
- `$text-base`: 16px (default)
- `$text-lg`: 18px
- `$text-xl`: 20px
- `$text-2xl`: 24px
- `$text-3xl`: 30px
- `$text-4xl`: 36px

## 📱 Breakpoints

- `$breakpoint-sm`: 640px
- `$breakpoint-md`: 768px
- `$breakpoint-lg`: 1024px
- `$breakpoint-xl`: 1280px
- `$breakpoint-2xl`: 1536px

## 🎭 Component Variables

### Buttons
- `$btn-padding-base`: Base padding
- `$btn-radius`: Border radius (12px)
- `$btn-font-weight`: Font weight

### Inputs
- `$input-height-base`: 44px
- `$input-border-color`: Border color
- `$input-border-color-focus`: Focus border color

### Cards
- `$card-bg`: Background color
- `$card-padding`: Padding
- `$card-radius`: Border radius (16px)
- `$card-shadow`: Shadow

## ✨ Best Practices

1. **Always use theme variables** instead of hardcoded values
2. **Use mixins** for common patterns (cards, buttons, etc.)
3. **Follow spacing system** - use `$space-*` variables
4. **Use semantic colors** - `$success-base`, `$error-base`, etc.
5. **Responsive design** - use `@include respond-to()` mixin
6. **Accessibility** - use `@include focus-ring` for focus states

## 📚 Examples

### Example: Card Component

```scss
@use 'theme/index' as *;

.patient-card {
  @include card;
  
  .patient-name {
    color: $gray-900;
    font-size: $text-xl;
    font-weight: $font-semibold;
    margin-bottom: $space-2;
  }
  
  .patient-status {
    display: inline-block;
    padding: $badge-padding;
    border-radius: $badge-radius;
    font-size: $badge-font-size;
    background: $success-light;
    color: $success-dark;
  }
}
```

### Example: Responsive Layout

```scss
@use 'theme/index' as *;

.dashboard-grid {
  display: grid;
  gap: $space-6;
  
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🔄 Updates

When updating the theme:
1. Modify variables in `_variables.scss`
2. Add new mixins to `_mixins.scss`
3. All components will automatically use the new values
