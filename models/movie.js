var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var Movie = new Schema({
    name: String,
    details: String,
    rating: String,
    avatarName: String,
    avatarUrl: String,
    videoName: String,
    videoUrl: String
});

Movie.plugin(mongoosePaginate);

module.exports = mongoose.model('Movie', Movie);