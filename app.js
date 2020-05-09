var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var expressSantizer=require("express-sanitizer");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var seedDB=require("./seed.js");
var passport=require("passport");
var localStrategy=require("passport-local");
var userRoutes=require("./routes/user.js");
var commentRoutes=require("./routes/comment.js");
var productRoutes=require("./routes/product.js");
var User=require("./models/user.js");
var Product=require("./models/product.js");
var Comment=require("./models/comments.js");
var flash=require("connect-flash");
var token=require("randomstring");

//for express-session
app.use(require("express-session")({
    secret:"Aditya Bhura",
    resave:false,
    saveUninitialized:false
}));

//setting up passport
app.use(passport.initialize());
app.use(passport.session());

//for serializing and deserializing
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Using passport-local 
passport.use(new localStrategy(User.authenticate()));

mongoose.connect("mongodb://localhost/product_app");

app.use(bodyParser.urlencoded({extended :true}));

app.use(expressSantizer());

app.set("view engine","ejs");

app.use(methodOverride("_method"));

app.use(flash());

//For Styling
app.use(express.static("style"));

app.use("/uploads",express.static("uploads"));

//this will be added to every ejs files
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//seeding the app
//  seedDB();

//Routes
app.get("/",function(req,res){
    res.redirect("/products");
});

app.use(productRoutes);
app.use(commentRoutes);
app.use(userRoutes);


app.listen(3000,function(){
    console.log("The server has started");
});







