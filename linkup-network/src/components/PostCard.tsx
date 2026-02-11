import { memo, useRef, useState } from 'react';
import type { Post, ReactionType } from '@/types';
import { tokens } from '@/styles/tokens';
import { useApp, useAnnounce, useReducedMotion } from '@/hooks';
import { api, MOCK_USERS } from '@/api';
import { formatRelativeTime, REACTION_META, totalReactions } from '@/utils';
import { Avatar } from './Avatar';

interface PostCardProps {
  post: Post;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = memo(({ post, index }) => {
  const { dispatch } = useApp();
  const [showReactions, setShowReactions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const announce = useAnnounce();
  const reducedMotion = useReducedMotion();
  const reactionRef = useRef<HTMLDivElement>(null);

  const truncateLength = 280;
  const isLong = post.content.length > truncateLength;
  const displayContent =
    isLong && !isExpanded
      ? post.content.slice(0, truncateLength) + '...'
      : post.content;

  const total = totalReactions(post.reactions as Record<string, number>);
  const author = post.author || MOCK_USERS[0];
  const animDelay = reducedMotion ? 0 : Math.min(index * 80, 400);

  const handleReaction = async (type: ReactionType) => {
    dispatch({ type: 'POST_REACTED', postId: post.id, reactionType: type });
    announce(`Reacted with ${REACTION_META[type].label}`);
    setShowReactions(false);
    await api.reactToPost(post.id, type);
  };

  return (
    <article
      aria-label={`Post by ${author.name}`}
      tabIndex={0}
      style={{
        background: tokens.colors.bgCard,
        borderRadius: tokens.radii.lg,
        border: `1px solid ${tokens.colors.border}`,
        marginBottom: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        animation: reducedMotion
          ? 'none'
          : `fadeSlideUp 0.5s ease-out ${animDelay}ms both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = tokens.colors.borderFocus + '55';
        e.currentTarget.style.boxShadow = tokens.shadows.sm;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = tokens.colors.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.accentSoft}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Optimistic sync indicator */}
      {post._optimistic && (
        <div
          style={{
            background: `linear-gradient(90deg, ${tokens.colors.accent}22, transparent)`,
            padding: '6px 20px',
            fontSize: 12,
            color: tokens.colors.accent,
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          ✓ Posted — syncing...
        </div>
      )}

      <div style={{ padding: 20 }}>
        {/* Author */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <Avatar
            user={author}
            size={48}
            onClick={() =>
              dispatch({ type: 'NAVIGATE', route: 'profile', profile: author })
            }
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() =>
                  dispatch({
                    type: 'NAVIGATE',
                    route: 'profile',
                    profile: author,
                  })
                }
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  color: tokens.colors.textPrimary,
                  fontFamily: tokens.fonts.display,
                  textAlign: 'left',
                }}
              >
                {author.name}
              </button>
              <span
                style={{ fontSize: 12, color: tokens.colors.textTertiary }}
              >
                · {formatRelativeTime(post.timestamp)}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: tokens.colors.textSecondary,
                margin: 0,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {author.headline}
            </p>
          </div>
          <button
            aria-label="More options"
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.textTertiary,
              fontSize: 20,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: tokens.radii.sm,
              alignSelf: 'flex-start',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = tokens.colors.textSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = tokens.colors.textTertiary;
            }}
          >
            ···
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: tokens.colors.textPrimary,
            fontFamily: tokens.fonts.body,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {displayContent}
          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.colors.accent,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 0',
                marginLeft: 4,
                fontFamily: tokens.fonts.body,
              }}
            >
              {isExpanded ? 'Show less' : 'See more'}
            </button>
          )}
        </div>

        {/* Reaction counts */}
        {total > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 14,
              paddingBottom: 12,
              borderBottom: `1px solid ${tokens.colors.border}`,
            }}
          >
            <div style={{ display: 'flex' }}>
              {Object.entries(post.reactions)
                .filter(([, v]) => v > 0)
                .slice(0, 3)
                .map(([type]) => (
                  <span key={type} style={{ fontSize: 14 }}>
                    {REACTION_META[type as ReactionType]?.emoji}
                  </span>
                ))}
            </div>
            <span
              style={{ fontSize: 13, color: tokens.colors.textSecondary }}
            >
              {total.toLocaleString()}
            </span>
            {post.comments > 0 && (
              <span
                style={{
                  fontSize: 13,
                  color: tokens.colors.textSecondary,
                  marginLeft: 'auto',
                }}
              >
                {post.comments} comments
              </span>
            )}
          </div>
        )}

        {/* Action bar */}
        <div
          role="toolbar"
          aria-label="Post actions"
          style={{ display: 'flex', gap: 4, marginTop: 8, position: 'relative' }}
        >
          {/* Like with reaction picker */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => handleReaction('like')}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() =>
                setTimeout(() => {
                  if (!reactionRef.current?.matches(':hover'))
                    setShowReactions(false);
                }, 200)
              }
              aria-label={
                post.userReaction
                  ? `You reacted with ${post.userReaction}`
                  : 'React to this post'
              }
              aria-haspopup="true"
              aria-expanded={showReactions}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                borderRadius: tokens.radii.md,
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: tokens.fonts.body,
                transition: 'all 0.2s',
                color: post.userReaction
                  ? REACTION_META[post.userReaction].color
                  : tokens.colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onMouseOver={(e) => {
                if (!post.userReaction)
                  e.currentTarget.style.background =
                    tokens.colors.bgCardHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {post.userReaction
                ? REACTION_META[post.userReaction].emoji
                : '👍'}{' '}
              {post.userReaction
                ? REACTION_META[post.userReaction].label
                : 'Like'}
            </button>

            {/* Reactions popup */}
            {showReactions && (
              <div
                ref={reactionRef}
                role="menu"
                aria-label="Choose a reaction"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: 8,
                  background: tokens.colors.bgElevated,
                  borderRadius: tokens.radii.xl,
                  border: `1px solid ${tokens.colors.border}`,
                  padding: '8px 12px',
                  display: 'flex',
                  gap: 4,
                  boxShadow: tokens.shadows.lg,
                  animation: reducedMotion ? 'none' : 'popUp 0.2s ease-out',
                  zIndex: 10,
                }}
              >
                {(
                  Object.entries(REACTION_META) as [
                    ReactionType,
                    (typeof REACTION_META)[ReactionType],
                  ][]
                ).map(([type, { emoji, label }]) => (
                  <button
                    key={type}
                    role="menuitem"
                    onClick={() => handleReaction(type)}
                    aria-label={label}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 24,
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: tokens.radii.md,
                      transition: 'all 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scale(1.3) translateY(-4px)';
                      e.currentTarget.style.background =
                        tokens.colors.accentSoft;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <span>{emoji}</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: tokens.colors.textTertiary,
                      }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other actions */}
          {['💬 Comment', '🔄 Repost', '📤 Send'].map((action) => (
            <button
              key={action}
              aria-label={action.split(' ')[1]}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderRadius: tokens.radii.md,
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: tokens.colors.textSecondary,
                fontFamily: tokens.fonts.body,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = tokens.colors.bgCardHover;
                e.currentTarget.style.color = tokens.colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = tokens.colors.textSecondary;
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';
