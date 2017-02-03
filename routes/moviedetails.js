var express = require('express');
var Movie = require('../models/movie');
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
var path = require('path');
var router = express.Router();
var fileHelper = require('../utils/fileUtil.js');

router.get('/:id', function (req, res) {

    console.log('movie details screen' + req.params.id);
    // var image = fs.creatReadStream(__dirname + '../uploads' +movie.avatarUrl);

    // This line opens the file as a readable stream


    Movie.findOne({_id: new ObjectId(req.params.id)}, function (err, movie) {
        console.log(movie);
        var imagePath = path.join('/uploads/', movie.avatarUrl); //path.resolve(__dirname + '/..') + '/uploads/' + movie.avatarUrl;
        var videoPath = path.join('/uploads/', movie.videoUrl);
        console.log('imagePath is ' + imagePath);
        // console.log(fs.createReadStream(imagePath));

        res.render('moviedetails', {
            movie: movie,
            imagePath: imagePath,
            videoPath: videoPath,
            videoPlaceholderPath: '/images/video_placeholder.jpg',
            user: req.user
        });
    });
});

router.delete('/:id', function (req, res) {
    console.log('delete call');
    Movie.findOneAndRemove({_id: new ObjectId(req.params.id)}, function (err, movie) {
        console.log(movie);
        if (!err) {
            // message.type = 'Deleted !';
            console.log('delete files');
            var imagePath = path.join(__dirname + '/..') + "/uploads/" + movie.avatarUrl;
            var videoPath = path.join(__dirname + '/..') + "/uploads/" + movie.videoUrl;
            fileHelper.deleteFile(imagePath, 'successfully deleted image');
            fileHelper.deleteFile(videoPath, 'successfully deleted video');
            // message.type = 'error deleting';
            res.redirect('/');
        }
        else {

        }
    });
});

module.exports = router;
