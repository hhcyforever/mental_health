<template>
  <div class="main">
    <mt-swipe :auto="30000000" class="swipe">
      <mt-swipe-item class="chart">
        <img src="../../assets/bg_main2.jpg" class="img_bg">
        <div class="emo">
          <!--<img src="../../assets/bg_main2.jpg" class="img_bg">-->
          <h3>Comprehensive Score of This day</h3>
          <h3 style="margin-left: 160px">{{daily_report.total_score || numFilter}}</h3>
          <mt-progress :value="(daily_report.total_score+100)/2">
            <div slot="start">
              <img src="../../assets/icon/sad.png" class="icon">&nbsp;
            </div>
            <div slot="end">
              &nbsp;<img src="../../assets/icon/happy.png" class="icon">
            </div>
          </mt-progress>
        </div>
        <br>

        <img src="../../assets/icon/split_2.png" style="position:relative; width: 400px; height: 20px;">
        <ve-histogram :data="daily_report.emoChart" :extend="chartSettings" width="400px" height="300px"></ve-histogram>
        <img src="../../assets/icon/split_2.png" style="position:relative; width: 400px; height: 20px;">
        <div class="quotes">
          <h3>Wishes</h3>
          <div class="chartQuotes">
            {{report_extend.total_words}}
          </div>
          <!--<div v-if="emoState > 0">-->
          <!--<div class="chartQuotes">-->
          <!--{{encourageWords[encourage_id]}}-->
          <!--</div>-->
          <!--</div>-->
          <!--<div v-else>-->
          <!--<div class="chartQuotes">-->
          <!--{{comfortWords[comfort_id]}}-->
          <!--</div>-->
          <!--</div>-->
        </div>
      </mt-swipe-item>
      <mt-swipe-item class="weather">
        <div>
          <img :src="report_extend.weather_img" class="img">
          <div class="weather_title">
            {{report_extend.weather_sentence}}
          </div>
          <div class="encourage">
            {{report_extend.weather_recommendation}}
          </div>
        </div>
        <!--<div v-if='daily_report.weather === "sunny"'>-->
          <!--<img src="../../assets/weathers/sunny.jpg" class="img">-->
          <!--<div class="weather_title">-->
            <!--Ardent Sunny Day-->
          <!--</div>-->
          <!--<div class="encourage">-->
            <!--{{poems.sunny}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else-if='daily_report.weather === "snowy"'>-->
          <!--<img src="../../assets/weathers/snow.jpg" class="img">-->
          <!--<div class="weather_title">-->
            <!--Dreamlike Snowy Day-->
          <!--</div>-->
          <!--<div class="encourage">-->
            <!--{{poems.snowy}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else-if='daily_report.weather === "rainy"'>-->
          <!--<img src="../../assets/weathers/rainy.jpg" class="img">-->
          <!--<div class="weather_title">-->
            <!--Artistic Rainy Day-->
          <!--</div>-->
          <!--<div class="encourage">-->
            <!--{{poems.rainy}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else-if='daily_report.weather === "cloudy"'>-->
          <!--<img src="../../assets/weathers/cloudy.jpg" class="img">-->
          <!--<div class="meal_title">-->
            <!--Elegant Cloudy Day-->
          <!--</div>-->
          <!--<div class="encourage">-->
            <!--{{poems.rainy}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div>{{daily_report.weather}}</div>-->
        <!--<div>{{daily_report.meals}}</div>-->
      </mt-swipe-item>
      <mt-swipe-item class="meals">
        <img :src="report_extend.meal_img" class="img">
        <div class="meal_title">
          You had
          <div class="meals">{{daily_report.meals}}</div>
          meals in this day
        </div>
        <div class="encourage_meal">
          Tips: {{report_extend.meal_recommendation}}
        </div>
      </mt-swipe-item>
      <mt-swipe-item class="hoursSleep">
        <img :src="report_extend.sleep_img" class="img">
        <div class="sleep_title">You slept for {{daily_report.hoursSleep}} hours in the night</div>
        <div class="encourage_meal">
          Tips: {{report_extend.sleep_recommendation}}
        </div>
      </mt-swipe-item>

      <mt-swipe-item class="text">
        <img src="../../assets/bg_main2.jpg" class="img_bg">
        <h2>Diary</h2>
        <img src="../../assets/icon/split_2.png" style="position:relative; width: 400px; height: 20px;">
        <br>
        <br>
        <div>
          <div style="font-size: 110%">
            {{daily_report.report}}
          </div>
        </div>
        <br>
        <img src="../../assets/icon/split_2.png" style="position:relative; width: 400px; height: 20px;">
        <br>
        <br>
        <div class="emo">
          <h4>Emotion Score</h4>
          <mt-progress :value="((daily_report.reportEmo * 16)+100)/2">
            <div slot="start">
              <img src="../../assets/icon/sad.png" class="icon">&nbsp;
            </div>
            <div slot="end">
              &nbsp;<img src="../../assets/icon/happy.png" class="icon">
            </div>
          </mt-progress>
        </div>
        <br>
        <img src="../../assets/icon/split_2.png" style="position:relative; width: 400px; height: 20px;">
        <br>
        <div class="keywords">
          <h4>Keywords</h4>
          {{daily_report.reportInfo}}
        </div>
      </mt-swipe-item>
      <mt-swipe-item class="img">
        <img src="../../assets/bg_main2.jpg" class="img_bg">
        <h2>Selfie</h2>

        <ve-pie :data="img_chart" width="400px"></ve-pie>
        <img :src="daily_report.img" class="my_photo">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
    export default {
      name: "emoChart",
      data(){
        this.chartSettings = {
          "xAxis.0.axisLabel.rotate": 30,
        };
        return {
          daily_report:{
            weather: null,
            hoursSleep: null,
            meals: null,
            emoChart: null,
            report: null,
            reportEmo: null,
            reportInfo: null,
            img: null,
            imgScore: null
          },
          report_extend:{
            weather_sentence: null,
            weather_img: null,
            weather_recommendation: null,
            meal_img: null,
            meal_recommendation: null,
            sleep_img: null,
            sleep_recommendation: null,
            total_words: null
          }
        }
      },
      computed: {
        // imgEmotion: function(){
        //   if(daily_report){
        //     console.log(daily_report['imgScore']);
        //     return {
        //
        //     }
        //   }
        // },
        img_chart:function(){
          if (this.daily_report.imgScore){
            return {
              columns: ['emotion', 'level'],
              rows: [
                { 'emotion': 'anger', 'level': this.daily_report.imgScore.anger},
                { 'emotion': 'disgust', 'level': this.daily_report.imgScore.disgust},
                { 'emotion': 'fear', 'level': this.daily_report.imgScore.fear},
                { 'emotion': 'happiness', 'level': this.daily_report.imgScore.happiness},
                { 'emotion': 'neutral', 'level': this.daily_report.imgScore.neutral},
                { 'emotion': 'sadness', 'level': this.daily_report.imgScore.sadness},
                { 'emotion': 'surprise', 'level': this.daily_report.imgScore.surprise}
              ]
            }
          }

        },
        meal_id: function () {
          return Math.floor(Math.random()*(this.meal_recommendations.length));
        },
        sleep_id: function () {
          return Math.floor(Math.random()*(this.sleep_recommendations.length));
        },
        comfort_id: function () {
          return Math.floor(Math.random()*(this.comfortWords.length));
        },
        encourage_id: function () {
          return Math.floor(Math.random()*(this.encourageWords.length));
        },
        emoState: function () {
          if(this.daily_report.emoChart){
            if('rows' in this.daily_report.emoChart){
              let emo = 0;
              let rows = this.daily_report.emoChart.rows;
              for(let i = 0; i < rows.length; i++){
                let row = rows[i];
                if(row['emotion'] === 'happiness'|| row['emotion'] === 'excitement'){
                  emo += row['level'];
                }
                else{
                  emo -= row['level'];
                }
              }
              console.log(emo);
              return emo;
            }
          }
        },
        keywords: function () {
          if(this.daily_report.emoChart){
            let keywords = "";
            for(let keyword in this.daily_report.emoChart.reportInfo){
              keywords += keyword;
              keywords += " ";
            }
            return keywords;
          }
        }
        // chartData: function () {
        //   return {
        //     columns: ['emotion', 'degree'],
        //     rows:[
        //       {'emotion': 'happiness', 'degree': 1},
        //       {'emotion': 'excitement', 'degree': 1},
        //       {'emotion': 'depression', 'degree': 2},
        //       {'emotion': 'anxiety', 'degree': 3},
        //       {'emotion': 'irritability', 'degree': 4}
        //     ]
        //   }
        // }
      },
      filters: {
        numFilter (value) {
          let realVal = null;
          if (value) {
            realVal = value.toFixed(2);
          }
          return realVal;
        }
      },
      mounted: function () {
      //  init chartInfo
      //   let year = this.$route.params.year;
      //   let month = this.$route.params.month;
      //   let date = this.$route.params.day;
      //   let user = this.$store.state.user;
        console.log("daily_report mounted!");
        let info = {};
        if(this.$route.params.year){
          info = {
            year: this.$route.params.year,
            month:this.$route.params.month,
            day: this.$route.params.day,
            user: this.$store.state.user
          };
        }
        else{
          let date = new Date();
          info = {
            year: date.getFullYear(),
            month:date.getMonth()+1,
            day: date.getDate(),
            user: this.$store.state.user
          }
        }
        this.$socket.emit("getDailyReport", info, (data)=>{
          console.log(data);
          if (data.code === 1){
            this.daily_report = data.dailyReport;
            this.report_extend = data.report_extend;
          }
        })
      }
    }
</script>

<style scoped>
  .main{
    position: absolute;
    height: 100%;
    width: 100%;
    /*background-image:url('../../assets/bg_main.jpg');*/
  }
  .swipe{
    position: absolute;
    height: 100%;
    width: 100%;
    /*background-image:url('../../assets/bg_main.jpg');*/
  }
  .weather{
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .weather_title{
    font-family: "Gill Sans", sans-serif;
    position: relative;
    top: 150px;
    color: #f0f7ff;
    font-size:200%;
  }
  .img{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .img_bg{
    opacity:0.3;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .encourage{
    font-family: cursive;
    position: relative;
    top: 300px;
    color: #f0f7ff;
    font-size:120%;
  }
  .encourage_meal{
    font-family: cursive;
    position: relative;
    margin-right: 10px;
    margin-left: 10px;
    top: 400px;
    color: #f0f7ff;
    font-size:100%;
  }
  .meal_title{
    font-family: "Gill Sans", sans-serif;
    position: relative;
    top: 150px;
    margin-right: 10px;
    color: #f0f7ff;
    font-size:200%;
    text-align: right;
  }
  .sleep_title{
    font-family: "Gill Sans", sans-serif;
    position: relative;
    top: 150px;
    margin-right: 10px;
    color: #f0f7ff;
    font-size:200%;
    text-align: right;
  }
  .meals{
    font-size:120%;
    color: #FFFFFF;
  }
  .chartQuotes{
    font-family: cursive;
    /*background: #000;*/
    /*position: absolute;*/
    /*top: 400px;*/
    font-size:120%;
  }
  .quotes{
    /*background: #000000;*/
  }
  .diary{
    font-family: Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif;
    background: #FFFFFF;
    width: 411px;
    height: 300px;
  }
  .icon{
    width: 15px;
    height: 15px;
  }
  .my_photo{
    position: absolute;
    width: 60%;
    margin-left: 80px;
  }
</style>
