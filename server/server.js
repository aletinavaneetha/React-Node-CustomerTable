const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Customer',
  password: '12345',
  port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/customers', async (req, res) => {
  let { page, search, sortBy, sortOrder } = req.query;
  const limit = 20;

  page = parseInt(page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const offset = (page - 1) * limit ;
  let query = 'SELECT * FROM customers ';

  if (search && search !== 'nan') {
    search = search.replace(/[^\w\s]/gi, '');
    query += ` WHERE customer_name ILIKE '%${search}%' OR location ILIKE '%${search}%'`;
  }
  if (sortBy) {
    query += ` ORDER BY ${sortBy} ${sortOrder || 'ASC'}`;
  }

  query += ` LIMIT ${limit} OFFSET ${offset}`;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});