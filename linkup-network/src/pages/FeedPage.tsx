import { useCallback, useEffect } from 'react';
import { useApp, useAnnounce, useInfiniteScroll } from '@/hooks';
import { api } from '@/api';
import { tokens } from '@/styles/tokens';
import { PostComposer, PostCard } from '@/components';

/** Skeleton loader for feed items */
const FeedSkeleton: React.FC = () => (
  <div aria-label="Loading more posts">
    {[1, 2].map((i) => (
      <div
        key={i}
        style={{
          background: tokens.colors.bgCard,
          borderRadius: tokens.radii.lg,
          border: `1px solid ${tokens.colors.border}`,
          padding: 20,
          marginBottom: 16,
          animation: 'pulse 1.5s infinite',
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: tokens.radii.full,
              background: tokens.colors.bgInput,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: '40%',
                height: 14,
                background: tokens.colors.bgInput,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: '60%',
                height: 12,
                background: tokens.colors.bgInput,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: 12,
            background: tokens.colors.bgInput,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: '85%',
            height: 12,
            background: tokens.colors.bgInput,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: '70%',
            height: 12,
            background: tokens.colors.bgInput,
            borderRadius: 4,
          }}
        />
      </div>
    ))}
  </div>
);

export const FeedPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const announce = useAnnounce();

  const loadMore = useCallback(async () => {
    if (state.feedLoading || !state.feedHasMore) return;
    dispatch({ type: 'FEED_LOADING' });

    try {
      const nextPage = state.feed.length === 0 ? 1 : state.feedPage + 1;
      const res = await api.getFeed(nextPage, 3);
      dispatch({
        type: 'FEED_LOADED',
        posts: res.data,
        page: nextPage,
        hasMore: res.meta.hasMore,
      });
      announce(`Loaded ${res.data.length} new posts`);
    } catch {
      announce('Failed to load posts');
    }
  }, [state.feedLoading, state.feedHasMore, state.feedPage, state.feed.length, dispatch, announce]);

  const sentinelRef = useInfiniteScroll(loadMore, state.feedHasMore, state.feedLoading);

  useEffect(() => {
    if (state.feed.length === 0) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <PostComposer />

      <div role="feed" aria-label="Professional feed" aria-busy={state.feedLoading}>
        {state.feed.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {state.feedLoading && <FeedSkeleton />}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {!state.feedHasMore && state.feed.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            color: tokens.colors.textTertiary,
            fontSize: 14,
            padding: '24px 0',
            fontFamily: tokens.fonts.body,
          }}
        >
          You're all caught up ✓
        </p>
      )}
    </div>
  );
};
