import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import worker from './worker.js';
import { Client, logger } from 'camunda-external-task-client-js';
import open from 'open';
import mysql from 'mysql2/promise';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let connection;

async function main() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'demodemo',
    database: 'e_auction'
  })
  .catch(err => console.error(err));  

  console.log('Connected to database');

  let auctions = await connection.query('SELECT * FROM auctions');
  let users = await connection.query('SELECT * FROM users');

  auctions = auctions[0];
  users = users[0];

  app.get('/auctions', (req, res) => {
    res.send(auctions);
  });

  app.get('/bids', async (req, res) => {
    const auctionId = req.query.auctionId;
    const [rows] = await connection.query('SELECT * FROM bids WHERE auctionId = ?', [auctionId]);
    res.send(rows);
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

  app.post('/users', (req, res) => {
    const { email, password, username } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email field is required' });
    }
    const newUser = { email, password, username };
    connection.query('INSERT INTO users SET ?', newUser, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User created successfully', id: results.insertId });
    });
  });

  app.put('/auctions/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await connection.execute('UPDATE auctions SET ended = true WHERE id = ?', [id]);
    res.status(200).send({ message: 'Auction ended successfully' });
  });

  app.post('/auctions', async (req, res) => {
    const { name, description, userId } = req.body;
    const [result, fields] = await connection.execute('INSERT INTO auctions (name, description, userId, ended) VALUES (?, ?, ?, 0)', [name, description, userId]);
    const newAuction = { id: result.insertId, name, description, userId };
    res.status(201).send(newAuction);
  });

  // Create an Invoice GET endpoint that takes as parameters the auction and user and bid and send the invoice to the user
  app.get('/invoice', async (req, res) => {
    const auctionId = req.query.auctionId;
    const userId = req.query.userId;
    const bidId = req.query.bidId;
    const [auctionRows] = await connection.query('SELECT * FROM auctions WHERE id = ?', [auctionId]);
    const [bidRows] = await connection.query('SELECT * FROM bids WHERE id = ?', [bidId]);
    const [userRows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    const auction = auctionRows[0];
    const invoice = {
      auctionName: auction.name,
      auctionDescription: auction.description,
      bidAmount: bidRows[0].amount,
      userEmail: userRows[0].email
    };
    res.send(invoice);
  });




  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    worker();
  });
}

main().catch(err => console.error(err));