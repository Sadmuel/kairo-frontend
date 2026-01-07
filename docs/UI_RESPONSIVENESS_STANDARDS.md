# UI Responsiveness Standards

This document establishes the standards for building responsive UI components in the Kairo frontend application. Follow these guidelines to ensure a consistent, accessible experience across all device sizes.

## Table of Contents

1. [Breakpoints](#breakpoints)
2. [Touch Targets](#touch-targets)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Layout Patterns](#layout-patterns)
6. [Component Guidelines](#component-guidelines)
7. [Best Practices](#best-practices)

---

## Breakpoints

We use Tailwind CSS's default breakpoint system. Design mobile-first, then add responsive modifiers.

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| (default)  | 0px       | Mobile phones  |
| `sm:`      | 640px     | Large phones, small tablets |
| `md:`      | 768px     | Tablets |
| `lg:`      | 1024px    | Laptops, small desktops |
| `xl:`      | 1280px    | Large desktops |

### Usage Pattern

```tsx
// Mobile-first: base styles for mobile, then add responsive modifiers
<div className="p-4 sm:p-6 md:p-8">
  <h1 className="text-xl sm:text-2xl md:text-3xl">Title</h1>
</div>
```

---

## Touch Targets

Minimum touch target size is **44x44 pixels** (or `h-10 w-10` / `h-11 w-11` in Tailwind) for mobile devices.

### Button Sizes

```tsx
// Icon buttons - minimum 40px (h-10) on mobile
<Button size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
  <Icon className="h-4 w-4" />
</Button>

// Text buttons - minimum 40px height on mobile
<Button className="h-10 sm:h-9">Click me</Button>
```

### Interactive Elements

```tsx
// Checkboxes with touch-friendly wrapper
<div className="flex h-10 w-10 items-center justify-center sm:h-auto sm:w-auto">
  <Checkbox className="h-5 w-5 sm:h-4 sm:w-4" />
</div>

// Drag handles
<button className="flex h-10 w-10 items-center justify-center sm:h-auto sm:w-auto">
  <GripVertical className="h-5 w-5" />
</button>
```

---

## Typography

Use responsive text sizes for better readability across devices.

### Text Scale

| Element | Mobile | Desktop (sm:) |
|---------|--------|---------------|
| Page title | `text-2xl` | `text-3xl` |
| Section heading | `text-lg` | `text-xl` |
| Card title | `text-base` | `text-lg` |
| Body text | `text-sm` | `text-base` |
| Small text | `text-xs` | `text-sm` |
| Tiny labels | `text-[10px]` | `text-xs` |

### Examples

```tsx
<h1 className="text-2xl font-bold sm:text-3xl">Page Title</h1>
<h2 className="text-lg font-semibold sm:text-xl">Section Heading</h2>
<p className="text-sm sm:text-base">Body text content</p>
<span className="text-xs text-muted-foreground sm:text-sm">Helper text</span>
```

---

## Spacing

Use consistent responsive spacing throughout the application.

### Page Padding

```tsx
// Page container
<div className="px-3 py-4 sm:px-4 sm:py-6 md:p-8">
  {/* content */}
</div>
```

### Component Spacing

```tsx
// Cards and sections
<Card className="p-3 sm:p-4 md:p-6">
  {/* content */}
</Card>

// Gap between elements
<div className="space-y-3 sm:space-y-4">
  {/* stacked items */}
</div>

<div className="flex gap-2 sm:gap-3">
  {/* inline items */}
</div>
```

---

## Layout Patterns

### Stacking Pattern

Elements that are side-by-side on desktop should stack on mobile.

```tsx
// Header with navigation
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1>Title</h1>
  <nav>{/* buttons */}</nav>
</div>

// Form buttons
<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
  <Button variant="outline">Cancel</Button>
  <Button>Submit</Button>
</div>
```

### Grid Pattern

Forms and multi-column layouts should collapse to single column on mobile.

```tsx
// Form fields
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
  <div>Field 1</div>
  <div>Field 2</div>
</div>
```

### Horizontal Scroll Pattern

For complex grids that can't collapse (like calendars), use horizontal scroll on mobile.

```tsx
<div className="overflow-x-auto">
  <div className="min-w-[640px]">
    {/* Week view grid */}
  </div>
</div>
```

---

## Component Guidelines

### Forms

```tsx
// Input fields
<Input className="h-10 sm:h-9" />

// Select/TimePicker
<SelectTrigger className="h-10 w-full sm:h-9 sm:w-[120px]">
  <SelectValue />
</SelectTrigger>

// Labels
<Label className="text-sm">Field Label</Label>
```

### Cards

```tsx
<Card>
  <CardHeader className="p-4 sm:p-6">
    <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
    {/* content */}
  </CardContent>
</Card>
```

### Dialogs/Modals

```tsx
<DialogContent className="max-w-[95vw] sm:max-w-lg">
  <DialogHeader>
    <DialogTitle className="text-lg sm:text-xl">Title</DialogTitle>
  </DialogHeader>
  {/* content */}
  <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </DialogFooter>
</DialogContent>
```

### Action Buttons in Lists

On mobile, action buttons should be always visible (not just on hover).

```tsx
<div className="group flex items-center">
  <span className="flex-1">Content</span>
  {/* opacity-100 on mobile, hover-only on desktop */}
  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
    <Button size="icon" className="h-8 w-8 sm:h-7 sm:w-7">
      <EditIcon />
    </Button>
  </div>
</div>
```

---

## Best Practices

### 1. Mobile-First Development

Always start with mobile styles, then add responsive modifiers for larger screens.

```tsx
// Good - mobile first
<div className="p-4 sm:p-6 lg:p-8">

// Avoid - desktop first (harder to maintain)
<div className="p-8 max-sm:p-4">
```

### 2. Avoid Fixed Widths

Use responsive widths or full-width on mobile.

```tsx
// Good
<input className="w-full sm:w-[200px]" />

// Avoid
<input className="w-[200px]" /> // Will overflow on mobile
```

### 3. Test on Real Devices

- Test on actual mobile devices, not just browser dev tools
- Check both portrait and landscape orientations
- Test touch interactions (swipe, tap, long press)

### 4. Prioritize Content

On mobile, consider:
- Hiding non-essential elements
- Using shorter text labels
- Collapsing secondary information

```tsx
// Full text on desktop, abbreviated on mobile
<span className="hidden sm:inline">January 2025</span>
<span className="sm:hidden">Jan 2025</span>
```

### 5. Use Semantic HTML

Proper HTML structure helps with accessibility and responsive behavior.

```tsx
// Use appropriate heading levels
<h1>, <h2>, <h3>

// Use button for clickable elements
<button type="button" onClick={handleClick}>

// Use nav for navigation
<nav>{/* navigation links */}</nav>
```

### 6. Consistent Breakpoint Usage

Stick to the standard breakpoints. Don't create custom breakpoints unless absolutely necessary.

### 7. Test with Different Content Lengths

Ensure layouts handle:
- Short text (e.g., "Hi")
- Long text (e.g., "This is a very long title that might overflow")
- Missing content (empty states)

---

## Checklist for New Components

Before submitting a new component, verify:

- [ ] Touch targets are at least 44px on mobile
- [ ] Text is readable (minimum 14px / text-sm)
- [ ] Component works at 320px viewport width
- [ ] Horizontal scroll is prevented (or intentionally allowed)
- [ ] Action buttons are visible on mobile (not hover-only)
- [ ] Forms stack vertically on mobile
- [ ] Spacing adjusts for different screen sizes
- [ ] No fixed widths that cause overflow

---

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Apple Human Interface Guidelines - Touch](https://developer.apple.com/design/human-interface-guidelines/accessibility#Touch-targets)
