<template>
  <el-container>

    <el-header>Header</el-header>
    <el-main>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="choose date">
      </el-date-picker>
      <div class="block">
        <span class="demonstration">happiness</span>
        <el-rate v-model="value_happiness"></el-rate>
      </div>
      <div class="block">
        <span class="demonstration">trouble</span>
        <el-rate v-model="value_trouble"></el-rate>
      </div>
      <div class="block">
        <span class="demonstration">anger</span>
        <el-rate v-model="value_anger"></el-rate>
      </div>
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      <el-button type="primary" v-on:click="submit">submit</el-button>
    </el-main>

  </el-container>
</template>

<script>
  export default {
    name: "emoStatus",
    data() {
      return {
        value_happiness: null,
        value_trouble:null,
        value_anger:null,
        input:'',
        date: null
      }
    },
    methods:{
      submit:function () {
        let message_tmp = "";
        if(this.value_happiness <= 2){
          message_tmp = "You are not happy today";
        }
        let that = this;
        let date = {
          year: that.date.getFullYear(),
          month: that.date.getMonth()+1,
          day: that.date.getDate()
        };
        this.$socket.emit('emoText',{
          txt: that.input,
          date: date
        })
      },

    },
    mounted: function () {
      this.sockets.subscribe('emoStatus',(data)=>{
        console.log(data);
        let emoStatus = "The emotion status is:"+ data.msg;
        this.$message(emoStatus);
      })
    }
  }
</script>

<style scoped>

</style>
