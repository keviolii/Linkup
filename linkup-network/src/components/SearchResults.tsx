import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { Avatar } from './Avatar';

export const SearchResults: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = state.searchResults;
  if (!results || !state.searchOpen) return null;

  const allItems: Array<{ type: 'user' | 'post'; id: string }> = [
    ...results.users.map((u) => ({ type: 'user' as const, id: u.id })),
    ...results.posts.map((p) => ({ type: 'post' as const, id: p.id })),
  ];

  const totalItems = allItems.length;

  const handleSelect = useCallback(
    (item: { type: 'user' | 'post'; id: string }) => {
      if (item.type === 'user') {
        const user = results.users.find((u) => u.id === item.id);
        if (user) {
          dispatch({ type: 'NAVIGATE', route: 'profile', profile: user });
          announce(`Viewing ${user.name}'s profile`);
        }
      } else {
        dispatch({ type: 'CLOSE_SEARCH' });
        announce('Scrolling to post');
      }
    },
    [results, dispatch, announce],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!state.searchOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(allItems[activeIndex]);
      } else if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_SEARCH' });
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  if (results.users.length === 0 && results.posts.length === 0) {
    return (
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 8,
          background: colors.bgElevated,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: 20,
          boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5))',
          zIndex: 200,
          animation: 'slideDown 0.2s ease-out',
        }}
      >
        <p style={{ fontSize: 14, color: colors.textTertiary, textAlign: 'center', margin: 0 }}>
          No results for "{state.searchQuery}"
        </p>
      </div>
    );
  }

  let idx = -1;

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Search results"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 8,
        background: colors.bgElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        maxHeight: 400,
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5))',
        zIndex: 200,
        animation: 'slideDown 0.2s ease-out',
      }}
    >
      {results.users.length > 0 && (
        <div>
          <div style={{ padding: '12px 16px 6px', fontSize: 11, fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            People
          </div>
          {results.users.map((user) => {
            idx++;
            const thisIdx = idx;
            return (
              <button
                key={user.id}
                role="option"
                aria-selected={activeIndex === thisIdx}
                onClick={() => handleSelect({ type: 'user', id: user.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 16px',
                  background: activeIndex === thisIdx ? colors.accentSoft : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={() => setActiveIndex(thisIdx)}
              >
                <Avatar user={user} size={36} tabIndex={-1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textTertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.headline.split('\u2022')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {results.posts.length > 0 && (
        <div>
          <div
            style={{
              padding: '12px 16px 6px',
              fontSize: 11,
              fontWeight: 700,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderTop: results.users.length > 0 ? `1px solid ${colors.border}` : 'none',
            }}
          >
            Posts
          </div>
          {results.posts.map((post) => {
            idx++;
            const thisIdx = idx;
            const author = post.author;
            return (
              <button
                key={post.id}
                role="option"
                aria-selected={activeIndex === thisIdx}
                onClick={() => handleSelect({ type: 'post', id: post.id })}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  width: '100%',
                  padding: '10px 16px',
                  background: activeIndex === thisIdx ? colors.accentSoft : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={() => setActiveIndex(thisIdx)}
              >
                <span style={{ fontSize: 18, marginTop: 2 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 2 }}>
                    {author?.name}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.content.slice(0, 80)}...
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';
