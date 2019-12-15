<template>
  <div class="content">
    <Calendar
      ref="Calendar"
      :markDateMore="arr"
      agoDayHide="1530115221"
      v-on:choseDay="clickDay"
      v-on:changeMonth="changeDate"
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
        arr2:[
          {
            date: "2019/12/4",
            className: "mark1"
          }
        ]
      };
    },
    components: {
      Calendar
    },
    methods: {
      clickDay(data) {
        console.log(this.arr);
      },
      clickToday(data) {
        console.log("跳到了本月今天", data); //跳到了本月
      },
      changeDate(data) {
        this.$toast("切换到的月份为" + data);
        console.log("左右点击切换月份", data);
      }
    },
    mounted() {
      function format(year, month, day) {
        return `${year}-${month}-${day}`;
      }
      let that = this;
      let data = {
        msg: 1
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



      // setTimeout(() => {
      //   this.arr = [
      //     {
      //       date: format(new Date(), 3),
      //       className: "mark1"
      //     },
      //     {
      //       date: format(new Date(), 12),
      //       className: "mark2"
      //     }
      //   ];
      //   this.arr.push({
      //     date: format(new Date(), 15),
      //     className: "mark1"
      //   });
      // }, 300);
    }
  };
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>


  .wh_container >>> .mark1 {
    background-color: orange;
  }
</style>
