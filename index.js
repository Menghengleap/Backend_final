require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); // require the file system module
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { connect } = require('http2');
const cors = require('cors');
const corsOptions = require('./config/corsOption');

connectDB();

app.use(cors(corsOptions));
// Database connection
require('./config/database');

// Body parser middleware to handle JSON data
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://dazzling-snickerdoodle-777101.netlify.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

<<<<<<< HEAD

=======
>>>>>>> b221db67c2a35e51779ed3c1b19ad3d6f10ba029
app.use('/',express.static(path.join(__dirname, '/public')));

app.use('/states', require('./routes/states'));
app.use('/', require('./routes/root'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
<<<<<<< HEAD
=======



>>>>>>> b221db67c2a35e51779ed3c1b19ad3d6f10ba029


app.get('/*',(req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})

