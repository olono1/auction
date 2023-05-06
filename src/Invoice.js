//Invoice.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Invoice() {
  const [auctionName, setAuctionName] = useState('');
  const [auctionDescription, setAuctionDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const auctionId = searchParams.get('auctionId');
    const userId = searchParams.get('userId');
    const bidAmount = searchParams.get('bidAmount');

    axios.get('http://localhost:5000/auctions')
      .then(res => {
        const auction = res.data[auctionId - 1];
        setAuctionName(auction.name);
        setAuctionDescription(auction.description);
      })

    axios.get('http://localhost:5000/users')
      .then(res => {
        const user = res.data[userId - 1];
        setUserEmail(user.email);
      })

    setBidAmount(bidAmount);
  }, []);

  return (
    <div>
      <h1>Invoice</h1>
      <p>Auction Name: {auctionName}</p>
      <p>Auction Description: {auctionDescription}</p>
      <p>Bid Amount: {bidAmount}</p>
      <p>User Email: {userEmail}</p>
    </div>
  );
}

export default Invoice;
