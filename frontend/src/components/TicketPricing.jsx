import React from 'react';
import { Check, Ticket, Zap } from 'lucide-react';

export default function TicketPricing({ onSelectTier, event }) {
  const inclusions = ['Your place at the experience', 'Instant digital QR ticket', 'Simple, secure door check-in'];
  return (
    <section className="ticket-section">
      <div className="section-heading">
        <p className="eyebrow"><span /> Ticketing made effortless</p>
        <h2>One pass. <em>All access.</em></h2>
        <p>Every Form Inengi ticket is built for a seamless night—from checkout to the door.</p>
      </div>
      <div className="pass-card">
        <div className="pass-card-copy">
          <p className="pass-overline">{event?.title || 'FORM INENGI EXPERIENCE'}</p>
          <h3>Secure your spot before the room fills up.</h3>
          <div className="pass-inclusions">{inclusions.map((item) => <p key={item}><Check size={17} /> {item}</p>)}</div>
        </div>
        <div className="pass-card-action">
          <Zap size={23} />
          <p>Tickets are issued instantly.</p>
          <button className="btn-cta" onClick={onSelectTier}>Get ticket <Ticket size={17} /></button>
        </div>
      </div>
    </section>
  );
}
