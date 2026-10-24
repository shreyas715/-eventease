import { useState, useEffect } from 'react';
import './App.css';
import AdminDashboard from './AdminDashboard.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
const [events, setEvents] = useState([]);
const [selectedEvent, setSelectedEvent] = useState(null);
const [formData, setFormData] = useState({
  name: '',
  email: '',});
const [isAdmin, setIsAdmin] = useState(false);

const [showAdminLogin, setShowAdminLogin] = useState(false);
const [adminUsername, setAdminUsername] = useState('');
const [adminPassword, setAdminPassword] = useState('');
const [loginError, setLoginError] = useState('');
const [loginLoading, setLoginLoading] = useState(false);
const [adminToken, setAdminToken] = useState('');

const [search, setSearch] = useState('');
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

async function handleAdminLogin(event) {
  event.preventDefault();

  setLoginError('');
  setLoginLoading(true);

  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: adminUsername.trim(),
        password: adminPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setLoginError(data.message || 'Login failed. Please try again.');
      return;
    }

    setAdminToken(data.token);
    setIsAdmin(true);
    setShowAdminLogin(false);
    setAdminUsername('');
    setAdminPassword('');
  } catch (error) {
    console.error('Admin login error:', error);
    setLoginError('Unable to connect to the server. Please try again.');
  } finally {
    setLoginLoading(false);
  }
}

