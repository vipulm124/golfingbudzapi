
module.exports = function (app, pool) {

    require('./api/user.api')(app, pool);
    require('./api/auth.api')(app, pool);
    require('./api/post.api')(app, pool);
    require('./api/country.api')(app, pool);
    require('./api/friend.api')(app, pool);
    require('./api/event.api')(app, pool);
    require('./api/page.api')(app, pool);
    require('./api/round.api')(app, pool);
    require('./api/blog.api')(app, pool);
    require('./api/playRequest.api')(app, pool);
    require('./api/notification.api')(app, pool);
    require('./api/contact.api')(app, pool);
    require('./api/faq.api')(app, pool);
    require('./api/metadata.api')(app, pool);

    app.get('/', function (req, res) {
        res.send("Welcome to GolfBudz api. For access, please contact system admin :-" + process.env.NODE_ENV);
    });

    app.get('/docs', function (req, res) {
        res.sendFile('./docs/index.html');
    });
};