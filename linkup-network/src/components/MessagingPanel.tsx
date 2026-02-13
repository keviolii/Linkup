import { memo, useState, useEffect, useRef } from 'react';
import { useApp, useAnnounce, useTheme } from '@/hooks';
import { api, MOCK_USERS } from '@/api';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '@/utils';

export const MessagingPanel: React.FC = memo(() => {
  const { state, dispatch } = useApp();
  const { colors } = useTheme();
  const announce = useAnnounce();
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, activeConversation, messagingOpen, messagesByConversation, currentUser } = state;

  // Load conversations on mount
  useEffect(() => {
    if (conversations.length === 0) {
      api.getConversations().then((res) => {
        dispatch({ type: 'CONVERSATIONS_LOADED', conversations: res.data });
      });
    }
  }, [conversations.length, dispatch]);

  // Load messages when conversation is opened
  useEffect(() => {
    if (activeConversation && !messagesByConversation[activeConversation]) {
      api.getMessages(activeConversation).then((res) => {
        dispatch({ type: 'MESSAGES_LOADED', conversationId: activeConversation, messages: res.data });
      });
    }
  }, [activeConversation, messagesByConversation, dispatch]);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByConversation, activeConversation]);

  if (!messagingOpen) {
    return (
      <button
        onClick={() => dispatch({ type: 'TOGGLE_MESSAGING' })}
        aria-label="Open messaging"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 500,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.accent}, #a78bfa)`,
          border: 'none',
          color: '#fff',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        💬
      </button>
    );
  }

  const handleSend = async () => {
    if (!msgInput.trim() || !activeConversation) return;
    const content = msgInput.trim();
    setMsgInput('');

    const res = await api.sendMessage(activeConversation, content, currentUser.id);
    dispatch({ type: 'MESSAGE_SENT', conversationId: activeConversation, message: res.data });
    announce('Message sent');
  };

  const activeConv = conversations.find((c) => c.id === activeConversation);
  const otherUserId = activeConv?.participantIds.find((id) => id !== currentUser.id);
  const otherUser = MOCK_USERS.find((u) => u.id === otherUserId);
  const messages = activeConversation ? (messagesByConversation[activeConversation] || []) : [];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 500,
        width: 360,
        height: 480,
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5))',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeSlideUp 0.3s ease-out',
      }}
      role="complementary"
      aria-label="Messaging"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bgElevated,
        }}
      >
        {activeConversation && (
          <button
            onClick={() => dispatch({ type: 'CLOSE_CHAT' })}
            aria-label="Back to conversations"
            style={{
              background: 'none',
              border: 'none',
              color: colors.textSecondary,
              fontSize: 18,
              cursor: 'pointer',
              padding: '0 8px 0 0',
            }}
          >
            ←
          </button>
        )}
        <h3 style={{ flex: 1, fontSize: 15, fontWeight: 700, color: colors.textPrimary, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          {activeConversation && otherUser ? otherUser.name : 'Messaging'}
        </h3>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_MESSAGING' })}
          aria-label="Close messaging"
          style={{
            background: 'none',
            border: 'none',
            color: colors.textTertiary,
            fontSize: 18,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      {!activeConversation ? (
        // Conversation list
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 && (
            <p style={{ padding: 20, fontSize: 14, color: colors.textTertiary, textAlign: 'center' }}>
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            const partnerId = conv.participantIds.find((id) => id !== currentUser.id);
            const partner = MOCK_USERS.find((u) => u.id === partnerId);
            if (!partner) return null;

            return (
              <button
                key={conv.id}
                onClick={() => dispatch({ type: 'OPEN_CHAT', conversationId: conv.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgCardHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Avatar user={partner} size={40} tabIndex={-1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary }}>
                      {partner.name}
                    </span>
                    {conv.lastMessage && (
                      <span style={{ fontSize: 11, color: colors.textTertiary }}>
                        {formatRelativeTime(conv.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p style={{ fontSize: 12, color: colors.textSecondary, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}{conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: '10px',
                      background: colors.accent,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 6px',
                    }}
                  >
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        // Active chat
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '8px 14px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMe
                        ? `linear-gradient(135deg, ${colors.accent}, #a78bfa)`
                        : colors.bgInput,
                      color: isMe ? '#fff' : colors.textPrimary,
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                    <div
                      style={{
                        fontSize: 10,
                        marginTop: 4,
                        opacity: 0.7,
                        textAlign: 'right',
                      }}
                    >
                      {formatRelativeTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 16px',
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Write a message..."
              aria-label="Write a message"
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                background: colors.bgInput,
                color: colors.textPrimary,
                fontSize: 14,
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = colors.borderFocus; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }}
            />
            <button
              onClick={handleSend}
              disabled={!msgInput.trim()}
              aria-label="Send message"
              style={{
                background: msgInput.trim() ? colors.accent : colors.bgInput,
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: msgInput.trim() ? '#fff' : colors.textTertiary,
                fontSize: 16,
                cursor: msgInput.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
});

MessagingPanel.displayName = 'MessagingPanel';
