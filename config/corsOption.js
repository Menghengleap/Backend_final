const allowedOrigin = require('./allowOrigin');

const whitelist = [
    'https://www.yoursite.com',  // Make sure the domain is spelled correctly
    'http://127.0.0.1:5500',     // Your local development environment
    'http://localhost:3500'      // Another local development environment
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
