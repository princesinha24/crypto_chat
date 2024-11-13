import '../styles/header.css';

// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Headers = () => (
    <header className="header">
      <h1 className="logo">MyApp</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/message">Message</Link></li>
        </ul>
      </nav>
    </header>
);

export default Headers;