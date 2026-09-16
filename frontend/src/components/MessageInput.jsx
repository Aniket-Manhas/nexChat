import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const MessageInput = () => {
  const { sendMessage, activeUser } = useChat();
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
    setText('');
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError('');
  }, [activeUser?._id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (sending) return;
    if (!text.trim() && !selectedFile) return;
    if (text.length > 250) {
      setError('Message exceeds 250 character limit.');
      return;
    }

    try {
      setSending(true);
      setError('');
      await sendMessage({
        message: text.trim(),
        file: selectedFile,
      });

      setText('');
      removeSelectedFile();
      textareaRef.current?.focus();
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = text.length;
  const isOverLimit = charCount > 250;
  const isNearLimit = charCount >= 220;

  return (
    <div
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {error && (
        <div className="alert alert-error" style={{ padding: '6px 10px', fontSize: 'var(--text-xs)' }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{error}</span>
          <button
            onClick={() => setError('')}
            style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss error"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {previewUrl && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 10px',
            backgroundColor: 'var(--muted)',
            borderRadius: 'var(--radius-md)',
            width: 'fit-content',
            border: '1px solid var(--border)',
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--foreground)',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedFile?.name}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>
              {(selectedFile?.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            onClick={removeSelectedFile}
            className="btn-icon"
            style={{ padding: '4px' }}
            title="Remove image"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          id="message-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-icon"
          title="Attach image (JPEG, PNG, WebP up to 5MB)"
          aria-label="Attach image"
          style={{ height: '38px', width: '38px', flexShrink: 0 }}
        >
          <ImageIcon size={18} />
        </button>

        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message @${activeUser?.userName || 'user'}... (Enter to send)`}
            className={`input ${isOverLimit ? 'input-error' : ''}`}
            style={{
              resize: 'none',
              minHeight: '38px',
              maxHeight: '120px',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingRight: '60px',
              lineHeight: 1.4,
            }}
            maxLength={260}
          />

          <span
            style={{
              position: 'absolute',
              right: '10px',
              bottom: '8px',
              fontSize: '11px',
              color: isOverLimit
                ? 'var(--color-danger)'
                : isNearLimit
                ? 'var(--color-warning)'
                : 'var(--muted-foreground)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {charCount}/250
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || (!text.trim() && !selectedFile) || isOverLimit}
          className="btn btn-primary"
          style={{ height: '38px', width: '38px', padding: 0, flexShrink: 0 }}
          title="Send message"
          aria-label="Send message"
        >
          {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};
