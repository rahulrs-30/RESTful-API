//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
 
//TODO
main().catch(err => console.log(err));
 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}  
// mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});
 
const articleSchema=new mongoose.Schema({
    title: String,
    content:String
});



const Article= mongoose.model("Article",articleSchema);


/////////////Requests targetting all articles /////////////
app.route("/articles")
.get(async(req,res)=>{
    try{
    const foundArticles= await Article.find();
        // console.log(foundArticles);
        res.send(foundArticles);
    }catch(err){
        // console.log(err);
        res.send(err);
    }
})
.post(function(req,res){
const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
});
newArticle.save()
.then(function(success){
    console.log("Successfully aded a new article!");
}).catch(function(err){
    console.log(err);
})
})
.delete(function(req,res){
    Article.deleteMany({}).then(function(){
        res.send("Successfuly deleted all articles");
    }).catch(err =>{
        res.send(err);
    });
}); 



/////////////Requests targetting specific articles /////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle){
        res.send(foundArticle);
    }).catch(err=>{
        res.send("No articles were found!");
    });
})
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        
    ).then(function(){
       res.send("Successfully updated article."); 
    });
})
.patch(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then(function(){
        res.send("Successfully updated the selected article");
    });
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    ).then(function(){
        res.send("Successfully deleted the corresponding article.")
    }).catch(err=>{
        res.send(err);
    });
});





 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
 
