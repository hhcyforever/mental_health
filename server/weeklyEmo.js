function WeeklyEmo(emo) {
  this.columns = ['date', emo];
  this.rows = [];
  this.emo = emo;
  this.append_date = function (date, emoValue) {
    let newEmo = {};
    newEmo['date'] = date;
    newEmo[this.emo] = emoValue;
    this.rows.push(newEmo);
  };
  this.getItem = function () {
    return {
      columns: this.columns,
      rows: this.rows
    }
  }
};

module.exports = {
  WeeklyEmo: WeeklyEmo
};

