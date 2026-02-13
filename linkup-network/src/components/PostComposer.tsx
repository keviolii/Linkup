import { memo, useRef, useState } from 'react';
import { useApp, useAnnounce, useFocusTrap, useTheme } from '@/hooks';
import { api } from '@/api';
import { Avatar } from './Avatar';

export const PostComposer: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const announce = useAnnounce();

  useFocusTrap(composerRef, state.composerOpen);

  const charLimit = 3000;
  const remaining = charLimit - content.length;

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const optimisticPost = {
      id: `temp-${Date.now()}`,
      authorId: state.currentUser.id,
      author: state.currentUser,
      content: content.trim(),
      timestamp: Date.now(),
      reactions: { like: 0, celebrate: 0, insightful: 0 },
      comments: 0,
      reposts: 0,
      _optimistic: true,
    };

    dispatch({ type: 'POST_CREATED', post: optimisticPost });
    announce('Post published successfully');
    setContent('');

    try {
      await api.createPost(content.trim(), state.currentUser.id);
    } catch {
      announce('Failed to publish post. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
    if (e.key === 'Escape') dispatch({ type: 'TOGGLE_COMPOSER' });
  };

  if (!state.composerOpen) {
    return (
      <div
        style={{
          background: colors.bgCard,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar user={state.currentUser} size={44} tabIndex={-1} />
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMPOSER' })}
            aria-label="Create a new post"
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '9999px',
              border: `1px solid ${colors.border}`,
              background: colors.bgInput,
              color: colors.textTertiary,
              fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.textTertiary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; }}
          >
            What's on your mind, {state.currentUser.name.split(' ')[0]}?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={composerRef}
      role="dialog"
      aria-label="Create a post"
      aria-modal="false"
      style={{
        background: colors.bgCard,
        borderRadius: '16px',
        border: `1px solid ${colors.borderFocus}`,
        padding: 20,
        marginBottom: 16,
        boxShadow: '0 0 20px rgba(99,102,241,0.15)',
        animation: 'slideDown 0.25s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar user={state.currentUser} size={44} tabIndex={-1} />
        <div>
          <div style={{ fontWeight: 700, color: colors.textPrimary, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
            {state.currentUser.name}
          </div>
          <div style={{ fontSize: 12, color: colors.textTertiary }}>Posting publicly</div>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMPOSER' })}
          aria-label="Close composer"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: colors.textTertiary,
            fontSize: 20,
            cursor: 'pointer',
            padding: 4,
            borderRadius: '8px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = colors.textPrimary; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = colors.textTertiary; }}
        >
          ✕
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
        onKeyDown={handleKeyDown}
        placeholder="Share your thoughts, insights, or updates..."
        aria-label="Post content"
        aria-describedby="char-count"
        rows={4}
        autoFocus
        style={{
          width: '100%',
          resize: 'vertical',
          minHeight: 100,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: colors.textPrimary,
          fontSize: 15,
          lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif",
          padding: 0,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['📷 Photo', '📎 Attach', '📊 Poll'].map((item) => (
            <button
              key={item}
              aria-label={item.split(' ')[1]}
              style={{
                background: colors.bgInput,
                border: `1px solid ${colors.border}`,
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: 13,
                color: colors.textSecondary,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecondary; }}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            id="char-count"
            aria-live="polite"
            style={{
              fontSize: 12,
              color: remaining < 100 ? colors.warning : colors.textTertiary,
            }}
          >
            {remaining < 200 ? `${remaining} characters remaining` : ''}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            aria-label="Publish post"
            style={{
              background: content.trim()
                ? `linear-gradient(135deg, ${colors.accent}, #a78bfa)`
                : colors.bgInput,
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 28px',
              color: content.trim() ? '#fff' : colors.textTertiary,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: content.trim() ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {isSubmitting ? 'Publishing...' : 'Post'}
          </button>
        </div>
      </div>

      <p style={{ fontSize: 11, color: colors.textTertiary, marginTop: 8 }}>
        <kbd style={{ background: colors.bgInput, padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>\u2318</kbd>{' '}
        +{' '}
        <kbd style={{ background: colors.bgInput, padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>Enter</kbd>{' '}
        to post
      </p>
    </div>
  );
});

PostComposer.displayName = 'PostComposer';
