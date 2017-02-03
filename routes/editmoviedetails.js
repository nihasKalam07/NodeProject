var express = require('express');
var Movie = require('../models/movie');
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fileHelper = require('../utils/fileUtil.js');

router.get('/:id', function (req, res) {

    console.log('movie updating screen' + req.params.id);
    // var image = fs.creatReadStream(__dirname + '../uploads' +movie.avatarUrl);

    // This line opens the file as a readable stream


    Movie.findOne({_id: new ObjectId(req.params.id)}, function (err, movie) {
        // console.log(movie);
        res.render('editmoviedetails', {movie: movie, user: req.user});
    });
});

var cpUpload = upload.fields([{name: 'movieAvatar', maxCount: 1}, {name: 'movieVideo', maxCount: 1}])
router.post('/:id', cpUpload, function (req, res, next) {
    console.log('movie updating call' + req.params.id);
    console.log(req.body.movieName + req.body.movieDetails);
    console.log(req.files['movieAvatar'][0]);
    console.log(req.files['movieVideo'][0]);
    var avatar = req.files['movieAvatar'][0];
    var video = req.files['movieVideo'][0];
    if (req.body.movieName === '') {
        console.log('Movie name is mandatory');
        res.redirect('/');
    }
    var fields = {
        name: req.body.movieName,
        details: req.body.movieDetails,
        avatarName: avatar.originalname,
        avatarUrl: avatar.filename,
        videoName: video.originalname,
        videoUrl: video.filename
    }

    Movie.findOneAndUpdate({_id: new ObjectId(req.params.id)},
        {
            $set: fields
        },
        // {new: true},
        function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                var imagePath = path.join(__dirname + '/..') + "/uploads/" + doc.avatarUrl;
                var videoPath = path.join(__dirname + '/..') + "/uploads/" + doc.videoUrl;
                fileHelper.deleteFile(imagePath, 'successfully deleted image');
                fileHelper.deleteFile(videoPath, 'successfully deleted video');
                console.log("successfully updated!");
                console.log(doc);
                res.redirect('/');
            }
        });
});

module.exports = router;
