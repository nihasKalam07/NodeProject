var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Movie = new Schema({
    name: String,
    details: String,
    rating: String,
    avatarName: String,
    avatarUrl: String,
    videoName: String,
    videoUrl: String
});


module.exports = mongoose.model('Movie', Movie);