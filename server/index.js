let express = require('express');
let router = express.Router();
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Sentiment = require('sentiment');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// var Sentiment = require('sentiment');
// var sentiment = new Sentiment();
// var result = sentiment.analyze('I am glad');
// console.log(result);

io.on('connection',function(socket) {
  socket.on('emoText', function (obj) {
    console.log(obj.txt);

    let sentiment = new Sentiment();
    let result = sentiment.analyze(obj.txt);
    let score = result.score;
    socket.emit('emoStatus',{
      msg: score
    });
    console.log("message sent: ", result);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
