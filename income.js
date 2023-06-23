const express = require('express');
const router = express.Router();
const connection = require('../database');

//INCOME STATEMENT CODE

/* 
router.get('/', (req, res) => {
  const netIncomequery = `
    SELECT
      SUM(CASE WHEN head = 'revenue' THEN debit ELSE 0 END) AS revenueDebit,
      SUM(CASE WHEN head = 'revenue' THEN credit ELSE 0 END) AS revenueCredit,
      SUM(CASE WHEN head = 'expense' THEN debit ELSE 0 END) AS expenseDebit,
      SUM(CASE WHEN head = 'expense' THEN credit ELSE 0 END) AS expenseCredit
    FROM transactions
    WHERE head IN ('revenue', 'expense')
  `;

  connection.netIncomequery(netIncomequery, (error, results) => {
    if (error) {
      console.error('Database Error:', error);
      throw error;
    } else {
      var incomeStatement = {
        revenueDebit: results[0].revenueDebit,
        revenueCredit: results[0].revenueCredit,
        expenseDebit: results[0].expenseDebit,
        expenseCredit: results[0].expenseCredit
      };

      var totalRevenue = incomeStatement.revenueCredit - incomeStatement.revenueDebit;
      var totalExpense = incomeStatement.expenseDebit - incomeStatement.expenseCredit;

      var netIncome = totalRevenue - totalExpense;

      res.render('income', { incomeStatement, netIncome });
    }
  });
}); */

