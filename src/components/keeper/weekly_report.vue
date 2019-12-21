<template>
  <mt-swipe :auto="30000000" class="swipe">
    <mt-swipe-item class="sleep">
      <div>In this week, you have {{weekly_report.averageSleep}} hours for sleep on average</div>
    </mt-swipe-item>
    <mt-swipe-item class="meals">
      <div>In this week, you have {{weekly_report.averageMeal}} hours for sleep on average</div>
    </mt-swipe-item>
    <mt-swipe-item class="chart">
      <ve-line :data="weekly_report.chartHappiness"></ve-line>
      <ve-line :data="weekly_report.chartExcitement"></ve-line>
      <ve-line :data="weekly_report.chartDepression"></ve-line>
      <ve-line :data="weekly_report.chartIrritability"></ve-line>
      <ve-line :data="weekly_report.chartAnxiety"></ve-line>
    </mt-swipe-item>
    <mt-swipe-item class="text">
      <div>{{weekly_report.BestRecords}}</div>
    </mt-swipe-item>
    <mt-swipe-item class="img">
      <img :src="weekly_report.BestPhoto">
    </mt-swipe-item>
  </mt-swipe>
</template>

<script>
    export default {
      name: "weekly_report",
      data(){
        return{
          weekly_report:{
            averageSleep: null,
            averageMeal: null,
            chartHappiness:{},
            chartExcitement:{},
            chartDepression:{},
            chartIrritability:{},
            chartAnxiety:{},
            BestRecords: null,
            BestPhoto: null
          }
        }
      },
      mounted: function () {
        let msg = {
          user: this.$store.state.user,
          date: new Date()
        };
        this.$socket.emit("getWeeklyReport",msg, function (data) {
          this.weekly_report = data.weekly_report;
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
