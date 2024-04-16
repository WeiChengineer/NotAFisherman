const express = require('express');
const path = require('path');
const router = express.Router();

// Import API routes
const apiRouter = require('./api');

// Use API router for all '/api' endpoint calls
router.use('/api', apiRouter);

// CSRF token restore - for development only
if (process.env.NODE_ENV !== 'production') {
    // This route is only available in non-production environments
    router.get("/api/csrf/restore", (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("XSRF-TOKEN", csrfToken, {
            path: '/',
            httpOnly: true,  // Makes the cookie inaccessible to client-side JavaScript
            secure: false,   // Cookie is sent over HTTP in development
        });
        res.status(200).json({
            'XSRF-Token': csrfToken
        });
    });
}

// Serve static files and React application in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app build directory
    router.use(express.static(path.resolve(__dirname, '../../frontend/build')));

    // Serve the frontend's index.html file for all routes not starting with '/api'
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
            path: '/',
            httpOnly: true,  // Makes the cookie inaccessible to client-side JavaScript
            secure: true,    // Cookie is sent over HTTPS in production
        });
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });
}

//testing for auth phase0
if (process.env.NODE_ENV !== 'production') {
    router.post('/test', (req, res) => {
        console.log(req.body); 
        res.json({ requestBody: req.body }); 
    });
}

module.exports = router;
