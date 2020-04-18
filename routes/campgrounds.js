var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX- Show all campgrounds
router.get("/",function(req,res){
	// Get all campgrounds from DB
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
	// res.render("campgrounds.ejs", {campgrounds: campgrounds});
});
//CREATE- Add new route to database
router.post("/", middleware.IsLoggedIn,function(req,res){
	// get data from forms and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, price:price, image:image, description:desc, author:author};
	// campgrounds.push(newCampground); Instead create a campground and send it to DB
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			// redirect back to campgrounds
			res.redirect("/campgrounds");
		}
	});	
});
//NEW- Show form to create new campground
router.get("/new",middleware.IsLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
//SHOW- Shows more info about one campgrond
router.get("/:id",function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});	
});
 
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});	
	

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findOneAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findOneAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;
