const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let connection;

async function main() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'demo',
    database: 'e_auction'
  });

  console.log('Connected to database');

  let auctions = await connection.query('SELECT * FROM auctions');
  let bids = await connection.query('SELECT * FROM bids');
  let users = await connection.query('SELECT * FROM users');

  auctions = auctions[0];
  bids = bids[0];
  users = users[0];

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

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows, fields] = await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      const user = rows[0];
      res.status(200).send({ message: "Login successful", user: { id: user.id, email: user.email } });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  });

  app.post('/bids', async (req, res) => {
    const { amount, auctionId, userId } = req.body;
    const [highestBidRows, highestBidFields] = await connection.execute('SELECT * FROM bids WHERE auctionId = ? ORDER BY amount DESC LIMIT 1', [auctionId]);
    const highestBid = highestBidRows[0];
    if (highestBid && amount <= highestBid.amount) {
      res.status(400).send({ message: 'Bid amount must be higher than the current highest bid' });
    } else {
      const [result, fields] = await connection.execute('INSERT INTO bids (amount, auctionId, userId) VALUES (?, ?, ?)', [amount, auctionId, userId]);
      const newBid = { id: result.insertId, amount, auctionId, userId };
      res.status(201).send(newBid);
    }
  });

  app.put('/auctions/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await connection.execute('UPDATE auctions SET ended = true WHERE id = ?', [id]);
    res.status(200).send({ message: 'Auction ended successfully' });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main().catch(err => console.error(err));