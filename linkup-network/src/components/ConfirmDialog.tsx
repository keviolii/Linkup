import { memo, useRef } from 'react';
import { useFocusTrap, useTheme } from '@/hooks';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = memo(
  ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, destructive = false }) => {
    const { colors } = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    useFocusTrap(ref, true);

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeSlideUp 0.2s ease-out',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        role="presentation"
      >
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          style={{
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            padding: 24,
            maxWidth: 400,
            width: '90%',
            boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5))',
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
        >
          <h2
            id="confirm-title"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.textPrimary,
              fontFamily: "'DM Sans', sans-serif",
              margin: '0 0 8px',
            }}
          >
            {title}
          </h2>
          <p
            id="confirm-message"
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            {message}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '8px 20px',
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgCardHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              style={{
                background: destructive ? colors.error : colors.accent,
                border: 'none',
                borderRadius: '20px',
                padding: '8px 20px',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';
