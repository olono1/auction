import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuctionList.css';

function AuctionList({ }) {
    const [auctions, setAuctions] = useState([]);

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
