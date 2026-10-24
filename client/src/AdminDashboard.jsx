import { useEffect, useState } from 'react';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function AdminDashboard({ onBack, token }) {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'WEB DEVELOPMENT',
    description: '',
    date: '',
    time: '',
    venue: '',
    seats: 30,
    icon: '💻',
    color: 'purple',
  });

  async function loadEvents() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load workshops.');
      }

      setEvents(data.events);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }
  async function loadAttendees() {
  try {
    const response = await fetch(`${API_URL}/attendees`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load attendees.');
    }

    setAttendees(data.attendees);
  } catch (err) {
    setError(err.message || 'Unable to load attendees.');
  }
}

  useEffect(() => {
    loadEvents();
  }, []);

  const totalRegistrations = events.reduce(
    (total, event) => total + event.registered,
    0
  );

  const totalSeats = events.reduce(
    (total, event) => total + event.seats,
    0
  );

  const availableSeats = totalSeats - totalRegistrations;

  async function addWorkshop(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/events`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
        body: JSON.stringify({
          ...form,
          seats: Number(form.seats),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to create workshop.');
      }

      setMessage('Workshop created successfully!');
      setShowForm(false);

      setForm({
        title: '',
        category: 'WEB DEVELOPMENT',
        description: '',
        date: '',
        time: '',
        venue: '',
        seats: 30,
        icon: '💻',
        color: 'purple',
      });

      await loadEvents();
    } catch (err) {
      setError(err.message || 'Unable to create workshop.');
    }
  }

  async function deleteWorkshop(eventId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this workshop?'
    );

    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
     const response = await fetch(`${API_URL}/events/${eventId}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to delete workshop.');
      }

      setMessage('Workshop deleted successfully!');
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Unable to delete workshop.');
    }
  }

  const menuItems = [
    { name: 'Overview', icon: '◫' },
    { name: 'Workshops', icon: '▤' },
    { name: 'Attendees', icon: '♧' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a href="#admin" className="admin-brand">
          <span className="admin-brand-icon">E</span>
          <span>
            event<span>ease</span>
          </span>
        </a>

        <p className="admin-menu-label">WORKSPACE</p>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activeTab === item.name ? 'admin-nav-item active' : 'admin-nav-item'
              }
              onClick={() => {
  setActiveTab(item.name);
  setMessage('');
  setError('');

  if (item.name === 'Attendees') {
    loadAttendees();
  }
}}

            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>Dashboard preview</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-breadcrumb">EventEase / Admin</span>
            <h1>{activeTab}</h1>
          </div>

          <button className="admin-back-button" onClick={onBack}>
            ← Public website
          </button>
        </header>

        {message && (
          <div className="admin-message success-message">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {error && (
          <div className="admin-message error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {loading ? (
          <p className="admin-loading">Loading dashboard...</p>
        ) : (
          <>
            {activeTab === 'Overview' && (
              <>
                <section className="admin-welcome">
                  <div>
                    <span className="admin-eyebrow">YOUR WORKSPACE</span>
                    <h2>Everything at a glance.</h2>
                    <p>
                      Track your workshops and registrations from one place.
                    </p>
                  </div>
                  <div className="admin-welcome-icon">✦</div>
                </section>

                <section className="admin-stat-grid">
                  <article className="admin-stat-card">
                    <span className="admin-stat-icon lavender">▤</span>
                    <p>Total workshops</p>
                    <h3>{events.length}</h3>
                    <span className="admin-stat-caption">
                      Workshops in your database
                    </span>
                  </article>

                  <article className="admin-stat-card">
                    <span className="admin-stat-icon peach">♧</span>
                    <p>Total registrations</p>
                    <h3>{totalRegistrations}</h3>
                    <span className="admin-stat-caption">
                      Registered seats across workshops
                    </span>
                  </article>

                  <article className="admin-stat-card">
                    <span className="admin-stat-icon mint">✓</span>
                    <p>Available seats</p>
                    <h3>{availableSeats}</h3>
                    <span className="admin-stat-caption">
                      Seats remaining across workshops
                    </span>
                  </article>

                  <article className="admin-stat-card">
                    <span className="admin-stat-icon blue">◷</span>
                    <p>Fully booked</p>
                    <h3>
                      {
                        events.filter(
                          (event) => event.registered >= event.seats
                        ).length
                      }
                    </h3>
                    <span className="admin-stat-caption">
                      Workshops at capacity
                    </span>
                  </article>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h2>Recent workshops</h2>
                      <p>Registration status at a glance.</p>
                    </div>

                    <button
                      className="admin-text-button"
                      onClick={() => setActiveTab('Workshops')}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Workshop</th>
                          <th>Date</th>
                          <th>Registrations</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {events.slice(0, 5).map((event) => (
                          <tr key={event.id}>
                            <td>
                              <div className="admin-workshop-name">
                                <span>{event.icon}</span>
                                <strong>{event.title}</strong>
                              </div>
                            </td>
                            <td>{event.date}</td>
                            <td>
                              {event.registered}/{event.seats}
                            </td>
                            <td>
                              <span
                                className={
                                  event.registered >= event.seats
                                    ? 'admin-status full'
                                    : 'admin-status open'
                                }
                              >
                                {event.registered >= event.seats
                                  ? 'Full'
                                  : 'Open'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'Workshops' && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Manage workshops</h2>
                    <p>Create and review your workshops.</p>
                  </div>

                  <button
                    className="admin-primary-button"
                    onClick={() => {
                      setShowForm(!showForm);
                      setError('');
                    }}
                  >
                    {showForm ? 'Cancel' : '+ Add workshop'}
                  </button>
                </div>

                {showForm && (
                  <form className="admin-workshop-form" onSubmit={addWorkshop}>
                    <label>
                      Workshop title
                      <input
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </label>

                    <label>
                      Category
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                      >
                        <option>WEB DEVELOPMENT</option>
                        <option>AI & MACHINE LEARNING</option>
                        <option>PROGRAMMING</option>
                        <option>DATA SCIENCE</option>
                        <option>DESIGN</option>
                      </select>
                    </label>

                    <label className="form-full-width">
                      Description
                      <textarea
                        required
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                      />
                    </label>

                    <label>
                      Date
                      <input
                        required
                        placeholder="28 Oct 2026"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                      />
                    </label>

                    <label>
                      Time
                      <input
                        required
                        placeholder="10:00 AM"
                        value={form.time}
                        onChange={(e) =>
                          setForm({ ...form, time: e.target.value })
                        }
                      />
                    </label>

                    <label>
                      Venue
                      <input
                        required
                        value={form.venue}
                        onChange={(e) =>
                          setForm({ ...form, venue: e.target.value })
                        }
                      />
                    </label>

                    <label>
                      Total seats
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        required
                        value={form.seats}
                        onChange={(e) =>
                          setForm({ ...form, seats: e.target.value })
                        }
                      />
                    </label>

                    <button
                      className="admin-primary-button form-full-width"
                      type="submit"
                    >
                      Save workshop
                    </button>
                  </form>
                )}

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Workshop</th>
                        <th>Date</th>
                        <th>Seats filled</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td>
                            <div className="admin-workshop-name">
                              <span>{event.icon}</span>
                              <strong>{event.title}</strong>
                            </div>
                          </td>
                          <td>{event.date}</td>
                          <td>
                            {event.registered}/{event.seats}
                          </td>
                          <td>
                            <button
                              className="admin-delete-button"
                              onClick={() => deleteWorkshop(event.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'Attendees' && (
  <section className="admin-panel">
    <div className="admin-panel-heading">
      <div>
        <h2>Attendee registrations</h2>
        <p>View people registered for your workshops.</p>
      </div>

      <button
        className="admin-primary-button"
        onClick={loadAttendees}
      >
        Refresh attendees
      </button>
    </div>

    {attendees.length === 0 ? (
      <div className="admin-empty-state">
        <span>♧</span>
        <h3>No attendee records found</h3>
        <p>New workshop registrations will appear here.</p>
      </div>
    ) : (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Email</th>
              <th>Workshop</th>
              <th>Workshop date</th>
              <th>Registered on</th>
            </tr>
          </thead>

          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>
                  <div className="admin-workshop-name">
                    <span>👤</span>
                    <strong>{attendee.name}</strong>
                  </div>
                </td>

                <td>{attendee.email}</td>
                <td>{attendee.workshop}</td>
                <td>{attendee.workshopDate || '—'}</td>

                <td>
                  {new Date(attendee.registeredAt).toLocaleDateString(
                    'en-IN',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
)}
    </>

        )}

        <footer className="admin-footer">
          EventEase Admin · Manage experiences that matter.
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;