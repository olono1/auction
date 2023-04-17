import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = props.users.find((user) => user.email === email && user.password === password);
    if (user) {
      props.setLoggedIn(true);
      props.setUserId(user.id);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          className="form-input"
          required
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="form-input"
          required
        />
        <button type="submit" className="form-submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
