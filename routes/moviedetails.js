var express = require('express');
var passport = require('passport');
var Movie = require('../models/movie');
var Rating = require('../models/rating');
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
var path = require('path');
var router = express.Router();
var fileHelper = require('../utils/fileUtil.js');

// router.get('/', function (req, res) {
//     res.render('moviedetails', {user: req.user});
// });


router.get('/:id', function (req, res) {

    console.log('movie details screen' + req.params.id);
    Movie.findOne({_id: new ObjectId(req.params.id)}, function (err, movie) {
        console.log('----------',movie);
        var imagePath = path.join('/uploads/', movie.avatarUrl); //path.resolve(__dirname + '/..') + '/uploads/' + movie.avatarUrl;
        var videoPath = path.join('/uploads/', movie.videoUrl);
        console.log('imagePath is ' + imagePath);
        console.log(req.user);

        if (!req.user) {
            console.log('user null');
            res.render('moviedetails', {
                movie: movie,
                imagePath: imagePath,
                videoPath: videoPath,
                videoPlaceholderPath: '/images/video_placeholder.jpg',
                user: req.user,
                individualRating: ""
            });
        } else {
            console.log('user exists');
            Rating.findOne({movieName: movie.name, userName: req.user.username},

                function (err, rating) {
                    if (err) {
                        console.log("Something wrong when rating!");
                        console.log(err);
                    } else {
                        console.log("successfully rated!");
                        console.log(rating);
                        if (rating === null) {
                            res.render('moviedetails', {
                                movie: movie,
                                imagePath: imagePath,
                                videoPath: videoPath,
                                videoPlaceholderPath: '/images/video_placeholder.jpg',
                                user: req.user,
                                overallRating: movie.rating > 0 ? 'This movies overall rating is ' + movie.rating : '',
                                individualRating: rating === null ? 'And you can rate this movie' : rating.rating
                            });
                        } else {
                            res.render('moviedetails', {
                                movie: movie,
                                imagePath: imagePath,
                                videoPath: videoPath,
                                videoPlaceholderPath: '/images/video_placeholder.jpg',
                                user: req.user,
                                overallRating: movie.rating > 0 ? 'This movies overall rating is ' + movie.rating : '',
                                individualRating: 'And your rating is ' + rating.rating
                            });
                        }

                    }
                });
        }
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

router.post('/ratemovie/:id', function (req, res) {
    req.checkBody("rating", "Maximum is 5 and minimum is 1").isInt().gte(1).lte(5);
    var errors = req.validationErrors();
    if (errors) {
        // return next(errors);
        console.log('error   ' + errors);
        var err = {
            message : errors[0].msg
        }
        res.render('error', { error: err });
        // return;
    } else {
        Movie.findOne({_id: new ObjectId(req.params.id)}, function (err, movie) {
            if (err) {
                console.log("Something wrong!");
            } else {

                console.log(movie);
                console.log(req.body.rating);

                var fields = {
                    movieName: movie.name,
                    rating: req.body.rating,
                    userName: req.user.username
                }

                Rating.findOneAndUpdate({movieName: movie.name, userName: req.user.username},
                    {
                        $set: fields
                    },
                    // {new: true},
                    function (err, rating) {
                        if (err) {
                            console.log("Something wrong when rating!");
                            console.log(err);
                        } else {
                            console.log("successfully rated!");
                            console.log(rating);
                            if (rating === null) {
                                var rating = new Rating({
                                    movieName: movie.name,
                                    rating: req.body.rating,
                                    userName: req.user.username
                                });
                                rating.save(function (err) {
                                    if (err)
                                        throw err;
                                    else {
                                        console.log('save rating successfully...');
                                        findRatings(req.params.id, res, movie);
                                    }
                                });
                            } else {
                                findRatings(req.params.id, res, movie);
                            }

                        }
                    });
            }
        });
    }

});

var findRatings = function (movieId, res, movie) {

    var totalRatingPoints = 0, totalNumberOfRatings = 0;
    Rating.find({rating: '5', movieName: movie.name}, function (err, movies) {
        if (err) return console.error(err);
        console.log('5 length is ' + movies.length);
        totalRatingPoints += (movies.length * 5);
        totalNumberOfRatings += movies.length;


        Rating.find({rating: '4', movieName: movie.name}, function (err, movies) {
            if (err) return console.error(err);
            console.log('4 length is ' + movies.length);
            totalRatingPoints += (movies.length * 4);
            totalNumberOfRatings += movies.length;

            Rating.find({rating: '3', movieName: movie.name}, function (err, movies) {
                if (err) return console.error(err);
                console.log('3 length is ' + movies.length);
                totalRatingPoints += (movies.length * 3);
                totalNumberOfRatings += movies.length;

                Rating.find({rating: '2', movieName: movie.name}, function (err, movies) {
                    if (err) return console.error(err);
                    console.log('2 length is ' + movies.length);
                    totalRatingPoints += (movies.length * 2);
                    totalNumberOfRatings += movies.length;

                    Rating.find({rating: '1', movieName: movie.name}, function (err, movies) {
                        if (err) return console.error(err);
                        console.log('1 length is ' + movies.length);
                        totalRatingPoints += (movies.length * 1);
                        totalNumberOfRatings += movies.length;
                        calculateWeightedRating(movieId, totalRatingPoints, totalNumberOfRatings, res);
                    });
                });
            });
        });
    });



}

var calculateWeightedRating = function (movieId, totalRatingPoints, totalNumberOfRatings, res) {
    var weightedRating = Math.round(totalRatingPoints / totalNumberOfRatings * 10) / 10;
    console.log("total points " + weightedRating +  totalRatingPoints + " " + totalNumberOfRatings);
    var fields = {
        // movieName: movie.name,
        rating: weightedRating
        // userName: req.user.username
    }
    Movie.findOneAndUpdate({_id: new ObjectId(movieId)},
        {
            $set: fields
        },
        {new: true},
        function (err, doc) {
            if (err) {
                console.log("Something wrong while updating data!");
            } else {
                console.log("successfully calculated rating!");
                console.log(doc);
                res.redirect('/moviedetails/' +  movieId);
            }
        });
}

module.exports = router;
