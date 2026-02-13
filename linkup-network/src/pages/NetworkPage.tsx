import { useState } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { MOCK_USERS, api } from '@/api';
import { getInitials } from '@/utils';

export const NetworkPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'connections' | 'pending'>('suggestions');

  const otherUsers = MOCK_USERS.filter((u) => u.id !== state.currentUser.id);
  const connectedUsers = otherUsers.filter((u) => state.connections.includes(u.id));
  const pendingSent = state.pendingRequests.filter((r) => r.fromUserId === state.currentUser.id);
  const pendingReceived = state.pendingRequests.filter((r) => r.toUserId === state.currentUser.id);

  const getConnectionStatus = (userId: string): 'connected' | 'pending' | 'none' => {
    if (state.connections.includes(userId)) return 'connected';
    if (state.pendingRequests.some((r) =>
      (r.fromUserId === state.currentUser.id && r.toUserId === userId) ||
      (r.fromUserId === userId && r.toUserId === state.currentUser.id)
    )) return 'pending';
    return 'none';
  };

  const handleConnect = async (userId: string) => {
    const res = await api.sendConnectionRequest(state.currentUser.id, userId);
    dispatch({ type: 'CONNECTION_REQUEST_SENT', request: res.data });
    announce('Connection request sent');
  };

  const handleAccept = async (requestId: string, userId: string) => {
    await api.acceptConnectionRequest(requestId);
    dispatch({ type: 'CONNECTION_REQUEST_ACCEPTED', requestId, userId });

    const user = MOCK_USERS.find((u) => u.id === userId);
    const notification = {
      type: 'connection_accepted' as const,
      fromUserId: userId,
      timestamp: Date.now(),
      read: false,
      message: `You are now connected with ${user?.name || 'someone'}`,
    };
    const notifRes = await api.addNotification(notification);
    dispatch({ type: 'NOTIFICATION_ADDED', notification: notifRes.data });
    announce('Connection request accepted');
  };

  const handleRemove = async (userId: string) => {
    await api.removeConnection(userId);
    dispatch({ type: 'CONNECTION_REMOVED', userId });
    announce('Connection removed');
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 24,
          color: colors.textPrimary,
        }}
      >
        My Network
      </h1>

      {/* Tabs */}
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          background: colors.bgCard,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: 4,
        }}
      >
        {[
          { id: 'suggestions' as const, label: 'Suggestions' },
          { id: 'connections' as const, label: `Connections (${connectedUsers.length})` },
          { id: 'pending' as const, label: `Pending (${pendingReceived.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id ? colors.accentSoft : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              color: activeTab === tab.id ? colors.accent : colors.textSecondary,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      {activeTab === 'suggestions' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {otherUsers.map((user) => {
            const status = getConnectionStatus(user.id);
            return (
              <div
                key={user.id}
                style={{
                  background: colors.bgCard,
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <div
                  style={{
                    height: 64,
                    background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}44)`,
                  }}
                />
                <div
                  style={{
                    padding: '0 16px 16px',
                    marginTop: -24,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '9999px',
                      margin: '0 auto 8px',
                      background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
                      border: `3px solid ${colors.bgCard}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#fff',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontFamily: "'DM Sans', sans-serif",
                      margin: 0,
                    }}
                  >
                    {user.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                      margin: '4px 0 12px',
                      lineHeight: 1.4,
                    }}
                  >
                    {user.headline.split('\u2022')[0].trim()}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'NAVIGATE',
                          route: 'profile',
                          profile: user,
                        })
                      }
                      style={{
                        flex: 1,
                        background: 'none',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '9999px',
                        padding: '8px 0',
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.textSecondary,
                        cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecondary; }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => status === 'none' && handleConnect(user.id)}
                      disabled={status !== 'none'}
                      style={{
                        flex: 1,
                        background: status === 'connected'
                          ? colors.success + '22'
                          : status === 'pending'
                            ? colors.warning + '22'
                            : `linear-gradient(135deg, ${colors.accent}, #a78bfa)`,
                        border: status === 'none'
                          ? 'none'
                          : `1px solid ${status === 'connected' ? colors.success + '44' : colors.warning + '44'}`,
                        borderRadius: '9999px',
                        padding: '8px 0',
                        fontSize: 13,
                        fontWeight: 600,
                        color: status === 'none' ? '#fff' : status === 'connected' ? colors.success : colors.warning,
                        cursor: status === 'none' ? 'pointer' : 'default',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                      }}
                    >
                      {status === 'connected' ? 'Connected' : status === 'pending' ? 'Pending' : '+ Connect'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connections */}
      {activeTab === 'connections' && (
        <div>
          {connectedUsers.length === 0 ? (
            <div style={{ background: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: 48, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: colors.textTertiary }}>No connections yet. Start connecting with people!</p>
            </div>
          ) : (
            connectedUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  background: colors.bgCard,
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '9999px',
                    background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: colors.textTertiary }}>{user.headline.split('\u2022')[0].trim()}</div>
                </div>
                <button
                  onClick={() => handleRemove(user.id)}
                  style={{
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '9999px',
                    padding: '6px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.error; e.currentTarget.style.color = colors.error; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecondary; }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div>
          {pendingReceived.length === 0 && pendingSent.length === 0 ? (
            <div style={{ background: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: 48, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: colors.textTertiary }}>No pending requests.</p>
            </div>
          ) : (
            <>
              {pendingReceived.map((req) => {
                const user = MOCK_USERS.find((u) => u.id === req.fromUserId);
                if (!user) return null;
                return (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 16,
                      background: colors.bgCard,
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '9999px',
                        background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: colors.textTertiary }}>wants to connect</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleAccept(req.id, req.fromUserId)}
                        style={{
                          background: colors.accent,
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '6px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
              {pendingSent.map((req) => {
                const user = MOCK_USERS.find((u) => u.id === req.toUserId);
                if (!user) return null;
                return (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 16,
                      background: colors.bgCard,
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      marginBottom: 8,
                      opacity: 0.7,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '9999px',
                        background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: colors.textTertiary }}>Request sent</div>
                    </div>
                    <span style={{ fontSize: 12, color: colors.warning, fontWeight: 600 }}>Pending</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
