import { useApp, useTheme } from '@/hooks';
import { PostCard } from '@/components';

export const SavedPage: React.FC = () => {
  const { state } = useApp();
  const { colors } = useTheme();

  const savedPosts = state.feed.filter((p) => state.savedPosts.includes(p.id));

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 24,
          color: colors.textPrimary,
        }}
      >
        Saved Posts
      </h1>

      {savedPosts.length === 0 ? (
        <div
          style={{
            background: colors.bgCard,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔖</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
            No saved posts yet
          </h2>
          <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
            Save posts you want to revisit later by clicking the bookmark icon.
          </p>
        </div>
      ) : (
        <div role="feed" aria-label="Saved posts">
          {savedPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
