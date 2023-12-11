const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  try {
    const { data } = await axios.get('https://example.com');
    const $ = cheerio.load(data);

    // Perform scraping or manipulation here

    res.json({ result: 'Scraping completed' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});