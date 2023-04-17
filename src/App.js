import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuctionPage from './AuctionPage';
import AuctionList from './AuctionList';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import './App.css';

function App() {
  const [auctions, setAuctions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/auctions')
      .then(res => {
        setAuctions(res.data);
      })
      .catch(err => {
        console.log(err);
      })

    axios.get('http://localhost:5000/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Router>
      {loggedIn ? (
        <nav className="navbar">
          <ul className="navbar-list">
            <li><LogoutButton setLoggedIn={setLoggedIn} /></li>
          </ul>
        </nav>
      ) : null}
      <Routes>
        {!loggedIn ? (
          <Route path="/" element={<LoginForm setLoggedIn={setLoggedIn} users={users} />} />
        ) : (
          <>
            <Route path="/" element={<AuctionList auctions={auctions} />} />
            {auctions.map(auction => (
              <Route key={auction.id} path={`/auctions/${auction.id}`} element={<AuctionPage auction={auction} />} />
            ))}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
