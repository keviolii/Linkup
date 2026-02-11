import { memo } from 'react';
import { tokens } from '@/styles/tokens';
import { useApp, useAnnounce } from '@/hooks';
import { Avatar } from './Avatar';
import type { Route } from '@/types';

const NAV_ITEMS: { id: Route; label: string; icon: string }[] = [
  { id: 'feed', label: 'Feed', icon: '⌂' },
  { id: 'network', label: 'Network', icon: '⊞' },
  { id: 'notifications', label: 'Alerts', icon: '🔔' },
];

export const Header: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const announce = useAnnounce();

  const navigate = (route: Route) => {
    dispatch({ type: 'NAVIGATE', route });
    announce(`Navigated to ${route}`);
  };

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${tokens.colors.border}`,
        padding: '0 24px',
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
              borderRadius: tokens.radii.sm,
              background: `linear-gradient(135deg, ${tokens.colors.accent}, #a78bfa)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: '#fff',
              fontFamily: tokens.fonts.display,
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.fonts.display,
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
            style={{
              width: '100%',
              padding: '8px 16px 8px 38px',
              borderRadius: tokens.radii.full,
              border: `1px solid ${tokens.colors.border}`,
              background: tokens.colors.bgInput,
              color: tokens.colors.textPrimary,
              fontSize: 14,
              fontFamily: tokens.fonts.body,
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = tokens.colors.borderFocus;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.colors.accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = tokens.colors.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              color: tokens.colors.textTertiary,
              pointerEvents: 'none',
            }}
          >
            ⌕
          </span>
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
                    ? tokens.colors.accentSoft
                    : 'transparent',
                border: 'none',
                borderRadius: tokens.radii.md,
                padding: '8px 16px',
                color:
                  state.activeRoute === item.id
                    ? tokens.colors.accent
                    : tokens.colors.textSecondary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: tokens.fonts.body,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                minWidth: 64,
              }}
              onMouseEnter={(e) => {
                if (state.activeRoute !== item.id)
                  e.currentTarget.style.background = tokens.colors.bgCardHover;
              }}
              onMouseLeave={(e) => {
                if (state.activeRoute !== item.id)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

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
