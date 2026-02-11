import { memo } from 'react';
import { tokens } from '@/styles/tokens';

/** Skip-to-content link for keyboard users */
export const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    style={{
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      zIndex: 9999,
      padding: '12px 24px',
      background: tokens.colors.accent,
      color: '#fff',
      borderRadius: tokens.radii.md,
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'all 0.2s',
    }}
    onFocus={(e) => {
      const t = e.currentTarget;
      t.style.left = '16px';
      t.style.top = '16px';
      t.style.width = 'auto';
      t.style.height = 'auto';
    }}
    onBlur={(e) => {
      const t = e.currentTarget;
      t.style.left = '-9999px';
      t.style.width = '1px';
      t.style.height = '1px';
    }}
  >
    Skip to main content
  </a>
);

/** ARIA live region — announces dynamic changes to screen readers */
export const LiveRegion: React.FC<{ announcements: string[] }> = memo(
  ({ announcements }) => (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {announcements[announcements.length - 1] || ''}
    </div>
  ),
);

LiveRegion.displayName = 'LiveRegion';
