var mongoose = require("mongoose");

var bookedSchema = new mongoose.Schema({
      username:String,
   eventid: [String]
});

module.exports = mongoose.model("Booked", bookedSchema);