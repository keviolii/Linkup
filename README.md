# LinkUp — Professional Network Feed & Profile Builder

A production-quality LinkedIn-like frontend application built with **React 18**, **TypeScript**, and **Vite**. Demonstrates modern frontend architecture with a strong emphasis on accessibility, performance optimization, and polished UX.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![WCAG](https://img.shields.io/badge/WCAG_2.1-AA_Compliant-4CAF50)

---

## Features

### Accessibility (WCAG 2.1 AA)
- **Skip-to-content link** for keyboard users
- **ARIA live regions** for dynamic content announcements to screen readers
- **Focus trap** in modal dialogs (post composer)
- **Visible focus indicators** (`:focus-visible`) on all interactive elements
- **Keyboard navigation** throughout the entire application
- **`prefers-reduced-motion`** media query support — all animations disabled
- Semantic HTML: `role="feed"`, `role="tablist"`, `aria-current`, `aria-expanded`, `aria-busy`
- Proper form labeling and `aria-describedby` associations

### Infinite Scroll & Optimistic UI
- **IntersectionObserver-based** infinite scroll with 200px pre-fetch margin
- **Skeleton loading states** with pulse animation for perceived performance
- **Optimistic post creation** — new posts appear instantly, then sync with the API
- **Optimistic reactions** — immediate visual feedback before server confirmation

### Mock REST API (MSW-style)
- Full simulated REST layer with typed endpoints:
  - `GET /api/feed?page=N&limit=N` — paginated feed
  - `GET /api/users/:id` — user profile
  - `POST /api/posts` — create post
  - `POST /api/posts/:id/react` — react to post
  - `POST /api/posts/:id/comment` — add comment
- Realistic network latency simulation (200–700ms)
- Paginated responses with metadata (`hasMore`, `total`, `page`)
- Clean separation between data layer and UI — swap for real APIs with zero component changes

### Architecture & Performance
- **`useReducer` + Context** for centralized state management
- **`React.memo()`** on all expensive components to prevent unnecessary re-renders
- **Custom hooks**: `useInfiniteScroll`, `useFocusTrap`, `useReducedMotion`, `useAnnounce`, `useThrottle`
- **Design token system** — single source of truth for colors, typography, spacing, shadows
- **Client-side routing** via state (Feed, Profile, Network, Notifications)
- **Code splitting** ready — pages can be lazy-loaded with `React.lazy()`
- Barrel exports for clean import paths

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| State | useReducer + Context API |
| API | Mock REST service (MSW-pattern) |
| Styling | Design tokens + inline styles |
| Accessibility | ARIA, semantic HTML, focus management |
| Linting | ESLint + TypeScript ESLint |

---

## Project Structure

```
src/
├── api/                  # Mock API layer
│   ├── client.ts         # REST endpoint handlers with latency simulation
│   ├── data.ts           # Seed data (users, posts)
│   └── index.ts
├── components/           # Reusable UI components
│   ├── A11y.tsx          # SkipLink, LiveRegion
│   ├── Avatar.tsx        # User avatar with initials fallback
│   ├── Header.tsx        # Sticky nav with search
│   ├── PostCard.tsx      # Feed post with reactions popup
│   ├── PostComposer.tsx  # Create post with optimistic UI
│   ├── Sidebar.tsx       # Trending topics, suggested connections
│   ├── Footer.tsx
│   └── index.ts
├── hooks/                # Custom React hooks
│   ├── useAppState.ts    # Reducer, context, actions
│   ├── useAccessibility.ts # Focus trap, announcements, reduced motion
│   └── index.ts
├── pages/                # Route-level page components
│   ├── FeedPage.tsx      # Infinite scroll feed
│   ├── ProfilePage.tsx   # Editable profile with tabs
│   ├── NetworkPage.tsx   # Connection grid
│   ├── NotificationsPage.tsx
│   └── index.ts
├── styles/
│   ├── global.css        # Reset, animations, responsive
│   └── tokens.ts         # Design tokens
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── index.ts          # Formatters, constants
├── App.tsx               # Root layout + routing
└── main.tsx              # Entry point
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Key Implementation Details

### Optimistic Updates
Posts and reactions update the UI immediately via the reducer, then confirm with the mock API. Failed operations trigger screen reader announcements. This pattern mirrors production social platforms.

### Accessibility Testing
Tested with:
- Keyboard-only navigation (Tab, Shift+Tab, Enter, Escape)
- Screen reader announcements via ARIA live regions
- Reduced motion preference respected globally
- Color contrast ratios ≥ 4.5:1 (WCAG AA)

### Performance Patterns
- `React.memo()` prevents re-renders of post cards when sibling state changes
- `IntersectionObserver` with rootMargin pre-fetches next page before user reaches bottom
- Skeleton screens maintain layout stability during loading (no CLS)
- Throttled scroll handlers prevent excessive callback execution

---

## License

MIT
