import React, { useState } from 'react';

const API = 'http://localhost:5000/api/auth';

function AuthForm({ setUser, setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    fetch(`${API}/${isSignup ? 'signup' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setUser(data.user);
          setToken(data.token);
        }
      });
  };

  return (
    <form onSubmit={submit} className="auth-form">
      {isSignup && (
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
      )}
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
      <p onClick={() => setIsSignup((s) => !s)} style={{ cursor: 'pointer' }}>
        {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
      </p>
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </form>
  );
}

export default AuthForm;
