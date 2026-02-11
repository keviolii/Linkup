import type { Post, ReactionType, PaginatedResponse, SingleResponse, User } from '@/types';
import { MOCK_USERS, generatePosts } from './data';
import { delay } from '@/utils';

// ═══════════════════════════════════════════════════════════
// Mock REST API Service
// Simulates real REST endpoints with realistic network latency.
// In production this would be replaced by MSW handlers or
// actual fetch calls — the interface stays identical.
// ═══════════════════════════════════════════════════════════

class MockAPIService {
  private posts: Post[];
  private nextId = 100;

  constructor() {
    this.posts = generatePosts();
  }

  /** GET /api/feed?page=N&limit=N */
  async getFeed(page = 1, limit = 3): Promise<PaginatedResponse<Post>> {
    await delay(400 + Math.random() * 300);

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = this.posts.slice(start, end).map((p) => ({
      ...p,
      author: MOCK_USERS.find((u) => u.id === p.authorId),
    }));

    return {
      data: items,
      meta: {
        page,
        limit,
        total: this.posts.length,
        hasMore: end < this.posts.length,
      },
    };
  }

  /** GET /api/users/:id */
  async getUser(userId: string): Promise<SingleResponse<User>> {
    await delay(200 + Math.random() * 200);
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return { data: user };
  }

  /** POST /api/posts */
  async createPost(
    content: string,
    authorId: string,
  ): Promise<SingleResponse<Post>> {
    await delay(300 + Math.random() * 200);

    const newPost: Post = {
      id: `p${this.nextId++}`,
      authorId,
      content,
      timestamp: Date.now(),
      reactions: { like: 0, celebrate: 0, insightful: 0 },
      comments: 0,
      reposts: 0,
    };

    this.posts = [newPost, ...this.posts];

    return {
      data: {
        ...newPost,
        author: MOCK_USERS.find((u) => u.id === authorId),
      },
    };
  }

  /** POST /api/posts/:id/react */
  async reactToPost(
    postId: string,
    reactionType: ReactionType,
  ): Promise<SingleResponse<{ postId: string; reactionType: ReactionType; count: number }>> {
    await delay(150);

    const post = this.posts.find((p) => p.id === postId);
    if (post && post.reactions[reactionType] !== undefined) {
      post.reactions[reactionType] = (post.reactions[reactionType] ?? 0) + 1;
    }

    return {
      data: {
        postId,
        reactionType,
        count: post?.reactions[reactionType] ?? 0,
      },
    };
  }

  /** POST /api/posts/:id/comment */
  async addComment(
    postId: string,
  ): Promise<SingleResponse<{ postId: string; comments: number }>> {
    await delay(200);

    const post = this.posts.find((p) => p.id === postId);
    if (post) post.comments++;

    return { data: { postId, comments: post?.comments ?? 0 } };
  }
}

/** Singleton API instance */
export const api = new MockAPIService();
