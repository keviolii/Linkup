import type { User, Post } from '@/types';

// ═══════════════════════════════════════════════════════════
// Mock Users
// ═══════════════════════════════════════════════════════════

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    headline:
      'Senior Frontend Engineer at Meta • React, TypeScript, Accessibility',
    avatar: null,
    coverColor: '#6366f1',
    location: 'San Francisco, CA',
    connections: 1284,
    about:
      'Passionate about building inclusive, performant web experiences. 8+ years in frontend engineering with focus on design systems and accessibility.',
    experience: [
      {
        title: 'Senior Frontend Engineer',
        company: 'Meta',
        duration: '2022 – Present',
        logo: 'M',
      },
      {
        title: 'Frontend Engineer',
        company: 'Stripe',
        duration: '2019 – 2022',
        logo: 'S',
      },
    ],
    skills: [
      'React',
      'TypeScript',
      'Accessibility',
      'Performance',
      'Design Systems',
      'GraphQL',
    ],
  },
  {
    id: 'u2',
    name: 'Marcus Johnson',
    headline: 'Engineering Manager @ Google • Building great teams',
    avatar: null,
    coverColor: '#34d399',
    location: 'Seattle, WA',
    connections: 2103,
    about:
      'Leading frontend platform teams. Previously at Amazon and Netflix.',
    experience: [
      {
        title: 'Engineering Manager',
        company: 'Google',
        duration: '2023 – Present',
        logo: 'G',
      },
      {
        title: 'Senior Engineer',
        company: 'Amazon',
        duration: '2020 – 2023',
        logo: 'A',
      },
    ],
    skills: ['Leadership', 'React', 'System Design', 'Mentoring'],
  },
  {
    id: 'u3',
    name: 'Priya Sharma',
    headline: 'Staff Engineer @ Netflix • Performance & Web Vitals',
    avatar: null,
    coverColor: '#f87171',
    location: 'Los Angeles, CA',
    connections: 956,
    about: 'Obsessed with web performance. Core Web Vitals evangelist.',
    experience: [
      {
        title: 'Staff Engineer',
        company: 'Netflix',
        duration: '2021 – Present',
        logo: 'N',
      },
    ],
    skills: ['Performance', 'React', 'Webpack', 'Core Web Vitals'],
  },
  {
    id: 'u4',
    name: 'Alex Rivera',
    headline: 'Design Engineer @ Vercel • UI/UX & Frontend',
    avatar: null,
    coverColor: '#fbbf24',
    location: 'Austin, TX',
    connections: 743,
    about: 'Bridging design and engineering. Making the web beautiful.',
    experience: [
      {
        title: 'Design Engineer',
        company: 'Vercel',
        duration: '2022 – Present',
        logo: 'V',
      },
    ],
    skills: ['CSS', 'React', 'Figma', 'Animation', 'TypeScript'],
  },
  {
    id: 'u5',
    name: 'Jordan Kim',
    headline:
      'Accessibility Lead @ Microsoft • WCAG, ARIA, Inclusive Design',
    avatar: null,
    coverColor: '#a78bfa',
    location: 'Redmond, WA',
    connections: 1567,
    about:
      'Making technology work for everyone. W3C contributor.',
    experience: [
      {
        title: 'Accessibility Lead',
        company: 'Microsoft',
        duration: '2020 – Present',
        logo: 'Ms',
      },
    ],
    skills: [
      'Accessibility',
      'ARIA',
      'Screen Readers',
      'WCAG',
      'Inclusive Design',
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// Mock Posts (seeded)
// ═══════════════════════════════════════════════════════════

export function generatePosts(): Post[] {
  return [
    {
      id: 'p1',
      authorId: 'u1',
      content:
        "Just shipped a major accessibility overhaul for our design system! 🎉\n\nKey improvements:\n• Full keyboard navigation across all components\n• ARIA live regions for dynamic content\n• Reduced motion support\n• Screen reader announcements for state changes\n\nAccessibility isn't a feature — it's a requirement. Proud of what our team accomplished.",
      timestamp: Date.now() - 3_600_000,
      reactions: { like: 142, celebrate: 38, insightful: 24 },
      comments: 18,
      reposts: 7,
    },
    {
      id: 'p2',
      authorId: 'u2',
      content:
        "Hot take: The best frontend engineers I've hired didn't just know React.\n\nThey understood:\n→ Browser rendering pipeline\n→ Network performance\n→ Accessibility fundamentals\n→ CSS layout algorithms\n→ JavaScript event loop\n\nFrameworks change. Fundamentals don't.\n\nWhat would you add to this list?",
      timestamp: Date.now() - 7_200_000,
      reactions: { like: 287, celebrate: 12, insightful: 95 },
      comments: 63,
      reposts: 31,
    },
    {
      id: 'p3',
      authorId: 'u3',
      content:
        "We reduced our LCP from 4.2s to 1.1s. Here's exactly how:\n\n1. Moved to streaming SSR\n2. Implemented resource hints (preconnect, prefetch)\n3. Optimized critical rendering path\n4. Lazy-loaded below-fold images with native loading='lazy'\n5. Eliminated render-blocking CSS with critical extraction\n\nCore Web Vitals matter. Your users notice.",
      timestamp: Date.now() - 14_400_000,
      reactions: { like: 198, celebrate: 67, support: 15 },
      comments: 42,
      reposts: 19,
    },
    {
      id: 'p4',
      authorId: 'u4',
      content:
        "Beautiful UI isn't just about aesthetics — it's about communication.\n\nEvery animation should have a purpose.\nEvery color choice should guide attention.\nEvery spacing decision should create hierarchy.\n\nDesign engineering is about making interfaces that feel inevitable.",
      timestamp: Date.now() - 28_800_000,
      reactions: { like: 156, celebrate: 23, insightful: 41 },
      comments: 27,
      reposts: 11,
    },
    {
      id: 'p5',
      authorId: 'u5',
      content:
        "Reminder: 1 in 4 adults in the US has a disability.\n\nIf your app doesn't work with a keyboard, you've excluded millions.\nIf your contrast ratio is below 4.5:1, you've excluded millions.\nIf your forms don't have labels, you've excluded millions.\n\nAccessibility is not optional. Let's build better.",
      timestamp: Date.now() - 43_200_000,
      reactions: { like: 324, celebrate: 89, support: 112 },
      comments: 51,
      reposts: 44,
    },
    {
      id: 'p6',
      authorId: 'u1',
      content:
        "TypeScript tip that saved our team hours of debugging:\n\nUse discriminated unions for your API responses instead of optional fields everywhere.\n\ntype ApiResponse<T> =\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: string }\n  | { status: 'loading' }\n\nPattern matching > null checking.",
      timestamp: Date.now() - 57_600_000,
      reactions: { like: 203, insightful: 78, celebrate: 15 },
      comments: 34,
      reposts: 22,
    },
    {
      id: 'p7',
      authorId: 'u3',
      content:
        "Your bundle size is your user's problem.\n\nJust audited a React app:\n• 2.4MB JavaScript (gzipped!)\n• 47 npm packages for a CRUD app\n• moment.js still in there (2023!)\n\nSwitch to date-fns. Use dynamic imports. Tree-shake your dependencies.\n\nYour users on 3G will thank you.",
      timestamp: Date.now() - 72_000_000,
      reactions: { like: 178, insightful: 56, celebrate: 8 },
      comments: 29,
      reposts: 16,
    },
    {
      id: 'p8',
      authorId: 'u2',
      content:
        "Promoted two engineers to senior this quarter. What they had in common:\n\n1. They didn't wait for permission to solve problems\n2. They elevated everyone around them\n3. They communicated clearly and proactively\n4. They owned their mistakes publicly\n5. They shipped with quality AND speed\n\nTechnical skill gets you in. These traits get you promoted.",
      timestamp: Date.now() - 86_400_000,
      reactions: { like: 412, celebrate: 134, insightful: 67 },
      comments: 89,
      reposts: 52,
    },
  ];
}
