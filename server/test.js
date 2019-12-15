let mongoose = require('mongoose');
require("./db.js");
require("./schema.js");
 var User = mongoose.model('User');
// User.remove({}, function (error, doc) {
//   if(error){
//     console.log(error);
//   }
//   else{
//     console.log(doc);
//   }
// });

User.find({}, function (error, doc) {
  if(error){
    console.log(error);
  }
  else{
    console.log(doc);
  }
});
