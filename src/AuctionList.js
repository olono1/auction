import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';




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
        {auctions.map(auction => (
            <div key={auction.id}>
                <Link to={`/auctions/${auction.id}`}>{auction.name}</Link>
            </div>
        ))}
        </div>
    );
} 

export default AuctionList;