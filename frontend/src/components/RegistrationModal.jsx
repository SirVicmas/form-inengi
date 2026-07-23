import React, { useState } from 'react';
import { X, User, Phone, Mail, Sparkles, Loader2 } from 'lucide-react';

export default function RegistrationModal({ event, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    attendeeName: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.attendeeName.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      backgroundColor: 'rgba(13, 12, 11, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2rem',
        position: 'relative',
        background: '#161411',
        border: '1px solid rgba(201, 165, 106, 0.45)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#EEE9DF',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge-neon" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
            <Sparkles size={14} /> RSVP TICKET
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Register for Event
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            {event?.title || 'Form Inengi: A Pajama Party'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Jane Doe"
                value={formData.attendeeName}
                onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
                  background: 'rgba(11, 16, 32, 0.8)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
                  background: 'rgba(11, 16, 32, 0.8)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Email Address (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
                  background: 'rgba(11, 16, 32, 0.8)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-cta" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating QR Ticket...
              </>
            ) : (
              'Confirm & Get Digital Ticket'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
