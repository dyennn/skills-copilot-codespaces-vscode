// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments');

// Create server
http.createServer((req, res) => {
  // Parse request
  const urlObj = url.parse(req.url, true);
  const pathname = urlObj.pathname;
  const query = urlObj.query;

  // Router
  if (pathname === '/api/comments') {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    // Set response headers
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    // POST
    if (req.method === 'POST') {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        comments.add(JSON.parse(data));
        res.end(JSON.stringify(comments.getAll()));
      });
    }
    // GET
    if (req.method === 'GET') {
      res.end(JSON.stringify(comments.getAll()));
    }
    // OPTIONS
    if (req.method === 'OPTIONS') {
      res.end();
    }
  } else {
    const pathname = urlObj.pathname;
    const filepath = path.join(__dirname, pathname);
    fs.readFile(filepath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }
      res.end(data);
    });
  }
}).listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});