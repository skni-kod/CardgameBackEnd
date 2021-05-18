const express = require('express');

const app = express();

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces'
    });
});

module.express = app;