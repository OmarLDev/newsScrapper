var mongoose = require("mongoose");

// Reference to schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: String, 
    body: String
},{
    // Adding timestamps
    timestamps :{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;