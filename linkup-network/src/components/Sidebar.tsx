import { memo } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { MOCK_USERS, api } from '@/api';
import { Avatar } from './Avatar';

// ─── Trending Topics ──────────────────────────────────────────

const TOPICS = [
  { tag: '#WebAccessibility', posts: '2.4k' },
  { tag: '#ReactConf2026', posts: '1.8k' },
  { tag: '#TypeScript5', posts: '1.2k' },
  { tag: '#CoreWebVitals', posts: '987' },
  { tag: '#DesignSystems', posts: '876' },
];

export const TrendingSidebar: React.FC = memo(() => {
  const { colors } = useTheme();

  return (
    <aside
      aria-label="Trending topics"
      style={{
        background: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: colors.textPrimary,
          fontFamily: "'DM Sans', sans-serif",
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
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: colors.accent,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.tag}
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              marginTop: 2,
            }}
          >
            {t.posts} posts
          </div>
        </button>
      ))}
    </aside>
  );
});

TrendingSidebar.displayName = 'TrendingSidebar';

// ─── Suggested Connections ────────────────────────────────────

export const SuggestedConnections: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();
  const suggestions = MOCK_USERS.filter((u) => u.id !== state.currentUser.id).slice(0, 3);

  const handleConnect = async (userId: string) => {
    const res = await api.sendConnectionRequest(state.currentUser.id, userId);
    dispatch({ type: 'CONNECTION_REQUEST_SENT', request: res.data });
    announce('Connection request sent');
  };

  const getStatus = (userId: string) => {
    if (state.connections.includes(userId)) return 'connected';
    if (state.pendingRequests.some((r) =>
      (r.fromUserId === state.currentUser.id && r.toUserId === userId) ||
      (r.fromUserId === userId && r.toUserId === state.currentUser.id)
    )) return 'pending';
    return 'none';
  };

  return (
    <aside
      aria-label="Suggested connections"
      style={{
        background: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: 20,
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: colors.textPrimary,
          fontFamily: "'DM Sans', sans-serif",
          margin: '0 0 16px',
        }}
      >
        People you may know
      </h2>
      {suggestions.map((user) => {
        const status = getStatus(user.id);
        return (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderTop: `1px solid ${colors.border}`,
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
                  color: colors.textPrimary,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'left',
                  display: 'block',
                }}
              >
                {user.name}
              </button>
              <p
                style={{
                  fontSize: 12,
                  color: colors.textTertiary,
                  margin: '2px 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.headline.split('\u2022')[0].trim()}
              </p>
            </div>
            <button
              onClick={() => status === 'none' && handleConnect(user.id)}
              disabled={status !== 'none'}
              style={{
                background: 'none',
                border: `1px solid ${status === 'connected' ? colors.success : status === 'pending' ? colors.warning : colors.accent}`,
                borderRadius: '9999px',
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: 600,
                color: status === 'connected' ? colors.success : status === 'pending' ? colors.warning : colors.accent,
                cursor: status === 'none' ? 'pointer' : 'default',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (status === 'none') e.currentTarget.style.background = colors.accentSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {status === 'connected' ? 'Connected' : status === 'pending' ? 'Pending' : '+ Connect'}
            </button>
          </div>
        );
      })}
    </aside>
  );
});

SuggestedConnections.displayName = 'SuggestedConnections';
