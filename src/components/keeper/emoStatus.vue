<template>
  <div>
    <h1 style="display: inline-block">Emo Record</h1>

    <div style="position:relative; display: inline-block; margin-left: 80px">
      <img src="../../assets/icon/date.png" class="icon" style="display: inline-block">
      <div style="font-size: 110%; display: inline-block">{{dateString}}</div>

    </div>
    <div class="odd_row">
      <div class="sub_title">
        <img src="../../assets/icon/weather.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Weather Today
        </div>
      </div>
      <div>
        <el-select v-model="emoRecord.weather" placeholder="choose">
          <el-option
            v-for="item in weather_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
      </div>
    </div>
    <div class="even_row">
      <div class="sub_title">
        <img src="../../assets/icon/food.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Meals Had Today
        </div>
      </div>
      <div>
        <el-select v-model="emoRecord.meals" placeholder="choose">
          <el-option
            v-for="item in meal_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="odd_row">
      <div class="sub_title">
        <img src="../../assets/icon/sleep.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Hours slept last night
        </div>
        <div style="display: inline-block; margin-left: 70px">{{hoursSleep}} hours</div>
      </div>

      <mt-range
        v-model="emoRecord.hoursSleep"
        :min="0"
        :max="24"
        :step="1">
        <div slot="start">0</div>
        <div slot="end">24</div>

      </mt-range>
    </div>
    <div class="even_row">
      <div class="sub_title">
        <img src="../../assets/icon/happy.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Today's most extreme happiness
        </div>
      </div>
      <mt-range
        v-model="emoRecord.value_happiness"
        :min="0"
        :max="3"
        :step="1">
      </mt-range>
      <table>
        <tr>
          <td class="label">None</td>
          <td class="label">Mild</td>
          <td class="label">Moderate</td>
          <td class="label">Strong</td>
        </tr>
      </table>
    </div>
    <div class="odd_row">
      <div class="sub_title">
        <img src="../../assets/icon/excite.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Today's most extreme excitement
        </div>
      </div>
      <mt-range
        v-model="emoRecord.value_excitement"
        :min="0"
        :max="3"
        :step="1">
      </mt-range>
      <table>
        <tr>
          <td class="label">None</td>
          <td class="label">Mild</td>
          <td class="label">Moderate</td>
          <td class="label">Strong</td>
        </tr>
      </table>
    </div>
    <div class="even_row">
      <div class="sub_title">
        <img src="../../assets/icon/sad.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Today's most extreme depression
        </div>
      </div>
      <mt-range
        v-model="emoRecord.value_depression"
        :min="0"
        :max="3"
        :step="1">
      </mt-range>
      <table>
        <tr>
          <td class="label">None</td>
          <td class="label">Mild</td>
          <td class="label">Moderate</td>
          <td class="label">Strong</td>
        </tr>
      </table>
    </div>
    <div class="odd_row">
      <div class="sub_title">
        <img src="../../assets/icon/angry.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Today's most extreme irritability
        </div>
      </div>
      <mt-range
        v-model="emoRecord.value_irritability"
        :min="0"
        :max="3"
        :step="1">
      </mt-range>
      <table>
        <tr>
          <td class="label">None</td>
          <td class="label">Mild</td>
          <td class="label">Moderate</td>
          <td class="label">Severe</td>
        </tr>
      </table>
    </div>
    <div class="even_row">
      <div class="sub_title">
        <img src="../../assets/icon/anxiety.png" class="icon" style="display: inline-block">
        <div style="display: inline-block">
          Today's most extreme anxiety
        </div>
      </div>
      <mt-range
        v-model="emoRecord.value_anxiety"
        :min="0"
        :max="3"
        :step="1">
      </mt-range>
      <table>
        <tr>
          <td class="label">None</td>
          <td class="label">Mild</td>
          <td class="label">Moderate</td>
          <td class="label">Severe</td>
        </tr>
      </table>
    </div>

    <div>Diary</div>
    <textarea class="textarea" v-model="emoInput.input" placeholder="Describe your life today with several sentences"></textarea>
    <!--<mt-button @click="open_camera">open camera</mt-button>-->

    <!--<div v-if="taken === 1">-->
      <!--<img :src="emoInput.img" class="img">-->
    <!--</div>-->
    <!--<div v-else>-->
      <!--<img src="../../assets/imagedefault.png" class="img">-->
    <!--</div>-->
    <div>
      <div style="display: inline-block">Take a selfie!</div>
      <img @click="callCamera" :src="headImgSrc" width="20" height="20" alt="摄像头" style="display: inline-block">
      <!--canvas截取流-->

      <!--图片展示-->
      <video id="video" ref="video" width="320" height="230" autoplay style="display: none"></video>
      <canvas id="canvas" ref="canvas" width="320" height="230" style="display: none"></canvas>
      <!--确认-->

    </div>
    <mt-button @click="photograph" style="display: inline-block">confirm</mt-button>
    <mt-button @click="submit" style="display: inline-block">submit</mt-button>
  </div>
