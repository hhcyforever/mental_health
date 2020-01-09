let fs = require('fs');

// function to encode file data to base64 encoded string
let base64_encode =  function(file) {
  // read binary data
  let bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
};

let read_imgs = function (path) {
  let files = fs.readdirSync(path);
  let imgs = [];
  files.forEach(function (item, index) {
    let tmp_path = path +"/"+ item;
    console.log(tmp_path);
    imgs.push(base64_encode(tmp_path));
  });
  return imgs;
};

let read_recommendations = function(path){
  let rawdata = fs.readFileSync(path);
  let student = JSON.parse(rawdata);
  return student;
};

module.exports = {
  read_imgs: read_imgs,
  read_recommendations: read_recommendations
};
