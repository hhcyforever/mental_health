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
let read_imgs = require('./local_load.js').read_imgs;
let read_recommendations = require('./local_load.js').read_recommendations;

let sunny_imgs = read_imgs("./imgs/weather/sunny");
let rainy_imgs = read_imgs("./imgs/weather/rainy");
let snowy_imgs = read_imgs("./imgs/weather/snowy");
let cloudy_imgs = read_imgs("./imgs/weather/cloudy");
let sleep_imgs = read_imgs("./imgs/sleep");
let food_imgs = read_imgs("./imgs/food");
let recommendations = read_recommendations('recommendations.json');

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { EnglishTokenizer, KeywordExtractor } = require("@agtabesh/keyword-extractor");

const rake = require('node-rake');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var User = mongoose.model('User');
var userRecord = mongoose.model('userRecord');

function score_compare(){
  return function(a,b){
    let value1 = a['score'];
    let value2 = b['score'];
    return (value2 - value1);
  }
}

function getRandom(list){
  let random_id = Math.floor(Math.random()*(list.length));
  return list[random_id];
}

//socket connect

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

  //emoStatus test
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

  //daily report
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
          // let reportInfo = (doc['keyWords']? JSON.parse(doc['keyWords']): "");
          console.log(doc['imgScore']);
          let imgScore = (doc['imgScore']? JSON.parse(doc['imgScore']): "");
          console.log();
          let dailyReport = {
            weather: doc['weather'],
            hoursSleep:doc['hoursSleep'],
            meals:doc['mealsHad'],
            report:doc['input'],
            reportEmo: doc['textScore'],
            reportInfo:doc['keyWords'],
            img:'data:image/jpeg;base64,'+ doc['img'],
            imgScore:imgScore,
            emoChart:{
              columns: ['emotion', 'level'],
              rows:[
                {'emotion': 'happiness', 'level': doc['value_happiness']},
                {'emotion': 'excitement', 'level': doc['value_excitement']},
                {'emotion': 'depression', 'level': doc['value_depression']},
                {'emotion': 'anxiety', 'level': doc['value_anxiety']},
                {'emotion': 'irritability', 'level': doc['value_irritability']}
              ]
            },
            total_score: doc['total_score']
          };

          let weather_sentence = null;
          let weather_img = null;
          let weather_recommendation = null;
          if (doc['weather'] === 'sunny'){
            weather_sentence = recommendations['sentences']['sunny'];
            weather_img = getRandom(sunny_imgs);
            weather_recommendation = getRandom(recommendations['poems']['sunny']);
          }
          else if (doc['weather'] === 'rainy'){
            weather_sentence = recommendations['sentences']['rainy'];
            weather_img = getRandom(rainy_imgs);
            weather_recommendation = getRandom(recommendations['poems']['rainy']);
          }
          else if (doc['weather'] === 'cloudy'){
            weather_sentence = recommendations['sentences']['cloudy'];
            weather_img = getRandom(cloudy_imgs);
            weather_recommendation = getRandom(recommendations['poems']['cloudy']);
          }
          else if (doc['weather'] === 'snowy'){
            weather_sentence = recommendations['sentences']['snowy'];
            weather_img = getRandom(snowy_imgs);
            weather_recommendation = getRandom(recommendations['poems']['snowy']);
          }
          let total_words = null;
          if(doc['total_score'] > 0){
            total_words = getRandom(recommendations['encourageWords']);
          }
          else {
            total_words = getRandom(recommendations['comfortWords']);
          }
          let report_extend = {
            weather_sentence: weather_sentence,
            weather_img: 'data:image/jpeg;base64,' + weather_img,
            weather_recommendation: weather_recommendation,
            meal_img: 'data:image/jpeg;base64,' + getRandom(food_imgs),
            meal_recommendation: getRandom(recommendations['meal_recommendations']),
            sleep_img: 'data:image/jpeg;base64,' + getRandom(sleep_imgs),
            sleep_recommendation: getRandom(recommendations['sleep_recommendations']),
            total_words: total_words
          };
          callback({
            code: 1,
            dailyReport: dailyReport,
            report_extend: report_extend
          })
        }
      }
    })
  });

  //weekly report
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
          console.log("get weekly report...........");
          // console.log(docs);
          let count = 0;
          let sleepSum = 0;
          let mealSum = 0;
          let textEmoSum = 0;
          let totalSum = 0;
          let happiness = new WeeklyEmo('happiness');
          let excitement = new WeeklyEmo('excitement');
          let depression = new WeeklyEmo('depression');
          let irritability = new WeeklyEmo('irritability');
          let anxiety = new WeeklyEmo('anxiety');
          let MondayDate = null;
          let bestPhoto = "";
          let bestRecord = "";
          let highestPhotoHappiness = 0;
          let highestTextHappiness = -3;
          for(let i=0; i < docs.length; i++){
            count += 1;
            MondayDate = docs[i]['MondayDate'];
            sleepSum += docs[i]['hoursSleep'];
            mealSum += docs[i]['mealsHad'];
            totalSum += docs[i]['total_score'];
            happiness.append_date(docs[i]['date'], docs[i]['value_happiness']);
            excitement.append_date(docs[i]['date'], docs[i]['value_excitement']);
            depression.append_date(docs[i]['date'], docs[i]['value_depression']);
            irritability.append_date(docs[i]['date'], docs[i]['value_irritability']);
            anxiety.append_date(docs[i]['date'], docs[i]['value_anxiety']);
            textEmoSum += docs[i]['textScore'];

            // let tmpKeyWords = JSON.parse(docs[i]['keyWords']);
            // for(let key in tmpKeyWords){
            //   if (key in keyWords){
            //     keyWords[key] += tmpKeyWords[key];
            //   }
            //   else{
            //     keyWords[key] = tmpKeyWords[key];
            //   }
            // }
            // keyWords.sort(score_compare());
            // let topKeyWords = {};
            // let begin = 0;
            // for(let key in keyWords){
            //   begin += 1;
            //   topKeyWords[key] = keyWords[key];
            //   if(begin > 5){
            //     break;
            //   }
            // }

            if(docs[i]['imgHappiness'] > highestPhotoHappiness){
              highestPhotoHappiness = docs[i]['imgHappiness'];
              bestPhoto = docs[i]['img'];
            }
            if(docs[i]['textScore'] > highestTextHappiness){
              highestTextHappiness = docs[i]['textScore'];
              bestRecord = docs[i]['input'];
            }
          }

          let returnValue = {
            'MondayDate': MondayDate,
            'averageSleep': sleepSum/count,
            'averageMeal': mealSum/count,
            'total_score': totalSum/count,
            'chartHappiness': happiness.getItem(),
            'chartExcitement': excitement.getItem(),
            'chartDepression': depression.getItem(),
            'chartIrritability': irritability.getItem(),
            'chartAnxiety': anxiety.getItem(),
            'BestRecords': bestRecord,
            'BestPhoto': 'data:image/jpeg;base64,'+ bestPhoto
          };
          callback({
            code: 1,
            weekly_report: returnValue
          })
        }
      }
    })
  });

  //collect data
  socket.on("emoContent", function(data, callback){
    console.log("processing emotion content.......");
    let date = new Date(data.date);
    console.log(date);

    //text analysis

    let sentiment = new Sentiment();
    let textScore = sentiment.analyze(data.emoInput.input).score;

    let sentences = data.emoInput.input.split(/[\n]/).filter(function(e){return e});
    let extractKeywords = function(list){
      //tfidf
      let tokenizer = new EnglishTokenizer();
      let keywordExtractor = new KeywordExtractor();
      // console.log(list);
      keywordExtractor.setTokenizer(tokenizer);
      list.forEach((text, i) => {
        keywordExtractor.addDocument(i, text)
      });
      let rank = {};
      for(let i = 0; i < list.length; i++){
        let tfidfResult = keywordExtractor.extractKeywords(list[i], {
          sortByScore: true,
          limit: 10
        });
        for(let j = 0; j < tfidfResult.length; j++){
          let key = tfidfResult[j][0];
          let value = tfidfResult[j][1];
          if (key in rank){
            rank[key] += value;
          }
          else{
            rank[key] = value;
          }
        }
      }
      let topRank = Object.keys(rank).sort((a,b)=>{
        return rank[b]-rank[a];
      });
      // console.log(rank);
      // rank.sort(score_compare());
      // let keywords = {};
      // let maxLen = 5;
      // let from = 0;
      // for(let j in rank){
      //   keywords[j] = rank[j];
      //   from += 1;
      //   if(from > maxLen) break;
      // }
      return topRank.slice(0,5).toString();
    };
    let keyWords = extractKeywords(sentences);


    // console.log(typeof (data.emoInput.input));
    // let keyWords = rake.generate(data.emoInput.input);
    // keyWords = keyWords.slice(0, 5).toString();
    // console.log(keyWords);

    //img analysis
    let timeStamp = (new Date()).valueOf();
    let path = "imgs/"+data.user+ timeStamp+ ".jpg";
    let imgScore = {};
    let imgHappiness = 0;
    let imgSadness = 0;
    if (data.emoInput.img){
      let dataBuffer = new Buffer(data.emoInput.img, 'base64');
      fs.writeFile(path, dataBuffer, function(err) {
        if(err){
          console.log(err);
        }
        else {
          imgScore = faceEmo.getEmo("@"+path);
          imgHappiness = imgScore['happiness'];
          imgSadness = imgScore['sadness'];
          imgScore = JSON.stringify(imgScore);
          if(imgScore === "{}"){
            imgScore = "";
          }
          let total_score = 0.6 * (33 * (data.emoStatus.value_happiness + data.emoStatus.value_excitement - 0.8 * data.emoStatus.value_depression -
            0.8 * data.emoStatus.value_anxiety - 0.4 * data.emoStatus.value_irritability)) +
            0.3 * (textScore * 10) +
            0.1 * ((imgHappiness - imgSadness));
          //record
          userRecord.create({
            //basic info
            weather: data.emoStatus.weather,
            username: data.user,
            year: date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate(),
            date: dateUtil.dateString(date),
            MondayDate: dateUtil.mondayDateString(date),
            input: data.emoInput.input,
            img: data.emoInput.img,
            hoursSleep: data.emoStatus.hoursSleep,
            mealsHad: data.emoStatus.meals,
            value_happiness: data.emoStatus.value_happiness,
            value_irritability: data.emoStatus.value_irritability,
            value_anxiety: data.emoStatus.value_anxiety,
            value_depression: data.emoStatus.value_depression,
            value_excitement: data.emoStatus.value_excitement,
            //detected value
            textScore: textScore,
            keyWords: keyWords,
            imgScore: imgScore,
            imgHappiness: imgHappiness,
            imgSadness: imgSadness,
            total_score: total_score
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
        }
      });
    }
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