</template>

<script>
  export default {
    name: "emoStatus",
    data() {
      return {
        headImgSrc: require('../../assets/camera.jpg'),
        weather_options:[{
          value: 'sunny',
          label: 'sunny'
        }, {
          value: 'rainy',
          label: 'rainy'
        }, {
          value: 'cloudy',
          label: 'cloudy'
        }, {
          value: 'snowy',
          label: 'snowy'
        }],
        meal_options:[{
          value: 0,
          label: 0
        }, {
          value: 1,
          label: 1
        }, {
          value: 2,
          label: 2
        }, {
          value: 3,
          label: 3
        }, {
          value: 4,
          label: 4
        }, {
          value: 5,
          label: ">4"
        }
        ],
        emoRecord:{
          weather: null,
          hoursSleep: 0,
          meals: null,
          value_happiness: 0,
          value_irritability: 0,
          value_anxiety: 0,
          value_depression: 0,
          value_excitement: 0
        },
        emoInput: {
          // symptoms: null,
          // therapy: null,
          input: null,
          imgData: null,
          img: null
        },
        taken: 0,
        date: new Date()
        // date: new Date(new Date()-24*60*60*1000)
      }

    },
    computed:{
      hoursSleep: function(){
        if(this.emoRecord.hoursSleep < 3){
          return "3-";
        }
        else if(this.emoRecord.hoursSleep > 12){
          return "12+";
        }
        else {
          return this.emoRecord.hoursSleep;
        }
      },
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
          that.taken = 1;
          that.emoInput.imgData = imageData;
          that.emoInput.img = "data:image/jpeg;base64," + imageData;
        }
        function onFail(message) {
          alert('Failed because: ' + message);
        }
      },
      submit:function () {
        console.log(this.emoInput);
        this.$socket.emit('emoContent',{
          emoInput: this.emoInput,
          emoStatus: this.emoRecord,
          date: this.date,
          user: this.$store.state.user
        }, (data)=>{
          if (data.code === 1){
            this.$toast("Submitted! Have a nice day :)")
          }
        });
      },

      callCamera () {
        let video = document.getElementById("video");
        video.style.display = "";
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then(success => {
          this.$refs['video'].srcObject = success
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      },
      photograph () {
        let canvas = document.getElementById("canvas");
        canvas.style.display = "";
        let ctx = this.$refs['canvas'].getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs['video'], 0, 0, 320, 230);
        // 转base64格式、图片格式转换、图片质量压缩
        let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg');

        // 由字节转换为KB 判断大小
        let str = imgBase64.replace('data:image/jpeg;base64,', '');
        this.emoInput.img = str;
        let strLength = str.length;
        let fileLength = parseInt(strLength - (strLength / 8) * 2);
        // 图片尺寸  用于判断
        let size = (fileLength / 1024).toFixed(2);
        console.log(size);
        // 上传拍照信息  调用接口上传图片 .........

        // 保存到本地
        // let ADOM = document.createElement('a');
        // ADOM.href = this.headImgSrc;
        // ADOM.download = new Date().getTime() + '.jpeg';
        // ADOM.click()
      },
      closeCamera () {
        if (!this.$refs['video'].srcObject) return;
        let stream = this.$refs['video'].srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop()
        })
        this.$refs['video'].srcObject = null
      },

    },
    mounted: function () {
      // this.sockets.subscribe('emoStatus',(data)=>{
      //   console.log(data);
      //   let emoStatus = "The emotion status is:"+ data.msg;
      //   this.$message(emoStatus);
      // })
    }
  }
</script>

<style scoped>
  .sub_title{
    text-align: left;
    font-size: 110%;
  }
  .odd_row{
    border: 10px solid transparent;
    background: mintcream;
  }
  .even_row{
    border: 10px solid transparent;
    background: gainsboro;
  }
  .label{
    width: 110px;
  }
  .textarea{
    border:0;
    border-radius:5px;
    background-color: mintcream;
    width: 355px;
    height: 100px;
    padding: 10px;
    resize: none;
  }
  .img{
    width: 355px;
    height: 300px;
  }
  .icon{
    width: 20px;
    height: 20px;
  }
</style>
