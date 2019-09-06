var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
//express sanitizer is used to restrict html to read  script elemeents  inside blog body
//
app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
    Title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
})
 var Blog=mongoose.model("Blog",blogSchema);
 app.get("/",function(req,res){
     res.redirect("/blogs");
 });
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
//create route
app.post("/blogs",function(req,res){
    //create Blog
    Blog.create(req.body.blog,function(err, newBlog){
        //blog in new.ejs just  a temporary name
        if(err)
        {
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })

})
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})
//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            console.log(err);
        }
        else{

            res.render("edit",{blog:foundBlog});
        }


    });
});
//we can't send a put http request only get and post request s allowed
//by the way when we try to send put request by deafault it become get request
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        {
            res.render("/blogs");
        }
        else{
            res.redirect(("/blogs/"+req.params.id))
        }
    })
})
//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.listen(3000,function(err,res){
    if(err)
    {
        console.log(err);
    }
    else
    {
    console.log("app has started");
    }
})