const mysql = require('mysql');

//Create Connection

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'ca_cycle',
    user: 'root',
    password: ''
});
connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('MySQL Database is connected Successfully');
    // Create table
    var createTableSql = `CREATE TABLE IF NOT EXISTS transactions (
        id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        flag ENUM('normal', 'adjustment', 'close') NOT NULL,
        account_id INT(25),
        date DATE,
        head ENUM('asset', 'liability', 'owner_capital','expense','revenue','owner_withdrawal') NOT NULL,
        account_name VARCHAR(255),
        debit DECIMAL(10, 2),
        credit DECIMAL(10, 2)
    )`;
    connection.query(createTableSql, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Table created');
        }
    });

/*      var alterQuery = 'ALTER TABLE transactions ADD COLUMN head ENUM("asset", "liability", "owner_equity", "expense", "revenue", "owner_withdrawal") NOT NULL AFTER `date`';
    connection.query(alterQuery, (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Table altered');
            // Once the table is altered, you can proceed with the INSERT query
            var query = `INSERT INTO transactions (flag, account_id, date, head, account_name, debit, credit) VALUES ("${flag}", "${account_id}", "${date}", "${head}", "${account_name}", "${debit}", "${credit}")`;

            connection.query(query, (error, data) => {
                if (error) throw error;
                else {
                    response.redirect("/transactions");
                }
            });
        }
    }); */

}

/*           // Add column
          var addColumnSql = `ALTER TABLE transactions ADD COLUMN head ENUM('asset', 'liability', 'owner_equity', 'expense', 'revenue', 'owner_withdrawal') NOT NULL AFTER date`;
          connection.query(addColumnSql, (error, result) => {
              if (error) {
                  console.log(error);
              } else {
                  console.log('Column added');
              } 
          }); */
/*               var alterTableSql = 'ALTER TABLE transactions DROP COLUMN account_id';
          connection.query(alterTableSql, function (error, result) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('Column account_id deleted from transactions table');
              }
          });*/
});
module.exports = connection;


