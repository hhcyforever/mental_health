let mongoose = require('mongoose');
require("./db.js");
require("./schema.js");
let emo = require('./faceEmo.js');
let WeeklyEmo = require('./weeklyEmo.js').WeeklyEmo;
let dateUtil = require('./utilsDate.js');
var userRecord = mongoose.model('userRecord');
userRecord.find({}, function (error, doc) {
  if(error){
    console.log(error);
  }
  else{
    console.log(doc);
  }
});

// User.find({}, function (error, doc) {
//   if(error){
//     console.log(error);
//   }
//   else{
//     console.log(doc);
//   }
// });

// console.log(new Date().getDay());
// let a = emo.getEmo("@imgs/happy.jpg");
// console.log(a);
// var now = new Date();
// var nowTime = now.getTime() ;
// var day = now.getDay();
// var oneDayTime = 24*60*60*1000 ;
//
// //显示周一
// var MondayTime = nowTime - (day-1)*oneDayTime ;
// console.log(dateUtil.dateString(now));
// console.log(dateUtil.mondayDateString(now));
// let h = new WeeklyEmo('happiness');
// h.append_date('2019-11-01', 1);
// h.append_date('2019-11-02', 2);
// let i = h.getItem();
// console.log(i);
// let q = {
//   'a': 1,
//   b: 2
// };
// console.log(q['a'],q['b'],q.a,q.b);
// let date = "2019/10/4".split(/\//);
// console.log(date);
// let a = [1,2];
// let date = Date.parse( '2019-12-19T01:52:36.970Z');
// console.log(date);
// console.log(typeof(new Date()));
// console.log(typeof(1) === "number");
