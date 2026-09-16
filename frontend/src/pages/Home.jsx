import { useState } from 'react';
import { MessageSquare, MessageSquarePlus, X, Mail, AtSign, Calendar } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { Sidebar } from '../components/Sidebar';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { NewChatModal } from '../components/NewChatModal';
import { ProfileModal } from '../components/ProfileModal';
import { ImageLightbox } from '../components/ImageLightbox';
import { Avatar } from '../components/Avatar';

export default function Home() {
  const { activeUser, isMobileChatOpen, openNewChatModal } = useChat();
  const { isOnline } = useSocket();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar Panel */}
      <Sidebar className={isMobileChatOpen ? 'sidebar-hidden' : ''} />

      {/* Main Chat Workspace */}
      <main
        className={`chat-main ${!isMobileChatOpen ? 'chat-hidden' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          backgroundColor: 'var(--background)',
          position: 'relative',
        }}
      >
        {activeUser ? (
          <>
            <ChatHeader onToggleDetails={() => setShowDetails(!showDetails)} />

            <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
              {/* Messages & Input Column */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  height: '100%',
                }}
              >
                <MessageList />
                <MessageInput />
              </div>

              {/* Side Details Drawer (Desktop only, toggled) */}
              {showDetails && (
                <aside
                  style={{
                    width: '280px',
                    borderLeft: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 16px',
                    gap: '16px',
                    overflowY: 'auto',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      User Details
                    </span>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="btn-icon"
                      aria-label="Close details"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                    }}
                  >
                    <Avatar
                      src={activeUser.image}
                      name={activeUser.name}
                      username={activeUser.userName}
                      size="lg"
                      showStatus
                      isOnline={isOnline(activeUser._id)}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 600,
                          color: 'var(--foreground)',
                        }}
                      >
                        {activeUser.name || activeUser.userName}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                        @{activeUser.userName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                      }}
                    >
                      <Mail size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeUser.email || 'Email not shared'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                      }}
                    >
                      <AtSign size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      <span>{activeUser.userName}</span>
                    </div>

                    {activeUser.createdAt && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                        }}
                      >
                        <Calendar size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                        <span>
                          Joined {new Date(activeUser.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </aside>
              )}
            </div>
          </>
        ) : (
          /* Empty Active State */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                marginBottom: '16px',
              }}
            >
              <MessageSquare size={28} />
            </div>

            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}
            >
              Welcome to NexChat
            </h2>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                maxWidth: '380px',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              Select a conversation from the sidebar or start a new direct chat to message in real
              time.
            </p>

            <button onClick={openNewChatModal} className="btn btn-primary">
              <MessageSquarePlus size={16} />
              <span>Start new conversation</span>
            </button>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <NewChatModal />
      <ProfileModal />
      <ImageLightbox />
    </div>
  );
}

