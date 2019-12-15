<template>
  <div class="sign-up">
    <h2>Welcome!</h2>
    <h1>Create account for EmoKeeper</h1>
    <div>
      <mt-field label="Username" placeholder="Enter your username" v-model="username" class="my-input"></mt-field>
      <mt-field label="Password" placeholder="Enter a password" type="password" v-model="password" class="my-input" ></mt-field>
      <mt-field label="Confirm" placeholder="Enter password again" type="password" v-model="password_new" class="my-input" ></mt-field>
      <mt-button size="large" color="primary" @click="sign_up">Create your account</mt-button>
    </div>
    <h6>Have an account?</h6>
    <router-link :to="{path: '/login'}">
      <mt-button>
        Log In
      </mt-button>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "sign-up",
    data(){
      return {
        username:null,
        password:null,
        password_new: null
      }
    },
    methods:{
      sign_up(){
        let u=this.username;
        let p=this.password;
        let p2 = this.password_new;

        let reg=/^[a-z0-9_]{3,12}$/i;
        if(!reg.test(u)){
          this.$toast("Improper username format!");
          return;
        }
        if(!reg.test(p)){
          this.$toast("Improper password format!");
          return;
        }

        if (p !== p2){
          this.$toast("Inconsistent password!");
          this.password = "";
          this.password_new = "";
          return;
        }

        let obj={
          username:u,
          password:p
        };

        this.$socket.emit('sign_up', obj, (data)=> {
            if(data.code === 1){
              this.$toast("Welcome," + this.username + "!");
              this.$router.push("/home");
            }
            else{
              this.$messagebox("Error","The username has been registered");
            }
          }
        );
      }
    }
  }
</script>

<style scoped>
  .sign-up{
    width:100%;
    height:670px;
    background-image:url('../assets/bg.jpg');
    background-size:100%;
  }

  .my-input{
    margin-top:5px;
  }
</style>
