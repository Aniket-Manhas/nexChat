import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ImageLightbox = () => {
  const { lightboxImage, closeLightbox } = useChat();

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, closeLightbox]);

  if (!lightboxImage) return null;

  return (
    <div className="lightbox-backdrop" onClick={closeLightbox}>
      <button
        onClick={closeLightbox}
        className="lightbox-close"
        aria-label="Close image preview"
      >
        <X size={20} />
      </button>
      <img
        src={lightboxImage}
        alt="Enlarged preview"
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
