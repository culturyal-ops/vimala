# Premium Design System

## Typography Scale

### Display Headings (Cormorant Garamond)
- `text-display-2xl` - 5.5rem / 88px - Hero sections
- `text-display-xl` - 4.5rem / 72px - Major headings  
- `text-display-lg` - 3.5rem / 56px - Section titles
- `text-display-md` - 2.5rem / 40px - Subsection titles
- `text-display-sm` - 2rem / 32px - Card headers

### Standard Headings
- `text-h1` - 3rem / 48px
- `text-h2` - 2.25rem / 36px
- `text-h3` - 1.75rem / 28px
- `text-h4` - 1.375rem / 22px

### Body Text (Outfit)
- `text-body-xl` - 1.25rem / 20px - Large paragraphs
- `text-body-lg` - 1.125rem / 18px - Featured text
- `text-body` - 1rem / 16px - Default body
- `text-body-sm` - 0.9375rem / 15px - Small text
- `text-body-xs` - 0.875rem / 14px - Captions

### UI Elements
- `text-label` - 0.8125rem / 13px - Labels, uppercase
- `text-caption` - 0.75rem / 12px - Fine print

## Color Palette

### Primary Colors
```css
bg-crimson          /* Deep red #8B1E3F */
bg-crimson-light    /* Lighter red #A53454 */
bg-crimson-dark     /* Darker red #6B1731 */
bg-crimson-deep     /* Deepest red #4A0D1F */

bg-gold             /* Rich gold #C9A96E */
bg-gold-light       /* Lighter gold #D9B97E */
bg-gold-muted       /* Muted gold #B89860 */
bg-gold-pale        /* Pale gold #EBE1D1 */
bg-gold-shimmer     /* Shimmer gold #E5D4B5 */
```

### Neutral Colors
```css
bg-canvas           /* Main background #FDFCFB */
bg-canvas-warm      /* Warm background #FAF9F7 */
bg-canvas-cream     /* Cream background #F9F7F4 */

bg-surface          /* Surface #F7F5F2 */
bg-surface-muted    /* Muted surface #F0EEEB */
bg-surface-elevated /* Elevated (white) */

bg-ivory            /* Pure ivory #FFFEFB */
bg-ivory-warm       /* Warm ivory #FAF9F6 */
bg-ivory-cream      /* Cream ivory #F5F3EF */

bg-ink              /* Deep black #1A1614 */
bg-ink-soft         /* Soft black #2D2926 */
bg-ink-muted        /* Muted black #524D48 */
bg-ink-lighter      /* Lighter ink #6B6560 */
```

## Shadows

### Premium Shadows
```css
shadow-premium-sm   /* Subtle elevation */
shadow-premium      /* Standard elevation */
shadow-premium-md   /* Medium elevation */
shadow-premium-lg   /* Large elevation */
shadow-premium-xl   /* Extra large elevation */
```

### Glow Effects
```css
shadow-glow-gold    /* Gold glow */
shadow-glow-crimson /* Crimson glow */
```

### Inner Shadows
```css
shadow-inner-subtle   /* Subtle inner shadow */
shadow-inner-premium  /* Premium inner shadow */
```

## Component Classes

### Cards
```css
.editorial-card      /* Hover lifts with shadow */
.luxury-card         /* Subtle scale on hover */
.glass-panel         /* Glass morphism light */
.glass-crimson       /* Glass morphism crimson */
.glass-dark          /* Glass morphism dark */
.glass-gold          /* Glass morphism gold */
```

### Buttons
```css
.btn-primary         /* Crimson gradient button */
.btn-secondary       /* Gold outline button */
```

### Text Effects
```css
.text-gradient-gold     /* Gold gradient text */
.text-gradient-crimson  /* Crimson gradient text */
.text-shadow-subtle     /* Subtle text shadow */
.text-shadow-premium    /* Premium text shadow */
```

### Patterns & Textures
```css
.hero-arch-pattern   /* Indian arch pattern */
.paisley-pattern     /* Paisley motif */
.damask-pattern      /* Damask pattern */
.silk-texture        /* Silk fabric texture */
```

### Gradients
```css
.gold-gradient       /* Gold gradient background */
.crimson-gradient    /* Crimson gradient background */
.shimmer-effect      /* Animated shimmer */
```

## Animations

```css
animate-fadeIn         /* Fade in with slide up */
animate-fadeInScale    /* Fade in with scale */
animate-shimmer        /* Shimmer animation */
animate-float          /* Floating animation */
animate-slideUpFade    /* Slide up with fade */
animate-slideDownFade  /* Slide down with fade */
animate-scaleIn        /* Scale in animation */
```

## Transitions

```css
ease-premium         /* Cubic bezier smooth */
ease-smooth          /* Extra smooth easing */
ease-bounce-soft     /* Soft bounce effect */
duration-300         /* Default 300ms */
```

## Spacing

### Section Spacing
```css
.section-pad         /* py-20 md:py-28 lg:py-36 */
.section-spacer      /* h-20 md:h-28 lg:h-36 */
.content-spacer      /* h-12 md:h-16 lg:h-20 */
```

### Container
```css
.page-container      /* Max-width container with responsive padding */
```

## Usage Examples

### Premium Hero Section
```tsx
<section className="relative overflow-hidden bg-canvas silk-texture">
  <div className="absolute inset-0 hero-arch-pattern opacity-40" />
  <div className="page-container section-pad">
    <h1 className="text-display-xl font-display font-light tracking-tight text-ink animate-fadeIn">
      Timeless Elegance
    </h1>
  </div>
</section>
```

### Luxury Card
```tsx
<div className="luxury-card rounded-xl p-8">
  <h3 className="text-h3 text-gradient-gold">Premium Silk Sarees</h3>
  <p className="text-body text-ink-muted">
    Handcrafted with care and tradition
  </p>
</div>
```

### Glass Panel
```tsx
<div className="glass-panel rounded-2xl p-6">
  <p className="text-body-lg text-ink">
    Elevated content with backdrop blur
  </p>
</div>
```

### Premium Button
```tsx
<button className="btn-primary rounded-full px-8 py-3.5 text-body font-medium">
  Shop Collection
</button>

<button className="btn-secondary rounded-full px-8 py-3.5 text-body font-medium">
  Learn More
</button>
```
