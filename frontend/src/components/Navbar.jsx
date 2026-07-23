import React from 'react';
import { Sparkles, Ticket } from 'lucide-react';

export default function Navbar({ onOpenEvents, onShowTicket, onRsvpClick, currentTicket }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(13, 12, 11, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(238, 233, 223, 0.14)',
      padding: '0.85rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={onOpenEvents}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '2px',
            background: '#C9A56A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(201, 165, 106, 0.2)',
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#EEE9DF',
            }}>
              FORM INENGI
            </h1>
            <p style={{
              fontSize: '0.7rem',
              color: '#A49B8F',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginTop: '-4px',
            }}>
              Social Therapy
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentTicket && (
            <button 
              onClick={onShowTicket}
              className="badge-cyan"
              style={{ cursor: 'pointer', border: 'none', background: 'rgba(34, 211, 238, 0.15)', padding: '0.5rem 1rem' }}
            >
              <Ticket size={16} /> My Ticket ({currentTicket.ticketCode})
            </button>
          )}

          <button onClick={onRsvpClick} className="btn-cta">
            <Ticket size={18} />
            Get Ticket
          </button>
        </div>
      </div>
    </nav>
  );
}
