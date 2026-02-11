import { tokens } from '@/styles/tokens';

const NOTIFICATIONS = [
  { icon: '👍', text: 'Marcus Johnson reacted to your post', time: '2h', unread: true },
  { icon: '💬', text: 'Priya Sharma commented on your post', time: '4h', unread: true },
  { icon: '🔗', text: 'Jordan Kim accepted your connection request', time: '1d', unread: false },
  { icon: '📢', text: 'Alex Rivera mentioned you in a comment', time: '2d', unread: false },
  { icon: '🎉', text: 'Your post reached 200 reactions!', time: '3d', unread: false },
];

export const NotificationsPage: React.FC = () => (
  <div style={{ maxWidth: 640, margin: '0 auto' }}>
    <h1
      style={{
        fontSize: 24,
        fontWeight: 800,
        fontFamily: tokens.fonts.display,
        marginBottom: 24,
        color: tokens.colors.textPrimary,
      }}
    >
      Notifications
    </h1>
    {NOTIFICATIONS.map((notif, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 16,
          background: notif.unread ? tokens.colors.accentSoft : tokens.colors.bgCard,
          borderRadius: tokens.radii.lg,
          border: `1px solid ${tokens.colors.border}`,
          marginBottom: 8,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = tokens.colors.bgCardHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = notif.unread
            ? tokens.colors.accentSoft
            : tokens.colors.bgCard;
        }}
      >
        <span style={{ fontSize: 24 }}>{notif.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: tokens.colors.textPrimary, fontFamily: tokens.fonts.body, margin: 0 }}>
            {notif.text}
          </p>
          <p style={{ fontSize: 12, color: tokens.colors.textTertiary, margin: '4px 0 0' }}>
            {notif.time} ago
          </p>
        </div>
        {notif.unread && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: tokens.radii.full,
              background: tokens.colors.accent,
            }}
          />
        )}
      </div>
    ))}
  </div>
);
