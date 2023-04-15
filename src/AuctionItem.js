// AuctionListItem.js

import React from 'react';

function AuctionListItem({ auction }) {
  return (
    <div>
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <p>Starting bid: ${auction.startingBid}</p>
      <p>Ends on: {new Date(auction.endDate).toLocaleString()}</p>
    </div>
  );
}

export default AuctionListItem;
