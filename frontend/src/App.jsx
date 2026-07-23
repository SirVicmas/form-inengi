import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TicketPricing from './components/TicketPricing';
import RegistrationModal from './components/RegistrationModal';
import TicketView from './pages/TicketView';
import { fetchEvents, registerForEvent } from './api/client';
import { Sparkles, CalendarDays, MapPin, ArrowUpRight } from 'lucide-react';

const FALLBACK_EVENT = {
  id: 1,
  title: 'Form Inengi: A Pajama Party',
  slug: 'tech-summit-2026',
  description: 'Come in your pajamas & with a shuka for a night of fun. Movie night done theater style, fun activities, food, photography and karaoke!',
  venue: 'Disclosed upon registration',
  eventDate: new Date('2026-07-31T20:00:00'),
  capacity: 100,
  status: 'published',
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(FALLBACK_EVENT);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'ticket'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        if (data && data.length > 0) {
          setEvents(data);
          setCurrentEvent(data[0]);
        }
      } catch (err) {
        console.log('Using default fallback event:', err);
      }
    }
    loadEvents();
  }, []);

  const handleRegisterSubmit = async (formData) => {
    const slug = currentEvent?.slug || 'tech-summit-2026';
    const result = await registerForEvent(slug, formData);
    
    setTicketData(result);
    setIsModalOpen(false);
    setActiveView('ticket');

    // Trigger celebration confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9A56A', '#EED09D', '#E65E43', '#EEE9DF'],
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onOpenEvents={() => setActiveView('home')} 
        onShowTicket={() => setActiveView('ticket')}
        onRsvpClick={() => setIsModalOpen(true)}
        currentTicket={ticketData?.ticket}
      />

      <main style={{ flex: 1 }}>
        {activeView === 'home' ? (
          <>
            <Hero 
              event={currentEvent} 
              onRegisterClick={() => setIsModalOpen(true)} 
            />
            <section id="events" className="events-section">
              <div className="events-heading"><div><p className="eyebrow"><span /> Calendar</p><h2>Find your next <em>night out.</em></h2></div><p>New experiences arrive often. Pick an event and make it yours.</p></div>
              <div className="event-rail">
                {(events.length ? events : [currentEvent]).map((ev, index) => {
                  const selected = currentEvent?.id === ev.id;
                  return <button key={ev.id || ev.slug} className={`event-select-card ${selected ? 'is-selected' : ''}`} onClick={() => setCurrentEvent(ev)}>
                    <span className="event-index">0{index + 1}</span><span className="event-select-status">{selected ? 'Selected' : 'View event'} <ArrowUpRight size={15} /></span>
                    <h3>{ev.title}</h3>
                    <p><CalendarDays size={15} /> {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }) : 'Date TBA'}</p>
                    <p><MapPin size={15} /> {ev.venue || 'Venue TBA'}</p>
                  </button>;
                })}
              </div>
            </section>
            <TicketPricing event={currentEvent}
              onSelectTier={() => setIsModalOpen(true)} 
            />
          </>
        ) : (
          <TicketView 
            ticketData={ticketData} 
            event={currentEvent} 
            onBack={() => setActiveView('home')} 
          />
        )}
      </main>

      <RegistrationModal 
        event={currentEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(238, 233, 223, 0.14)',
        padding: '2.5rem 1.5rem',
        backgroundColor: '#0D0C0B',
        textAlign: 'center',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EEE9DF', fontWeight: 700 }}>
            <Sparkles size={18} color="#C9A56A" /> FORM INENGI
          </div>
          <p style={{ fontSize: '0.9rem', color: '#A49B8F', maxWidth: '480px' }}>
            We create fun spaces to unwind & get new experiences. We basically peddle social therapy.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#A49B8F', marginTop: '0.5rem' }}>
            © {new Date().getFullYear()} Form Inengi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
