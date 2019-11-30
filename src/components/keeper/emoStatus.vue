<template>
  <el-container>

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
        input:''
      }
    },
    methods:{
      submit:function () {
        var message_tmp = "";
        var that = this;
        if(this.value_happiness <= 2){
          message_tmp = "You are not happy today";
        }
        // this.$alert(this.input, 'test', {
        //
        // });
        let params = {
          input: that.input
        };
        console.log(params);
        this.$http.post('/api/nlpProcess', params)
          .then((response) => {

          })
      },
      }

  }
</script>

<style scoped>

</style>
