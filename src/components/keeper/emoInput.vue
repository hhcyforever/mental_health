<template>
  <div>
    <!--<h1>Emo Record</h1>-->
    <div>
      {{dateString}}
    </div>
    <div>
      <!--<mt-cell title="Psychotic symptoms today">-->
        <!--<mt-switch v-model="emoInput.symptoms"></mt-switch>-->
      <!--</mt-cell>-->
      <!--<mt-cell title="Talk therapy today">-->
        <!--<mt-switch v-model="emoInput.therapy"></mt-switch>-->
      <!--</mt-cell>-->
      <div>Diary</div>
      <textarea v-model="emoInput.input" placeholder="Describe your life today with several sentences"></textarea>
      <div>Take a selfie!</div>
      <mt-button @click="open_camera">open camera</mt-button>
      <img :src="emoInput.img" class="img">
      <!--<img src="../../assets/happy.jpg" />-->
      <mt-button @click="submit">submit</mt-button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "emoInput",
      data(){

        return{
          emoInput: {
            // symptoms: null,
            // therapy: null,
            input: null,
            imgData: null,
            img: null
          },
          // date: new Date(),
          date: new Date(new Date()-24*60*60*1000)
        }
      },
      computed:{
        dateString: function () {
          let date =  this.date;
          return String(date.getFullYear())+"-"+String(date.getMonth()+1)+"-"+date.getDate();
        }
      },
      methods:{
        open_camera(){
          navigator.camera.getPicture(onSuccess, onFail,
            {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL
            });
          let that = this;
          function onSuccess(imageData) {
            // let image = document.getElementById('myImage');
            // image.src = "data:image/jpeg;base64," + imageData;
            that.emoInput.imgData = imageData;
            that.emoInput.img = "data:image/jpeg;base64," + imageData;
          }
          function onFail(message) {
            alert('Failed because: ' + message);
          }
        },
        submit:function () {
          console.log(this.emoInput);
          // let date = {
          //   year: this.date.getFullYear(),
          //   month: this.date.getMonth()+1,
          //   day: this.date.getDate()
          // };
          this.$socket.emit('emoContent',{
            emoInput: this.emoInput,
            emoStatus: this.$route.params.status,
            date: this.date,
            user: this.$store.state.user
          }, (data)=>{
            if (data.code === 1){
              this.toast("Submitted! Have a nice day :)")
            }
          });
        },
      }
    }
</script>

<style scoped>
 .img{
   height: 200px;
   width: 200px;
 }
</style>
