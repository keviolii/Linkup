import { createContext, useContext } from 'react';
import type { AppState, AppAction } from '@/types';
import { MOCK_USERS } from '@/api';
import { storage } from '@/utils/storage';

// ═══════════════════════════════════════════════════════════
// App Reducer — centralised state management
// ═══════════════════════════════════════════════════════════

export const initialState: AppState = {
  feed: [],
  feedPage: 1,
  feedLoading: false,
  feedHasMore: true,
  currentUser: MOCK_USERS[0],
  selectedProfile: null,
  activeRoute: 'feed',
  announcements: [],
  composerOpen: false,
  // Comments
  commentsByPost: {},
  openComments: {},
  // Search
  searchQuery: '',
  searchResults: null,
  searchOpen: false,
  // Theme
  theme: storage.get<'dark' | 'light'>('theme', 'dark'),
  // Messaging
  conversations: [],
  activeConversation: null,
  messagesByConversation: {},
  messagingOpen: false,
  // Connections
  connections: storage.get<string[]>('connections', []),
  pendingRequests: [],
  // Bookmarks
  savedPosts: storage.get<string[]>('savedPosts', []),
  // Notifications
  notifications: [],
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'FEED_LOADING':
      return { ...state, feedLoading: true };

    case 'FEED_LOADED':
      return {
        ...state,
        feed:
          action.page === 1
            ? action.posts
            : [...state.feed, ...action.posts],
        feedPage: action.page,
        feedHasMore: action.hasMore,
        feedLoading: false,
      };

    case 'POST_CREATED':
      return {
        ...state,
        feed: [action.post, ...state.feed],
        composerOpen: false,
      };

    case 'POST_REACTED':
      return {
        ...state,
        feed: state.feed.map((p) =>
          p.id === action.postId
            ? {
                ...p,
                reactions: {
                  ...p.reactions,
                  [action.reactionType]:
                    (p.reactions[action.reactionType] ?? 0) + 1,
                },
                userReaction: action.reactionType,
              }
            : p,
        ),
      };

    case 'NAVIGATE':
      return {
        ...state,
        activeRoute: action.route,
        selectedProfile: action.profile ?? null,
        searchOpen: false,
        searchQuery: '',
        searchResults: null,
      };

    case 'TOGGLE_COMPOSER':
      return { ...state, composerOpen: !state.composerOpen };

    case 'ANNOUNCE':
      return {
        ...state,
        announcements: [...state.announcements, action.message],
      };

    // ─── Comments ──────────────────────────────────────────

    case 'COMMENTS_LOADED':
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [action.postId]: action.comments,
        },
      };

    case 'COMMENT_ADDED':
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [action.postId]: [
            ...(state.commentsByPost[action.postId] || []),
            action.comment,
          ],
        },
        feed: state.feed.map((p) =>
          p.id === action.postId ? { ...p, comments: p.comments + 1 } : p,
        ),
      };

    case 'TOGGLE_COMMENTS':
      return {
        ...state,
        openComments: {
          ...state.openComments,
          [action.postId]: !state.openComments[action.postId],
        },
      };

    // ─── Search ────────────────────────────────────────────

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.query,
        searchOpen: action.query.length > 0,
      };

    case 'SEARCH_RESULTS':
      return { ...state, searchResults: action.results };

    case 'CLOSE_SEARCH':
      return {
        ...state,
        searchOpen: false,
        searchQuery: '',
        searchResults: null,
      };

    // ─── Theme ─────────────────────────────────────────────

    case 'SET_THEME':
      return { ...state, theme: action.theme };

    // ─── Messaging ─────────────────────────────────────────

    case 'CONVERSATIONS_LOADED':
      return { ...state, conversations: action.conversations };

    case 'MESSAGES_LOADED':
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.conversationId]: action.messages,
        },
      };

    case 'MESSAGE_SENT':
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.conversationId]: [
            ...(state.messagesByConversation[action.conversationId] || []),
            action.message,
          ],
        },
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, lastMessage: action.message }
            : c,
        ),
      };

    case 'OPEN_CHAT':
      return {
        ...state,
        activeConversation: action.conversationId,
        messagingOpen: true,
      };

    case 'CLOSE_CHAT':
      return { ...state, activeConversation: null };

    case 'TOGGLE_MESSAGING':
      return {
        ...state,
        messagingOpen: !state.messagingOpen,
        activeConversation: state.messagingOpen ? null : state.activeConversation,
      };

    // ─── Connections ───────────────────────────────────────

    case 'CONNECTION_REQUEST_SENT':
      return {
        ...state,
        pendingRequests: [...state.pendingRequests, action.request],
      };

    case 'CONNECTION_REQUEST_ACCEPTED':
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter(
          (r) => r.id !== action.requestId,
        ),
        connections: [...state.connections, action.userId],
      };

    case 'CONNECTION_REMOVED':
      return {
        ...state,
        connections: state.connections.filter((id) => id !== action.userId),
      };

    case 'CONNECTIONS_LOADED':
      return {
        ...state,
        connections: action.connections,
        pendingRequests: action.requests,
      };

    // ─── Bookmarks ─────────────────────────────────────────

    case 'TOGGLE_BOOKMARK': {
      const isSaved = state.savedPosts.includes(action.postId);
      return {
        ...state,
        savedPosts: isSaved
          ? state.savedPosts.filter((id) => id !== action.postId)
          : [...state.savedPosts, action.postId],
      };
    }

    // ─── Post Deletion ────────────────────────────────────

    case 'POST_DELETED':
      return {
        ...state,
        feed: state.feed.filter((p) => p.id !== action.postId),
        savedPosts: state.savedPosts.filter((id) => id !== action.postId),
      };

    // ─── Notifications ────────────────────────────────────

    case 'NOTIFICATIONS_LOADED':
      return { ...state, notifications: action.notifications };

    case 'NOTIFICATION_ADDED':
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };

    case 'NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n,
        ),
      };

    case 'NOTIFICATIONS_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppContext.Provider>');
  return ctx;
}
