require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); // require the file system module
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const connect = require('http2');
const connectDB = require('./config/database');

connectDB();
// Database connection
require('./config/database');

// Body parser middleware to handle JSON data
app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/states', require('./routes/states'));


app.get('^/$|index(.html)?', (req, res) => {
    // res.sendFile('./views/index.html', { root:_});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
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

