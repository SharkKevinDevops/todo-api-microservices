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

    return new Promise((resolve, reject) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean) DEFAULT CHARSET utf8mb4',
            err => {
                if (err) return reject(err);
                console.log(`Connected to MySQL at ${HOST}`);
                resolve();
            }
        );
    });
}

async function storeItem(item) {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

async function updateItem(id, item) {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE todo_items SET name=?, completed=? WHERE id=?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

async function removeItem(id) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM todo_items WHERE id = ?', [id], err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { init, storeItem, updateItem, removeItem };
