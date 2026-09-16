import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket, joinChat } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const activeUserRef = useRef(activeUser);
  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]);

  const fetchConversations = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoadingConversations(true);
      const res = await api.get('/conversations');
      setConversations(res.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchConversations();
    } else {
      setConversations([]);
      setActiveUser(null);
      setMessages([]);
    }
  }, [user?._id, fetchConversations]);

  const selectUser = useCallback(
    async (peerUser) => {
      if (!peerUser?._id) return;
      setActiveUser(peerUser);
      setIsMobileChatOpen(true);
      setLoadingMessages(true);
      setMessages([]);
      setHasMore(false);

      joinChat(peerUser._id);

      try {
        const res = await api.get(`/message/${peerUser._id}`);
        setMessages(res.data || []);
        setHasMore(Boolean(res.hasMore));
      } catch (err) {
        if (err.status === 404) {
          setMessages([]);
          setHasMore(false);
        } else {
          console.error('Failed to load messages:', err);
        }
      } finally {
        setLoadingMessages(false);
      }
    },
    [joinChat]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!activeUser?._id || loadingMore || !hasMore || messages.length === 0) {
      return;
    }

    const earliestMessage = messages[0];
    if (!earliestMessage?._id) return;

    try {
      setLoadingMore(true);
      const res = await api.get(`/message/${activeUser._id}?before=${earliestMessage._id}`);
      const olderMessages = res.data || [];
      if (olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages, ...prev]);
      }
      setHasMore(Boolean(res.hasMore));
    } catch (err) {
      console.error('Failed to load older messages:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [activeUser?._id, loadingMore, hasMore, messages]);

  const sendMessage = useCallback(
    async ({ message, file }) => {
      if (!activeUser?._id) return;

      let res;
      if (file) {
        const formData = new FormData();
        if (message && message.trim()) {
          formData.append('message', message.trim());
        }
        formData.append('image', file);
        res = await api.postForm(`/message/${activeUser._id}`, formData);
      } else {
        res = await api.post(`/message/${activeUser._id}`, {
          message: (message || '').trim(),
        });
      }

      const newMessage = res.data;
      if (newMessage) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });

        setConversations((prev) => {
          const existingIndex = prev.findIndex((conv) => {
            const other = conv.otherParticipant;
            return other && other._id.toString() === activeUser._id.toString();
          });

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage: newMessage,
              updatedAt: new Date().toISOString(),
            };
            const item = updated.splice(existingIndex, 1)[0];
            return [item, ...updated];
          } else {
            const newConv = {
              _id: newMessage.conversationId || Date.now().toString(),
              otherParticipant: activeUser,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString(),
            };
            return [newConv, ...prev];
          }
        });
      }

      return newMessage;
    },
    [activeUser]
  );

  useEffect(() => {
    if (!socket) return;

    const handleNotification = ({ newMessage }) => {
      if (!newMessage) return;

      const currentActive = activeUserRef.current;
      const isForActiveChat =
        currentActive &&
        (newMessage.sender.toString() === currentActive._id.toString() ||
          newMessage.receiver.toString() === currentActive._id.toString());

      if (isForActiveChat) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }

      setConversations((prev) => {
        const peerId =
          newMessage.sender.toString() === user?._id?.toString()
            ? newMessage.receiver.toString()
            : newMessage.sender.toString();

        const existingIndex = prev.findIndex((c) => {
          const other = c.otherParticipant;
          return other && other._id.toString() === peerId;
        });

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
          };
          const item = updated.splice(existingIndex, 1)[0];
          return [item, ...updated];
        } else {
          fetchConversations();
          return prev;
        }
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, user?._id, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        loadingConversations,
        fetchConversations,
        activeUser,
        selectUser,
        messages,
        loadingMessages,
        loadingMore,
        hasMore,
        loadMoreMessages,
        sendMessage,
        isMobileChatOpen,
        setIsMobileChatOpen,
        closeMobileChat: () => setIsMobileChatOpen(false),
        isNewChatModalOpen,
        openNewChatModal: () => setIsNewChatModalOpen(true),
        closeNewChatModal: () => setIsNewChatModalOpen(false),
        isProfileModalOpen,
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        lightboxImage,
        openLightbox: (url) => setLightboxImage(url),
        closeLightbox: () => setLightboxImage(null),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
