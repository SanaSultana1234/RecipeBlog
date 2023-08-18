require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
//variables and constants

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const blogSchema = new mongoose.Schema({
    name: String,
    email: String,
    recipe: String,
    image: String
});

const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog({
    name: 'Pizza',
    email: 'sana2004@gmail.com',
    recipe: 'COOK the pizza',
    image: 'https://tse1.mm.bing.net/th?id=OIP.OZny5F6g0QAQPLsU_4HnEAHaE8&pid=Api&P=0&h=180'
});
const blog2 = new Blog({
    name: 'Cake',
    email: 'farhana199@123.com',
    recipe: 'Cook the cake',
    image: 'https://tse2.mm.bing.net/th?id=OIP.IKFlkOTsu73IEbe0HhC3XAHaLH&pid=Api&P=0&h=180'
});
const blog3 = new Blog({
    name: 'Macaroni',
    email: 'Khizer123@ali.com',
    recipe: 'Cook the macaroni pasta',
    image: 'https://tse4.mm.bing.net/th?id=OIP.TRKuAA8Nt1iBs76N6HDM-AHaE8&pid=Api&P=0&h=180'
});

const blogsArray = [blog1, blog2, blog3];
let aboutContent = "About Us";
let bookingContent = "Recipe Blogging";
let menuContent = "Menu";
let serviceContent = "Service";
let teamContent = "Team";
let testimonialContent = "Testimonial";

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.render("index");
});
app.get("/about", function(req, res) {
    res.render("about", {tab: aboutContent});
});
app.get("/booking", function(req, res) {
    res.render("booking", {tab: bookingContent});
});
app.get("/menu", function(req, res) {
    Blog.find()
    .then(function(foundBlogs) {
        if(foundBlogs.length===0) {
            Blog.insertMany(blogsArray)
            .then(function() {
                console.log("Succesfully inserted all the items in the db");
            })
            .catch(function(err) {
                console.log(err);
            })
        }
        res.render("menu", {tab: menuContent, blogPosts: foundBlogs});
    })
    .catch(function(err) {
        console.log(err);
    })
    
});
app.get("/service", function(req, res) {
    res.render("service", {tab: serviceContent});
});
app.get("/team", function(req, res) {
    res.render("team", {tab: teamContent});
});
app.get("/testimonial", function(req, res) {
    res.render("testimonial", {tab: testimonialContent});
});

app.get("/post", function(req, res) {
    res.render("post", {title: "title", content: "content"});
})

app.get("/posts/:postName", function(req, res) {
    const requestedTitle= _.capitalize(req.params.postName);
    Blog.findOne({name: requestedTitle})
    .then(function(post){
        if(!post) {
            console.log("Recipe does not exist");
            res.redirect("/menu");
        }
        else {
        const storedTitle= _.capitalize(post.name);
        if(requestedTitle === storedTitle) {
            return res.render("post", {blog:post});
        } 
        }
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.post("/booking", function(req, res) {
    let blog = new Blog({
        name: req.body.name,
        email: req.body.email,
        recipe: req.body.recipe,
        image: req.body.image
    });
    blog.save();
    res.redirect("/menu");
})

app.listen(3000, function() {
    console.log("listening on port 3000");
})