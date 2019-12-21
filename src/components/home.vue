<template>
  <div class="home">
    <div>
      <div v-if="selected === 'record'">
        <emo-status></emo-status>
      </div>
      <div v-else-if="selected === 'calendar'">
        <calendar></calendar>
      </div>
      <div v-else-if="selected === 'report'">
        <daily_report></daily_report>
      </div>
      <div v-else>
        <weekly_report></weekly_report>
      </div>
    </div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <mt-tabbar v-model="selected" class="bottom">
      <mt-tab-item id="record">
        <!--<emo-status></emo-status>-->
        record
      </mt-tab-item>
      <mt-tab-item id="calendar">
        <!--<calendar></calendar>-->
        calendar
      </mt-tab-item>
      <mt-tab-item id="report">
        <!--<daily_report></daily_report>-->
        report
      </mt-tab-item>
      <mt-tab-item id="statistics">
        <!--<weekly_report></weekly_report>-->
        statistics
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import emoStatus from "./keeper/emoStatus"
  import daily_report from "./keeper/daily_report"
  import weekly_report from "./keeper/weekly_report"
  import calendar from "./keeper/calendar"
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome',
      selected: 'record'
    }
  },
  components:{
    emoStatus,
    daily_report,
    weekly_report,
    calendar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home{
    /*position: relative;*/
  }
  .bottom{
    position:fixed;
    bottom: 5px;
  }
</style>
