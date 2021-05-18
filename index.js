const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

app.use(express.static('client'));

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces'
    });
});

server.listen(PORT, function() {
    console.log('server running');
});

module.express = app;