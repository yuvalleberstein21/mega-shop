const express = require('express');
const db = require('./DB/database');
const cors = require('cors')
const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

app.get('/api/products', (req, res) => {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // set the limit of items per page

    let startValue;
    let endValue;


    if (page > 0) {
        startValue = (page - 1) * limit; // 0, 10, 20, 30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = limit;
    }

    const intLimit = parseInt(limit, 10);

    db.query(`SELECT c.title as category, p.title as name, p.price, p.quantity, p.description, p.short_desc, p.image, p.id
        FROM products as p
        JOIN categories as c ON c.id = p.cat_id
        ORDER BY id DESC
        LIMIT ?, ?`, [startValue, intLimit], (err, prods) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error occurred while fetching products" });
        }

        if (prods.length > 0) {
            res.status(200).json({
                count: prods.length,
                products: prods
            });
        } else {
            res.json({ message: "No products found" });
        }
    });
});

app.get('/api/products/:prodId', (req, res) => {

    let productId = req.params.prodId;


    db.query(`SELECT c.title as category, p.title as name, p.price, p.quantity, p.description, p.image, p.id, p.images
        FROM products as p
        JOIN categories as c ON c.id = p.cat_id
        WHERE p.id = ?`, [productId], (err, prods) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error occurred while fetching products" });
        }

        if (prods.length > 0) {
            res.status(200).json({
                count: prods.length,
                products: prods
            });
        } else {
            res.json({ message: "No products found" });
        }
    });

});

app.get('/api/products/category/:catName', (req, res) => {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // set the limit of items per page

    let startValue;
    let endValue;


    if (page > 0) {
        startValue = (page - 1) * limit; // 0, 10, 20, 30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = limit;
    }

    const intLimit = parseInt(limit, 10);

    const cat_title = req.params.catName;

    db.query(`SELECT c.title as category, p.title as name, p.price, p.quantity, p.description, p.short_desc, p.image, p.id
        FROM products as p
        JOIN categories as c ON c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'
        ORDER BY id DESC
        LIMIT ?, ?`, [startValue, intLimit], (err, prods) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error occurred while fetching products" });
        }

        if (prods.length > 0) {
            res.status(200).json({
                count: prods.length,
                products: prods
            });
        } else {
            res.json({ message: `No products found from ${cat_title} category.` });
        }
    });

});




app.get('/', (req, res) => {
    res.send('working')
});


app.listen(8001, () => console.log('Server running on port 8001'))