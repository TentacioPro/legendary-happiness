# Portfolio Website Blueprint

## Project Overview

A modern, single-page portfolio website built with Next.js 14, showcasing skills, projects, and contact information with smooth animations and responsive design.

**Live URL**: https://www.abishek-maharajan.online  
**Tech Stack**: Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion, Shadcn/ui  
**Deployment**: GitHub Pages (static export)

---

## Architecture & Structure

### Core Technology Decisions

1. **Next.js 14 with Static Export** (`output: "export"`)
   - Generates static HTML/CSS/JS for GitHub Pages hosting
   - No server-side rendering required
   - Optimized for performance and SEO

2. **Single Page Application (SPA)**
   - All content on one page (`src/app/page.tsx`)
   - Smooth scroll navigation between sections
   - No routing needed

3. **Component-Based Architecture**
   - Reusable UI components in `src/components/`
   - Section-based content organization in `src/sections/`
   - Shadcn/ui for base UI primitives

---

## File Structure

```
abishek-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── public/
│   ├── cropped.jpg             # Profile photo
│   └── memoji_out.mp4          # Animated avatar video
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata & global components
│   │   ├── page.tsx            # Main page (Hero → About → Skills → Contact)
│   │   └── globals.css         # Global styles & CSS variables
│   ├── assets/
│   │   └── GoldenSignature.otf # Custom font for logo
│   ├── components/
│   │   ├── ui/                 # Shadcn/ui primitives
│   │   │   ├── 3d-card.tsx
│   │   │   ├── button.tsx
│   │   │   └── tooltip.tsx
│   │   ├── back-to-top.tsx     # Floating scroll-to-top button
│   │   ├── blur.tsx
│   │   ├── contact-list.tsx    # Social media icon buttons
│   │   ├── cool-portrait-card.tsx  # 3D portrait card wrapper
│   │   ├── grid-background.tsx # Animated grid background
│   │   ├── header.tsx          # Navigation header
│   │   ├── motion-div.tsx      # Scroll-triggered animation wrapper
│   │   ├── motion-list.tsx     # Animated list wrapper
│   │   └── motion-text.tsx     # Animated text wrapper
│   ├── sections/
│   │   ├── hero.tsx            # Landing section with intro
│   │   ├── about.tsx           # About me section
│   │   ├── skills.tsx          # Skills showcase
│   │   └── contact.tsx         # Contact section
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn for classnames)
│   └── utils/
│       └── paths.ts            # Asset path helper for base path handling
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # TailwindCSS configuration
├── components.json             # Shadcn/ui configuration
└── package.json                # Dependencies & scripts
```

---

## Content Structure & Flow

### Page Layout (`src/app/page.tsx`)

The main page renders four sections in sequence:

```tsx
<Hero />      // Introduction & animated avatar
<About />     // Personal background & photo
<Skills />    // Technical skills categorized
<Contact />   // Social links & contact info
```

### Section Breakdown

#### 1. Hero Section (`src/sections/hero.tsx`)
**Purpose**: First impression, personal branding

**Content Elements**:
- Greeting: "Hi, I'm Abishek Maharajan! 👋"
- Animated memoji video (170x170px, auto-playing loop)
- Three role titles with staggered animations:
  - Developer 🧑🏻‍💻
  - Photographer 📸
  - LLM Enthusiast 🤖
- Inspirational quote (Einstein)
- Brief personal statement
- Social media contact buttons

**Animation Strategy**:
- Text appears with `MotionText` (character-by-character)
- Video fades in with `MotionDiv`
- Role titles cascade with 0.1s delays (0.8s, 0.9s, 1.0s)
- Quote and description follow (1.2s, 1.4s, 1.6s)
- Contact list appears last (1.45s)



#### 2. About Section (`src/sections/about.tsx`)
**Purpose**: Personal story and background

**Layout**: Two-column responsive layout
- **Left Column (2/3 width)**: Text content
  - "About Me" heading
  - Three paragraphs describing background, skills, and interests
  - Each paragraph animates in separately (0.4s, 0.5s, 0.6s delays)
  
- **Right Column (1/3 width)**: Profile photo
  - Desktop: 3D card effect with `CoolPortraitCard`
  - Mobile: Simple image with hover effects (rotate + scale)
  - Image: `cropped.jpg` (350px width, rounded corners)

**Responsive Behavior**:
- Mobile: Photo appears first, then text below
- Desktop: Text left, photo right with 3D tilt effect

