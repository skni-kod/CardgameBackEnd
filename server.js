const app = require('./app');
const http = require('http');

const port = process.env.PORT || 8080;
const server = http.createServer(app);

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces'
    });
});

server.listen(port, () => {
    console.log('Działa Qrwa');
});