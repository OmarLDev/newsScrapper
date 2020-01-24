// Server and DB tools
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Tools for scraping
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring all models
var db = require("./models");

// setting the port from Heroku, otherwise use our default
const PORT = process.env.PORT || 3000 ;

// Express initialization
var app = express();

// Logging through morgan
app.use(logger("dev"));

// parsing body requests as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// making public a static folder
app.use(express.static("public"));

//Connecting to the MongoDB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser : true});

// GET route to scrape articles
app.get("/scrape", (req, res) => {
    // Getting the body from the html
    axios.get("https://www.theguardian.com/uk/technology").then(response => {
        // Setting a $ shortcut for loading with cheerio    
        var $ = cheerio.load(response.data);
        // Grabbing every li element to retrieve news
        $("section div").each(function(i, element)  {
            // Empty object to store results
            var result = {};
            
            // Retrieving title and link for every property
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            if(typeof result.link !== "undefined"){
                // Creating a new article using the previously defined object
                db.Article.create(result)
                .then((dbArticle) => {
                    // review added result in the console
                    console.log(dbArticle);
                })
                .catch((err) =>{
                    // if error, log it
                    console.log(err);
                });
            }
        });

        res.send("Scraping completed");
    });
});

// GET for retrieving articles from the db
app.get("/articles", (req, res) => {
    db.Article.find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
});

// GET to retrieve an specific artticle
app.get("/articles/:id", (req, res) =>{
    // Converting id to a mongo object
    db.Article.findOne({_id : mongoose.Types.ObjectId(req.params.id)})
    // populating all comments related to this article
    .populate("comment")
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
});

// POST to store comments
app.post("/articles/:id", (req, res) => {
    // Creating a new Comment
    db.Comment.create(req.body)
    .then((dbComment) => {
        return db.Comment.findOneAndUpdate({"_id": req.params.id}, {comment: dbNote._id}, {new: true});
    })
    .then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    })
});

app.listen(PORT, ()=> {
    console.log(`App running on port ${PORT}`);
});