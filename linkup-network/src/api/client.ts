import type { Post, ReactionType, PaginatedResponse, SingleResponse, User, Comment, Message, Conversation, Notification, SearchResults, ConnectionRequest } from '@/types';
import { MOCK_USERS, generatePosts, generateComments, generateMessages, generateConversations, generateNotifications } from './data';
import { delay } from '@/utils';

// ═══════════════════════════════════════════════════════════
// Mock REST API Service
// ═══════════════════════════════════════════════════════════

class MockAPIService {
  private posts: Post[];
  private comments: Comment[];
  private messages: Message[];
  private conversations: Conversation[];
  private notifications: Notification[];
  private connections: Set<string> = new Set();
  private pendingRequests: ConnectionRequest[] = [];
  private nextId = 100;
  private nextCommentId = 100;
  private nextMessageId = 100;
  private nextNotifId = 100;
  private nextRequestId = 100;

  constructor() {
    this.posts = generatePosts();
    this.comments = generateComments();
    this.messages = generateMessages();
    this.conversations = generateConversations();
    this.notifications = generateNotifications();
  }

  // ─── Feed ──────────────────────────────────────────────

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

  // ─── Users ─────────────────────────────────────────────

  async getUser(userId: string): Promise<SingleResponse<User>> {
    await delay(200 + Math.random() * 200);
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return { data: user };
  }

  // ─── Posts ─────────────────────────────────────────────

  async createPost(content: string, authorId: string): Promise<SingleResponse<Post>> {
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

  async deletePost(postId: string): Promise<SingleResponse<{ postId: string }>> {
    await delay(200);
    this.posts = this.posts.filter((p) => p.id !== postId);
    this.comments = this.comments.filter((c) => c.postId !== postId);
    return { data: { postId } };
  }

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

  // ─── Comments ──────────────────────────────────────────

  async getComments(postId: string): Promise<SingleResponse<Comment[]>> {
    await delay(300 + Math.random() * 200);
    const postComments = this.comments
      .filter((c) => c.postId === postId)
      .map((c) => ({
        ...c,
        author: MOCK_USERS.find((u) => u.id === c.authorId),
      }));
    return { data: postComments };
  }

  async addComment(postId: string, content: string, authorId: string, parentId: string | null = null): Promise<SingleResponse<Comment>> {
    await delay(200);

    const newComment: Comment = {
      id: `c${this.nextCommentId++}`,
      authorId,
      postId,
      content,
      timestamp: Date.now(),
      parentId,
      author: MOCK_USERS.find((u) => u.id === authorId),
    };

    this.comments.push(newComment);

    const post = this.posts.find((p) => p.id === postId);
    if (post) post.comments++;

    return { data: newComment };
  }

  // ─── Search ────────────────────────────────────────────

  async search(query: string): Promise<SingleResponse<SearchResults>> {
    await delay(200 + Math.random() * 150);

    const q = query.toLowerCase();
    const users = MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.headline.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)),
    );

    const posts = this.posts
      .filter((p) => p.content.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => ({
        ...p,
        author: MOCK_USERS.find((u) => u.id === p.authorId),
      }));

    return { data: { users, posts } };
  }

  // ─── Messaging ─────────────────────────────────────────

  async getConversations(): Promise<SingleResponse<Conversation[]>> {
    await delay(200);
    return { data: this.conversations };
  }

  async getMessages(conversationId: string): Promise<SingleResponse<Message[]>> {
    await delay(200);
    const msgs = this.messages.filter((m) => m.conversationId === conversationId);
    return { data: msgs };
  }

  async sendMessage(conversationId: string, content: string, senderId: string): Promise<SingleResponse<Message>> {
    await delay(150);

    const newMessage: Message = {
      id: `m${this.nextMessageId++}`,
      conversationId,
      senderId,
      content,
      timestamp: Date.now(),
    };

    this.messages.push(newMessage);

    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) conv.lastMessage = newMessage;

    return { data: newMessage };
  }

  async getOrCreateConversation(userId1: string, userId2: string): Promise<SingleResponse<Conversation>> {
    await delay(100);

    const existing = this.conversations.find(
      (c) => c.participantIds.includes(userId1) && c.participantIds.includes(userId2),
    );

    if (existing) return { data: existing };

    const newConv: Conversation = {
      id: `conv${this.nextId++}`,
      participantIds: [userId1, userId2],
      unreadCount: 0,
    };

    this.conversations.push(newConv);
    return { data: newConv };
  }

  // ─── Connections ───────────────────────────────────────

  async sendConnectionRequest(fromUserId: string, toUserId: string): Promise<SingleResponse<ConnectionRequest>> {
    await delay(200);

    const request: ConnectionRequest = {
      id: `req${this.nextRequestId++}`,
      fromUserId,
      toUserId,
      timestamp: Date.now(),
    };

    this.pendingRequests.push(request);
    return { data: request };
  }

  async acceptConnectionRequest(requestId: string): Promise<SingleResponse<{ requestId: string; userId: string }>> {
    await delay(200);

    const request = this.pendingRequests.find((r) => r.id === requestId);
    if (!request) throw new Error('Request not found');

    this.pendingRequests = this.pendingRequests.filter((r) => r.id !== requestId);
    this.connections.add(request.fromUserId);

    return { data: { requestId, userId: request.fromUserId } };
  }

  async removeConnection(userId: string): Promise<SingleResponse<{ userId: string }>> {
    await delay(150);
    this.connections.delete(userId);
    return { data: { userId } };
  }

  async getConnections(): Promise<SingleResponse<{ connections: string[]; requests: ConnectionRequest[] }>> {
    await delay(200);
    return {
      data: {
        connections: Array.from(this.connections),
        requests: this.pendingRequests,
      },
    };
  }

  // ─── Notifications ─────────────────────────────────────

  async getNotifications(): Promise<SingleResponse<Notification[]>> {
    await delay(200);
    const notifs = this.notifications.map((n) => ({
      ...n,
      fromUser: MOCK_USERS.find((u) => u.id === n.fromUserId),
    }));
    return { data: notifs };
  }

  async addNotification(notification: Omit<Notification, 'id'>): Promise<SingleResponse<Notification>> {
    await delay(100);
    const newNotif: Notification = {
      ...notification,
      id: `n${this.nextNotifId++}`,
      fromUser: MOCK_USERS.find((u) => u.id === notification.fromUserId),
    };
    this.notifications = [newNotif, ...this.notifications];
    return { data: newNotif };
  }

  async markNotificationRead(notificationId: string): Promise<SingleResponse<{ notificationId: string }>> {
    await delay(100);
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (notif) notif.read = true;
    return { data: { notificationId } };
  }

  async markAllNotificationsRead(): Promise<SingleResponse<{ count: number }>> {
    await delay(100);
    let count = 0;
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        count++;
      }
    });
    return { data: { count } };
  }
}

/** Singleton API instance */
export const api = new MockAPIService();
