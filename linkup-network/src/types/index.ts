// ═══════════════════════════════════════════════════════════
// Domain Types
// ═══════════════════════════════════════════════════════════

export interface User {
  id: string;
  name: string;
  headline: string;
  avatar: string | null;
  coverColor: string;
  location: string;
  connections: number;
  about: string;
  experience: Experience[];
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  logo: string;
}

export type ReactionType = 'like' | 'celebrate' | 'support' | 'insightful';

export interface Reactions {
  like: number;
  celebrate: number;
  support?: number;
  insightful: number;
  [key: string]: number | undefined;
}

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  content: string;
  timestamp: number;
  reactions: Reactions;
  comments: number;
  reposts: number;
  userReaction?: ReactionType;
  _optimistic?: boolean;
}

// ═══════════════════════════════════════════════════════════
// API Response Types
// ═══════════════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface SingleResponse<T> {
  data: T;
}

// ═══════════════════════════════════════════════════════════
// App State Types
// ═══════════════════════════════════════════════════════════

export type Route = 'feed' | 'profile' | 'network' | 'notifications';

export interface AppState {
  feed: Post[];
  feedPage: number;
  feedLoading: boolean;
  feedHasMore: boolean;
  currentUser: User;
  selectedProfile: User | null;
  activeRoute: Route;
  announcements: string[];
  composerOpen: boolean;
}

export type AppAction =
  | { type: 'FEED_LOADING' }
  | { type: 'FEED_LOADED'; posts: Post[]; page: number; hasMore: boolean }
  | { type: 'POST_CREATED'; post: Post }
  | { type: 'POST_REACTED'; postId: string; reactionType: ReactionType }
  | { type: 'NAVIGATE'; route: Route; profile?: User | null }
  | { type: 'TOGGLE_COMPOSER' }
  | { type: 'ANNOUNCE'; message: string };
