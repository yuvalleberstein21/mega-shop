const express = require('express');
const db = require('./DB/database');

const app = express();



app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) console.log(err)
        res.send(result);
    })
});


app.get('/', (req, res) => {
    res.send('working')
});


app.listen(8001, () => console.log('Server running on port 8001'))