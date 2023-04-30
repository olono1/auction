import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuctionPage from './AuctionPage';
import AuctionList from './AuctionList';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import Invoice from './Invoice';
import axios from 'axios';
import './App.css';

function App() {
  const [auctions, setAuctions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);

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

      //Check if user is logged in
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setLoggedIn(true);
        setUserId(user.id);
      }
  }, []);

  return (
    <Router>
      {loggedIn ? (
        <nav className="navbar">
          <ul className="navbar-list">
            {loggedIn ? (
              <>
                <li><Link to="/" className="home">Home</Link></li>
                <li className="ml-auto"><LogoutButton setLoggedIn={setLoggedIn} setUserId={setUserId} /></li>
              </>
            ) : null}
          </ul>
        </nav>
      ) : null}
      <Routes>
        {!loggedIn ? (
          <Route path="/" element={<LoginForm setLoggedIn={setLoggedIn} setUserId={setUserId} users={users} />} />
        ) : (
          <>
            <Route path="/" element={<AuctionList auctions={auctions} userId={userId} />} />
            {auctions.map(auction => (
              <Route key={auction.id} path={`/auctions/${auction.id}`} element={<AuctionPage auction={auction} userId={userId}/>} />
            ))}
            <Route path="/invoice" element={<Invoice />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
