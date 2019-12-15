let express = require('express');
let router = express.Router();
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Sentiment = require('sentiment');
let mongoose = require('mongoose');
require("./db.js");
require("./schema.js");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//0. db initiate
var User = mongoose.model('User');

//1. socket connect
let allRecordDate = [];
io.on('connection',function(socket) {

  //signup
  socket.on("sign_up", function (data, callback) {
    User.find({
      'username': data.username
    }, function (error, docs) {
      if(error) {
        console.log(error);
      }
      else
      {
        if (docs.length === 0){
          User.create({
            username: data.username,
            password: data.password,
            create_time: String(new Date())
          }, function (error, doc) {
            if (error) {
              console.log(error);
            }
            else{
              console.log("success");
              callback({
                code:1
              })
            }
          })
        }
        else{
          console.log(docs);
          callback({
            code: 0,
            msg: "have been registered"
          })
        }
      }
    });
  });

  //login
  socket.on("login", function (data, callback) {
    console.log("login request from user"+ data.username);
    User.find({
      'username': data.username,
      'password': data.password
    }, function (error, docs) {
      if(error){
        console.log(error);
      }
      else
      {
        if (docs.length === 0){
          callback({
            code: 0
          })
        }
        else{
          console.log(docs);
          callback({
            code: 1,
            username: docs[0].username
          })
        }

      }
    });

  });

  //emoStatus submit
  socket.on('emoText', function (obj) {
    console.log(obj.txt);

    let sentiment = new Sentiment();
    let result = sentiment.analyze(obj.txt);
    let score = result.score;
    let date = obj.date;
    console.log(date);
    allRecordDate.push({
      year: date.year,
      month: date.month,
      day: date.day
    });

    socket.emit('emoStatus',{
      msg: score
    });

    console.log("message sent: ", result);
  });

  //calendar
  socket.on('tryGetDate', function (data, callback) {
    console.log("date request received!");
    let msg = {
      msg: allRecordDate,
    };
    callback(msg);
  })
});


//listen
http.listen(3000, function(){
  console.log('listening on *:3000');
});