useEffect(() => {
  async function fetchEvents() {
    try {
      const response = await fetch(`${API_URL}/events`)

      if (!response.ok) {
        throw new Error('Failed to fetch workshops');
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError('Unable to load workshops. Please try again.');
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchEvents();
}, []);

async function registerForEvent(eventId) {
  if (!formData.name.trim() || !formData.email.trim()) {
    setMessage('Please enter your name and email.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || 'Registration failed.');
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId ? data.event : event
      )
    );

    setSelectedEvent(null);
    setFormData({ name: '', email: '' });
    setMessage(data.message);
  } catch (error) {
    console.error('Registration error:', error);
    setMessage('Unable to connect to the server. Please try again.');
  }
}

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.category} ${event.venue}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
if (isAdmin) {
  return (
    <AdminDashboard
      token={adminToken}
      onBack={() => {
        setIsAdmin(false);
        setAdminToken('');
      }}
    />
  );
}

if (showAdminLogin) {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <a href="#home" className="brand">
          <span className="brand-icon">E</span>
          <span>
            event<span className="brand-highlight">ease</span>
          </span>
        </a>

        <span className="section-label">ADMINISTRATOR ACCESS</span>

        <h1>Welcome back.</h1>
        <p>Sign in to manage your workshops and attendees.</p>

        {loginError && (
          <div className="login-error">
            {loginError}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <label htmlFor="admin-username">Username</label>

          <input
            id="admin-username"
            type="text"
            placeholder="Enter admin username"
            value={adminUsername}
            onChange={(event) => setAdminUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>

          <input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="primary-button admin-login-submit"
            disabled={loginLoading}
          >
            {loginLoading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <button
          type="button"
          className="admin-login-back"
          onClick={() => {
            setShowAdminLogin(false);
            setLoginError('');
            setAdminPassword('');
          }}
        >
          ← Back to EventEase
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">E</span>
          <span>event<span className="brand-highlight">ease</span></span>
        </a>

        <nav>
  <a href="#workshops">Workshops</a>
  <a href="#about">About</a>
  <button
  type="button"
  className="nav-admin-button"
  onClick={() => {
    setShowAdminLogin(true);
    setLoginError('');
  }}
>
  Admin ↗
</button>
  </nav>

        <a className="nav-button" href="#workshops">
          Explore events ↗
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT LEARNING EXPERIENCE</span>

            <h1>
              Learn something.
              <br />
              <span>Build something.</span>
              <br />
              Become something.
            </h1>

            <p className="hero-description">
              Discover technical workshops, meet curious minds,
              and turn your ideas into real-world skills.
            </p>

            <a className="primary-button" href="#workshops">
              Explore workshops →
            </a>
          </div>

          <div className="hero-visual">
  <div className="feature-card-grid">
    <div className="feature-card feature-card-one">
      <span className="feature-emoji">🚀</span>
      <h3>Ideas into action.</h3>
      <p>One workshop at a time.</p>
      <span className="feature-number">01 / INNOVATE</span>
    </div>
<div className="feature-card feature-card-two">
  <span className="feature-emoji">💡</span>
  <h3>Think beyond limits.</h3>
  <p>Big ideas start here.</p>
  <span className="feature-number">02 / IMAGINE</span>
</div>
<div className="feature-card feature-card-three">
  <span className="feature-emoji">🤖</span>
  <h3>Build the future.</h3>
  <p>Explore what's possible.</p>
  <span className="feature-number">03 / EXPLORE</span>
</div>
<div className="feature-card feature-card-four">
  <span className="feature-emoji">🎨</span>
  <h3>Make it beautiful.</h3>
  <p>Creativity meets technology.</p>
  <span className="feature-number">04 / CREATE</span>
</div>
<div className="feature-card feature-card-five">
  <span className="feature-emoji">💻</span>
  <h3>Code your dreams.</h3>
  <p>Turn logic into reality.</p>
  <span className="feature-number">05 / BUILD</span>
</div>
<div className="feature-card feature-card-six">
  <span className="feature-emoji">🔥</span>
  <h3>Create something epic.</h3>
  <p>Your next chapter starts now.</p>
  <span className="feature-number">06 / ACHIEVE</span>
</div>
  </div>
</div>
        </section>

        <section className="workshops-section" id="workshops">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE AND LEARN</span>
              <h2>Upcoming workshops.</h2>
              <p>Find your next opportunity to learn and grow.</p>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search workshops..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          {selectedEvent && (
  <div
    className="registration-overlay"
    onClick={() => setSelectedEvent(null)}
  >
    <div
      className="registration-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="modal-close"
        aria-label="Close registration form"
        onClick={() => setSelectedEvent(null)}
      >
        ×
      </button>

      <span className="section-label">SAVE YOUR SPOT</span>

      <h2 id="registration-title">Register for a workshop</h2>

      <p className="modal-workshop-title">
        {selectedEvent.title}
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          registerForEvent(selectedEvent.id);
        }}
      >
        <label htmlFor="attendee-name">Full name</label>

        <input
          id="attendee-name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(event) =>
            setFormData({
              ...formData,
              name: event.target.value,
            })
          }
          required
          autoComplete="name"
        />

        <label htmlFor="attendee-email">Email address</label>

        <input
          id="attendee-email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(event) =>
            setFormData({
              ...formData,
              email: event.target.value,
            })
          }
          required
          autoComplete="email"
        />

        <button type="submit" className="register-button">
          Confirm registration →
        </button>
      </form>
    </div>
  </div>
)}

          {message && (
            <div className="message-banner">
              {message}
              <button onClick={() => setMessage('')}>×</button>
            </div>
          )}
          {loading && <p>Loading workshops...</p>}

          {error && <p className="empty-state">{error}</p>}

          <div className="event-grid">
            {filteredEvents.map((event) => {
              const availableSeats = event.seats - event.registered;
              const isFull = availableSeats === 0;

              return (
                <article className="event-card" key={event.id}>
                  <div className={`event-art ${event.color}`}>
                    <span className="category-pill">{event.category}</span>
                    <span className="event-emoji">{event.icon}</span>
                  </div>

                  <div className="event-body">
                    <div className="event-date">
                      {event.date} · {event.time}
                    </div>

                    <h3>{event.title}</h3>
                    <p className="event-description">
                      {event.description}
                    </p>

                    <p className="event-venue">📍 {event.venue}</p>

                    <div className="seat-info">
                      <span>
                        {isFull
                          ? 'Fully booked'
                          : `${availableSeats} seats remaining`}
                      </span>
                      <span>
                        {event.registered}/{event.seats}
                      </span>
                    </div>

                    <div className="seat-track">
                      <div
                        className="seat-progress"
                        style={{
                          width: `${
                            (event.registered / event.seats) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <button
  className={`register-button ${isFull ? 'disabled' : ''}`}
  disabled={isFull}
  onClick={() => {
    setMessage('');
    setFormData({ name: '', email: '' });
    setSelectedEvent(event);
  }}
>
  {isFull ? 'Fully booked' : 'Register now →'}
</button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <p className="empty-state">No workshops found. Try another search.</p>
          )}
        </section>

        <section className="bottom-cta" id="about">
          <h2>Curiosity is a great place to start.</h2>
          <p>Learn a skill. Meet people. Build something amazing.</p>
          <a className="primary-button" href="#workshops">
            Find a workshop →
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">EventEase</a>
        <p>Built for learners. Designed for possibilities.</p>
        <span>EventEase © 2026</span>
      </footer>
    </div>
  );
}

export default App;