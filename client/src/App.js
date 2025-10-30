import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
  }, [user, token]);

  const logout = () => {
    setUser(null); setToken(null); localStorage.clear();
  };

  return (
    <>
      <nav className="navbar">
        <span className="app-title">LinkedIn Clone</span>
        {user &&
          <span className="profile">
            <span style={{
              background: "#0073b1",
              color: "#fff",
              borderRadius: '50%',
              padding: '7px 12px',
              fontWeight: "bold"
            }}>
              {user.name[0]?.toUpperCase()}
            </span>
            &nbsp; {user.name} <button onClick={logout}>Logout</button>
          </span>
        }
      </nav>
      <div className="container">
        {!user
          ? <AuthForm setUser={setUser} setToken={setToken} />
          : <Feed user={user} token={token} />
        }
      </div>
    </>
  );
}
export default App;
