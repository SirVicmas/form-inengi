import React from 'react';
import { ArrowUpRight, CalendarDays, MapPin, ShieldCheck, Ticket } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-KE', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function Hero({ event, onRegisterClick }) {
  return (
    <section className="hero-night">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-copy">
        <p className="eyebrow"><span /> The next good story starts here</p>
        <h1>{event?.title || 'There is always another night worth showing up for.'}</h1>
        <p className="hero-description">{event?.description || 'Curated social experiences for the people who make ordinary nights feel legendary.'}</p>
        <div className="hero-actions">
          <button className="btn-cta" onClick={onRegisterClick}>Get tickets <ArrowUpRight size={18} /></button>
          <a className="text-link" href="#events">Explore events <ArrowUpRight size={16} /></a>
        </div>
        <p className="trust-note"><ShieldCheck size={16} /> Secure booking · instant QR ticket</p>
      </div>

      <aside className="hero-event-card" aria-label="Selected event details">
        <div className="event-card-glow" />
        <div className="event-card-top"><span>Featured experience</span><span className="live-dot">Tickets live</span></div>
        <div className="event-card-number">01</div>
        <div className="event-card-content">
          <p className="event-card-label">FORM INENGI PRESENTS</p>
          <h2>{event?.title || 'Form Inengi'}</h2>
          <div className="event-details">
            <p><CalendarDays size={17} /> {formatDate(event?.eventDate)}</p>
            <p><MapPin size={17} /> {event?.venue || 'Venue shared after booking'}</p>
          </div>
          <button className="event-card-cta" onClick={onRegisterClick}><Ticket size={17} /> Reserve your place</button>
        </div>
      </aside>
    </section>
  );
}
