let shell = require('shelljs');

let api_key = 'KaDTvxtUh9nmzzMgJJ0yAzzoeXI2TQ3H';
let api_secret = '2Iy3IzEiQPOZlffc2L8adjsUENxxw_NB';

let getEmo = function(path){
  // let tmp = "@imgs/happy.jpg";
  let tmp = path;
  let cmd = 'curl -X POST "https://api-cn.faceplusplus.com/facepp/v3/detect"  -F "api_key=' + api_key +
    '" -F "api_secret=' + api_secret + '" -F "image_file=' + tmp + '" -F "return_attributes=emotion"';
  // console.log(cmd);
  let res = JSON.parse(shell.exec(cmd, {silent: true}).toString());
  // console.log(res);
  let emo = res["faces"][0]["attributes"]["emotion"];
  console.log(res["faces"][0]["attributes"]["emotion"]);
  return emo;
};

// getEmo("@imgs/happy.jpg");
// let cmd = "emotion-detector-js info -i ./imgs/happy_man_test.jpg";
// let res = shell.exec(cmd, {silent: false}).toString();
// console.log(res);
module.exports = {
  getEmo: getEmo
};
