# SHOPHUB Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern e-commerce leaders (Shopify, Stripe, Vercel) combined with AI-first product aesthetics. The design emphasizes trust, visual product presentation, and seamless transactions while showcasing AI capabilities as a premium differentiator.

**Design Principles**:
- Clean, trustworthy commerce aesthetics with premium AI features
- Product-first visual hierarchy with generous imagery
- Frictionless checkout and dashboard experiences
- Professional seller/admin tools that feel powerful yet approachable

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary Brand: `220 90% 56%` (Vibrant blue - trust and technology)
- Primary Hover: `220 90% 48%`
- Background: `0 0% 100%` (Pure white)
- Surface: `220 20% 98%` (Subtle warm gray)
- Border: `220 15% 88%`
- Text Primary: `220 20% 15%`
- Text Secondary: `220 15% 45%`

**Dark Mode**:
- Primary Brand: `220 85% 60%`
- Primary Hover: `220 85% 52%`
- Background: `220 25% 8%` (Deep blue-black)
- Surface: `220 20% 12%`
- Border: `220 15% 20%`
- Text Primary: `220 10% 95%`
- Text Secondary: `220 10% 65%`

**Semantic Colors**:
- Success: `142 76% 36%` (Green - for payments, stock)
- Warning: `38 92% 50%` (Amber - low stock alerts)
- Error: `0 84% 60%` (Red - out of stock, errors)
- AI Accent: `280 70% 65%` (Purple gradient for AI features)

---

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - Clean, modern, excellent readability
- Accent: 'Sora' (Google Fonts) - For headings and AI feature labels

**Type Scale**:
- Hero Display: `text-6xl font-bold` (60px)
- Page Heading: `text-4xl font-bold` (36px)
- Section Title: `text-2xl font-semibold` (24px)
- Card Title: `text-lg font-semibold` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Micro: `text-xs` (12px)

---

### C. Layout System

**Spacing Primitives**: Use Tailwind units of `2, 4, 6, 8, 12, 16, 20, 24` for consistent rhythm.

**Container Widths**:
- Max content: `max-w-7xl` (1280px)
- Product grids: `max-w-screen-2xl` (1536px)
- Dashboards: `max-w-screen-xl` (1280px)
- Forms/Checkout: `max-w-2xl` (672px)

**Grid Systems**:
- Product Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Dashboard Metrics: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Checkout Flow: Single column with `max-w-2xl`

---

## Page-Specific Layouts

### Homepage

**Hero Section** (`h-screen` or `min-h-[600px]`):
- Full-width hero with split layout: left side with headline "AI-Powered Shopping, Redefined" + subheading + dual CTAs ("Start Shopping" primary, "Sell With AI" outline), right side features large product showcase image or AI-generated lifestyle image
- Background: Subtle animated gradient mesh (blue to purple) with low opacity
- Buttons on hero: Use `backdrop-blur-md bg-white/10` for outline variants

**Featured Products Carousel**:
- Horizontal scroll with large product cards (400x500px images)
- AI badge for AI-generated descriptions
- Quick-add to cart on hover

**Category Grid** (4 columns on desktop):
- Large category images with overlay text
- Hover: Slight zoom + overlay darkening

**AI Features Showcase** (3 columns):
- Purple gradient accents on cards
- Animated icon placeholders (Heroicons)
- "Try AI Assistant" CTA

**Trust Section** (4 columns):
- Payment icons, security badges, customer count, delivery promise
- Subtle background in `Surface` color

### Product Pages

**Layout**: Two-column split (60/40)

**Left Column**:
- Large product image gallery with thumbnails
- Zoom on hover
- Multiple image carousel

**Right Column**:
- Product title (`text-3xl font-bold`)
- Star rating + review count
- Price (`text-4xl font-bold` in Primary color)
- Stock indicator (green dot + "In Stock")
- AI-generated description with "AI" badge
- Quantity selector + "Add to Cart" (large, primary)
- "Add to Wishlist" (outline button)
- Accordion: Shipping info, Returns, Reviews

**Reviews Section**:
- AI-generated summary card at top (purple accent border)
- Individual reviews with 5-star display, user avatar, helpful votes

### Shopping Cart

**Layout**: Two-column (70/30)

**Left Column**:
- Cart items as cards with thumbnail, title, price, quantity controls
- Remove button (ghost, text-error)
- Continue shopping link

