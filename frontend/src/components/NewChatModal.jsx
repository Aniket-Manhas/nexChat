import { useState, useEffect, useRef } from 'react';
import { X, Search, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { Avatar } from './Avatar';

export const NewChatModal = () => {
  const { isNewChatModalOpen, closeNewChatModal, selectUser } = useChat();
  const { isOnline } = useSocket();

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (isNewChatModalOpen) {
      setSearchTerm('');
      setError('');
      fetchUsers('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isNewChatModalOpen]);

  const fetchUsers = async (query) => {
    try {
      setLoading(true);
      setError('');
      const endpoint = query ? `/users?search=${encodeURIComponent(query)}` : '/users';
      const res = await api.get(endpoint);
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNewChatModalOpen) return;
    const timeout = setTimeout(() => {
      fetchUsers(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, isNewChatModalOpen]);

  if (!isNewChatModalOpen) return null;

  const handleStartChat = (user) => {
    selectUser(user);
    closeNewChatModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeNewChatModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        <div className="modal-header">
          <h3 className="modal-title">New Conversation</h3>
          <button
            onClick={closeNewChatModal}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
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
              ref={inputRef}
              type="text"
              className="input"
              style={{ paddingLeft: '32px', height: '38px', fontSize: 'var(--text-sm)' }}
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  color: 'var(--muted-foreground)',
                  padding: '2px',
                }}
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            maxHeight: '360px',
            overflowY: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {error && (
            <div className="alert alert-error" style={{ margin: '8px' }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div
              style={{
                padding: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <Loader2 className="animate-spin" size={18} />
              <span>Finding users...</span>
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
              }}
            >
              {searchTerm ? 'No users found matching your search.' : 'No other users registered yet.'}
            </div>
          ) : (
            users.map((u) => {
              const online = isOnline(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => handleStartChat(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background-color 100ms ease',
                  }}
                  className="btn-ghost"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Avatar
                      src={u.image}
                      name={u.name}
                      username={u.userName}
                      size="md"
                      showStatus
                      isOnline={online}
                    />
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 500,
                          color: 'var(--foreground)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {u.name || u.userName}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        @{u.userName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartChat(u);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <MessageSquare size={13} />
                    <span>Chat</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
