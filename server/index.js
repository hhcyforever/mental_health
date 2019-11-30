var express = require('express');
var router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.post('/api/nlpProcess', function (req, res) {
    var aa= req.body.content;
    console.log(aa);
    console.log("received");
    res.json({

    });
  });

// var Sentiment = require('sentiment');
// var sentiment = new Sentiment();
// var result = sentiment.analyze('I am glad');
// console.log(result);


app.listen(3000);
console.log('success listen 3000');
