// Requiring mongoose for structure definition
var mongoose = require("mongoose");

// Save a reference to Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    // Setting the title to unique to store articles only once
    title : {
        type: String,
        required: true, 
        unique: true
    },
    link : {
        type: String, 
        required: true
    },
    // Setting an array to store multiple comments
    comments: [{
        type: Schema.Types.ObjectId, 
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;