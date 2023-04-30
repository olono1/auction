//Invoice.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Invoice() {
const { auctionId, userId, bidAmount } = useParams();
const [auctionName, setAuctionName] = useState('');
const [auctionDescription, setAuctionDescription] = useState('');
const [userEmail, setUserEmail] = useState('');

useEffect(() => {
  axios.get(`http://localhost:5000/invoice?auctionId=${auctionId}&userId=${userId}&bidAmount=${bidAmount}`)
  .then(res => {
setAuctionName(res.data.auctionName);
setAuctionDescription(res.data.auctionDescription);
setUserEmail(res.data.userEmail);
})
.catch(err => {
console.log(err);
})
}, [auctionId, userId, bidAmount]);

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