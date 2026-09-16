import { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2, Check, AlertCircle, Calendar, Mail, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Avatar } from './Avatar';

export const ProfileModal = () => {
  const { user, updateProfile } = useAuth();
  const { isProfileModalOpen, closeProfileModal } = useChat();

  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isProfileModalOpen && user) {
      setName(user.name || '');
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('');
      setSuccess('');
    }
  }, [isProfileModalOpen, user]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isProfileModalOpen || !user) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar image must be under 5 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    const nameChanged = name.trim() !== (user.name || '');
    const imageChanged = Boolean(selectedFile);

    if (!nameChanged && !imageChanged) {
      closeProfileModal();
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      if (nameChanged) {
        formData.append('name', name.trim());
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await updateProfile(formData);
      setSuccess('Profile updated successfully.');
      setTimeout(() => {
        closeProfileModal();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeProfileModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <h3 className="modal-title">Account Settings</h3>
          <button onClick={closeProfileModal} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <Check size={15} style={{ flexShrink: 0 }} />
                <span>{success}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  src={previewUrl || user.image}
                  name={name || user.name}
                  username={user.userName}
                  size="xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--surface)',
                    cursor: 'pointer',
                  }}
                  title="Upload new avatar"
                  aria-label="Upload new avatar"
                >
                  <Camera size={13} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                JPEG, PNG, or WebP (Max 5MB)
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="profile-name" className="form-label">
                Display Name
              </label>
              <input
                id="profile-name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <AtSign size={15} />
                <span>{user.userName}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <Mail size={15} />
                <span>{user.email}</span>
              </div>
            </div>

            {user.createdAt && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--muted-foreground)',
                  marginTop: '4px',
                }}
              >
                <Calendar size={13} />
                <span>
                  Member since{' '}
                  {new Date(user.createdAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={closeProfileModal}
              className="btn btn-ghost btn-sm"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
