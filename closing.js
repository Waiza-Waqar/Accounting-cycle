const express = require('express');
const router = express.Router();
const connection = require('../database');

router.get('/', (req, res) => {
  const closingEntriesQuery = `
    SELECT
      account_name,
      CASE WHEN head = 'revenue' THEN SUM(credit) - SUM(debit) ELSE 0 END AS closing_debit,
      CASE WHEN head = 'expense' THEN SUM(debit) - SUM(credit) ELSE 0 END AS closing_credit
    FROM transactions
    WHERE head IN ('revenue', 'expense')
    GROUP BY account_name, head;
  `;
//flag AS flag
  connection.query(closingEntriesQuery, (error, closingEntriesResults) => {
    if (error) {
      throw error;
    } else {
      const closingEntries = closingEntriesResults.map((entry) => {
        return {
          account_name: entry.account_name,
          closing_debit: entry.closing_debit,
          closing_credit: entry.closing_credit
        };
      
      });
    
      res.render('closing', { closingEntries: closingEntries });
    }
  });
});

module.exports = router;