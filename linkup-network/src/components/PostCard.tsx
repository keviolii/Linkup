import { memo, useRef, useState } from 'react';
import type { Post, ReactionType } from '@/types';
import { useApp, useAnnounce, useReducedMotion, useTheme } from '@/hooks';
import { api, MOCK_USERS } from '@/api';
import { formatRelativeTime, REACTION_META, totalReactions } from '@/utils';
import { Avatar } from './Avatar';
import { CommentThread } from './CommentThread';
import { ConfirmDialog } from './ConfirmDialog';

interface PostCardProps {
  post: Post;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = memo(({ post, index }) => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const [showReactions, setShowReactions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const announce = useAnnounce();
  const reducedMotion = useReducedMotion();
  const reactionRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const truncateLength = 280;
  const isLong = post.content.length > truncateLength;
  const displayContent =
    isLong && !isExpanded
      ? post.content.slice(0, truncateLength) + '...'
      : post.content;

  const total = totalReactions(post.reactions as Record<string, number>);
  const author = post.author || MOCK_USERS[0];
  const animDelay = reducedMotion ? 0 : Math.min(index * 80, 400);

  const isOwnPost = post.authorId === state.currentUser.id;
  const isSaved = state.savedPosts.includes(post.id);
  const commentsOpen = state.openComments[post.id];

  const handleReaction = async (type: ReactionType) => {
    dispatch({ type: 'POST_REACTED', postId: post.id, reactionType: type });
    announce(`Reacted with ${REACTION_META[type].label}`);
    setShowReactions(false);
    await api.reactToPost(post.id, type);
  };

  const handleBookmark = () => {
    dispatch({ type: 'TOGGLE_BOOKMARK', postId: post.id });
    announce(isSaved ? 'Post removed from saved' : 'Post saved');
  };

  const handleDelete = async () => {
    setDeleting(true);
    setShowDeleteConfirm(false);
    await api.deletePost(post.id);
    dispatch({ type: 'POST_DELETED', postId: post.id });
    announce('Post deleted');
  };

  return (
    <>
      <article
        aria-label={`Post by ${author.name}`}
        tabIndex={0}
        style={{
          background: colors.bgCard,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          marginBottom: 16,
          overflow: 'hidden',
          transition: deleting ? 'opacity 0.3s, transform 0.3s' : 'border-color 0.2s, box-shadow 0.2s',
          animation: reducedMotion
            ? 'none'
            : `fadeSlideUp 0.5s ease-out ${animDelay}ms both`,
          opacity: deleting ? 0 : 1,
          transform: deleting ? 'scale(0.95)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.borderFocus + '55';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.3))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.accentSoft}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Optimistic sync indicator */}
        {post._optimistic && (
          <div
            style={{
              background: `linear-gradient(90deg, ${colors.accent}22, transparent)`,
              padding: '6px 20px',
              fontSize: 12,
              color: colors.accent,
              borderBottom: `1px solid ${colors.border}`,
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
                    color: colors.textPrimary,
                    fontFamily: "'DM Sans', sans-serif",
                    textAlign: 'left',
                  }}
                >
                  {author.name}
                </button>
                <span
                  style={{ fontSize: 12, color: colors.textTertiary }}
                >
                  · {formatRelativeTime(post.timestamp)}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
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
            {/* More options menu */}
            <div style={{ position: 'relative' }}>
              <button
                aria-label="More options"
                aria-haspopup="true"
                aria-expanded={showMenu}
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textTertiary,
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  alignSelf: 'flex-start',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.textSecondary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textTertiary; }}
              >
                ···
              </button>
              {showMenu && (
                <div
                  ref={menuRef}
                  role="menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: 4,
                    background: colors.bgElevated,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md, 0 4px 16px rgba(0,0,0,0.4))',
                    zIndex: 20,
                    minWidth: 160,
                    overflow: 'hidden',
                    animation: 'popUp 0.15s ease-out',
                  }}
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    role="menuitem"
                    onClick={() => { handleBookmark(); setShowMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: colors.textPrimary,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgCardHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    {isSaved ? '🔖 Unsave' : '🔖 Save post'}
                  </button>
                  {isOwnPost && (
                    <button
                      role="menuitem"
                      onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 14,
                        color: colors.error,
                        fontFamily: "'DM Sans', sans-serif",
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgCardHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      🗑 Delete post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: colors.textPrimary,
              fontFamily: "'DM Sans', sans-serif",
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
                  color: colors.accent,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 0',
                  marginLeft: 4,
                  fontFamily: "'DM Sans', sans-serif",
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
                borderBottom: `1px solid ${colors.border}`,
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
                style={{ fontSize: 13, color: colors.textSecondary }}
              >
                {total.toLocaleString()}
              </span>
              {post.comments > 0 && (
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_COMMENTS', postId: post.id })}
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; }}
                >
                  {post.comments} comments
                </button>
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
                  borderRadius: '12px',
                  padding: '10px 0',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                  color: post.userReaction
                    ? REACTION_META[post.userReaction].color
                    : colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
                onMouseOver={(e) => {
                  if (!post.userReaction)
                    e.currentTarget.style.background = colors.bgCardHover;
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
                    background: colors.bgElevated,
                    borderRadius: '24px',
                    border: `1px solid ${colors.border}`,
                    padding: '8px 12px',
                    display: 'flex',
                    gap: 4,
                    boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5))',
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
                        borderRadius: '12px',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'scale(1.3) translateY(-4px)';
                        e.currentTarget.style.background = colors.accentSoft;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <span>{emoji}</span>
                      <span style={{ fontSize: 10, color: colors.textTertiary }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_COMMENTS', postId: post.id })}
              aria-label="Comment"
              aria-expanded={commentsOpen}
              style={{
                flex: 1,
                background: commentsOpen ? colors.accentSoft : 'none',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: commentsOpen ? colors.accent : colors.textSecondary,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (!commentsOpen) {
                  e.currentTarget.style.background = colors.bgCardHover;
                  e.currentTarget.style.color = colors.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (!commentsOpen) {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = colors.textSecondary;
                }
              }}
            >
              💬 Comment
            </button>

            {/* Repost */}
            <button
              aria-label="Repost"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: colors.textSecondary,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.bgCardHover;
                e.currentTarget.style.color = colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              🔄 Repost
            </button>

            {/* Save/Bookmark */}
            <button
              onClick={handleBookmark}
              aria-label={isSaved ? 'Remove bookmark' : 'Save post'}
              style={{
                flex: 1,
                background: isSaved ? colors.accentSoft : 'none',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: isSaved ? colors.accent : colors.textSecondary,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.background = colors.bgCardHover;
                  e.currentTarget.style.color = colors.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = colors.textSecondary;
                }
              }}
            >
              {isSaved ? '🔖 Saved' : '🔖 Save'}
            </button>
          </div>
        </div>

        {/* Comment thread */}
        {commentsOpen && <CommentThread postId={post.id} />}
      </article>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete post?"
          message="This action cannot be undone. Your post will be permanently removed."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          destructive
        />
      )}
    </>
  );
});

PostCard.displayName = 'PostCard';
