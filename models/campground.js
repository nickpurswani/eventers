var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   location:String,
   price: String,
   date:String,
   timing:String,
   address:String,
   contact:String,
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);