const express = require('express');
const router = express.Router();
const connection = require('../database');


router.get('/', (req, res) => {
    const trialBalanceQuery = `
        SELECT
            head,
            account_name,
            SUM(CASE WHEN debit > 0 THEN debit ELSE 0 END) AS debit,
            SUM(CASE WHEN credit > 0 THEN credit ELSE 0 END) AS credit
        FROM transactions
        GROUP BY head, account_name
    `;

    connection.query(trialBalanceQuery, (error, balanceResults) => {
        if (error) {
            throw error;
        } else {
            const trialBalance = balanceResults.map((account) => {
                return {
                    head: account.head,
                    account_name: account.account_name,
                    debit: account.debit,
                    credit: account.credit
                };
            });
           


            // Calculate total debit and credit
            const totalDebit = trialBalance.reduce((total, account) => total + account.debit, 0);
            const totalCredit = trialBalance.reduce((total, account) => total + account.credit, 0);

            res.render('trialbalances', { trialBalance, totalDebit, totalCredit });
        }
    });
});

module.exports = router;