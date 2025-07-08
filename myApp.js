const express = require('express');
const helmet = require('helmet');
const app = express(); 

// Configure Helmet using the 'parent' helmet() Middleware
// hidePoweredBy, xssFilter, and dnsPrefetchControl are enabled by default
// when using the parent helmet() middleware, so they don't need explicit configuration
// unless you want to disable them or change their default behavior.
const timeInseconds = 90 * 24 * 60 * 60;
app.use(helmet({
  frameguard: {         // Configure frameguard
    action: 'deny'
  },
  hsts: {               // Configure hsts
    maxAge: timeInseconds,
    force: true
  },
  noCache: true,        // Enable noCache (not enabled by default)
  contentSecurityPolicy: { // Enable and configure contentSecurityPolicy
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com']
    }
  }
}));


module.exports = app;
const api = require('./server.js'); // This specific disable is outside helmet, keep as is
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`fakellama info security app started on port ${port}`);
});
