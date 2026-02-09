const waitPort = require('wait-port');
const mysql = require('mysql2');

const {
    MYSQL_HOST: HOST = 'localhost',
    MYSQL_USER: USER = 'root',
    MYSQL_PASSWORD: PASSWORD = 'password',
    MYSQL_DB: DB = 'todos',
} = process.env;

let pool;

async function init() {
    await waitPort({ 
        host: HOST, 
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DB,
        charset: 'utf8mb4',
    });

    console.log(`Connected to MySQL at ${HOST}`);
}

async function getItems() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todo_items', (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(item => ({
                ...item,
                completed: item.completed === 1,
            })));
        });
    });
}

async function getItem(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve(null);
            resolve({
                ...rows[0],
                completed: rows[0].completed === 1,
            });
        });
    });
}

module.exports = { init, getItems, getItem };
