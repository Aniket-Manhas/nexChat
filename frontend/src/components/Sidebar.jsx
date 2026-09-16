import { useState, useMemo } from 'react';
import {
  MessageSquarePlus,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  X,
  MessageSquareDashed,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '../utils/format';

export const Sidebar = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isOnline } = useSocket();
  const {
    conversations,
    loadingConversations,
    activeUser,
    selectUser,
    openNewChatModal,
    openProfileModal,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((conv) => {
      const peer = conv.otherParticipant;
      if (!peer) return false;
      const nameMatch = peer.name?.toLowerCase().includes(query);
      const usernameMatch = peer.userName?.toLowerCase().includes(query);
      const lastMsgMatch = conv.lastMessage?.message?.toLowerCase().includes(query);
      return nameMatch || usernameMatch || lastMsgMatch;
    });
  }, [conversations, searchQuery]);

  return (
    <aside
      className={`chat-sidebar ${className}`}
      style={{
        width: '100%',
        maxWidth: '340px',
        minWidth: '280px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* User Header */}
      <header
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div
          onClick={openProfileModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            flex: 1,
            minWidth: 0,
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            transition: 'background-color 150ms',
          }}
          className="btn-ghost"
          title="Click to view/edit profile"
        >
          <Avatar
            src={user?.image}
            name={user?.name}
            username={user?.userName}
            size="md"
            showStatus
            isOnline={true}
          />
          <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--foreground)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || user?.userName}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              @{user?.userName}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={openNewChatModal}
            className="btn-icon"
            title="Start new conversation"
            aria-label="Start new conversation"
          >
            <MessageSquarePlus size={18} />
          </button>
          <button
            onClick={openProfileModal}
            className="btn-icon"
            title="Account Settings"
            aria-label="Account Settings"
          >
            <User size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={logout}
            className="btn-icon"
            style={{ color: 'var(--color-danger)' }}
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              color: 'var(--muted-foreground)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="input"
            style={{
              paddingLeft: '32px',
              paddingRight: searchQuery ? '32px' : '12px',
              fontSize: 'var(--text-sm)',
              height: '36px',
            }}
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                color: 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loadingConversations ? (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--muted)',
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      height: '14px',
                      width: '50%',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--muted)',
                    }}
                  />
                  <div
                    style={{
                      height: '12px',
                      width: '80%',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--muted)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
            }}
          >
            <MessageSquareDashed size={36} style={{ marginBottom: '12px', strokeWidth: 1.5 }} />
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: '4px',
              }}
            >
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', marginBottom: '16px', lineHeight: 1.4 }}>
              {searchQuery
                ? 'Try a different search query or start a new chat.'
                : 'Connect with other users by starting a direct conversation.'}
            </p>
            <button onClick={openNewChatModal} className="btn btn-primary btn-sm">
              <MessageSquarePlus size={14} />
              Start a chat
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredConversations.map((conv) => {
              const peer = conv.otherParticipant;
              if (!peer) return null;
              const isSelected = activeUser?._id?.toString() === peer._id?.toString();
              const online = isOnline(peer._id);
              const lastMsg = conv.lastMessage;
              const formattedTime = formatRelativeTime(lastMsg?.createdAt || conv.updatedAt);

              return (
                <div
                  key={conv._id || peer._id}
                  onClick={() => selectUser(peer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--surface-hover)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'background-color 100ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Avatar
                    src={peer.image}
                    name={peer.name}
                    username={peer.userName}
                    size="md"
                    showStatus
                    isOnline={online}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: isSelected ? 600 : 500,
                          color: 'var(--foreground)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {peer.name || peer.userName}
                      </span>
                      {formattedTime && (
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--muted-foreground)',
                            flexShrink: 0,
                            marginLeft: '8px',
                          }}
                        >
                          {formattedTime}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--muted-foreground)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {lastMsg?.image && <ImageIcon size={13} style={{ flexShrink: 0 }} />}
                      <span>
                        {lastMsg
                          ? lastMsg.message || (lastMsg.image ? 'Photo' : '')
                          : 'No messages yet'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
