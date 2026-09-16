import { Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--background)',
        padding: '24px',
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
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          marginBottom: '16px',
        }}
      >
        <MessageSquare size={28} />
      </div>

      <h1
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '6px',
        }}
      >
        404 — Page Not Found
      </h1>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          maxWidth: '360px',
          lineHeight: 1.5,
          marginBottom: '20px',
        }}
      >
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>Return to Chats</span>
      </Link>
    </div>
  );
}

