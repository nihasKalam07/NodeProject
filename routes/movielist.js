var express = require('express');
var Movie = require('../models/movie');
var router = express.Router();
var limit = 3;

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
        res.render('index', { movielist : result, user : req.user });
    });
});

router.get('/:pageNumber', function (req, res) {
    console.log('movie with pagination ' + req.params.pageNumber);
    var pageNumber = req.params.pageNumber ? req.params.pageNumber : 0;

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
        var params = {
            movielist: result,
            user: req.user,
            limit: limit,
            pageNumber: pageNumber,
            totalPages: totalPages,
            isSearch: false
        }
        res.render('index', params);
    });
});

router.get('/search/:pageNumber', function (req, res) {
    console.log('movie with pagination ' + req.params.pageNumber);
    var pageNumber = req.params.pageNumber ? req.params.pageNumber : 0;
    var searchKey = req.query.searchKey;
    console.log('search Key ' + req.query.searchKey);
    if(searchKey === '') {
        res.redirect('/');
        return;
    }

    var query = Movie.find({ "name":{$regex: searchKey, $options: "i"} });
    var options = {
        lean: true,
        page: pageNumber,
        limit: limit
    };

    Movie.paginate(query, options).then(function (result) {
        var totalPages;
        console.log(result);
        console.log('reminder is ' + result.total % limit);

        if (result.total % limit > 0) {
            totalPages = (result.total - result.total % limit) / limit + 1;
        } else {
            totalPages = result.total/limit;
        }
        console.log('total pages ' + totalPages);
        console.log(result);

        var params = {
            movielist: result,
            user: req.user,
            limit: limit,
            pageNumber: pageNumber,
            totalPages: totalPages,
            isSearch: true
        }

        res.render('index', params);
    });
});

module.exports = router;