#### 3. Skills Section (`src/sections/skills.tsx`)
**Purpose**: Showcase technical expertise

**Organization**: 5 categorized skill groups

1. **Programming** (6 skills)
   - JavaScript, Python, C, CSS, HTML, SQL

2. **Web Development** (8 skills)
   - React.js, Node.js, Express.js, MongoDB, Sequelize, REST APIs, TailwindCSS, Material-UI

3. **Data & Analytics** (3 skills)
   - Apache Superset, Metabase, SQL Query Builder

4. **AI/ML & LLMs** (3 skills)
   - LLama3, Machine Learning, AI Fundamentals

5. **DevOps & Infrastructure** (7 skills)
   - Git, Github, AWS Cloud Practitioner, Linux/Bash, Docker, Kubernetes, Cloud Infrastructure

**Skill Card Design**:
- FontAwesome icon (8x8 size in 16x16 container)
- Skill name below icon
- Hover effect: scale 110% + drop shadow
- Smooth transitions (200ms ease-linear)

**Data Structure**:
```typescript
interface Skill {
  name: string;
  icon: IconDefinition;  // FontAwesome icon
}

interface SkillSection {
  title: string;
  skills: Skill[];
}
```

#### 4. Contact Section (`src/sections/contact.tsx`)
**Purpose**: Call-to-action for collaboration

**Content**:
- "Contact" heading
- Brief invitation message
- `ContactList` component with social links

---

## Reusable Components

### Animation Components

#### `MotionDiv` (`src/components/motion-div.tsx`)
**Purpose**: Scroll-triggered fade-in animation

