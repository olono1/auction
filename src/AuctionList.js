import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuctionList.css';

function AuctionList({ userId}) {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:5000/auctions')
        .then(res => {
          setAuctions(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }, [auctions]);

    const addAuction = (e) => {
      e.preventDefault();
      const name = e.target[0].value;
      const description = e.target[1].value;
      axios.post('http://localhost:5000/auctions', { name, description, userId })
        .then(res => {
          setAuctions([...auctions, res.data]);
        }
      );
    };


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
        {/** Create a form for adding a new auction to DB */}
        <form onSubmit={addAuction}>
          <input type="text" placeholder="Auction name" />
          <input type="text" placeholder="Auction description" />
          <button type="submit">Add auction</button>
        </form>

      </div>
    );
}


export default AuctionList;
