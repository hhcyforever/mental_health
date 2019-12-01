<template>
  <el-container>

<!--    rate the moods on a 1-to-5 scale.-->
    <el-header>Header</el-header>
    <el-main>
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

      <!-- diary-->
      <el-input v-model="input" placeholder="Your diary:"></el-input>

      <!-- select go to bed time-->
      <el-time-picker
        v-model="bedTime"
        :picker-options="{
      selectableRange: '20:00:00 - 02:00:00'
    }"
        placeholder="Go to bed at">
      </el-time-picker>

      <!-- select wake up time-->
      <el-time-picker
        arrow-control
        v-model="wakeTime"
        :picker-options="{
      selectableRange: '04:00:00 - 10:00:00'
    }"
        placeholder="Wake up at">
      </el-time-picker>

      <!-- true if sick, false otherwise-->
      <el-switch
        v-model="is_sick"
        active-color="#13ce66"
        inactive-color="#cccccc">
      </el-switch>

      <!-- Medications, if sick. Not applicable (N/A) if not sick-->
      <el-input
        placeholder="Input medications if applicable:"
        v-model="input"
        :disabled=!is_sick>
      </el-input>

      <!-- submit data-->
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
        bedTime:null,
        wakeTime:null,
        is_sick: false,
        input:''
      }
    },
    methods:{
      submit:function () {
        let message_tmp = "";
        if(this.value_happiness <= 2){
          message_tmp = "You are not happy today";
        }
        let that = this;
        this.$socket.emit('emoText',{
          txt: that.input
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
