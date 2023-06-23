const express = require('express');
const router = express.Router();

// Import the database connection
const database = require('../database');

router.get('/', function (request, response, next) {
  const query = "SELECT * FROM transactions ORDER BY id DESC";

  database.query(query, function (error, data) {
    if (error) {
      throw error;
    } else {
      response.render('transactions', {
        title: 'Transactions',
        action: 'list',
        sampleTransactions: data
      });
    }
  });
});

router.get('/add', function (request, response, next) {
  response.render('transactions', {
    title: 'Insert Transaction Data',
    action: 'add'
  });
});

router.post('/add_transactions', function (request, response, next) {
  const flag = request.body.flag;
  const date = request.body.date;
  const head = request.body.head;
  const account_name = request.body.account_name;
  const debit = request.body.debit;
  const credit = request.body.credit;

  const query = `INSERT INTO transactions (flag, date, head, account_name, debit, credit) VALUES (?, ?, ?, ?, ?, ?)`;

  database.query(query, [flag, date, head, account_name, debit, credit], function (error, data) {
    if (error) {
      throw error;
    } else {
      response.redirect('/transactions');
    }
  });
});

// Route for editing a transaction
router.get('/edit_transaction/:id', function (request, response, next) {
  const id = request.params.id;

  // Construct the SQL query to fetch the transaction with the specified ID
  const query = `SELECT * FROM transactions WHERE id = ?`;

  // Execute the query
  database.query(query, [id], function (error, data) {
    if (error) {
      throw error;
    } else {
      response.render('transactions', {
        title: 'Edit Transactions',
        action: 'edit',
        sampleTransactions: data[0]
      });
    }
  });
});

// POST UPDATED TRANSACTION
router.post('/edit/:id', function (request, response, next) {
  const id = request.params.id;
  const flag = request.body.flag;
  const date = request.body.date;
  const head = request.body.head;
  const account_name = request.body.account_name;
  const debit = request.body.debit;
  const credit = request.body.credit;

  const query = `UPDATE transactions SET flag = ?, date = ?, head = ?, account_name = ?, debit = ?, credit = ? WHERE id = ?`;

  database.query(query, [flag, date, head, account_name, debit, credit, id], function (error, data) {
    if (error) {
      throw error;
    } else {
      response.redirect('/transactions');
    }
  });
});

module.exports = router;