var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var Movie = new Schema({
    name: String,
    details: String,
    avatarName: String,
    avatarUrl: String,
    videoName: String,
    videoUrl: String,
    rating: Number
});

Movie.plugin(mongoosePaginate);

module.exports = mongoose.model('Movie', Movie);