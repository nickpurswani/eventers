    var express = require("express");
    var router = express.Router();
    var Campground = require("../models/campground");
    var Comment = require("../models/comment");
    var middleware = require("../middleware");
    var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyDcnDQ_dix63hKkocKlzSba7ReKPmUxy6k',
  formatter: null
};

var geocoder = NodeGeocoder(options);
    router.get("/campgrounds", function(req, res){
        var noMatch = null;
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            // Get all campgrounds from DB
            Campground.find({name: regex}, function(err, allCampgrounds){
               if(err){
                   console.log(err);
               } else {
                  if(allCampgrounds.length < 1) {
                      noMatch = "No campgrounds match that query, please try again.";
                  }
                  res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
               }
            });
        } else {
            // Get all campgrounds from DB
            Campground.find({}, function(err, allCampgrounds){
               if(err){
                   console.log(err);
               } else {
                  res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
               }
            });
        }
    });


    //create====

    router.post("/campgrounds",middleware.isLoggedIN,function(req , res){
    var name = req.body.name;
    var date = req.body.date;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    var location = req.body.location;
    var contact=req.body.contact;
    var address = req.body.address;
    var timing = req.body.timing;
    var newCampground = {
    name:name,image:image,description:desc,author:author,price:price,date:date,location: location,address:address,timing:timing,contact:contact    };
    Campground.create(newCampground,function(err , newCreated){
    if(err){
    console.log(err);
    }else{
       
    res.redirect("/campgrounds");
    }});
    });
    
    router.get("/index",function(req,res){
        res.sendFile(__dirname+"/index.html");
    });
    router.post("/index",(req,res)=>{
        
        res.render("campgrounds/new",{link:req.body.link});

    });
    router.get("/campgrounds/new",middleware.isLoggedIN,function(req , res){
    res.render("campgrounds/new",{link:''});
    });
    router.get("/campgrounds/:id",function(req , res){
    //show the information of campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
    req.flash("error","Campground not found");
    res.redirect("/campgrounds");
    }else{

    res.render("campgrounds/show", { campground: foundCampground});
    }
    });
    }); 
    //Edit
    router.get("/campgrounds/:id/edit",middleware.checkCamp,function(req,res){
        
            Campground.findById(req.params.id,function(err,camp){
                        res.render("campgrounds/edit",{campground: camp});
            });

    });
    //update
    router.put("/campgrounds/:id",middleware.checkCamp,function(req,res){
        Campground.findByIdAndUpdate(req.params.id,req.body.c,function(err,updated){
            
                res.redirect("/campgrounds/"+req.params.id);
            
        });
    });

router.delete("/campgrounds/:id",middleware.checkCamp,(req,res)=>{
Campground.findByIdAndRemove({_id:req.params.id,routes:'yelp_camp'},(err)=>{
if(err){
    res.status(404).json({
        err:'not found campground'
    });
}
else{
    res.redirect('/campgrounds');
}
});
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;