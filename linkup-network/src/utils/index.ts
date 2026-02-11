import type { ReactionType } from '@/types';

/**
 * Format a timestamp into a relative time string (e.g. "2h", "3d")
 */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}d`;
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

/**
 * Reaction metadata map
 */
export const REACTION_META: Record<
  ReactionType,
  { emoji: string; label: string; color: string }
> = {
  like: { emoji: '👍', label: 'Like', color: '#ef4444' },
  celebrate: { emoji: '🎉', label: 'Celebrate', color: '#fbbf24' },
  support: { emoji: '💜', label: 'Support', color: '#a78bfa' },
  insightful: { emoji: '💡', label: 'Insightful', color: '#38bdf8' },
};

/**
 * Sum all reaction counts on a post
 */
export function totalReactions(reactions: Record<string, number>): number {
  return Object.values(reactions).reduce((a, b) => a + b, 0);
}

/**
 * Promised delay (for simulating network latency)
 */
export const delay = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));
