import { memo } from 'react';
import { tokens } from '@/styles/tokens';
import { useApp } from '@/hooks';
import { MOCK_USERS } from '@/api';
import { Avatar } from './Avatar';

// ─── Trending Topics ──────────────────────────────────────────

const TOPICS = [
  { tag: '#WebAccessibility', posts: '2.4k' },
  { tag: '#ReactConf2026', posts: '1.8k' },
  { tag: '#TypeScript5', posts: '1.2k' },
  { tag: '#CoreWebVitals', posts: '987' },
  { tag: '#DesignSystems', posts: '876' },
];

export const TrendingSidebar: React.FC = memo(() => (
  <aside
    aria-label="Trending topics"
    style={{
      background: tokens.colors.bgCard,
      borderRadius: tokens.radii.lg,
      border: `1px solid ${tokens.colors.border}`,
      padding: 20,
      marginBottom: 16,
    }}
  >
    <h2
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.fonts.display,
        margin: '0 0 16px',
      }}
    >
      Trending
    </h2>
    {TOPICS.map((t) => (
      <button
        key={t.tag}
        style={{
          display: 'block',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '10px 0',
          cursor: 'pointer',
          textAlign: 'left',
          borderTop: `1px solid ${tokens.colors.border}`,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: tokens.colors.accent,
            fontFamily: tokens.fonts.display,
          }}
        >
          {t.tag}
        </div>
        <div
          style={{
            fontSize: 12,
            color: tokens.colors.textTertiary,
            marginTop: 2,
          }}
        >
          {t.posts} posts
        </div>
      </button>
    ))}
  </aside>
));

TrendingSidebar.displayName = 'TrendingSidebar';

// ─── Suggested Connections ────────────────────────────────────

export const SuggestedConnections: React.FC = memo(() => {
  const { dispatch } = useApp();
  const suggestions = MOCK_USERS.slice(1, 4);

  return (
    <aside
      aria-label="Suggested connections"
      style={{
        background: tokens.colors.bgCard,
        borderRadius: tokens.radii.lg,
        border: `1px solid ${tokens.colors.border}`,
        padding: 20,
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: tokens.colors.textPrimary,
          fontFamily: tokens.fonts.display,
          margin: '0 0 16px',
        }}
      >
        People you may know
      </h2>
      {suggestions.map((user) => (
        <div
          key={user.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            borderTop: `1px solid ${tokens.colors.border}`,
          }}
        >
          <Avatar
            user={user}
            size={40}
            onClick={() =>
              dispatch({ type: 'NAVIGATE', route: 'profile', profile: user })
            }
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <button
              onClick={() =>
                dispatch({
                  type: 'NAVIGATE',
                  route: 'profile',
                  profile: user,
                })
              }
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                color: tokens.colors.textPrimary,
                fontFamily: tokens.fonts.display,
                textAlign: 'left',
                display: 'block',
              }}
            >
              {user.name}
            </button>
            <p
              style={{
                fontSize: 12,
                color: tokens.colors.textTertiary,
                margin: '2px 0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.headline.split('•')[0].trim()}
            </p>
          </div>
          <button
            style={{
              background: 'none',
              border: `1px solid ${tokens.colors.accent}`,
              borderRadius: tokens.radii.full,
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: tokens.colors.accent,
              cursor: 'pointer',
              fontFamily: tokens.fonts.display,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tokens.colors.accentSoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            + Connect
          </button>
        </div>
      ))}
    </aside>
  );
});

SuggestedConnections.displayName = 'SuggestedConnections';
