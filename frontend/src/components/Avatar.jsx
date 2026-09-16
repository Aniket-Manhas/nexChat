import { useState } from 'react';
import { getInitials } from '../utils/format';

export const Avatar = ({
  src,
  name,
  username,
  size = 'md',
  isOnline = false,
  showStatus = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name, username);

  const sizeClasses = {
    xs: 'avatar-xs',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  const sizePx = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  }[size] || 40;

  const fontSizes = {
    xs: '0.625rem',
    sm: '0.75rem',
    md: '0.875rem',
    lg: '1.25rem',
    xl: '1.5rem',
  }[size] || '0.875rem';

  return (
    <div className={`avatar-container ${className}`} style={{ width: sizePx, height: sizePx }}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name || username || 'Avatar'}
          className={`avatar ${sizeClasses[size] || 'avatar-md'}`}
          onError={() => setImageError(true)}
          style={{ width: sizePx, height: sizePx }}
        />
      ) : (
        <div
          className={`avatar ${sizeClasses[size] || 'avatar-md'}`}
          style={{
            width: sizePx,
            height: sizePx,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: fontSizes,
            userSelect: 'none',
          }}
          aria-label={name || username}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`status-dot ${isOnline ? 'status-online' : 'status-offline'}`}
          title={isOnline ? 'Online' : 'Offline'}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
