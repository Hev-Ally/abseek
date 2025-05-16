import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Register the user
    const registerResponse = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (registerResponse.ok) {
      // Step 2: Login user immediately after registration
      const loginResponse = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        alert('Registration and login successful!');
        navigate('/staff-dashboard');
      } else {
        alert('Registered, but login failed.');
      }
    } else {
      alert('Registration failed. Please check your input.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Register
        </button>
      </form>
    </div>
  );
}

