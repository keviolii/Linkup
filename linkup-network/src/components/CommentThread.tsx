import { memo, useState, useEffect } from 'react';
import type { Comment } from '@/types';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { api, MOCK_USERS } from '@/api';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '@/utils';

interface CommentThreadProps {
  postId: string;
}

export const CommentThread: React.FC<CommentThreadProps> = memo(({ postId }) => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const comments = state.commentsByPost[postId] || [];

  useEffect(() => {
    if (comments.length === 0 && !loading) {
      setLoading(true);
      api.getComments(postId).then((res) => {
        dispatch({ type: 'COMMENTS_LOADED', postId, comments: res.data });
        setLoading(false);
      });
    }
  }, [postId, comments.length, dispatch, loading]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    const res = await api.addComment(postId, newComment.trim(), state.currentUser.id);
    dispatch({ type: 'COMMENT_ADDED', postId, comment: res.data });
    announce('Comment posted');
    setNewComment('');
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    const res = await api.addComment(postId, replyContent.trim(), state.currentUser.id, parentId);
    dispatch({ type: 'COMMENT_ADDED', postId, comment: res.data });
    announce('Reply posted');
    setReplyContent('');
    setReplyTo(null);
  };

  const topLevel = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const renderComment = (comment: Comment, depth = 0) => {
    const author = comment.author || MOCK_USERS.find((u) => u.id === comment.authorId) || MOCK_USERS[0];
    const replies = getReplies(comment.id);
    const isCollapsed = collapsed[comment.id];

    return (
      <div
        key={comment.id}
        style={{
          marginLeft: depth > 0 ? 24 : 0,
          borderLeft: depth > 0 ? `2px solid ${colors.border}` : 'none',
          paddingLeft: depth > 0 ? 16 : 0,
          marginTop: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <Avatar user={author} size={32} onClick={() => dispatch({ type: 'NAVIGATE', route: 'profile', profile: author })} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                background: colors.bgInput,
                borderRadius: '12px',
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                  {author.name}
                </span>
                <span style={{ fontSize: 11, color: colors.textTertiary }}>
                  {formatRelativeTime(comment.timestamp)}
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: colors.textPrimary, margin: 0, wordBreak: 'break-word' }}>
                {comment.content}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 4, paddingLeft: 8 }}>
              <button
                onClick={() => {
                  setReplyTo(replyTo === comment.id ? null : comment.id);
                  setReplyContent('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.accent,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reply
              </button>
              {replies.length > 0 && (
                <button
                  onClick={() => setCollapsed({ ...collapsed, [comment.id]: !isCollapsed })}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    color: colors.textTertiary,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {isCollapsed ? `Show ${replies.length} replies` : `Hide replies`}
                </button>
              )}
            </div>
            {replyTo === comment.id && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleReply(comment.id); }}
                  placeholder={`Reply to ${author.name}...`}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${colors.border}`,
                    background: colors.bgInput,
                    color: colors.textPrimary,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyContent.trim()}
                  style={{
                    background: replyContent.trim() ? colors.accent : colors.bgInput,
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: replyContent.trim() ? '#fff' : colors.textTertiary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: replyContent.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  Reply
                </button>
              </div>
            )}
            {!isCollapsed && replies.map((r) => renderComment(r, depth + 1))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '16px 20px 20px',
        borderTop: `1px solid ${colors.border}`,
        animation: 'slideDown 0.25s ease-out',
      }}
    >
      {/* Comment input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Avatar user={state.currentUser} size={32} tabIndex={-1} />
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${colors.border}`,
            background: colors.bgInput,
            color: colors.textPrimary,
            fontSize: 14,
            outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = colors.borderFocus; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }}
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          aria-label="Post comment"
          style={{
            background: newComment.trim() ? colors.accent : colors.bgInput,
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            color: newComment.trim() ? '#fff' : colors.textTertiary,
            fontSize: 13,
            fontWeight: 600,
            cursor: newComment.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          Post
        </button>
      </div>

      {loading && (
        <p style={{ fontSize: 13, color: colors.textTertiary, textAlign: 'center', padding: 12 }}>
          Loading comments...
        </p>
      )}

      {topLevel.map((c) => renderComment(c))}
    </div>
  );
});

CommentThread.displayName = 'CommentThread';
