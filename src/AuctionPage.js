import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuctionPage.css';

function AuctionPage({ auction, userId }) {
  const [bids, setBids] = useState([]);
  const [users, setUsers] = useState([]);
  const [bidedAmount, setBidedAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/bids?auctionId=${auction.id}`)
      .then(res => {
        setBids(res.data);

        if (res.data.length === 3) {
          alert('Congratulations, you won the auction');
          generateInvoice(res.data); // call generateInvoice function after the alert
        }
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
  }, [, bidedAmount]);

  const bidAmount = (e) => {
    e.preventDefault();

    if (bids.length === 3) {
      alert('The auction has reached the maximum number of bids');
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://localhost:5000/bids", {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        "amount": bidedAmount,
        "auctionId": auction.id,
        "userId": userId
      })
    })
      .then(res => {
        if (res.status === 400) {
          alert('Bid is lower than the winning bid');
          return;
        }
        res.json().then(() => {
          setBidedAmount(0);
          setErrorMessage('');
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  const generateInvoice = (bids) => {
    // Create invoice HTML string
    let invoiceHTML = `<h2>Invoice for Auction ${auction.name}</h2>`;
    invoiceHTML += `<p>Winning Bid: ${Math.max(...bids.map(bid => bid.amount))}</p>`;
    invoiceHTML += `<h3>Bids</h3>`;
    invoiceHTML += `<ul>`;
    bids.forEach(bid => {
      invoiceHTML += `<li>${bid.amount} - ${users.find(user => user.id === bid.userId).username}</li>`;
    });
    invoiceHTML += `</ul>`;
  
    // Open a new window and print the invoice
    const invoiceWindow = window.open('', 'Invoice');
    invoiceWindow.document.write(invoiceHTML);
  };
  
  return (
    <div>
      <h2 className="auction_h2">{auction.name}</h2>
      <p className="auction_p">{auction.description}</p>
      <h2 className="auction_h2">Winning Bid</h2>
      {/**Find the max amount from the bids to this auction. If there is note, write a message */}
      {bids.length > 0 ? (
      <div>
      <p className="auction_p">{Math.max(...bids.map(bid => bid.amount))}</p>
      {/**Find the bid object with the highest amount, and get the corresponding user's username */}
      {users.length > 0 && (
        <p className="auction_p">{users.find(user => user.id === bids.reduce((prev, current) => prev.amount > current.amount ? prev : current).userId).username}</p>
      )}
      </div>
      ) : (
      <p className="auction_p">No bids yet</p>
      )}

      <h3 className="auction_h3">Bids</h3>
      <ul className="auction_ul">
        {bids.map(bid => (
          <li key={bid.id} className="auction_li">
            <p className="auction_p">{bid.amount}</p>
            {/**First check if users are fetched from server */}
            {users.length > 0 && (
            <p className="auction_p">{users.find(user => user.id === bid.userId).username}</p>
            )}
          </li>
        ))}
      </ul>
      {/** Give the user an option to enter an amount that he wants to bid. It cannot be lower that the winning bid
       * will send a POST request to the server with the amount and the auctionId and the userId
       */}
      <form onSubmit={bidAmount} className="auction_form"> 
        <input className="auction_input" type="number" value={bidedAmount} onChange={(e)=>setBidedAmount(e.target.value) } name="amount" />
        <button className="auction_button" type="submit">Bid</button>
      </form>
    </div>
  );
}

export default AuctionPage;