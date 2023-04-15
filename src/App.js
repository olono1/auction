import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import AuctionPage from './AuctionPage';
import AuctionList from './AuctionList';

function App() {
  const [auctions, setAuctions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
      <nav>
        <ul>
          <Link to="/">Home</Link>
          <Link to="/log-out">Log Out</Link>
        </ul>
      </nav>
      <Routes>
        {auctions.map(auction => (
          <Route key={auction.id} path={`/auctions/${auction.id}`} element={<AuctionPage auction={auction} />} />
        ))}
        <Route path="/" element={<AuctionList/>} />
        <Route path="/log-out" element={<h1>Log Out</h1>} />
      </Routes>
    </Router>
  );
}



export default App;
