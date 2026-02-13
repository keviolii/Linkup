import { useReducer, useMemo, useEffect, useRef } from 'react';
import { AppContext, appReducer, initialState } from '@/hooks';
import { SkipLink, LiveRegion, Header, Footer, TrendingSidebar, SuggestedConnections, MessagingPanel } from '@/components';
import { FeedPage, ProfilePage, NetworkPage, NotificationsPage, SavedPage } from '@/pages';
import { debouncedWrite } from '@/utils/storage';
import { applyThemeToDOM } from '@/styles/tokens';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  const prevRoute = useRef(state.activeRoute);
  const contentRef = useRef<HTMLDivElement>(null);

  // Apply theme on mount
  useEffect(() => {
    applyThemeToDOM(state.theme);
  }, [state.theme]);

  // Persist state to localStorage
  useEffect(() => {
    debouncedWrite('savedPosts', state.savedPosts);
  }, [state.savedPosts]);

  useEffect(() => {
    debouncedWrite('connections', state.connections);
  }, [state.connections]);

  useEffect(() => {
    debouncedWrite('theme', state.theme);
  }, [state.theme]);

  // Page transition animation
  useEffect(() => {
    if (prevRoute.current !== state.activeRoute && contentRef.current) {
      contentRef.current.style.animation = 'none';
      // Force reflow
      void contentRef.current.offsetHeight;
      contentRef.current.style.animation = 'fadeSlideUp 0.3s ease-out';
      prevRoute.current = state.activeRoute;
    }
  }, [state.activeRoute]);

  return (
    <AppContext.Provider value={contextValue}>
      <SkipLink />
      <LiveRegion announcements={state.announcements} />
      <Header />

      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        style={{ padding: '24px 24px 0', minHeight: '100vh', transition: 'background 0.3s' }}
      >
        <div
          ref={contentRef}
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            display: 'flex',
            gap: 24,
          }}
        >
          {state.activeRoute === 'feed' && (
            <>
              <div className="main-feed" style={{ flex: 1, minWidth: 0 }}>
                <FeedPage />
              </div>
              <div className="desktop-sidebar" style={{ width: 300, flexShrink: 0 }}>
                <TrendingSidebar />
                <SuggestedConnections />
              </div>
            </>
          )}

          {state.activeRoute === 'profile' && (
            <div style={{ flex: 1 }}>
              <ProfilePage />
            </div>
          )}

          {state.activeRoute === 'network' && (
            <div style={{ flex: 1 }}>
              <NetworkPage />
            </div>
          )}

          {state.activeRoute === 'notifications' && (
            <div style={{ flex: 1 }}>
              <NotificationsPage />
            </div>
          )}

          {state.activeRoute === 'saved' && (
            <div style={{ flex: 1 }}>
              <SavedPage />
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MessagingPanel />
    </AppContext.Provider>
  );
}
