import { tokens } from '@/styles/tokens';
import { useApp } from '@/hooks';
import { MOCK_USERS } from '@/api';
import { getInitials } from '@/utils';

export const NetworkPage: React.FC = () => {
  const { dispatch } = useApp();

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          fontFamily: tokens.fonts.display,
          marginBottom: 24,
          color: tokens.colors.textPrimary,
        }}
      >
        My Network
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {MOCK_USERS.slice(1).map((user) => (
          <div
            key={user.id}
            style={{
              background: tokens.colors.bgCard,
              borderRadius: tokens.radii.lg,
              border: `1px solid ${tokens.colors.border}`,
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
                  borderRadius: tokens.radii.full,
                  margin: '0 auto 8px',
                  background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
                  border: `3px solid ${tokens.colors.bgCard}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#fff',
                  fontFamily: tokens.fonts.display,
                }}
              >
                {getInitials(user.name)}
              </div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: tokens.colors.textPrimary,
                  fontFamily: tokens.fonts.display,
                  margin: 0,
                }}
              >
                {user.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: tokens.colors.textTertiary,
                  margin: '4px 0 12px',
                  lineHeight: 1.4,
                }}
              >
                {user.headline.split('•')[0].trim()}
              </p>
              <button
                onClick={() =>
                  dispatch({
                    type: 'NAVIGATE',
                    route: 'profile',
                    profile: user,
                  })
                }
                style={{
                  width: '100%',
                  background: 'none',
                  border: `1px solid ${tokens.colors.accent}`,
                  borderRadius: tokens.radii.full,
                  padding: '8px 0',
                  fontSize: 13,
                  fontWeight: 600,
                  color: tokens.colors.accent,
                  cursor: 'pointer',
                  fontFamily: tokens.fonts.display,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tokens.colors.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
