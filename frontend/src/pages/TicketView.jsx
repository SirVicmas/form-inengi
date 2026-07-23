import React from 'react';
import { Download, CheckCircle, Calendar, MapPin, Ticket as TicketIcon, Sparkles, ArrowLeft, Share2 } from 'lucide-react';

export default function TicketView({ ticketData, event, onBack }) {
  if (!ticketData || !ticketData.ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>No Ticket Found</h2>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Events
        </button>
      </div>
    );
  }

  const { ticket, qrCode } = ticketData;

  const handleDownloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `Ticket_${ticket.ticketCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section style={{
      padding: '3rem 1.5rem 5rem 1.5rem',
      maxWidth: '720px',
      margin: '0 auto',
    }}>
      <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="badge-cyan" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
          <CheckCircle size={14} color="#10B981" /> CONFIRMED REGISTRATION
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
          Your Digital Pass
        </h2>
        <p style={{ color: '#94A3B8' }}>
          Show this QR code at the door for entry check-in.
        </p>
      </div>

      {/* Ticket Card Container */}
      <div className="ticket-stub" style={{
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.25)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        background: 'linear-gradient(135deg, #161B2F 0%, #0E1428 100%)',
      }}>
        {/* Top Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
              FORM INENGI PASS
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
              {event?.title || 'Form Inengi: A Pajama Party'}
            </h3>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '0.4rem 0.85rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#FFF',
          }}>
            {ticket.status?.toUpperCase() || 'VALID'}
          </div>
        </div>

        {/* Ticket Details & QR Code Grid */}
        <div style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
        }}>
          {/* Left Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ATTENDEE NAME
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                {ticket.attendeeName}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TICKET CODE
              </div>
              <div style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#22D3EE',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}>
                {ticket.ticketCode}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="#8B5CF6" />
                <span>{event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : '31st July'} @ 8:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#EC4899" />
                <span>{event?.venue || 'Disclosed upon registration'}</span>
              </div>
            </div>
          </div>

          {/* Right QR Code Box */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {qrCode ? (
              <img 
                src={qrCode} 
                alt="Ticket QR Code" 
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '12px',
                  background: '#FFF',
                  padding: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              />
            ) : (
              <div style={{ width: '180px', height: '180px', background: '#333', borderRadius: '12px', margin: '0 auto' }} />
            )}

            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.75rem' }}>
              Scan for Venue Entrance
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.25rem 2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <button onClick={handleDownloadQR} className="btn-cta">
            <Download size={18} /> Save QR Code
          </button>
          
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#22D3EE" /> Form Inengi Social Therapy
          </div>
        </div>
      </div>
    </section>
  );
}
