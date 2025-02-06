const Pool = require('../server/node_modules/pg').Pool;

const pool = new Pool({
    user:'postgres',
    password:'azert',
    host:'localhost',
    port:8080,
    database:'yalta'
});

module.exports = pool;

