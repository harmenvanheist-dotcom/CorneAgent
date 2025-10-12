const { createServer: createHttpsServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const os = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;
const httpPort = process.env.HTTP_PORT || 8080; // HTTP redirect port (default: 8080)

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.crt')),
};

// Get local IP address for display
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpAddress();

app.prepare().then(() => {
  // HTTPS Server
  createHttpsServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}:${port}`);
    console.log(`> Access from other devices: https://${localIp}:${port}`);
  });

  // HTTP Redirect Server (redirects all HTTP traffic to HTTPS)
  createHttpServer((req, res) => {
    const host = req.headers.host || `localhost:${port}`;
    // Remove port from host if present, then add HTTPS port
    const hostWithoutPort = host.split(':')[0];
    const httpsUrl = `https://${hostWithoutPort}:${port}${req.url}`;
    
    res.writeHead(301, { 
      'Location': httpsUrl,
      'Content-Type': 'text/plain'
    });
    res.end(`Redirecting to ${httpsUrl}`);
  }).listen(httpPort, (err) => {
    if (err) {
      console.warn(`⚠ Could not start HTTP redirect server on port ${httpPort}:`, err.message);
    } else {
      console.log(`> HTTP redirect server running on http://${hostname}:${httpPort}`);
      console.log(`> http://localhost:${httpPort} → https://localhost:${port}`);
    }
  });
});










