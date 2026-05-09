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

import { db } from './firebase';

function App() {
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchLogs();
      }
    });
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

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 50 }}>
        <h1>Admin Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: 'block',
            marginBottom: 10,
            padding: 10,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: 'block',
            marginBottom: 10,
            padding: 10,
          }}
        />

        <button onClick={login}>
          Login
        </button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: 20 }}>
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  }}>
    <h1>SOP Admin Dashboard</h1>

    <button
      onClick={() => signOut(auth)}
      style={{
        marginBottom: 20,
        padding: 10,
      }}
    >
      Logout
    </button>
  </div>

      <input
  placeholder="Search by employee email"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  style={{
    padding: 10,
    marginBottom: 20,
    width: 300,
  }}
/>

      {filteredLogs.map((item) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            padding: 15,
            marginBottom: 20,
            borderRadius: 10,
          }}
        >
          <h3>{item.sop}</h3>

          <p>
            Employee:
            {' '}
            {item.userEmail || item.userId}
          </p>

          <img
            src={item.imageUrl}
            alt="SOP"
            width="300"
          />
        </div>
      ))}
    </div>
  );
}

export default App;