**Right Column** (sticky):
- Order summary card with Surface background
- Subtotal, shipping, taxes breakdown
- Total (`text-2xl font-bold`)
- Checkout button (large, primary, full-width)
- Accepted payment methods icons

### Seller Dashboard

**Sidebar Navigation** (`w-64`):
- Logo at top
- Navigation items with icons (Heroicons)
- Active state: Primary background with white text
- Logout at bottom

**Main Content Area**:
- Page header with breadcrumbs
- Metrics cards grid (4 columns): Total Sales, Products Listed, Pending Orders, Revenue (Chart.js sparklines)
- Product management table with actions
- "Add Product" floating action button (large, primary, bottom-right with `shadow-2xl`)

**Add/Edit Product Form**:
- Clean form layout with labels above inputs
- AI assistance buttons next to description/image fields (purple accent)
- Image upload with preview grid
- Category dropdown, price input, stock counter
- Save as Draft / Publish buttons

### Admin Dashboard

**Enhanced Analytics Focus**:
- Large Chart.js graphs (line charts for sales trends, bar charts for category performance)
- Color-coded status indicators
- Advanced filters toolbar
- Data tables with sorting, search, pagination
- User management with role badges
- Site settings panel with theme preview

---

## D. Component Library

### Cards
- Background: `Surface` color
- Border: `1px` in `Border` color
- Radius: `rounded-xl` (12px)
- Shadow: `shadow-sm` default, `shadow-lg` on hover
- Padding: `p-6`

### Buttons
**Primary**: Background in Primary, white text, `rounded-lg`, `px-6 py-3`, `font-semibold`, hover darkens
**Outline**: Border in Primary, Primary text, transparent background, same sizing
**On Images**: `backdrop-blur-md bg-white/10 border-white/20` with white text

### Input Fields
- Height: `h-12`
- Padding: `px-4`
- Border: `border-2` in `Border` color
- Radius: `rounded-lg`
- Focus: Primary border color with ring
- Dark mode: Surface background with lighter border

### Navigation
**Top Header** (`h-16`):
- Logo left, search center (`max-w-2xl`), cart/profile right
- Sticky with `backdrop-blur-lg bg-white/80` (glassmorphism)
- Shadow on scroll

**Category Bar**: Secondary nav below header with horizontal category links

### Product Cards
- Image: `aspect-square` with `object-cover`
- Padding: `p-4`
- Hover: `scale-105` transform with smooth transition
- Quick actions on hover: heart icon (wishlist), eye icon (quick view)
- AI badge: Small purple pill in top-right corner

### Modals/Dialogs
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Content: `max-w-2xl` with `rounded-2xl` and `shadow-2xl`
- Close button: Top-right, ghost style

### Toast Notifications
- Position: `top-right` with `fixed` positioning
- Success: Green accent border-left
- Error: Red accent border-left
- Auto-dismiss after 4 seconds
- Framer Motion slide-in animation

---

## E. Animations

Use sparingly for polish, not distraction:

**Page Transitions**: Fade in with `opacity-0` to `opacity-100` (300ms)
**Product Card Hover**: Scale + shadow increase (200ms ease-out)
**Add to Cart**: Brief scale pulse on cart icon (300ms)
**Loading States**: Skeleton shimmer effect for product grids
**AI Features**: Subtle purple glow pulse on AI badges

---

## Images

### Required Images:

1. **Hero Image**: Large lifestyle photo showcasing products in use or attractive product display - positioned on right side of hero split layout (1200x800px)

2. **Product Images**: High-quality product photos with white/neutral backgrounds for catalog (square format, min 800x800px)

3. **Category Images**: Lifestyle photos representing each category (landscape 1200x600px)

4. **AI Feature Icons**: Use Heroicons for AI assistant, search, recommendations (with purple accent)

5. **Seller/Admin Avatars**: Placeholder user icons or actual profile photos (circular, 40x40px)

6. **Payment/Trust Badges**: MTN MoMo logo, Paystack logo, security shield icons

7. **Empty States**: Friendly illustrations for empty cart, no products, no orders (use placeholder illustrations)

---

## Accessibility & Performance

- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- ARIA labels on all interactive elements
- Keyboard navigation with visible focus states (ring in Primary color)
- Dark mode consistently applied across all components and forms
- Lazy load images below the fold
- Skeleton loaders for async content

This design creates a modern, trustworthy e-commerce platform that highlights AI capabilities while maintaining familiar shopping patterns users expect.