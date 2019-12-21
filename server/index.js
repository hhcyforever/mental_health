let express = require('express');
let router = express.Router();
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let Sentiment = require('sentiment');
let mongoose = require('mongoose');
require("./db.js");
require("./schema.js");
let faceEmo = require("./faceEmo.js");
let dateUtil = require('./utilsDate.js');
let WeeklyEmo = require('./weeklyEmo.js').WeeklyEmo;

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//0. db initiate
var User = mongoose.model('User');
var userRecord = mongoose.model('userRecord');

//1. socket connect

io.on('connection',function(socket) {

  //signup
  socket.on("sign_up", function (data, callback) {
    console.log(data);
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
          // console.log(docs);
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

  socket.on("getDailyReport", function(data,callback){
    console.log("getDailyReport request received", data);
    userRecord.find({
      'username': data.user,
      'year': data.year,
      'month': data.month,
      'day': data.day
    },function (error, docs) {
      if (error){
        console.log(error);
      }
      else{
        if(docs.length === 0){
          console.log("No record found for daily report!");
          callback({
            code: 0
          });
        }
        else{
          let doc = docs[0];
          console.log("find report", doc);
          let reportInfo = (doc['textScore']? JSON.parse(doc['textScore']): "");
          console.log(doc['imgScore']);
          let imgScore = (doc['imgScore']? JSON.parse(doc['imgScore']): "");
          callback({
            code: 1,
            dailyReport: {
              weather: doc['weather'],
              hoursSleep:doc['hoursSleep'],
              meals:doc['mealsHad'],
              report:doc['input'],
              reportInfo:JSON.parse(doc['textScore']),
              img:doc['img'],
              imgScore:JSON.parse(doc['imgScore']),
              emoChart:{
                columns: ['emotion', 'level'],
                rows:[
                  {'emotion': 'happiness', 'level': doc['value_happiness']},
                  {'emotion': 'excitement', 'level': doc['value_excitement']},
                  {'emotion': 'depression', 'level': doc['value_depression']},
                  {'emotion': 'anxiety', 'level': doc['value_anxiety']},
                  {'emotion': 'irritability', 'level': doc['value_irritability']}
                ]
              }
            }
          })
        }
      }
    })
  });

  socket.on("getWeeklyReport", function(data,callback){
    userRecord.find({
      'username': data.user,
      'MondayDate': dateUtil.mondayDateString(data.date)
    },function (error, docs) {
      if (error){
        console.log(error);
      }
      else{
        if(docs.length === 0){
          callback({
            code: 0
          });
        }
        else{
          // weekly_report:{
          //   averageSleep: null,
          // averageMeal: null
          //     totalSymptoms: null,
          //     totalTherapy: null,
          //     chartHappiness:{},
          //   chartExcitement:{},
          //   chartDepression:{},
          //   chartIrritability:{},
          //   chartAnxiety:{},
          //   totalRecord: null,
          //     BestRecord: null,
          //     BestPhoto: null
          // }
          let count = 0;
          let sleepSum = 0;
          let mealSum = 0;
          let happiness = new WeeklyEmo('happiness');
          let excitement = new WeeklyEmo('excitement');
          let depression = new WeeklyEmo('depression');
          let irritability = new WeeklyEmo('irritability');
          let anxiety = new WeeklyEmo('anxiety');
          let goodSentences = [];
          let bestPhoto = "";
          let highestPhotoHappiness = 0;
          for(let i=0; i < docs.length; i++){
            count += 1;
            sleepSum += docs[i]['hoursSleep'];
            mealSum += docs[i]['mealsHad'];
            happiness.append_date(docs[i]['date'], docs[i]['value_happiness']);
            excitement.append_date(docs[i]['date'], docs[i]['value_excitement']);
            depression.append_date(docs[i]['date'], docs[i]['value_depression']);
            irritability.append_date(docs[i]['date'], docs[i]['value_irritability']);
            anxiety.append_date(docs[i]['date'], docs[i]['value_anxiety']);
            let sentences = JSON.parse(docs[i]['textScore']);
            for(let sentence in sentences){
              goodSentences.push({
                'sentence': sentence['sentence'],
                'score': sentence['score']
              })
            }
            if(docs[i]['imgHappiness'] > highestPhotoHappiness){
              highestPhotoHappiness = docs[i]['imgHappiness'];
              bestPhoto = docs[i]['img'];
            }
          }
          function score_compare(){
            return function(a,b){
              let value1 = a['score'];
              let value2 = b['score'];
              return (value2 - value1);
            }
          }
          goodSentences.sort(score_compare());
          let bestSentences = {};
          for (let i = 0; i < goodSentences.length; i++){
            bestSentences[String(i)] = goodSentences[i];
            if( i >= 2){
              break;
            }
          }
          let returnValue = {
            'averageSleep': sleepSum/count,
            'averageMeal': mealSum/count,
            'chartHappiness': happiness.getItem(),
            'chartExcitement': excitement.getItem(),
            'chartDepression': depression.getItem(),
            'chartIrritability': irritability.getItem(),
            'chartAnxiety': anxiety.getItem(),
            'BestRecords': bestSentences,
            'BestPhoto': bestPhoto
          };
          callback({
            code: 1,
            weekly_report: returnValue
          })
        }
      }
    })
  });


  socket.on("emoContent", function(data, callback){
    //text analysis
    let sentiment = new Sentiment();
    console.log(data);
    let sentences = data.emoInput.input.split(/[.!?;]/);
    let sentenceEmo = [];
    function score_compare(){
      return function(a,b){
        let value1 = a['score'];
        let value2 = b['score'];
        return (value2 - value1);
      }
    }
    for (let i = 0; i < sentences.length; i++){
      let sentence = sentences[i];
      let result = sentiment.analyze(sentence).score;
      sentenceEmo.push({
        'sentence': sentence,
        'score':  result
      })
    }
    let date = new Date(Date.parse(data.date));
    // console.log(date);
    console.log(date.getFullYear());
    sentenceEmo.sort(score_compare());
    let bestSentences = {};
    for (let i = 0; i < sentences.length; i++){
      bestSentences[dateUtil.dateString(date)+"-"+i] = sentences[i];
      if( i >= 2){
        break;
      }
    }
    let textScore = JSON.stringify(bestSentences);

    //img analysis
    let timeStamp = (new Date()).valueOf();
    let path = "imgs/"+data.user+ timeStamp+ ".jpg";
    let imgScore = {};
    let imgHappiness = 0;
    let imgSadness = 0;
    if (data.emoInput.imgData){
      let dataBuffer = new Buffer(data.emoInput.imgData, 'base64');
      fs.writeFile(path, dataBuffer, function(err) {
        if(err){
          console.log(err);
        }
        else {
          imgScore = faceEmo.getEmo("@"+path);
          imgHappiness = imgScore['happiness'];
          imgSadness = imgScore['sadness'];
        }
      });
    }
    console.log()
    if(imgScore === {}){
      imgScore = null;
    }
    else{
      imgScore = imgScore.toString();
    }


    //record
    userRecord.create({
      //basic info
      username: data.user,
      year: date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate(),
      date: dateUtil.dateString(date),
      MondayDate: dateUtil.mondayDateString(date),
      //input value
      // symptoms: data.emoInput.symptoms,
      // therapy: data.emoInput.therapy,
      input: data.emoInput.input,
      img: data.emoInput.imgData,
      hoursSleep: data.emoStatus.hoursSleep,
      mealsHad: data.emoStatus.meals,
      value_happiness: data.emoStatus.value_happiness,
      value_irritability: data.emoStatus.value_irritability,
      value_anxiety: data.emoStatus.value_anxiety,
      value_depression: data.emoStatus.value_depression,
      value_excitement: data.emoStatus.value_excitement,
      //detected value
      textScore: textScore,
      imgScore: imgScore,
      imgHappiness: imgHappiness,
      imgSadness: imgSadness
    }, function (error, doc) {
        if(error){
          console.log(error);
        }
        else{
          callback({
            code: 1
          })
        }
    })
  });

  //calendar
  socket.on('tryGetDate', function (data, callback) {
    userRecord.find({'username': data.user},function (error, docs) {
      if (error){
        console.log(error);
      }
      else {
        if (docs.length === 0) {
          callback({
            code: 0
          });
        }
        else {
          let allRecordDate = [];
          for(let i = 0; i < docs.length; i++){
            allRecordDate.push({
              year: docs[i].year,
              month: docs[i].month,
              day: docs[i].day
            })
          }
          let msg = {
            code: 1,
            msg: allRecordDate,
          };
          callback(msg);
        }
      }
    })
  });
});

//listen
http.listen(3000, function(){
  console.log('listening on *:3000');
});
