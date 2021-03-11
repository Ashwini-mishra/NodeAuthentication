let mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/userReg", {
  useNewUrlParser: true,
});


const User = mongoose.model(
  "user",
  new Schema({
   
    email: { type: String, required: true },
    pass: { type: String, required: true }
   
  })
);
module.exports = User;