  require('dotenv').config();
  var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index"),
  flash = require("connect-flash"),
  seedDB = require("./seeds");

var User = require("./models/user");
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect('mongodb://localhost:27017/eventers', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));mongoose.set("useCreateIndex", true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
})
// passport config====
app.use(flash());
app.use(require("express-session")({
secret: "Once again Rusty wins cutest dog!",
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

 app.use(express.static("public"));
app.set("view engine","ejs");
//seedDB();
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(function(req,res,next){
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.success = req.flash("success");
next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
    console.log("server has started at 3000");
})
