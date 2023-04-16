import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuctionList.css';

function AuctionList({ }) {
    const [auctions, setAuctions] = useState([
    { id: 1, name: "Auction 1", description: "This is the first auction", startingBid: 10, endDate: "2023-04-30T12:00:00Z" },
    { id: 2, name: "Auction 2", description: "This is the second auction", startingBid: 20, endDate: "2023-05-01T12:00:00Z" },
    { id: 3, name: "Auction 3", description: "This is the third auction", startingBid: 30, endDate: "2023-05-02T12:00:00Z" },]);

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
      <div>
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div key={auction.id} className="auction-link">
              <Link to={`/auctions/${auction.id}`}>{auction.name}</Link>
            </div>
          ))
        ) : (
          <div>No auctions available</div>
        )}
      </div>
    );
}

export default AuctionList;