**Features**:
- Detects when element enters viewport
- Animates from `y: 100, opacity: 0` to `y: 0, opacity: 1`
- Spring animation (damping: 30, stiffness: 200)
- Optional delay offset
- Triggers once (doesn't re-animate on scroll up)

**Usage**:
```tsx
<MotionDiv delayOffset={0.5}>
  <p>This text fades in after 0.5s</p>
</MotionDiv>
```

#### `MotionList` (`src/components/motion-list.tsx`)
**Purpose**: Stagger animation for list items

**Features**:
- Each child animates with incremental delay
- Can trigger on scroll or immediately
- Used for contact buttons and skill cards

#### `MotionText` (`src/components/motion-text.tsx`)
**Purpose**: Character-by-character text reveal

**Features**:
- Splits text into individual characters
- Each character fades in sequentially
- Creates typewriter-like effect

### UI Components

#### `ContactList` (`src/components/contact-list.tsx`)
**Purpose**: Social media and contact links

**Links Included** (6 total):
1. Email (yellow) - `mailto:maharajanabishek@gmail.com`
2. X/Twitter (black) - `https://x.com/abizhek_m`
3. GitHub (black) - `https://github.com/TentacioPro`
4. LinkedIn (blue) - `https://www.linkedin.com/in/abishek-maharajan/`
5. Google Cloud Skills Boost (blue) - Profile link
6. Credly (blue) - Certification profile

**Design**:
- Circular buttons (11x11 on mobile, 12x12 on desktop)
- FontAwesome icons (size-6)
- Tooltip on hover showing platform name
- Color-coded by platform
- Opens in new tab

**Props**:
- `delayOffset`: Animation start delay
- `showWhenInView`: Trigger on scroll vs immediate

#### `CoolPortraitCard` (`src/components/cool-portrait-card.tsx`)
**Purpose**: 3D tilt effect for profile photo

**Implementation**:
- Wraps image in Shadcn 3D card component
- Responds to mouse movement
- Creates depth with `translateZ` transform
- Desktop only (hidden on mobile)

#### `BackToTop` (`src/components/back-to-top.tsx`)
**Purpose**: Quick navigation to top

**Behavior**:
- Appears when scrolled > 100px
- Fixed position (bottom-right corner)
- Circular button with chevron-up icon
- Smooth scroll to top on click
- Fade in/out animation

#### `Header` (`src/components/header.tsx`)
**Purpose**: Navigation and branding

**Layout**:
- Logo: "Abishek Maharajan" in GoldenSignature font (5xl)
- Navigation links: About, Skills, Contact
- Smooth scroll to section on click

**Responsive**:
- Mobile: Stacked (logo top, nav bottom)
- Desktop: Horizontal (logo left, nav right)
- Desktop nav has underline hover effect

#### `GridBackground` (`src/components/grid-background.tsx`)
**Purpose**: Animated background pattern

**Effect**:
- Subtle grid pattern
- Adds visual depth without distraction

---

## Styling System

### TailwindCSS Configuration

**Theme Extensions**:
- Custom color system using CSS variables
- Supports light/dark mode (class-based)
- Custom animations: fade-in, accordion-down/up
- Container centered with 2rem padding
- Max width: 1400px (2xl breakpoint)

**Color Palette** (HSL-based):
- Primary: Dark slate (222.2° 47.4% 11.2%)
- Secondary: Light slate (210° 40% 96.1%)
- Accent, muted, destructive variants
- All colors have foreground pairs for contrast

### Global Styles (`src/app/globals.css`)

**Typography**:
- h1: 2rem (mobile) → 2.7rem (desktop), font-weight 700
- h2: 1.75rem, font-weight 700
- h3: 1.25rem, font-weight 700
- Body: System fonts (fallback from Montserrat)

**Custom Effects**:
- Smooth scrolling enabled globally
- Nav link underline animation (desktop only)
  - Width animates from 0 → 100% on hover
  - 0.2s ease-out transition
  - 1.25px height, black color

**Font Loading**:
- GoldenSignature.otf loaded via @font-face
- Used for logo/signature only

---

## Asset Management

### Path Utility (`src/utils/paths.ts`)

**Purpose**: Handle base path for GitHub Pages deployment

**Function**:
```typescript
getAssetPath(path: string): string
```

**Logic**:
- Reads `BASE_PATH` environment variable
- Removes leading slash from path
- Prepends base path if exists
- Returns absolute path

**Usage**:
```tsx
<img src={getAssetPath("cropped.jpg")} />
// Development: /cropped.jpg
// Production: /repo-name/cropped.jpg (if BASE_PATH set)
```

### Public Assets

**Images**:
- `cropped.jpg`: Profile photo (350px recommended)
- Used in About section

**Videos**:
- `memoji_out.mp4`: Animated avatar
- Autoplay, loop, muted, playsInline
- 170x170px display size

---

## Configuration Files

### Next.js Config (`next.config.js`)

**Key Settings**:
```javascript
{
  output: "export",              // Static site generation
  images: { unoptimized: true }, // No image optimization for static export
  basePath: "",                  // Root directory (no subdirectory)
  assetPrefix: "",               // No CDN prefix
  trailingSlash: true,           // Add trailing slashes to URLs
  experimental: {
    optimizePackageImports: ['lucide-react']  // Bundle size optimization
  }
}
```

**Webpack Config**:
- Disables `fs` and `path` modules on client-side
- Prevents build errors from server-only modules

### Shadcn/ui Config (`components.json`)

**Settings**:
```json
{
  "style": "default",
  "rsc": true,              // React Server Components
  "tsx": true,              // TypeScript
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true    // Use CSS variables for theming
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Deployment Pipeline

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Trigger**: Push to `main` branch

**Steps**:
1. **Checkout**: Clone repository with full history
2. **Setup**: Install pnpm (latest version)
3. **Install**: Run `pnpm install --no-frozen-lockfile`
4. **Build**: Run `pnpm build` (generates `/out` directory)
5. **Deploy**: Push to `gh-pages` branch using `peaceiris/actions-gh-pages@v3`

**Deploy Configuration**:
- Target branch: `gh-pages`
- Source directory: `./out`
- Force orphan: true (clean history)
- Keep files: true (preserve existing files)
- Disable Jekyll: true (prevent GitHub Pages Jekyll processing)
- Bot commits: `github-actions[bot]`

### Build Output

**Generated Files** (in `/out`):
- Static HTML for each page
- Optimized CSS bundles
- JavaScript chunks
- Public assets (images, videos)
- `_next/` directory with Next.js assets

---

## Animation Strategy

### Timing Philosophy

**Staggered Entrance**:
- Elements appear in reading order
- 0.1-0.2s delays between related items
- Longer delays (0.4-0.6s) between sections

**Hero Section Timeline**:
```
0.0s  → Greeting text
0.0s  → Avatar video
0.8s  → "Developer" title
0.9s  → "Photographer" title
1.0s  → "LLM Enthusiast" title
1.2s  → Quote text
1.4s  → Quote attribution
1.6s  → Personal statement
1.45s → Contact buttons
```

### Scroll-Triggered Animations

**Implementation**:
- Framer Motion's `useInView` hook
- Triggers when element enters viewport
- `once: true` prevents re-animation
- Spring physics for natural movement

**Parameters**:
- Damping: 30 (controls bounce)
- Stiffness: 200 (controls speed)
- Initial: `y: 100, opacity: 0`
- Final: `y: 0, opacity: 1`

---

## Responsive Design

### Breakpoints (TailwindCSS defaults)

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px (custom max-width)

### Mobile-First Approach

**Header**:
- Mobile: Vertical stack, centered
- Desktop: Horizontal flex, space-between

**About Section**:
- Mobile: Photo first, text below
- Desktop: Text left (2/3), photo right (1/3)

**Skills**:
- Mobile: Flexible wrap, smaller gaps
- Desktop: Centered grid with larger spacing

**Typography**:
- h1: 1.4rem (mobile) → 2rem (desktop)
- Container padding: Responsive (2rem base, 7rem on lg)

---

## SEO & Metadata

### Meta Tags (`src/app/layout.tsx`)

```typescript
{
  title: "Abishek Maharajan | Portfolio",
  metadataBase: new URL("https://www.abishek-maharajan.online"),
  alternates: { canonical: "/" },
  authors: [{ 
    name: "Abishek Maharajan", 
    url: "https://github.com/TentacioPro" 
  }],
  description: "Abishek Maharajan's personal portfolio website",
  openGraph: {
    title: "Abishek Maharajan | Portfolio",
    description: "Abishek Maharajan's personal portfolio website",
    images: [{
      url: "/photo.jpeg",
      alt: "Abishek Maharajan's Portrait",
      width: 640,
      height: 800
    }]
  }
}
```

**Benefits**:
- Proper social media sharing (Open Graph)
- Search engine optimization
- Canonical URL prevents duplicate content
- Author attribution

---

## Dependencies

### Core Framework
- `next@14.1.0`: React framework
- `react@18.2.0`: UI library
- `react-dom@18.2.0`: React renderer

### Styling
- `tailwindcss@3.4.1`: Utility-first CSS
- `tailwindcss-animate@1.0.7`: Animation utilities
- `autoprefixer@10.4.17`: CSS vendor prefixes
- `postcss@8.4.35`: CSS processor

### UI Components
- `@radix-ui/react-slot@1.0.2`: Composition primitive
- `@radix-ui/react-tooltip@1.0.7`: Tooltip component
- `class-variance-authority@0.7.0`: Component variants
- `clsx@2.1.0`: Conditional classnames
- `tailwind-merge@2.2.1`: Merge Tailwind classes

### Animation
- `framer-motion@11.0.5`: Animation library
- `react-use@17.5.0`: React hooks (useWindowScroll)

### Icons
- `@fortawesome/fontawesome-svg-core@6.5.1`: FontAwesome core
- `@fortawesome/free-brands-svg-icons@6.5.1`: Brand icons
- `@fortawesome/free-solid-svg-icons@6.5.1`: Solid icons
- `@fortawesome/react-fontawesome@0.2.0`: React wrapper
- `@heroicons/react@2.2.0`: Heroicons
- `lucide-react@0.331.0`: Lucide icons

### Build Tools
- `typescript@5.3.3`: Type checking
- `sharp@0.33.2`: Image optimization
- `gh-pages@6.3.0`: GitHub Pages deployment

### Development
- `prettier@3.2.5`: Code formatter
- `prettier-plugin-tailwindcss@0.5.11`: Tailwind class sorting

---

## Performance Optimizations

### Build Optimizations

1. **Static Export**: No server required, pure HTML/CSS/JS
2. **Image Unoptimization**: Disabled for static hosting compatibility
3. **Package Import Optimization**: `lucide-react` tree-shaking
4. **Code Splitting**: Automatic by Next.js

### Runtime Optimizations

1. **Animation Performance**:
   - GPU-accelerated transforms (translateZ, scale)
   - `will-change` hints for smooth animations
   - Debounced scroll listeners

2. **Asset Loading**:
   - Video: Autoplay with `playsInline` for mobile
   - Images: Lazy loading by default
   - Fonts: `display: swap` prevents FOIT

3. **Bundle Size**:
   - Tree-shaking enabled
   - Only used FontAwesome icons imported
   - Minimal dependencies

---

## Content Management Strategy

### Adding New Skills

**Location**: `src/sections/skills.tsx`

**Steps**:
1. Import icon from FontAwesome
2. Add to appropriate category in `data` array
3. Skill automatically renders with animation

**Example**:
```typescript
{
  title: "Programming",
  skills: [
    { name: "Rust", icon: faRust },  // Add new skill
    // ... existing skills
  ]
}
```

### Adding New Social Links

**Location**: `src/components/contact-list.tsx`

**Steps**:
1. Import icon from FontAwesome
2. Add to `contacts` array with name, href, className, icon
3. Link automatically renders with tooltip

**Example**:
```typescript
{
  name: "YouTube",
  className: "bg-red-600 hover:bg-red-700",
  href: "https://youtube.com/@channel",
  icon: faYoutube
}
```

### Updating Personal Info

**Locations**:
- Hero intro: `src/sections/hero.tsx`
- About text: `src/sections/about.tsx`
- Meta description: `src/app/layout.tsx`
- README: `README.md`

---

## Design Principles

### Visual Hierarchy

1. **Typography Scale**: Clear distinction between h1, h2, h3
2. **Spacing**: Consistent margins (my-4, my-8, my-16)
3. **Color**: Minimal palette, accent colors for CTAs
4. **Whitespace**: Generous padding for readability

### User Experience

1. **Navigation**: Smooth scroll, clear section anchors
2. **Feedback**: Hover states on all interactive elements
3. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
4. **Performance**: Fast load times, optimized animations

### Brand Identity

1. **Signature Font**: GoldenSignature for personal touch
2. **Professional Tone**: Clean, modern, minimal
3. **Personality**: Emojis add warmth without being unprofessional
4. **Consistency**: Repeated patterns (motion components, color scheme)

---

## Future Enhancement Ideas

### Content Additions
- Projects/portfolio section with case studies
- Blog integration for articles
- Testimonials from clients/colleagues
- Resume download button

### Technical Improvements
- Dark mode toggle
- Internationalization (i18n)
- Analytics integration (Google Analytics, Plausible)
- Contact form with backend (Formspree, EmailJS)
- Project filtering/search

### Animation Enhancements
- Parallax scrolling effects
- Mouse-follow cursor effects
- Page transition animations
- Loading skeleton screens

### Performance
- Image optimization with next/image (requires custom loader)
- Service worker for offline support
- Preload critical assets
- Lazy load below-fold content

---

## Troubleshooting Common Issues

### Build Failures

**Issue**: `Error: Image Optimization using Next.js' default loader is not compatible with export`
**Solution**: Set `images: { unoptimized: true }` in `next.config.js`

**Issue**: `Module not found: Can't resolve 'fs'`
**Solution**: Add webpack fallback for `fs` and `path` in `next.config.js`

### Deployment Issues

**Issue**: Assets not loading on GitHub Pages
**Solution**: 
- Check `basePath` and `assetPrefix` in `next.config.js`
- Use `getAssetPath()` utility for all public assets
- Ensure `trailingSlash: true`

**Issue**: 404 on page refresh
**Solution**: GitHub Pages doesn't support SPA routing. Use hash routing or custom 404.html

### Animation Issues

**Issue**: Animations not triggering
**Solution**: 
- Check `useInView` ref is attached to element
- Verify `once: true` hasn't already triggered
- Ensure element is in viewport

**Issue**: Janky animations
**Solution**:
- Use `transform` instead of `top/left`
- Add `will-change` CSS property
- Reduce animation complexity

---

## Key Takeaways

### What Makes This Portfolio Effective

1. **Single Page Design**: All content accessible without navigation
2. **Progressive Disclosure**: Animations reveal content as user scrolls
3. **Mobile-First**: Works perfectly on all devices
4. **Fast Loading**: Static export = instant page loads
5. **Easy Maintenance**: Component-based, clear file structure
6. **Professional Polish**: Smooth animations, consistent design
7. **SEO Optimized**: Proper meta tags, semantic HTML
8. **Accessible**: ARIA labels, keyboard navigation, semantic markup

### Architecture Highlights

1. **Separation of Concerns**: Sections, components, utilities clearly divided
2. **Reusability**: Motion components used throughout
3. **Configurability**: Skills and contacts easily updated
4. **Scalability**: Easy to add new sections or features
5. **Type Safety**: TypeScript prevents runtime errors
6. **Modern Stack**: Latest React patterns and best practices

---

## Conclusion

This portfolio demonstrates a well-structured, performant, and maintainable approach to building a personal website. The combination of Next.js static export, Framer Motion animations, and TailwindCSS styling creates a professional, engaging user experience while remaining easy to update and deploy.

The modular component architecture and clear separation between content (sections) and presentation (components) makes it straightforward to customize and extend as your career evolves.
