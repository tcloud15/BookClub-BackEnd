const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    //host: 'mal.cs.plu.edu',
    host: 'localhost',
    port: '2000',
    user: 'Bookclub',
    password: 'Capstone1819',
    database: 'Bookclub2018'
});
//exports query so any file that needs database information can require db-module.js
module.exports = {
    query
};

function query(text, params, callback) {
    return new Promise((resolve, reject) => {
        return pool.query(text, params, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        }).result
    })
}
