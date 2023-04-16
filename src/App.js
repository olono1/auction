import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuctionPage from './AuctionPage';
import AuctionList from './AuctionList';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import './App.css';

function App() {
  const [auctions, setAuctions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  // Hardcoded user data
  const users = [
    { email: 'aaa@aaa.aaa', password: 'aaa' },
    { email: 'bbb@bbb.bbb', password: 'bbb' },
    { email: 'ccc@ccc.ccc', password: 'ccc' },
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/auctions')
      .then(res => {
        setAuctions(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <ul className="navbar-list">
          {loggedIn ? <li><LogoutButton setLoggedIn={setLoggedIn} /></li> : <li><Link className="navbar-link" to="/login">Login</Link></li>}
        </ul>
      </nav>
      <Routes>
        {loggedIn ? <Route path="/" element={<AuctionList auctions={auctions} />} /> : null}
        {auctions.map(auction => (
          <Route key={auction.id} path={`/auctions/${auction.id}`} element={<AuctionPage auction={auction} />} />
        ))}
        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} users={users} />} />
      </Routes>
    </Router>
  );
}

export default App;
