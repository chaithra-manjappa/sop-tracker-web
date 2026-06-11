import { useEffect, useState } from 'react';

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAuth,
} from 'firebase/auth';

import {
  collection,
  getDocs,
} from 'firebase/firestore';

import './App.css';
import { db } from './firebase';

const auth = getAuth();

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchLogs();
      }
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchLogs = async () => {
    const querySnapshot = await getDocs(
      collection(db, 'sopLogs')
    );

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setLogs(data);
  };

  const filteredLogs = logs.filter((item) =>
    item.userEmail?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.userId?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sop?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!user) {
    return (
      <main className="app-shell login-shell">
        <section className="login-card" aria-labelledby="login-title">
          <div className="brand-pill">
            <span className="brand-dot" />
            SOP Tracker
          </div>

          <h1 id="login-title">Admin Login</h1>
          <p className="login-copy">
            Review completed SOP entries in a brighter green and yellow workspace.
          </p>

          <div className="login-form">
            <label className="input-label" htmlFor="email">
              Email
              <input
                id="email"
                className="app-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="input-label" htmlFor="password">
              Password
              <input
                id="password"
                className="app-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="app-button" onClick={login} type="button">
              Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="dashboard-card" aria-labelledby="dashboard-title">
        <header className="dashboard-header">
          <div className="dashboard-title-row">
            <span className="dashboard-icon" aria-hidden="true">✓</span>
            <div>
              <div className="brand-pill">
                <span className="brand-dot" />
                Admin Workspace
              </div>
              <h1 className="dashboard-title" id="dashboard-title">
                SOP Admin Dashboard
              </h1>
              <p className="dashboard-subtitle">
                Track employee submissions with a cleaner, nature-inspired interface.
              </p>
            </div>
          </div>

          <button
            className="app-button secondary"
            onClick={() => signOut(auth)}
            type="button"
          >
            Logout
          </button>
        </header>

        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">🔎</span>
            <input
              className="app-input"
              placeholder="Search by employee email, ID, or SOP"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <span className="stats-pill">
            {filteredLogs.length} of {logs.length} entries
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            No SOP logs match your search yet.
          </div>
        ) : (
          <div className="logs-grid">
            {filteredLogs.map((item) => (
              <article className="log-card" key={item.id}>
                <div className="log-image-wrap">
                  <img
                    className="log-image"
                    src={item.imageUrl}
                    alt={item.sop ? `${item.sop} SOP evidence` : 'SOP evidence'}
                  />
                  <span className="log-badge">SOP Log</span>
                </div>

                <h3>{item.sop}</h3>

                <p className="employee-line">
                  <strong>Employee:</strong>
                  {' '}
                  {item.userEmail || item.userId}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
