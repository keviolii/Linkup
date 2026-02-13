import { useState } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { api } from '@/api';
import { getInitials } from '@/utils';

export const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const profile = state.selectedProfile || state.currentUser;
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'skills'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editAbout, setEditAbout] = useState(profile.about);
  const announce = useAnnounce();

  const isOwnProfile = profile.id === state.currentUser.id;
  const isConnected = state.connections.includes(profile.id);
  const isPending = state.pendingRequests.some(
    (r) =>
      (r.fromUserId === state.currentUser.id && r.toUserId === profile.id) ||
      (r.fromUserId === profile.id && r.toUserId === state.currentUser.id),
  );

  const handleSave = () => {
    setIsEditing(false);
    announce('Profile updated successfully');
  };

  const handleConnect = async () => {
    const res = await api.sendConnectionRequest(state.currentUser.id, profile.id);
    dispatch({ type: 'CONNECTION_REQUEST_SENT', request: res.data });
    announce('Connection request sent');
  };

  const handleMessage = async () => {
    const res = await api.getOrCreateConversation(state.currentUser.id, profile.id);
    dispatch({ type: 'OPEN_CHAT', conversationId: res.data.id });
    // Make sure conversations are loaded
    if (!state.conversations.find((c) => c.id === res.data.id)) {
      const convRes = await api.getConversations();
      dispatch({ type: 'CONVERSATIONS_LOADED', conversations: convRes.data });
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Cover & Avatar */}
      <div
        style={{
          background: `linear-gradient(135deg, ${profile.coverColor}, ${profile.coverColor}44, ${colors.bgCard})`,
          height: 180,
          borderRadius: '16px 16px 0 0',
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
            borderRadius: '9999px',
            background: `linear-gradient(135deg, ${profile.coverColor}, ${profile.coverColor}88)`,
            border: `4px solid ${colors.bg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {getInitials(profile.name)}
        </div>
      </div>

      {/* Info card */}
      <div
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          padding: '56px 24px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: colors.textPrimary,
                fontFamily: "'DM Sans', sans-serif",
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {profile.name}
            </h1>
            <p style={{ fontSize: 15, color: colors.textSecondary, margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
              {profile.headline}
            </p>
            <p style={{ fontSize: 13, color: colors.textTertiary, margin: '6px 0 0' }}>
              {profile.location} ·{' '}
              <span style={{ color: colors.accent }}>
                {profile.connections.toLocaleString()} connections
              </span>
            </p>
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => setIsEditing(!isEditing)}
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
              style={{
                background: isEditing ? colors.error + '22' : colors.accentSoft,
                border: `1px solid ${isEditing ? colors.error + '44' : colors.accent + '44'}`,
                borderRadius: '9999px',
                padding: '8px 20px',
                color: isEditing ? colors.error : colors.accent,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={isConnected || isPending ? undefined : handleConnect}
                style={{
                  background: isConnected
                    ? colors.success + '22'
                    : isPending
                      ? colors.warning + '22'
                      : `linear-gradient(135deg, ${colors.accent}, #a78bfa)`,
                  border: isConnected || isPending
                    ? `1px solid ${isConnected ? colors.success + '44' : colors.warning + '44'}`
                    : 'none',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  color: isConnected ? colors.success : isPending ? colors.warning : '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: isConnected || isPending ? 'default' : 'pointer',
                  boxShadow: !isConnected && !isPending ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {isConnected ? 'Connected' : isPending ? 'Pending' : 'Connect'}
              </button>
              <button
                onClick={handleMessage}
                style={{
                  background: 'transparent',
                  border: `1px solid ${colors.accent}`,
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  color: colors.accent,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
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
            borderTop: `1px solid ${colors.border}`,
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
                background: activeTab === tab ? colors.accentSoft : 'transparent',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 18px',
                color: activeTab === tab ? colors.accent : colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
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
              background: colors.bgCard,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", marginBottom: 12, marginTop: 0 }}>
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
                    background: colors.bgInput,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: 12,
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = colors.borderFocus; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    marginTop: 12,
                    background: `linear-gradient(135deg, ${colors.accent}, #a78bfa)`,
                    border: 'none',
                    borderRadius: '9999px',
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
              <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.textSecondary, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
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
              background: colors.bgCard,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, marginTop: 0 }}>
              Experience
            </h2>
            {profile.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 0',
                  borderTop: i > 0 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: colors.bgInput,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: colors.accent,
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {exp.logo}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: 14, color: colors.textSecondary, margin: '2px 0 0' }}>
                    {exp.company}
                  </p>
                  <p style={{ fontSize: 13, color: colors.textTertiary, margin: '2px 0 0' }}>
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
              background: colors.bgCard,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, marginTop: 0 }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: colors.accentSoft,
                    border: `1px solid ${colors.accent}33`,
                    borderRadius: '9999px',
                    padding: '6px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: colors.accent,
                    fontFamily: "'DM Sans', sans-serif",
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
