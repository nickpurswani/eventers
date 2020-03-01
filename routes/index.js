    var express = require("express");
    var mongoose = require("mongoose")
    var router = express.Router();
    var passport = require("passport");
    var User = require("../models/user");
    var Campground = require("../models/campground");
    var Profile = require("../models/profile");
    var Booked = require("../models/booked");
    
    router.get("/",function(req , res){
    res.render("landing");
    });
    //AuthRoutes
    //==============================
    router.get("/register",function(req,res){
    res.render("register");
    });
    router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
    if(err){
        req.flash("error",err.message);
    console.log(err);
    return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to Eventers "+user.username);
    res.redirect("/campgrounds");
    })
    })
    });
    //login form
    router.get("/login",function(req,res){
    res.render("login");
    });

    router.post("/login",passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect : "/login",
    failureFlash: true,
    successFlash: 'Welcome to Eventers!'
    })
    );
    router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!")
    res.redirect("/campgrounds");
    });
    router.get("/profile/:name",isLoggedIN,function(req,res){
        var newProfile={'username':req.params.name,'image':'https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg'};
        
        Profile.find({'username':req.params.name},function(err,allProfile){
            
            if(err || allProfile.length==0){
                
                Profile.create(newProfile,function(err , newCreated){
                    if(err){
                    console.log(err);
                    }else{
                        res.render("profile",{p: newCreated});
                    }});
            }
            else{
              
                res.render("profile",{p: allProfile[0]});
            }
        });
        
    });
    
    router.get("/profile/:name/edit",isLoggedIN,(req,res)=>{
        Profile.find({'username':req.params.name},function(err,allProfile){
            if(err){
                console.log(err);
            }
            else{
                res.render("profileEdit",{p:allProfile[0]});
            }
        })
    });
    router.put("/profile/:name",function(req,res){
        Profile.findOneAndUpdate({'username':req.params.name},req.body.pro,function(err , newCreated){
        if(err){
        console.log(err);
        }else{
           
        res.redirect("/profile/"+req.params.name);
        }});
    });
    router.get("/events/:name/:id",isLoggedIN,(req,res)=>{
       
        var id = mongoose.Types.ObjectId(req.params.id);
        Campground.find({'author':{'id':id,'username':req.params.name}}, function(err, allCampgrounds){
                if(err){
                    console.log(err);
                } else {
                    
                   res.render("events",{campgrounds:allCampgrounds});
                }
             });
        
    });
    router.get("/campgrounds/:name/:id/register",isLoggedIN,(req,res)=>{
        var booked={'username':req.params.name,'eventid':[req.params.id]};
        
        Booked.find({'username':req.params.name},function(err,allProfile){
            
            if(err || allProfile.length==0){
                
                Booked.create(booked,function(err , newCreated){
                    if(err){
                    console.log(err);
                    }else{
                        res.redirect("/campgrounds");
                    }});
            }
            else{
                var x=1;
              
                for(var i=0;i<allProfile[0].eventid.length;i++){
                    if(allProfile[0].eventid[i]==req.params.id){
                        x=0;
                    }
                }
                

                if(x==1){
                
                allProfile[0].eventid.push(req.params.id);
                
                     var newbook={'username':req.params.name,'eventid':allProfile[0].eventid,'campname':allProfile[0].campname};
                     
                     Booked.findOneAndUpdate({'username':req.params.name},newbook,function(err,newadd){
                        if(err){
                            console.log(err)
                        }
                        else{
                            
                            req.flash("success","Registered");
                     res.redirect('/campgrounds');
                        }
                     });
                    }
                    else{
                        req.flash("success","Already Registered Ease Down");
                        res.redirect('/campgrounds');
                    }
            }
        });
    });
    router.get("/bookedevents/:name",isLoggedIN,(req,res)=>{
        Booked.find({'username':req.params.name},function(err,newbook){
if(err){
    console.log(err);
}else{
    
res.render("booked",{book:newbook});
}
        });
    });
    router.get("/campgrounds/:id/:name/deregister",isLoggedIN,(req,res)=>{
         
        Booked.find({'username':req.params.name},function(err,allProfile){
                    for(var i=0;i<allProfile[0].eventid.length;i++){
                        if(allProfile[0].eventid[i]==req.params.id){
                            allProfile[0].eventid.splice(i,1);
                        }
                    }
                
                     var newbook={'username':req.params.name,'eventid':allProfile[0].eventid};
                     
                     Booked.findOneAndUpdate({'username':req.params.name},newbook,function(err,newadd){
                        if(err){
                            console.log(err)
                        }
                        else{
                            
                            req.flash("success","DeRegistered");
                     res.redirect('/bookedevents/'+req.params.name);
                        }
                     });
                    
                   
            
    });
});
    function isLoggedIN(req,res,next){
    if(req.isAuthenticated()){
    return next();
    }
    res.redirect("/login");
    }
    
    module.exports = router;
