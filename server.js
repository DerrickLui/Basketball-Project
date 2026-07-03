const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;

// Unity WebGL .gz files need Content-Encoding: gzip + correct Content-Type
app.use(express.static(path.join(__dirname, 'src'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.gz') {
      const inner = path.extname(filePath.slice(0, -3)).toLowerCase();
      const types = {
        '.js':   'application/javascript',
        '.wasm': 'application/wasm',
        '.data': 'application/octet-stream',
      };
      res.setHeader('Content-Type',     types[inner] || 'application/octet-stream');
      res.setHeader('Content-Encoding', 'gzip');
    } else if (ext === '.wasm') {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Fallback → index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`ShopNPlay Basketball Game running at http://localhost:${PORT}`);
});
