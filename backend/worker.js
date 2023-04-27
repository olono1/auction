import { Client, logger } from 'camunda-external-task-client-js';
import open from 'open';
import mysql from 'mysql2/promise';

const worker = async () => {
  // configuration for the Client:
  //  - 'baseUrl': url to the Process Engine
  //  - 'logger': utility to automatically log important events
  //  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
  const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

  let connection;

  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'demodemo',
    database: 'e_auction'
  })
  .catch(err => console.error(err));  
  

  // create a Client instance with custom configuration
  const client = new Client(config);

  // susbscribe to the topic: 'charge-card'
  client.subscribe('charge-card', async function({ task, taskService }) {
    // Put your business logic here

    // Get a process variable
    const amount = task.variables.get('amount');
    const item = task.variables.get('item');
    const bidAmount = task.variables.get('field_1e6lk1j');

    //Populate select with options


    console.log(`Charging credit card with an amount of ${amount}€ for the item '${item}'...`);
    console.log(`Bid amount: ${bidAmount}`);

    open('https://docs.camunda.org/get-started/quick-start/success');

    // Complete the task
    await taskService.complete(task);
  });

  client.subscribe('auction-exist' , async function({ task, taskService }) {
    const auctionId = task.variables.get('auctionId');
    const [rows] = await connection.query('SELECT * FROM auctions WHERE id = ?', [auctionId]);
    if (rows.length > 0) {
      await taskService.complete(task);
    } else {
      await taskService.handleFailure(task, {
        errorMessage: 'Auction does not exist',
        errorDetails: 'Auction does not exist',
        retries: 0
      });
    }
  });

  client.subscribe('user-exist' , async function({ task, taskService }) {
    const userId = task.variables.get('userId');
    console.log(userId);
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    console.log(rows);
    if (rows.length > 0) {
      await taskService.complete(task);
    } else {
      await taskService.handleFailure(task, {
        errorMessage: 'User does not exist',
        errorDetails: 'User does not exist',
        retries: 0
      });
    }
  });

  client.subscribe('bid-create', async function({ task, taskService }) {
    const auctionId = task.variables.get('auctionId');
    const userId = task.variables.get('userId');
    const bidAmount = task.variables.get('bidAmount');
    const [result, fields] = await connection.execute('INSERT INTO bids (amount, auctionId, userId) VALUES (?, ?, ?)', [bidAmount, auctionId, userId]);
    await taskService.complete(task);
  });

  client.subscribe('show-invoice', async function({ task, taskService }) {
    const auctionId = task.variables.get('auctionId');
    const userId = task.variables.get('userId');
    const bidAmount = task.variables.get('bidAmount');
    open(`http://localhost:3000/invoice?auctionId=${auctionId}&userId=${userId}&bidAmount=${bidAmount}`);
    await taskService.complete(task);
  });


  client.subscribe('send-email', async function({ task, taskService }) {
    console.log('Sending email...');
    await taskService.complete(task);
  });
};

export default worker;