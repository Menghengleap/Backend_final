require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); // require the file system module
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { connect } = require('http2');

connectDB();
// Database connection
require('./config/database');

// Body parser middleware to handle JSON data
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.static(path.join(__dirname, '/public')));

app.use('/states', require('./routes/states'));
app.use('/', require('./routes/root'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('^/$|states(.json)?', (req, res) => {
    // res.sendFile('./views/index.html', { root:_});
    res.sendFile(path.join(__dirname, 'data', 'statesData.json'));
})
app.get('/^/$|new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})
app.get('/^/$|old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
});




app.get('/*',(req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})

