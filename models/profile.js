var mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
   name: String,
   image: String,
   contact:Number,
   email:String,
   username:String,
   
});

module.exports = mongoose.model("Profile", profileSchema);