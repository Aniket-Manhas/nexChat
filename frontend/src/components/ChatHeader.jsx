import { ArrowLeft, MoreVertical, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { Avatar } from './Avatar';

export const ChatHeader = ({ onToggleDetails }) => {
  const { activeUser, closeMobileChat } = useChat();
  const { isOnline } = useSocket();

  if (!activeUser) return null;

  const online = isOnline(activeUser._id);

  return (
    <header
      style={{
        height: '60px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Mobile back button */}
        <button
          onClick={closeMobileChat}
          className="btn-icon"
          style={{ display: 'none' }}
          id="chat-back-button"
          title="Back to conversations"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        <Avatar
          src={activeUser.image}
          name={activeUser.name}
          username={activeUser.userName}
          size="md"
          showStatus
          isOnline={online}
        />

        <div style={{ minWidth: 0, textAlign: 'left' }}>
          <h2
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--foreground)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {activeUser.name || activeUser.userName}
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-xs)',
              color: 'var(--muted-foreground)',
            }}
          >
            <span>@{activeUser.userName}</span>
            <span>•</span>
            <span
              style={{
                color: online ? 'var(--color-online)' : 'var(--muted-foreground)',
                fontWeight: online ? 500 : 400,
              }}
            >
              {online ? 'Active now' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {onToggleDetails && (
          <button
            onClick={onToggleDetails}
            className="btn-icon"
            title="Conversation info"
            aria-label="Conversation info"
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #chat-back-button {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
