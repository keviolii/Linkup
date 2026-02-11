import { memo, useRef, useState } from 'react';
import { tokens } from '@/styles/tokens';
import { useApp, useAnnounce, useFocusTrap } from '@/hooks';
import { api } from '@/api';
import { Avatar } from './Avatar';

export const PostComposer: React.FC = memo(() => {
  const { state, dispatch } = useApp();
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

    // Optimistic update — post appears instantly
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

    // Confirm with mock API
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

  // Collapsed state
  if (!state.composerOpen) {
    return (
      <div
        style={{
          background: tokens.colors.bgCard,
          borderRadius: tokens.radii.lg,
          border: `1px solid ${tokens.colors.border}`,
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
              borderRadius: tokens.radii.full,
              border: `1px solid ${tokens.colors.border}`,
              background: tokens.colors.bgInput,
              color: tokens.colors.textTertiary,
              fontSize: 15,
              fontFamily: tokens.fonts.body,
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tokens.colors.textTertiary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = tokens.colors.border;
            }}
          >
            What's on your mind, {state.currentUser.name.split(' ')[0]}?
          </button>
        </div>
      </div>
    );
  }

  // Expanded composer
  return (
    <div
      ref={composerRef}
      role="dialog"
      aria-label="Create a post"
      aria-modal="false"
      style={{
        background: tokens.colors.bgCard,
        borderRadius: tokens.radii.lg,
        border: `1px solid ${tokens.colors.borderFocus}`,
        padding: 20,
        marginBottom: 16,
        boxShadow: tokens.shadows.glow,
        animation: 'slideDown 0.25s ease-out',
      }}
    >
      {/* Author row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Avatar user={state.currentUser} size={44} tabIndex={-1} />
        <div>
          <div
            style={{
              fontWeight: 700,
              color: tokens.colors.textPrimary,
              fontSize: 15,
              fontFamily: tokens.fonts.display,
            }}
          >
            {state.currentUser.name}
          </div>
          <div style={{ fontSize: 12, color: tokens.colors.textTertiary }}>
            Posting publicly
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMPOSER' })}
          aria-label="Close composer"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: tokens.colors.textTertiary,
            fontSize: 20,
            cursor: 'pointer',
            padding: 4,
            borderRadius: tokens.radii.sm,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = tokens.colors.textPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = tokens.colors.textTertiary;
          }}
        >
          ✕
        </button>
      </div>

      {/* Textarea */}
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
          color: tokens.colors.textPrimary,
          fontSize: 15,
          lineHeight: 1.6,
          fontFamily: tokens.fonts.body,
          padding: 0,
        }}
      />

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${tokens.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['📷 Photo', '📎 Attach', '📊 Poll'].map((item) => (
            <button
              key={item}
              aria-label={item.split(' ')[1]}
              style={{
                background: tokens.colors.bgInput,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: tokens.radii.full,
                padding: '6px 14px',
                fontSize: 13,
                color: tokens.colors.textSecondary,
                cursor: 'pointer',
                fontFamily: tokens.fonts.body,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.accent;
                e.currentTarget.style.color = tokens.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.border;
                e.currentTarget.style.color = tokens.colors.textSecondary;
              }}
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
              color:
                remaining < 100
                  ? tokens.colors.warning
                  : tokens.colors.textTertiary,
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
                ? `linear-gradient(135deg, ${tokens.colors.accent}, #a78bfa)`
                : tokens.colors.bgInput,
              border: 'none',
              borderRadius: tokens.radii.full,
              padding: '10px 28px',
              color: content.trim() ? '#fff' : tokens.colors.textTertiary,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: tokens.fonts.display,
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: content.trim()
                ? '0 4px 16px rgba(99,102,241,0.3)'
                : 'none',
            }}
          >
            {isSubmitting ? 'Publishing...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p
        style={{
          fontSize: 11,
          color: tokens.colors.textTertiary,
          marginTop: 8,
        }}
      >
        <kbd
          style={{
            background: tokens.colors.bgInput,
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11,
          }}
        >
          ⌘
        </kbd>{' '}
        +{' '}
        <kbd
          style={{
            background: tokens.colors.bgInput,
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11,
          }}
        >
          Enter
        </kbd>{' '}
        to post
      </p>
    </div>
  );
});

PostComposer.displayName = 'PostComposer';
