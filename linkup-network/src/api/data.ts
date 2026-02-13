import type { User, Post, Comment, Message, Conversation, Notification } from '@/types';

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
        "Just shipped a major accessibility overhaul for our design system! \n\nKey improvements:\n\u2022 Full keyboard navigation across all components\n\u2022 ARIA live regions for dynamic content\n\u2022 Reduced motion support\n\u2022 Screen reader announcements for state changes\n\nAccessibility isn't a feature \u2014 it's a requirement. Proud of what our team accomplished.",
      timestamp: Date.now() - 3_600_000,
      reactions: { like: 142, celebrate: 38, insightful: 24 },
      comments: 18,
      reposts: 7,
    },
    {
      id: 'p2',
      authorId: 'u2',
      content:
        "Hot take: The best frontend engineers I've hired didn't just know React.\n\nThey understood:\n\u2192 Browser rendering pipeline\n\u2192 Network performance\n\u2192 Accessibility fundamentals\n\u2192 CSS layout algorithms\n\u2192 JavaScript event loop\n\nFrameworks change. Fundamentals don't.\n\nWhat would you add to this list?",
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
        "Beautiful UI isn't just about aesthetics \u2014 it's about communication.\n\nEvery animation should have a purpose.\nEvery color choice should guide attention.\nEvery spacing decision should create hierarchy.\n\nDesign engineering is about making interfaces that feel inevitable.",
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
        "Your bundle size is your user's problem.\n\nJust audited a React app:\n\u2022 2.4MB JavaScript (gzipped!)\n\u2022 47 npm packages for a CRUD app\n\u2022 moment.js still in there (2023!)\n\nSwitch to date-fns. Use dynamic imports. Tree-shake your dependencies.\n\nYour users on 3G will thank you.",
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

// ═══════════════════════════════════════════════════════════
// Mock Comments (seeded)
// ═══════════════════════════════════════════════════════════

export function generateComments(): Comment[] {
  return [
    {
      id: 'c1',
      authorId: 'u2',
      postId: 'p1',
      content: 'This is incredible work, Sarah! Accessibility-first design systems are so rare. Would love to see a blog post about your approach to ARIA live regions.',
      timestamp: Date.now() - 3_000_000,
      parentId: null,
    },
    {
      id: 'c2',
      authorId: 'u5',
      postId: 'p1',
      content: 'As someone who works on accessibility daily, this makes me so happy. The reduced motion support is often overlooked. Great job!',
      timestamp: Date.now() - 2_800_000,
      parentId: null,
    },
    {
      id: 'c3',
      authorId: 'u1',
      postId: 'p1',
      content: 'Thanks Marcus! I\'m actually working on a deep-dive blog post right now. Will share it here when it\'s ready.',
      timestamp: Date.now() - 2_500_000,
      parentId: 'c1',
    },
    {
      id: 'c4',
      authorId: 'u3',
      postId: 'p1',
      content: 'Did you measure any performance impact from the ARIA live regions? We had some issues with excessive re-renders.',
      timestamp: Date.now() - 2_200_000,
      parentId: null,
    },
    {
      id: 'c5',
      authorId: 'u1',
      postId: 'p1',
      content: 'Good question Priya! We debounce the announcements and use a single shared live region. No measurable perf impact.',
      timestamp: Date.now() - 2_000_000,
      parentId: 'c4',
    },
    {
      id: 'c6',
      authorId: 'u4',
      postId: 'p2',
      content: 'I\'d add CSS architecture to the list. Understanding specificity, cascade layers, and container queries is crucial.',
      timestamp: Date.now() - 6_800_000,
      parentId: null,
    },
    {
      id: 'c7',
      authorId: 'u1',
      postId: 'p2',
      content: '100% agree with this. Framework knowledge gets you the interview, but fundamentals help you solve real problems.',
      timestamp: Date.now() - 6_500_000,
      parentId: null,
    },
    {
      id: 'c8',
      authorId: 'u5',
      postId: 'p2',
      content: 'Accessibility should definitely be on this list! Understanding how assistive technology works changes how you think about UI.',
      timestamp: Date.now() - 6_200_000,
      parentId: null,
    },
    {
      id: 'c9',
      authorId: 'u3',
      postId: 'p3',
      content: 'The streaming SSR was the biggest win for us too. The time-to-first-byte improvement was dramatic.',
      timestamp: Date.now() - 13_000_000,
      parentId: null,
    },
    {
      id: 'c10',
      authorId: 'u2',
      postId: 'p5',
      content: 'This needs to be required reading for every product team. Sharing with my org.',
      timestamp: Date.now() - 40_000_000,
      parentId: null,
    },
  ];
}

// ═══════════════════════════════════════════════════════════
// Mock Conversations & Messages
// ═══════════════════════════════════════════════════════════

export function generateMessages(): Message[] {
  return [
    { id: 'm1', conversationId: 'conv1', senderId: 'u2', content: 'Hey Sarah! Loved your accessibility post. Our team is looking for advice on screen reader testing.', timestamp: Date.now() - 7_200_000 },
    { id: 'm2', conversationId: 'conv1', senderId: 'u1', content: 'Thanks Marcus! I\'d recommend starting with VoiceOver on Mac and NVDA on Windows. Happy to chat more about it.', timestamp: Date.now() - 6_800_000 },
    { id: 'm3', conversationId: 'conv1', senderId: 'u2', content: 'That would be amazing. Could we set up a quick call this week?', timestamp: Date.now() - 6_400_000 },
    { id: 'm4', conversationId: 'conv2', senderId: 'u3', content: 'Hi Sarah, I saw your TypeScript discriminated unions post. We\'re using a similar pattern at Netflix for our API layer.', timestamp: Date.now() - 50_000_000 },
    { id: 'm5', conversationId: 'conv2', senderId: 'u1', content: 'Oh nice! Are you using exhaustive checks with never type too?', timestamp: Date.now() - 49_000_000 },
    { id: 'm6', conversationId: 'conv2', senderId: 'u3', content: 'Yes! It\'s been a game changer for catching unhandled cases at compile time.', timestamp: Date.now() - 48_000_000 },
    { id: 'm7', conversationId: 'conv3', senderId: 'u5', content: 'Sarah, would you be interested in co-presenting at the next accessibility summit?', timestamp: Date.now() - 100_000_000 },
    { id: 'm8', conversationId: 'conv3', senderId: 'u1', content: 'Absolutely! What topics are you thinking about?', timestamp: Date.now() - 99_000_000 },
  ];
}

export function generateConversations(): Conversation[] {
  const messages = generateMessages();
  return [
    {
      id: 'conv1',
      participantIds: ['u1', 'u2'],
      lastMessage: messages.find(m => m.id === 'm3'),
      unreadCount: 1,
    },
    {
      id: 'conv2',
      participantIds: ['u1', 'u3'],
      lastMessage: messages.find(m => m.id === 'm6'),
      unreadCount: 0,
    },
    {
      id: 'conv3',
      participantIds: ['u1', 'u5'],
      lastMessage: messages.find(m => m.id === 'm8'),
      unreadCount: 0,
    },
  ];
}

// ═══════════════════════════════════════════════════════════
// Mock Notifications
// ═══════════════════════════════════════════════════════════

export function generateNotifications(): Notification[] {
  return [
    { id: 'n1', type: 'reaction', fromUserId: 'u2', timestamp: Date.now() - 7_200_000, read: false, relatedPostId: 'p1', message: 'Marcus Johnson reacted to your post' },
    { id: 'n2', type: 'comment', fromUserId: 'u3', timestamp: Date.now() - 14_400_000, read: false, relatedPostId: 'p1', message: 'Priya Sharma commented on your post' },
    { id: 'n3', type: 'connection_accepted', fromUserId: 'u5', timestamp: Date.now() - 86_400_000, read: true, message: 'Jordan Kim accepted your connection request' },
    { id: 'n4', type: 'mention', fromUserId: 'u4', timestamp: Date.now() - 172_800_000, read: true, relatedPostId: 'p4', message: 'Alex Rivera mentioned you in a comment' },
    { id: 'n5', type: 'reaction', fromUserId: 'u5', timestamp: Date.now() - 259_200_000, read: true, relatedPostId: 'p6', message: 'Your post reached 200 reactions!' },
  ];
}
