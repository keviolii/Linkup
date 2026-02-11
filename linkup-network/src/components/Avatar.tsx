import { memo } from 'react';
import type { User } from '@/types';
import { tokens } from '@/styles/tokens';
import { getInitials } from '@/utils';

interface AvatarProps {
  user: User;
  size?: number;
  onClick?: () => void;
  tabIndex?: number;
}

export const Avatar: React.FC<AvatarProps> = memo(
  ({ user, size = 48, onClick, tabIndex }) => {
    const initials = getInitials(user.name);

    return (
      <button
        onClick={onClick}
        tabIndex={tabIndex}
        aria-label={`View ${user.name}'s profile`}
        style={{
          width: size,
          height: size,
          borderRadius: tokens.radii.full,
          border: 'none',
          background: `linear-gradient(135deg, ${user.coverColor}, ${user.coverColor}88)`,
          color: '#fff',
          fontSize: size * 0.36,
          fontWeight: 700,
          fontFamily: tokens.fonts.display,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = tokens.shadows.glow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {initials}
      </button>
    );
  },
);

Avatar.displayName = 'Avatar';
