import { memo } from 'react';
import { tokens } from '@/styles/tokens';

export const Footer: React.FC = memo(() => (
  <footer
    role="contentinfo"
    style={{
      maxWidth: 1080,
      margin: '40px auto 0',
      padding: '20px 24px',
      borderTop: `1px solid ${tokens.colors.border}`,
      textAlign: 'center',
    }}
  >
    <p
      style={{
        fontSize: 12,
        color: tokens.colors.textTertiary,
        fontFamily: tokens.fonts.body,
      }}
    >
      LinkUp · Built with React + TypeScript · WCAG 2.1 AA Compliant ·
      Keyboard Navigable · Screen Reader Optimized
    </p>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginTop: 8,
      }}
    >
      {['Accessibility', 'Privacy', 'Terms', 'Help'].map((link) => (
        <button
          key={link}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.textTertiary,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: tokens.fonts.body,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = tokens.colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = tokens.colors.textTertiary;
          }}
        >
          {link}
        </button>
      ))}
    </div>
  </footer>
));

Footer.displayName = 'Footer';
