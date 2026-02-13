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

export interface Comment {
  id: string;
  authorId: string;
  author?: User;
  postId: string;
  content: string;
  timestamp: number;
  parentId: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export type NotificationType = 'reaction' | 'comment' | 'connection_request' | 'connection_accepted' | 'mention';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  fromUser?: User;
  timestamp: number;
  read: boolean;
  relatedPostId?: string;
  message: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: number;
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

export interface SearchResults {
  users: User[];
  posts: Post[];
}

// ═══════════════════════════════════════════════════════════
// App State Types
// ═══════════════════════════════════════════════════════════

export type Route = 'feed' | 'profile' | 'network' | 'notifications' | 'saved';

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
  // Comments
  commentsByPost: Record<string, Comment[]>;
  openComments: Record<string, boolean>;
  // Search
  searchQuery: string;
  searchResults: SearchResults | null;
  searchOpen: boolean;
  // Theme
  theme: 'dark' | 'light';
  // Messaging
  conversations: Conversation[];
  activeConversation: string | null;
  messagesByConversation: Record<string, Message[]>;
  messagingOpen: boolean;
  // Connections
  connections: string[];
  pendingRequests: ConnectionRequest[];
  // Bookmarks
  savedPosts: string[];
  // Notifications
  notifications: Notification[];
}

export type AppAction =
  | { type: 'FEED_LOADING' }
  | { type: 'FEED_LOADED'; posts: Post[]; page: number; hasMore: boolean }
  | { type: 'POST_CREATED'; post: Post }
  | { type: 'POST_REACTED'; postId: string; reactionType: ReactionType }
  | { type: 'NAVIGATE'; route: Route; profile?: User | null }
  | { type: 'TOGGLE_COMPOSER' }
  | { type: 'ANNOUNCE'; message: string }
  // Comments
  | { type: 'COMMENTS_LOADED'; postId: string; comments: Comment[] }
  | { type: 'COMMENT_ADDED'; postId: string; comment: Comment }
  | { type: 'TOGGLE_COMMENTS'; postId: string }
  // Search
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SEARCH_RESULTS'; results: SearchResults }
  | { type: 'CLOSE_SEARCH' }
  // Theme
  | { type: 'SET_THEME'; theme: 'dark' | 'light' }
  // Messaging
  | { type: 'CONVERSATIONS_LOADED'; conversations: Conversation[] }
  | { type: 'MESSAGES_LOADED'; conversationId: string; messages: Message[] }
  | { type: 'MESSAGE_SENT'; conversationId: string; message: Message }
  | { type: 'OPEN_CHAT'; conversationId: string }
  | { type: 'CLOSE_CHAT' }
  | { type: 'TOGGLE_MESSAGING' }
  // Connections
  | { type: 'CONNECTION_REQUEST_SENT'; request: ConnectionRequest }
  | { type: 'CONNECTION_REQUEST_ACCEPTED'; requestId: string; userId: string }
  | { type: 'CONNECTION_REMOVED'; userId: string }
  | { type: 'CONNECTIONS_LOADED'; connections: string[]; requests: ConnectionRequest[] }
  // Bookmarks
  | { type: 'TOGGLE_BOOKMARK'; postId: string }
  // Post deletion
  | { type: 'POST_DELETED'; postId: string }
  // Notifications
  | { type: 'NOTIFICATIONS_LOADED'; notifications: Notification[] }
  | { type: 'NOTIFICATION_ADDED'; notification: Notification }
  | { type: 'NOTIFICATION_READ'; notificationId: string }
  | { type: 'NOTIFICATIONS_ALL_READ' };
