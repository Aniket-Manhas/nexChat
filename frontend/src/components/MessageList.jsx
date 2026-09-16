import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatDateDivider, formatTime } from '../utils/format';
import { Avatar } from './Avatar';

export const MessageList = () => {
  const { user } = useAuth();
  const {
    activeUser,
    messages,
    loadingMessages,
    loadingMore,
    hasMore,
    loadMoreMessages,
    openLightbox,
  } = useChat();

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const prevMessagesLength = useRef(0);

  useEffect(() => {
    if (!scrollRef.current) return;

    const isInitialLoad = prevMessagesLength.current === 0 && messages.length > 0;
    const isNewMessage = messages.length > prevMessagesLength.current && !loadingMore;

    if (isInitialLoad || isNewMessage) {
      bottomRef.current?.scrollIntoView({ behavior: isInitialLoad ? 'auto' : 'smooth' });
    }

    prevMessagesLength.current = messages.length;
  }, [messages, loadingMore]);

  if (loadingMessages) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--background)',
          color: 'var(--muted-foreground)',
          gap: '8px',
          fontSize: 'var(--text-sm)',
        }}
      >
        <Loader2 className="animate-spin" size={20} />
        <span>Loading messages...</span>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background)',
      }}
    >
      {/* Load More Button */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            onClick={loadMoreMessages}
            disabled={loadingMore}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {loadingMore ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>Loading earlier messages...</span>
              </>
            ) : (
              'Load earlier messages'
            )}
          </button>
        </div>
      )}

      {/* Empty conversation placeholder */}
      {messages.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--muted-foreground)',
          }}
        >
          <Avatar
            src={activeUser?.image}
            name={activeUser?.name}
            username={activeUser?.userName}
            size="lg"
            className="mb-3"
          />
          <div
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginTop: '12px',
              marginBottom: '4px',
            }}
          >
            {activeUser?.name || activeUser?.userName}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', maxWidth: '320px', lineHeight: 1.4 }}>
            This is the start of your direct conversation with @{activeUser?.userName}. Send a
            message to connect!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, index) => {
            const senderId =
              typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
            const isMe = senderId?.toString() === user?._id?.toString();

            const currentDateDivider = formatDateDivider(msg.createdAt);
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const prevDateDivider = prevMsg ? formatDateDivider(prevMsg.createdAt) : null;
            const showDateDivider = currentDateDivider !== prevDateDivider;

            const prevSenderId =
              prevMsg && (typeof prevMsg.sender === 'object' ? prevMsg.sender?._id : prevMsg.sender);
            const isConsecutive =
              prevMsg &&
              prevSenderId?.toString() === senderId?.toString() &&
              !showDateDivider &&
              new Date(msg.createdAt) - new Date(prevMsg.createdAt) < 5 * 60 * 1000;

            return (
              <div key={msg._id || index} style={{ display: 'flex', flexDirection: 'column' }}>
                {showDateDivider && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '16px 0 12px 0',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 500,
                      }}
                    >
                      {currentDateDivider}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: '8px',
                    marginTop: isConsecutive ? '3px' : '10px',
                  }}
                >
                  {!isMe && (
                    <div style={{ width: '28px', flexShrink: 0 }}>
                      {!isConsecutive ? (
                        <Avatar
                          src={activeUser?.image}
                          name={activeUser?.name}
                          username={activeUser?.userName}
                          size="xs"
                        />
                      ) : null}
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        padding: msg.image && !msg.message ? '4px' : '8px 12px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: isMe
                          ? 'var(--bubble-sent-bg)'
                          : 'var(--bubble-received-bg)',
                        color: isMe ? 'var(--bubble-sent-text)' : 'var(--bubble-received-text)',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xs)',
                        fontSize: 'var(--text-base)',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                      }}
                    >
                      {/* Image Attachment */}
                      {msg.image && (
                        <div
                          style={{
                            marginBottom: msg.message ? '6px' : '0',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onClick={() => openLightbox(msg.image)}
                          title="Click to view full image"
                        >
                          <img
                            src={msg.image}
                            alt="Attachment"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '260px',
                              borderRadius: 'var(--radius-md)',
                              display: 'block',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Text Message */}
                      {msg.message && (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                      )}

                      {/* Timestamp */}
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          marginTop: '4px',
                          textAlign: 'right',
                          color: isMe ? 'var(--bubble-sent-meta)' : 'var(--bubble-received-meta)',
                          userSelect: 'none',
                        }}
                      >
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} style={{ height: '4px' }} />
        </div>
      )}
    </div>
  );
};
