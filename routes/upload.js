var express = require('express');
var passport = require('passport');
var Movie = require('../models/movie');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/', function (req, res) {
    console.log('upload screen');
    res.render('upload', { user : req.user });
});

var cpUpload = upload.fields([{ name: 'movieAvatar', maxCount: 1 }, { name: 'movieVideo', maxCount: 1 }])
router.post('/', cpUpload, function (req, res, next) {
    console.log(req.body.movieName + req.body.movieDetails);
    console.log(req.files['movieAvatar']);
    console.log(req.files['movieVideo']);
    var avatar = req.files['movieAvatar'][0];
    var video = req.files['movieVideo'][0];

    req.checkBody("movieName", "Movie name cannot be empty").notEmpty();
    req.checkBody("movieDetails", "Movie Details cannot be empty").notEmpty();

    if(req.files['movieAvatar'] === 'undefined') {
        var err = {
            message : "Please do attach Avatar image"
        }
        console.log("Please do attach Avatar image");
        res.render('error', { error: err });
    }

    else if(req.files['movieVideo'] === 'undefined') {
        var err = {
            message : "Please do attach video"
        }
        console.log("Please do attach video");
        res.render('error', { error: err });
    }

    var errors = req.validationErrors();
    if (errors) {
        // return next(errors);

        console.log('error   ' + errors);
        var err = {
            message : errors[0].msg
        }
        req.flash('message',errors[0].msg);
        res.render('upload');
        // return;
    } else {
        // normal processing here


        var movie = new Movie({
            name: req.body.movieName,
            details: req.body.movieDetails,
            avatarName: avatar.originalname,
            avatarUrl: avatar.filename,
            videoName: video.originalname,
            videoUrl: video.filename
        });

        movie.save(function (err) {
            if (err)
                throw err;
            else
                console.log('save movie successfully...');
        });

        res.redirect('/');
    }
});

module.exports = router;
