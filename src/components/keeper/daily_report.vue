<template>
  <mt-swipe :auto="30000000" class="swipe">
    <mt-swipe-item class="weather">
      <div>{{daily_report.weather}}</div>
      <div>{{daily_report.sleepHour}}</div>
      <div>{{daily_report.meals}}</div>
    </mt-swipe-item>
    <mt-swipe-item class="chart">
      <ve-line :data="daily_report.emoChart"></ve-line>
    </mt-swipe-item>
    <mt-swipe-item class="text">
      <div>{{daily_report.report}}</div>
    </mt-swipe-item>
    <mt-swipe-item class="img">
      <img :src="daily_report.img">
    </mt-swipe-item>
  </mt-swipe>
</template>

<script>
    export default {
      name: "emoChart",
      data(){
        return {
          daily_report:{
            weather: null,
            sleepHour: null,
            meals: null,
            emoChart: null,
            report: null,
            reportInfo: null,
            img: null,
            imgInfo: null
          }
        }
      },
      computed: {
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
          }
        })
      }
    }
</script>

<style scoped>
  .swipe{
    background: #3a8ee6;
    height: 300px;
    width: 300px;
  }
</style>
