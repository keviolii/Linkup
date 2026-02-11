import { createContext, useContext } from 'react';
import type { AppState, AppAction } from '@/types';
import { MOCK_USERS } from '@/api';

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
      };

    case 'TOGGLE_COMPOSER':
      return { ...state, composerOpen: !state.composerOpen };

    case 'ANNOUNCE':
      return {
        ...state,
        announcements: [...state.announcements, action.message],
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
