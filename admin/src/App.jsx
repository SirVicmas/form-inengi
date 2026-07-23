import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Camera, CheckCircle2, ChevronRight, CircleAlert, ClipboardCheck, LogOut, Plus, Search, Ticket, Users, X } from 'lucide-react';
import { checkIn, createEvent, getEvents, getTickets, login, updateEvent } from './api';

const emptyEvent = { title: '', slug: '', description: '', venue: '', eventDate: '', capacity: '', status: 'draft' };
const formatDate = (date) => date ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) : 'Date TBA';

function Login({ onLogin }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { onLogin(await login(email, password)); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <main className="login-shell"><section className="login-intro"><p className="kicker">FORM INENGI / STAFF</p><h1>Run the room.<br /><em>Not the paperwork.</em></h1><p>Check in guests, manage events, and keep every door moment moving.</p></section><form className="login-card" onSubmit={submit}><p className="kicker">Staff access</p><h2>Welcome back</h2>{error && <p className="error"><CircleAlert size={16} /> {error}</p>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label><button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to dashboard'} <ChevronRight size={17} /></button></form></main>;
}

function EventForm({ event, onSave, onClose }) {
  const [form, setForm] = useState(event || emptyEvent); const [error, setError] = useState(''); const set = (key, value) => setForm({ ...form, [key]: value });
  const submit = async (e) => { e.preventDefault(); setError(''); try { await onSave({ ...form, capacity: form.capacity ? Number(form.capacity) : null, eventDate: form.eventDate || null }); onClose(); } catch (err) { setError(err.message); } };
  return <div className="modal-backdrop"><form className="event-modal" onSubmit={submit}><div className="modal-title"><div><p className="kicker">Event management</p><h2>{event ? 'Edit event' : 'Create an event'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={19} /></button></div>{error && <p className="error"><CircleAlert size={16} /> {error}</p>}<div className="form-grid"><label>Event title<input value={form.title} onChange={e => set('title', e.target.value)} required /></label><label>URL slug<input value={form.slug} onChange={e => set('slug', e.target.value)} required /></label><label>Venue<input value={form.venue || ''} onChange={e => set('venue', e.target.value)} /></label><label>Start date & time<input type="datetime-local" value={form.eventDate ? form.eventDate.slice(0, 16) : ''} onChange={e => set('eventDate', e.target.value)} /></label><label>Capacity<input min="1" type="number" value={form.capacity ?? ''} onChange={e => set('capacity', e.target.value)} /></label><label>Status<select value={form.status} onChange={e => set('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option></select></label></div><label>Description<textarea value={form.description} onChange={e => set('description', e.target.value)} required rows="4" /></label><button className="primary">{event ? 'Save changes' : 'Create event'} <ChevronRight size={17} /></button></form></div>;
}

function CameraScanner({ onDetected }) {
  const [open, setOpen] = useState(false); const [message, setMessage] = useState(''); const video = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    let stream; let timer;
    const start = async () => {
      if (!('BarcodeDetector' in window)) { setMessage('Camera QR scanning is not supported in this browser. Use the ticket-code field instead.'); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.current.srcObject = stream; await video.current.play();
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        timer = window.setInterval(async () => {
          const codes = await detector.detect(video.current);
          if (codes[0]?.rawValue) { onDetected(codes[0].rawValue); setOpen(false); }
        }, 400);
      } catch { setMessage('Camera permission was not available. Use the ticket-code field instead.'); }
    };
    start();
    return () => { window.clearInterval(timer); stream?.getTracks().forEach(track => track.stop()); };
  }, [open, onDetected]);
  return <div className="camera-scan"><button type="button" className="camera-button" onClick={() => { setMessage(''); setOpen(!open); }}><Camera size={16} /> {open ? 'Close camera' : 'Scan with camera'}</button>{open && <video ref={video} muted playsInline />}{message && <span>{message}</span>}</div>;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('forminengi_admin_token')); const [events, setEvents] = useState([]); const [tickets, setTickets] = useState([]); const [selectedEvent, setSelectedEvent] = useState(''); const [query, setQuery] = useState(''); const [scanCode, setScanCode] = useState(''); const [scanResult, setScanResult] = useState(null); const [modal, setModal] = useState(null); const [loading, setLoading] = useState(true);
  const reload = async (eventId = selectedEvent) => { setLoading(true); try { const [eventData, ticketData] = await Promise.all([getEvents(token), getTickets(token, eventId)]); setEvents(eventData); setTickets(ticketData); } finally { setLoading(false); } };
  useEffect(() => { if (token) reload(); }, [token, selectedEvent]);
  const signIn = ({ token: next }) => { localStorage.setItem('forminengi_admin_token', next); setToken(next); };
  const signOut = () => { localStorage.removeItem('forminengi_admin_token'); setToken(''); };
  const verifyCode = async (code) => { setScanResult(null); try { const ticket = await checkIn(token, code); setScanResult({ ticket, ok: true }); setScanCode(''); reload(); } catch (err) { setScanResult({ message: err.message, ok: false }); } };
  const verify = async (e) => { e.preventDefault(); verifyCode(scanCode); };
  const saveEvent = async (data) => { if (modal?.id) await updateEvent(token, modal.id, data); else await createEvent(token, data); await reload(); };
  const visibleTickets = useMemo(() => tickets.filter(t => [t.attendeeName, t.ticketCode, t.phone, t.email].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())), [tickets, query]);
  if (!token) return <Login onLogin={signIn} />;
  const checkedIn = tickets.filter(t => t.status === 'checked_in').length;
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span>FI</span><div>FORM INENGI<small>STAFF CONSOLE</small></div></div><nav><a className="active" href="#overview"><ClipboardCheck size={18} /> Check-in desk</a><a href="#tickets"><Ticket size={18} /> Guest list</a><a href="#events"><CalendarDays size={18} /> Events</a></nav><button className="sign-out" onClick={signOut}><LogOut size={17} /> Sign out</button></aside><main className="dashboard"><header><div><p className="kicker">Operations dashboard</p><h1>Good evening, team.</h1></div><button className="primary" onClick={() => setModal(emptyEvent)}><Plus size={17} /> New event</button></header><section id="overview" className="checkin-layout"><div className="scanner-card"><p className="kicker">Door control</p><h2>Verify a ticket</h2><p>Scan a QR code with your device camera, a handheld scanner, or enter the ticket code below.</p><form onSubmit={verify}><label>Ticket code<input autoFocus placeholder="e.g. FI-8Q3X..." value={scanCode} onChange={e => setScanCode(e.target.value)} /></label><button className="primary"><CheckCircle2 size={17} /> Check in guest</button></form><CameraScanner onDetected={verifyCode} />{scanResult && <div className={`scan-result ${scanResult.ok ? 'success' : 'failed'}`}>{scanResult.ok ? <><CheckCircle2 size={20} /><div><strong>{scanResult.ticket.attendeeName} is checked in.</strong><span>{scanResult.ticket.ticketCode} · Welcome in.</span></div></> : <><CircleAlert size={20} /><div><strong>Ticket not accepted</strong><span>{scanResult.message}</span></div></>}</div>}</div><div className="stats"><article><Ticket /><strong>{tickets.length}</strong><span>Tickets in view</span></article><article><Users /><strong>{checkedIn}</strong><span>Guests checked in</span></article><article><CheckCircle2 /><strong>{tickets.length ? Math.round((checkedIn / tickets.length) * 100) : 0}%</strong><span>Arrival rate</span></article></div></section><section id="tickets" className="panel"><div className="panel-heading"><div><p className="kicker">Attendees</p><h2>Guest list</h2></div><div className="table-controls"><select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}><option value="">All events</option>{events.map(event => <option value={event.id} key={event.id}>{event.title}</option>)}</select><label className="search"><Search size={16} /><input placeholder="Search a guest or code" value={query} onChange={e => setQuery(e.target.value)} /></label></div></div><div className="table-wrap"><table><thead><tr><th>Guest</th><th>Event</th><th>Ticket</th><th>Booked</th><th>Status</th></tr></thead><tbody>{loading ? <tr><td colSpan="5">Loading guest list…</td></tr> : visibleTickets.length ? visibleTickets.map(ticket => <tr key={ticket.id}><td><strong>{ticket.attendeeName}</strong><span>{ticket.phone}</span></td><td>{ticket.event.title}</td><td className="ticket-code">{ticket.ticketCode}</td><td>{formatDate(ticket.createdAt)}</td><td><span className={`status ${ticket.status}`}>{ticket.status.replace('_', ' ')}</span></td></tr>) : <tr><td colSpan="5">No tickets found.</td></tr>}</tbody></table></div></section><section id="events" className="events-panel"><div className="panel-heading"><div><p className="kicker">Event control</p><h2>Events</h2></div></div><div className="event-grid">{events.map(event => <article key={event.id}><span className={`status ${event.status}`}>{event.status}</span><h3>{event.title}</h3><p>{formatDate(event.eventDate)}</p><p>{event.venue || 'Venue TBA'}</p><button onClick={() => setModal(event)}>Manage event <ChevronRight size={15} /></button></article>)}</div></section></main>{modal && <EventForm event={modal.id ? modal : null} onSave={saveEvent} onClose={() => setModal(null)} />}</div>;
}
