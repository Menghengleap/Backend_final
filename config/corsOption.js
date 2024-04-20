const whitelist = [
    'https://www.yoursite.com',  // Make sure the domain is spelled correctly
    'http://127.0.0.1:5500',     // Your local development environment
    'http://localhost:3500'      // Another local development environment
];

const corsOptions = {
    origin: (origin, callback) => {
        // Check if the origin is in the whitelist or if the request is sent from the same-origin
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            // If the origin is not allowed, send an error with a message to that effect
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200  // Corrected the property name to 'optionsSuccessStatus'
};

module.exports = corsOptions;
