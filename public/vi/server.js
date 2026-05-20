const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3333;
const root = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.webp': 'image/webp',
    '.webm': 'video/webm'
};

http.createServer((req, res) => {
    let url = req.url.split('?')[0]; // Ignore query params
    
    // Redirect root to /vi/
    if (url === '/' || url === '/vi') {
        res.writeHead(302, { 'Location': '/vi/' });
        return res.end();
    }

    let localPath = url;
    if (url.startsWith('/vi/')) {
        localPath = url.substring(3); // Map /vi/path to ./path
    }

    if (localPath === '/' || localPath === '') localPath = '/index.html';

    let filePath = path.join(root, localPath);

    // Handle directory serving (e.g. /Pricing -> /Pricing/index.html)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // Handle extensionless URLs (e.g. /Pricing -> /Pricing/index.html if folder exists)
    if (!fs.existsSync(filePath) && !path.extname(filePath)) {
        const folderIndex = path.join(filePath, 'index.html');
        if (fs.existsSync(folderIndex)) {
            filePath = folderIndex;
        }
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.log(`[404] ${url} -> ${filePath}`);
            res.writeHead(404);
            res.end(`404: Not Found`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/vi`);
    console.log('Press Ctrl+C to stop');
});
