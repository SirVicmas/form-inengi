import React from 'react';
import { Camera, Gamepad2, Utensils, Mic2, Film, Clock, HelpCircle } from 'lucide-react';

const PROGRAM_ITEMS = [
  {
    time: '8:00 PM',
    title: 'Arrival & Vinyls',
    desc: 'Guests trickle in as photos are taken with vinyl background music.',
    icon: Camera,
    color: '#8B5CF6',
  },
  {
    time: '9:00 PM',
    title: 'Fun Activities & Surprise Game',
    desc: 'Interactive icebreakers & a surprise game! (Hint: It has to do with money 💸)',
    icon: Gamepad2,
    color: '#EC4899',
    special: true,
  },
  {
    time: '11:00 PM',
    title: 'Food & Theater Prep',
    desc: 'Delicious food served as the theater is prepped for movie night.',
    icon: Utensils,
    color: '#22D3EE',
  },
  {
    time: '12:00 AM',
    title: 'Karaoke Time',
    desc: 'Sing your heart out with the crowd under pajama party vibes!',
    icon: Mic2,
    color: '#10B981',
  },
  {
    time: '01:00 AM',
    title: 'Theater Style Movie Night',
    desc: 'Snuggle in your shuka for a dark room cinema experience.',
    icon: Film,
    color: '#F59E0B',
  },
];

export default function EventProgram() {
  return (
    <section id="program" style={{
      padding: '4rem 1.5rem',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge-cyan" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
          <Clock size={14} /> NIGHT SCHEDULE
        </span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          The Event <span className="gradient-text-neon">Program</span>
        </h2>
        <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>
          Gates open @ 8:00 PM. Come in your pajamas & with a shuka for a night of fun!
        </p>
      </div>

      {/* Timeline Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
      }}>
        {PROGRAM_ITEMS.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div key={index} className="glass-card" style={{
              padding: '1.5rem 1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              borderLeft: `4px solid ${item.color}`,
              background: item.special ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, #161B2F 100%)' : '#161B2F',
            }}>
              <div style={{
                background: `rgba(${parseInt(item.color.slice(1,3),16)}, ${parseInt(item.color.slice(3,5),16)}, ${parseInt(item.color.slice(5,7),16)}, 0.15)`,
                padding: '0.85rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconComp size={24} color={item.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
                    {item.title}
                  </h3>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: item.color,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '8px',
                  }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