// Route for generating the income statement
router.get('/', (req, res) => {
  // Query the database to retrieve revenue and expense data
  const incomeQuery = `
    SELECT
      SUM(CASE WHEN head = 'revenue' THEN debit ELSE 0 END) AS revenueDebit,
      SUM(CASE WHEN head = 'revenue' THEN credit ELSE 0 END) AS revenueCredit,
      SUM(CASE WHEN head = 'expense' THEN debit ELSE 0 END) AS expenseDebit,
      SUM(CASE WHEN head = 'expense' THEN credit ELSE 0 END) AS expenseCredit
    FROM transactions
    WHERE head IN ('revenue', 'expense')
  `;

  connection.query(incomeQuery, (error, incomeResults) => {
    if (error) {
      throw error;
    } else {
      const incomeStatement = {
        revenueDebit: incomeResults[0].revenueDebit || 0,
        revenueCredit: incomeResults[0].revenueCredit || 0,
        expenseDebit: incomeResults[0].expenseDebit || 0,
        expenseCredit: incomeResults[0].expenseCredit || 0
      };

      // Calculate net income

      var totalRevenue = incomeStatement.revenueCredit - incomeStatement.revenueDebit;
      var totalExpense = incomeStatement.expenseDebit - incomeStatement.expenseCredit;

      var netIncome = totalRevenue - totalExpense;


      //------------------- OWNER EQUITY STATEMNET--------------------------------//
      // Query the database to retrieve owner's capital and withdrawal data
      const ownerQuery = `
        SELECT
        SUM(CASE WHEN head = 'owner_capital' THEN debit ELSE 0 END) AS ownerCapitalDebit,
        SUM(CASE WHEN head = 'owner_capital' THEN credit ELSE 0 END) AS ownerCapitalCredit,
        SUM(CASE WHEN head = 'owner_withdrawal' THEN debit ELSE 0 END) AS ownerWithdrawalDebit,
        SUM(CASE WHEN head = 'owner_withdrawal' THEN credit ELSE 0 END) AS ownerWithdrawalCredit
        FROM transactions
        WHERE head IN ('owner_capital', 'owner_withdrawal')
      `;

      connection.query(ownerQuery, (error, ownerResults) => {
        if (error) {
          throw error;
        } else {

          //ownercapital var:
          const ownerEquityStatement = {
            ownerCapitalDebit: ownerResults[0].ownerCapitalDebit || 0,
            ownerCapitalCredit: ownerResults[0].ownerCapitalCredit || 0,
            ownerWithdrawalDebit: ownerResults[0].ownerWithdrawalDebit || 0,
            ownerWithdrawalCredit: ownerResults[0].ownerWithdrawalCredit || 0
          };


          //        const ownerCapital = ownerResults[0]?.ownerCapital || 0;
          //        const ownerWithdrawal = ownerResults[0]?.ownerWithdrawal || 0;

          //Caculating owner calital debit and credit

          var totalOwnerCapital = ownerEquityStatement.ownerCapitalCredit - ownerEquityStatement.ownerCapitalDebit;
          var totalOwnerWithdrawal = ownerEquityStatement.ownerWithdrawalDebit - ownerEquityStatement.ownerWithdrawalCredit;

          const ownerEquity = parseFloat(totalOwnerCapital) + parseFloat(netIncome) - parseFloat(totalOwnerWithdrawal);

          // Format the owner equity with parentheses if it's negative
          const formattedOwnerEquity = ownerEquity < 0 ? `(${Math.abs(ownerEquity).toLocaleString()})` : ownerEquity.toLocaleString();

          // Render the income statement view and pass the variables
          //  res.render('income', { incomeStatement, netIncome, ownerEquityStatement, totalOwnerCapital, totalOwnerWithdrawal, ownerEquity: formattedOwnerEquity });



          //---------------BALANCE SHEET---------------------//
          const balanceSheetQuery = `
          SELECT
            SUM(CASE WHEN head = 'asset' THEN debit ELSE 0 END) AS assetDebit,
            SUM(CASE WHEN head = 'asset' THEN credit ELSE 0 END) AS assetCredit,
            SUM(CASE WHEN head = 'liability' THEN debit ELSE 0 END) AS liabilityDebit,
            SUM(CASE WHEN head = 'liability' THEN credit ELSE 0 END) AS liabilityCredit
          FROM transactions
          WHERE head IN ('asset', 'liability')
        `;

          connection.query(balanceSheetQuery, (error, balanceSheetResults) => {
            if (error) {
              throw error;
            } else {
              const balanceSheet = {
                assetDebit: balanceSheetResults[0].assetDebit || 0,
                assetCredit: balanceSheetResults[0].assetCredit || 0,
                liabilityDebit: balanceSheetResults[0].liabilityDebit || 0,
                liabilityCredit: balanceSheetResults[0].liabilityCredit || 0
              };
              // Calculate total assets and total liabilities
              var totalAssets = balanceSheet.assetDebit - balanceSheet.assetCredit;
              var totalLiabilities = balanceSheet.liabilityCredit - balanceSheet.liabilityDebit;

              // Calculate total liabilities and equity
              var totalLiabilitiesAndEquity = totalLiabilities + ownerEquity;
              // Format the amounts with parentheses if they are negative
              const formattedTotalAssets = totalAssets < 0 ? `(${Math.abs(totalAssets).toLocaleString()})` : totalAssets.toLocaleString();
              const formattedTotalLiabilities = totalLiabilities < 0 ? `(${Math.abs(totalLiabilities).toLocaleString()})` : totalLiabilities.toLocaleString();
              //const formattedTotalEquity = totalEquity < 0 ? `(${Math.abs(totalEquity).toLocaleString()})` : totalEquity.toLocaleString();
              const formattedTotalLiabilitiesAndEquity = totalLiabilitiesAndEquity < 0 ? `(${Math.abs(totalLiabilitiesAndEquity).toLocaleString()})` : totalLiabilitiesAndEquity.toLocaleString();
              // Render the balance sheet view and pass the variables

              res.render('income', { incomeStatement, netIncome, ownerEquityStatement, totalOwnerCapital, totalOwnerWithdrawal, ownerEquity: formattedOwnerEquity , balanceSheet,
                totalAssets: formattedTotalAssets, totalLiabilities: formattedTotalLiabilities, totalLiabilitiesAndEquity: formattedTotalLiabilitiesAndEquity});

              /* res.render('income', {
                 incomeStatement, netIncome, ownerEquityStatement, totalOwnerCapital, totalOwnerWithdrawal, ownerEquity: formattedOwnerEquity,
                 balanceSheet,
                 totalAssets: formattedTotalAssets,
                 totalLiabilities: formattedTotalLiabilities,
                 totalEquity: formattedTotalEquity,
                 totalLiabilitiesAndEquity: formattedTotalLiabilitiesAndEquity
               });*/
            }

          });

        }
      });
    }
  });
});

module.exports = router;