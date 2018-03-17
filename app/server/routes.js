var User = require('./models/User');

module.exports = function (app) {

    app.get('/brochure', function (req, res) {
        let url = process.env.BROCHURE;
        if(req.params.download)
            url += "&export=download";
        res.redirect(url);
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
