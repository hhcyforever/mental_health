let dateString = function (dateFrom) {
  let date = dateFrom;
  if(typeof (dateFrom) === "string"){
    date = new Date(Date.parse(dateFrom));
  }
  return String(date.getFullYear())+"-"+String(date.getMonth()+1)+"-"+date.getDate();
};

let mondayDateString = function (dateFrom) {
  let date = dateFrom;
  // console.log(typeof (dateFrom) === "string");
  if(typeof (dateFrom) === "string"){
    date = new Date(Date.parse(dateFrom));
  }
  // console.log(typeof(date));
  let time = date.getTime();
  let day = date.getDay();
  let oneDayTime = 24*60*60*1000;
  let MondayDate = new Date(time-(day-1)*oneDayTime);
  return String(MondayDate.getFullYear())+"-"+String(MondayDate.getMonth()+1)+"-"+MondayDate.getDate();
};

module.exports = {
  dateString: dateString,
  mondayDateString: mondayDateString
};
