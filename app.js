var express =require("express");
var app = express();
var bodyParser = require("body-parser");
var	mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var User       = require("./models/user");
var flash      = require("connect-flash");
// var seedDB  = require("./seed");

//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
//seedDB();

// mongoose.connect("mongodb://localhost:27017/yelp_camp", 
// 	{
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

mongoose.connect("mongodb+srv://ej217:chintu123@cluster0-xtsrb.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then( () =>{
	console.log("Connected to DB")
}).catch(err =>{
	console.log('ERROR:',err.message)
});
	



// Campground.create({
// 	name: "Granite Hill",
// 	image: "http://media.gettyimages.com/videos/beautiful-rock-formation-at-spitzkoppe-video-id510466595?s=640x640",
// 	description: "Granite Hill is the place to be if you're on a camping trip with your family. No bathrooms, no worries just purity of nature at it's fullest"
// }, function(err,campground){
// 	if(err){
// 		console.log(err)
// 	} else{
// 		console.log("New Campground created: ");
// 		console.log(campground);
// 	}
// });

// var campgrounds = [
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"},
// 		{name:"abc", image:"http://media4.picsearch.com/is?czbmiodTFWZvyrE9jXLgLBonQrqjLUdVXGIqvsHbE2U&height=221"}
// 	]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I am the best in the World",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT = 3000, function(){
	console.log("The Yelp Camp Server has started");
});