    var express = require("express");
    var router = express.Router();
    var Campground = require("../models/campground");
    var Comment = require("../models/comment");
    var middleware = require("../middleware");

    router.get("/campgrounds/:id/comments/new",middleware.isLoggedIN,function(req , res){
    Campground.findById(req.params.id,function(err , campgrounds){
        console.log(campgrounds);
    res.render("comments/new",{campground : campgrounds});
    });
    });
    router.post("/campgrounds/:id/comments",middleware.isLoggedIN,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
    if(err){
    redirect("/campgrounds");
    }else{
    Comment.create(req.body.comment,function(err,comment){
    if(err){
    console.log(err);
    }
    else{
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    comment.save();
    campground.comments.push(comment);
    campground.save();
    req.flash("success","Successfully added comment");
    res.redirect("/campgrounds/"+campground._id);
    }
    });
    }
    });
    });
    //edit
    router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkComment,(req,res)=>{
        
        Comment.findById(req.params.comment_id,function(err,comment){
    res.render("comments/edit",{camp_id:req.params.id,comment:comment});

    });
    });
    //update
    router.put('/campgrounds/:id/comments/:comment_id',middleware.checkComment,(req,res)=>{
        
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updte)=>{
    if(err)res.redirect("back");
    else{
        req.flash("success","Comment Updated");
        res.redirect("/campgrounds/"+req.params.id);
    }
    });
    });
    //delete
    router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkComment,(req,res)=>{
        Comment.findByIdAndRemove({_id:req.params.comment_id,routes:'yelp_camp'},(err)=>{
            if(err)res.redirect("back");
            else{
                req.flash("success","Comment Deleted");
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });
    
    module.exports = router;
