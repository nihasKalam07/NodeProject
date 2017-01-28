var express = require('express');
var passport = require('passport');
var Movie = require('../models/movie');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

router.get('/', function (req, res) {
    console.log('upload screen');
    res.render('upload', { user : req.user });
});

var cpUpload = upload.fields([{ name: 'movieAvatar', maxCount: 1 }, { name: 'movieVideo', maxCount: 1 }])
router.post('/', cpUpload, function (req, res, next) {

    console.log(req.body.movieName + req.body.movieDetails);
    console.log(req.files['movieAvatar'][0]);
    console.log(req.files['movieVideo'][0]);
    var avatar = req.files['movieAvatar'][0];
    var video = req.files['movieVideo'][0];
    var movie = new Movie({
        name : req.body.movieName,
        details : req.body.movieDetails,
        avatarName : avatar.originalname,
        avatarUrl : __dirname + avatar.filename,
        videoName : video.originalname,
        videoUrl : __dirname + video.filename
    });

    movie.save(function(err) {
        if (err)
            throw err;
        else
            console.log('save movie successfully...');
    });

    res.redirect('/');
});

module.exports = router;
