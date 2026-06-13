const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from AWS EC2!', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('API running on port 5000');
});