import { useEffect } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { api, MOCK_USERS } from '@/api';
import { formatRelativeTime } from '@/utils';

const NOTIF_ICONS: Record<string, string> = {
  reaction: '\ud83d\udc4d',
  comment: '\ud83d\udcac',
  connection_request: '\ud83d\udd17',
  connection_accepted: '\ud83c\udf89',
  mention: '\ud83d\udce2',
};

export const NotificationsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();

  useEffect(() => {
    if (state.notifications.length === 0) {
      api.getNotifications().then((res) => {
        dispatch({ type: 'NOTIFICATIONS_LOADED', notifications: res.data });
      });
    }
  }, [state.notifications.length, dispatch]);

  const handleMarkRead = async (notifId: string) => {
    await api.markNotificationRead(notifId);
    dispatch({ type: 'NOTIFICATION_READ', notificationId: notifId });
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    dispatch({ type: 'NOTIFICATIONS_ALL_READ' });
    announce('All notifications marked as read');
  };

  const handleNotifClick = (notif: typeof state.notifications[0]) => {
    if (!notif.read) handleMarkRead(notif.id);

    if (notif.relatedPostId) {
      dispatch({ type: 'NAVIGATE', route: 'feed' });
    } else if (notif.fromUserId) {
      const user = MOCK_USERS.find((u) => u.id === notif.fromUserId);
      if (user) dispatch({ type: 'NAVIGATE', route: 'profile', profile: user });
    }
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "'DM Sans', sans-serif",
            color: colors.textPrimary,
            margin: 0,
          }}
        >
          Notifications
          {unreadCount > 0 && (
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.accent,
              marginLeft: 8,
            }}>
              ({unreadCount} new)
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'none',
              border: `1px solid ${colors.accent}`,
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: colors.accent,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.accentSoft; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            Mark all read
          </button>
        )}
      </div>

      {state.notifications.length === 0 ? (
        <div style={{ background: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\ud83d\udd14'}</div>
          <p style={{ fontSize: 14, color: colors.textTertiary }}>No notifications yet</p>
        </div>
      ) : (
        state.notifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => handleNotifClick(notif)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              width: '100%',
              background: notif.read ? colors.bgCard : colors.accentSoft,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              marginBottom: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.bgCardHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = notif.read
                ? colors.bgCard
                : colors.accentSoft;
            }}
          >
            <span style={{ fontSize: 24 }}>{NOTIF_ICONS[notif.type] || '\ud83d\udd14'}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", margin: 0, fontWeight: notif.read ? 400 : 600 }}>
                {notif.message}
              </p>
              <p style={{ fontSize: 12, color: colors.textTertiary, margin: '4px 0 0' }}>
                {formatRelativeTime(notif.timestamp)} ago
              </p>
            </div>
            {!notif.read && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '9999px',
                  background: colors.accent,
                  flexShrink: 0,
                }}
              />
            )}
          </button>
        ))
      )}
    </div>
  );
};
