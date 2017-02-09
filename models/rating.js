var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rating = new Schema({
    movieName: String,
    rating: Number,
    userName: String
});


module.exports = mongoose.model('Rating', Rating);