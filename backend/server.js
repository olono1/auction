const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let auctions = [
  { id: 1, name: "Auction 1", description: "This is the first auction", startingBid: 10, endDate: "2023-04-30T12:00:00Z", ended: false },
  { id: 2, name: "Auction 2", description: "This is the second auction", startingBid: 20, endDate: "2023-05-01T12:00:00Z", ended: false },
  { id: 3, name: "Auction 3", description: "This is the third auction", startingBid: 30, endDate: "2023-05-02T12:00:00Z", ended: false },
];

let bids = [];

let users = [
  { id: 1, email: 'aaa@aaa.aaa', password: 'aaa', username: 'aaa' },
  { id: 2, email: 'bbb@bbb.bbb', password: 'bbb', username: 'bbb' },
  { id: 3, email: 'ccc@ccc.ccc', password: 'ccc', username: 'ccc' },
];

app.get('/auctions', (req, res) => {
  res.send(auctions);
});

app.get('/bids', (req, res) => {
  const auctionId = req.query.auctionId;
  const filteredBids = bids.filter(bid => bid.auctionId == auctionId);
  res.send(filteredBids);
});

app.get('/users', (req, res) => {
  res.send(users);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email == email && user.password == password);
  if (user) {
    res.status(200).send({ message: "Login successful", user: { id: user.id, email: user.email } });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});


app.post('/bids', (req, res) => {
  const { amount, auctionId, userId } = req.body;
  const highestBid = bids.filter((bid) => bid.auctionId == auctionId).sort((a, b) => b.amount - a.amount)[0];
  if (highestBid && amount <= highestBid.amount) {
    res.status(400).send({ message: 'Bid amount must be higher than the current highest bid' });
  } else {
    const newBid = { id: bids.length + 1, amount, auctionId, userId };
    bids.push(newBid);
    res.status(201).send(newBid);
  }
});

app.put('/auctions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const auction = auctions.find(auction => auction.id === id);
  auction.ended = true;
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});