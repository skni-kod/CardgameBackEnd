const PORT = process.env.PORT || 5000;
const express = require('express');
const { Client } = require('pg');

const app = express();

// connection to Heroku postgresql
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


module.express = app;