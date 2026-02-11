import { useReducer, useMemo } from 'react';
import { AppContext, appReducer, initialState } from '@/hooks';
import { SkipLink, LiveRegion, Header, Footer, TrendingSidebar, SuggestedConnections } from '@/components';
import { FeedPage, ProfilePage, NetworkPage, NotificationsPage } from '@/pages';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppContext.Provider value={contextValue}>
      <SkipLink />
      <LiveRegion announcements={state.announcements} />
      <Header />

      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        style={{ padding: '24px 24px 0', minHeight: '100vh' }}
      >
        <div
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
        </div>
      </main>

      <Footer />
    </AppContext.Provider>
  );
}
