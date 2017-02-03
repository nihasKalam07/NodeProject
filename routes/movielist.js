var express = require('express');
var Movie = require('../models/movie');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('movie list screen');

    var query   = {};
    var options = {
        lean:     true,
        offset:   0,
        limit:    50
    };

    Movie.paginate(query, options).then(function(result) {
        console.log(result);
        res.render('movielist', { movielist : result, user : req.user });
    });
});

module.exports = router;
