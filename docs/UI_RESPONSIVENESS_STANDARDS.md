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

// Drag handles for sortable todos and notes; time blocks have no drag handle
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

### Calendar Color Surfaces

Use [`getCalendarColorStyle`](../src/lib/calendar-colors.ts) for the shared calendar treatment. It mixes **11% of the saved color with 89% of `hsl(var(--card))`**, using `color || DEFAULT_BLOCK_COLOR`. Keep the full-strength color on the left accent. The helper only returns presentation styles; it does not normalize or persist colors.

| Component | Surface | Left accent |
|-----------|---------|-------------|
| Day `TimeBlockCard` | Soft background across the entire card, including expanded details | 6 px |
| Day `EventCard` | Soft background across the entire card | 6 px |
| Week time block | Soft background with a neutral 1 px inset contour | 3 px |
| Week/Month `EventBadge` | Soft background | 3 px |
| Dashboard `TimeBlockListWidget` rows | Soft background across each time block row | 3 px |
| Dashboard `UpcomingEventsWidget` rows | Soft background across each event row; neutral, theme-aware date tile | 3 px |
| Month time block dots | Solid saved color; keep existing 4 px / 6 px dot sizes | Not applicable |

Dashboard statistics widgets do not use this shared surface treatment.

- **Theme-aware text:** use `card-foreground` on tinted surfaces. Week and dashboard secondary text and completed titles, plus Day event recurrence labels, use `text-card-foreground/70 dark:text-muted-foreground`. Day retains its scoped contrast adjustments for secondary text and placeholders. Day event and time block cards share a local destructive-button color that mixes 70% `destructive` with 30% `card-foreground`. Do not derive badge text color from the original solid fill.
- **Completion:** retain the background and accent at full opacity. Strike through and mute the title; Day also shows the checked checkbox and the dashboard keeps its completion icon. Do not fade the whole time block. The existing event badge hover opacity is a separate interaction state.
- **Day events:** apply the soft background and 6 px accent to `EventCard` itself, replacing the inner 4 px stripe. Preserve title truncation, recurrence labels, edit/delete controls and dialogs, and the occurrence date passed to the edit form.
- **Week geometry:** keep time positioning, minimum block height, padding, and horizontal scrolling. Draw the neutral contour with an inset shadow so it does not consume the limited text height of short blocks.
- **Month density:** keep the existing solid dots, up to three visible blocks, counters, and two visible events per cell. Do not tint an entire day cell or reduce dot opacity to match the larger surfaces.
- **Dashboard rows:** apply the color to the complete row instead of an interior stripe or solid date tile. Keep the event date tile at 40 × 40 px with a neutral background and theme-aware text. Use `grid-cols-1 md:grid-cols-2` on the dashboard grid so long titles do not expand the mobile layout. Preserve title truncation, recurrence and completion icons, todo counts, local occurrence dates, the five-item limits, overflow counts, and calendar links. Match Day's schedule ordering: sort a copy by `startTime` ascending, then numeric `order` ascending for equal start times, before taking the first five blocks. Upcoming events retain their received order.
- **Interaction:** preserve badge recurrence icons, truncation, tooltip, and click/Enter/Space behavior. Activating an event must open its modal without also activating the containing day cell.

For changes to these components, compare before/after in light and dark themes at 320, 375, 768, and 1280 px. Include all preset colors, `null`, custom dark/light colors, completed blocks, long titles, short blocks, dense Month cells, dashboard date tiles and counters, and keyboard focus. Check contrast against the composed background, including hover, rather than only the original color swatch. Keep local contrast adjustments scoped to the affected component.

The current compact layouts have known limitations: minimum-height Week blocks can clip their time label at desktop breakpoints, dense Month cells can compress event rows at 320 px, and the badge's native focus outline can be clipped by its wrapper. Closing the event modal currently returns focus to the document body. Preserve the baseline when making visual changes and assess improvements separately; the soft-color treatment does not establish full accessibility compliance.

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

### Expandable Calendar Sections

Use `CollapsibleContent` for time block details, their summary preview, Notes, Todos, and Day Tasks. Keep the existing initial states: time blocks closed; Notes, Todos, and Day Tasks open.

- **Motion:** animate CSS Grid rows from `0fr` to `1fr` over `400ms` with `cubic-bezier(.2, 0, 0, 1)`. Rotate the same chevron by 180 degrees using the shared CSS tokens. `prefers-reduced-motion: reduce` removes motion and immediately settles mounted content, including when the preference changes during a transition.
- **Presence:** keep the wrapper and its ID mounted so `aria-controls` always resolves. Mount children on first expansion, retain them during closing, and unmount after closing finishes. Reopening during closing preserves the draft; reopening after a full close resets it. Initially open content has no entrance animation.
- **Layout:** put spacing and borders inside the animated body. The time block summary uses an inverse expansion with the same tokens. Clip only while closed or moving, then restore visible overflow for sortable rows and focus rings. Keep the grid column and clipping wrapper's horizontal minimum at zero. Do not measure content height, set a maximum height, or animate transforms on sortable rows.
- **Interaction:** triggers use `aria-expanded`, `aria-controls`, and `type="button"`; focus the trigger before closing. Closing content becomes `inert` and `aria-hidden` immediately. `CollapsibleOpenContext` combines parent and child visibility without starting another size animation in every descendant.
- **Portals:** the todo deadline popover closes immediately when its section or time block closes. Suppress its delayed focus restoration to an inactive or detached trigger; reopening the section must not reopen the popover. Outside a collapsible region, the context defaults to open.

Verify rapid reversals, a full close and reopen, reduced motion changes, nested sections, keyboard focus, and the real deadline portal. Check both pointer and keyboard sorting after expansion, including closing during a drag. Compare baseline and updated geometry in light/dark at 320, 375, 768, and 1280 px with empty and long content. Grid transitions still perform layout; confirm there are no per-frame React updates or size measurements.

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
