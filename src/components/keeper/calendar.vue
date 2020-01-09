<template>
  <div class="content">
    <Calendar
      ref="Calendar"
      :markDateMore="arr"
      agoDayHide="1530115221"
      v-on:choseDay="clickDay"
      style="height: 600px"
    ></Calendar>
  </div>
</template>

<script>
  import Calendar from "vue-calendar-component";
  export default {
    data() {
      return {
        finishedArr: [],
        arr: [],
        // arr2:[
        //   {
        //     date: "2019/12/4",
        //     className: "mark1"
        //   }
        // ]
      };
    },
    components: {
      Calendar
    },
    methods: {
      clickDay(data) {
        console.log(data);
        let date = data.split(/\//);
        console.log(date);
        // this.$store.commit('setDate',date);
        // this.$store.commit('gotoPage','daily_report');
        this.$router.push({name:'daily_report',params: {year: date[0], month: date[1], day: date[2]}})
      }
    },
    mounted() {
      function format(year, month, day) {
        return `${year}-${month}-${day}`;
      }
      let that = this;
      let data = {
        user: this.$store.state.user
      };
      this.$socket.emit('tryGetDate',data, function (data) {
        let allDates = data.msg;
        console.log(allDates);
        for(let i=0; i<allDates.length; i++){
          let date = allDates[i];
          that.arr.push({
            date: format(date.year, date.month, date.day),
            className: "mark1"
          });
        }
      });
    }
  };
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>


  .wh_container >>> .mark1 {
    background-color: orange;
  }
</style>
