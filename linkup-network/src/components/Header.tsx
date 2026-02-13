import { memo, useEffect } from 'react';
import { useApp, useAnnounce, useTheme, useDebounce } from '@/hooks';
import { api } from '@/api';
import { Avatar } from './Avatar';
import { SearchResults } from './SearchResults';
import type { Route } from '@/types';

const NAV_ITEMS: { id: Route; label: string; icon: string }[] = [
  { id: 'feed', label: 'Feed', icon: '\u2302' },
  { id: 'network', label: 'Network', icon: '\u229e' },
  { id: 'notifications', label: 'Alerts', icon: '\ud83d\udd14' },
  { id: 'saved', label: 'Saved', icon: '\ud83d\udccc' },
];

export const Header: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const { colors, toggle: toggleTheme, theme } = useTheme();
  const announce = useAnnounce();

  const debouncedQuery = useDebounce(state.searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      api.search(debouncedQuery).then((res) => {
        dispatch({ type: 'SEARCH_RESULTS', results: res.data });
      });
    }
  }, [debouncedQuery, dispatch]);

  const navigate = (route: Route) => {
    dispatch({ type: 'NAVIGATE', route });
    announce(`Navigated to ${route}`);
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: theme === 'dark' ? 'rgba(10,10,15,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${colors.border}`,
        padding: '0 24px',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          height: 60,
          gap: 32,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('feed')}
          aria-label="LinkUp Home"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${colors.accent}, #a78bfa)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: colors.textPrimary,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            LinkUp
          </span>
        </button>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
          <label htmlFor="search-input" className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>
            Search
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search posts, people..."
            aria-label="Search posts and people"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', query: e.target.value })}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.borderFocus;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = 'none';
              // Delay close to allow clicking results
              setTimeout(() => {
                if (!document.querySelector('[role="listbox"]:hover')) {
                  dispatch({ type: 'CLOSE_SEARCH' });
                }
              }, 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') dispatch({ type: 'CLOSE_SEARCH' });
            }}
            style={{
              width: '100%',
              padding: '8px 16px 8px 38px',
              borderRadius: '9999px',
              border: `1px solid ${colors.border}`,
              background: colors.bgInput,
              color: colors.textPrimary,
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              color: colors.textTertiary,
              pointerEvents: 'none',
            }}
          >
            \u2315
          </span>
          <SearchResults />
        </div>

        {/* Nav */}
        <nav role="navigation" aria-label="Main navigation" style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              aria-current={state.activeRoute === item.id ? 'page' : undefined}
              style={{
                background:
                  state.activeRoute === item.id
                    ? colors.accentSoft
                    : 'transparent',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                color:
                  state.activeRoute === item.id
                    ? colors.accent
                    : colors.textSecondary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                minWidth: 64,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (state.activeRoute !== item.id)
                  e.currentTarget.style.background = colors.bgCardHover;
              }}
              onMouseLeave={(e) => {
                if (state.activeRoute !== item.id)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
              {/* Notification badge */}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: '8px',
                    background: colors.error,
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            background: colors.bgInput,
            border: `1px solid ${colors.border}`,
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = 'rotate(30deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          {theme === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19'}
        </button>

        {/* Profile avatar */}
        <Avatar
          user={state.currentUser}
          size={36}
          onClick={() => {
            dispatch({
              type: 'NAVIGATE',
              route: 'profile',
              profile: state.currentUser,
            });
            announce('Viewing your profile');
          }}
        />
      </div>
    </header>
  );
});

Header.displayName = 'Header';
