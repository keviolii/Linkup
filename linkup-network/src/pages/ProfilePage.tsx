import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { useApp, useAnnounce } from '@/hooks';
import { getInitials } from '@/utils';

export const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const profile = state.selectedProfile || state.currentUser;
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'skills'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editAbout, setEditAbout] = useState(profile.about);
  const announce = useAnnounce();

  const isOwnProfile = profile.id === state.currentUser.id;

  const handleSave = () => {
    setIsEditing(false);
    announce('Profile updated successfully');
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Cover & Avatar */}
      <div
        style={{
          background: `linear-gradient(135deg, ${profile.coverColor}, ${profile.coverColor}44, ${tokens.colors.bgCard})`,
          height: 180,
          borderRadius: `${tokens.radii.lg} ${tokens.radii.lg} 0 0`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: 24,
            width: 96,
            height: 96,
            borderRadius: tokens.radii.full,
            background: `linear-gradient(135deg, ${profile.coverColor}, ${profile.coverColor}88)`,
            border: `4px solid ${tokens.colors.bg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: '#fff',
            fontFamily: tokens.fonts.display,
          }}
        >
          {getInitials(profile.name)}
        </div>
      </div>

      {/* Info card */}
      <div
        style={{
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          borderTop: 'none',
          borderRadius: `0 0 ${tokens.radii.lg} ${tokens.radii.lg}`,
          padding: '56px 24px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: tokens.colors.textPrimary,
                fontFamily: tokens.fonts.display,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {profile.name}
            </h1>
            <p style={{ fontSize: 15, color: tokens.colors.textSecondary, margin: '4px 0 0', fontFamily: tokens.fonts.body }}>
              {profile.headline}
            </p>
            <p style={{ fontSize: 13, color: tokens.colors.textTertiary, margin: '6px 0 0' }}>
              {profile.location} ·{' '}
              <span style={{ color: tokens.colors.accent }}>
                {profile.connections.toLocaleString()} connections
              </span>
            </p>
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => setIsEditing(!isEditing)}
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
              style={{
                background: isEditing ? tokens.colors.error + '22' : tokens.colors.accentSoft,
                border: `1px solid ${isEditing ? tokens.colors.error + '44' : tokens.colors.accent + '44'}`,
                borderRadius: tokens.radii.full,
                padding: '8px 20px',
                color: isEditing ? tokens.colors.error : tokens.colors.accent,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: tokens.fonts.display,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  background: `linear-gradient(135deg, ${tokens.colors.accent}, #a78bfa)`,
                  border: 'none',
                  borderRadius: tokens.radii.full,
                  padding: '10px 24px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: tokens.fonts.display,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}
              >
                Connect
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: `1px solid ${tokens.colors.accent}`,
                  borderRadius: tokens.radii.full,
                  padding: '10px 24px',
                  color: tokens.colors.accent,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: tokens.fonts.display,
                  cursor: 'pointer',
                }}
              >
                Message
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Profile sections"
          style={{
            display: 'flex',
            gap: 4,
            marginTop: 24,
            borderTop: `1px solid ${tokens.colors.border}`,
            paddingTop: 16,
          }}
        >
          {(['about', 'experience', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? tokens.colors.accentSoft : 'transparent',
                border: 'none',
                borderRadius: tokens.radii.md,
                padding: '8px 18px',
                color: activeTab === tab ? tokens.colors.accent : tokens.colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: tokens.fonts.display,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div style={{ marginTop: 16 }}>
        {activeTab === 'about' && (
          <div
            role="tabpanel"
            id="panel-about"
            aria-label="About"
            style={{
              background: tokens.colors.bgCard,
              borderRadius: tokens.radii.lg,
              border: `1px solid ${tokens.colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: tokens.colors.textPrimary, fontFamily: tokens.fonts.display, marginBottom: 12, marginTop: 0 }}>
              About
            </h2>
            {isEditing ? (
              <div>
                <textarea
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  aria-label="Edit about section"
                  rows={4}
                  style={{
                    width: '100%',
                    background: tokens.colors.bgInput,
                    border: `1px solid ${tokens.colors.border}`,
                    borderRadius: tokens.radii.md,
                    padding: 12,
                    color: tokens.colors.textPrimary,
                    fontSize: 15,
                    fontFamily: tokens.fonts.body,
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = tokens.colors.borderFocus; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = tokens.colors.border; }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    marginTop: 12,
                    background: `linear-gradient(135deg, ${tokens.colors.accent}, #a78bfa)`,
                    border: 'none',
                    borderRadius: tokens.radii.full,
                    padding: '8px 24px',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 15, lineHeight: 1.7, color: tokens.colors.textSecondary, fontFamily: tokens.fonts.body, margin: 0 }}>
                {editAbout}
              </p>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div
            role="tabpanel"
            id="panel-experience"
            aria-label="Experience"
            style={{
              background: tokens.colors.bgCard,
              borderRadius: tokens.radii.lg,
              border: `1px solid ${tokens.colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: tokens.colors.textPrimary, fontFamily: tokens.fonts.display, marginBottom: 16, marginTop: 0 }}>
              Experience
            </h2>
            {profile.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 0',
                  borderTop: i > 0 ? `1px solid ${tokens.colors.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: tokens.radii.md,
                    background: tokens.colors.bgInput,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: tokens.colors.accent,
                    fontFamily: tokens.fonts.display,
                    flexShrink: 0,
                    border: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  {exp.logo}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: tokens.colors.textPrimary, fontFamily: tokens.fonts.display, margin: 0 }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: 14, color: tokens.colors.textSecondary, margin: '2px 0 0' }}>
                    {exp.company}
                  </p>
                  <p style={{ fontSize: 13, color: tokens.colors.textTertiary, margin: '2px 0 0' }}>
                    {exp.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div
            role="tabpanel"
            id="panel-skills"
            aria-label="Skills"
            style={{
              background: tokens.colors.bgCard,
              borderRadius: tokens.radii.lg,
              border: `1px solid ${tokens.colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: tokens.colors.textPrimary, fontFamily: tokens.fonts.display, marginBottom: 16, marginTop: 0 }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: tokens.colors.accentSoft,
                    border: `1px solid ${tokens.colors.accent}33`,
                    borderRadius: tokens.radii.full,
                    padding: '6px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: tokens.colors.accent,
                    fontFamily: tokens.fonts.display,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
