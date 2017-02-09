var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Movie = require('../models/movie');
var router = express.Router();
var limit = 3;

router.get('/', function (req, res) {
    console.log('movie list screen');

    var pageNumber = 1;

    var query = {};
    var options = {
        lean: true,
        page: pageNumber,
        limit: limit
    };

    Movie.paginate(query, options).then(function (result) {
        var totalPages;
        console.log('reminder is ' + result.total % limit);

        if (result.total % limit > 0) {
            totalPages = (result.total - result.total % limit) / limit + 1;
        } else {
            totalPages = result.total/limit;
        }
        console.log('total pages ' + totalPages);
        console.log(result);

        res.render('index', {movielist: result, user: req.user, limit: limit, pageNumber: pageNumber, totalPages: totalPages});
    });
});

router.get('/register', function (req, res) {
    res.render('register', {registerScreen: true});
});

router.post('/register', function (req, res) {
    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        // if (err) {
        //     // req.flash('message',"User already exists. Please choose another username");
        //     return res.render('register', {account: account, error: err});
        // }

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/register', // see text
            failureFlash: true // optional, see text as well
        })(req, res, function () {
            res.locals.messages = req.flash();
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    createAdmin(req, res);
    res.render('login', {user: req.user, loginScreen: true});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login', // see text
    failureFlash: true // optional, see text as well
}), function (req, res) {
    res.locals.messages = req.flash();
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

var createAdmin = function (req, res) {
    Account.register(new Account({username: 'admin'}), 'admin', function (err, account) {

        passport.authenticate('local')(req, res, function () {
            return done(null);
        });
    });
};

module.exports = router;
