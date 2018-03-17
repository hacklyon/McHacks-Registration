var User = require('./models/User');

module.exports = function (app) {

    app.get('/brochure', function (req, res) {
        res.redirect(process.env.BROCHURE);
    });

    // Application ------------------------------------------
    app.get('/', function (req, res) {
        res.sendfile('./app/client/index.html');
    });

    // Wildcard all other GET requests to the angular app
    app.get('*', function (req, res) {
        res.sendfile('./app/client/index.html');
    });

};
