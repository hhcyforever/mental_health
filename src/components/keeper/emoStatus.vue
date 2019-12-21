<template>
  <div>
    <h1>Emo Record</h1>
    <div>
      {{dateString}}
    </div>
    <div class="odd_row">
      <div class="sub_title">Weather Today</div>
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
      <div class="sub_title">Meals had today</div>
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
      <div class="sub_title">Hours slept last night</div>
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
      <div class="sub_title">Today's most extreme happiness</div>
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
      <div class="sub_title">Today's most extreme excitement</div>
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
      <div class="sub_title">Today's most extreme depression</div>
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
      <div class="sub_title">Today's most extreme irritability</div>
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
      <div class="sub_title">Today's most extreme anxiety</div>
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
    <textarea v-model="emoInput.input" placeholder="Describe your life today with several sentences"></textarea>
    <div>Take a selfie!</div>
    <mt-button @click="open_camera">open camera</mt-button>
    <img :src="emoInput.img" class="img">
    <mt-button @click="submit">submit</mt-button>
  </div>
</template>

<script>
  export default {
    name: "emoStatus",
    data() {
      return {
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
          hoursSleep: null,
          meals: null,
          value_happiness: null,
          value_irritability: null,
          value_anxiety: null,
          value_depression: null,
          value_excitement: null
        },
        emoInput: {
          // symptoms: null,
          // therapy: null,
          input: null,
          imgData: null,
          img: null
        },

        date: new Date()
      }

    },
    computed:{
      dateString: function () {
        let date =  new Date();
        return String(date.getFullYear())+"-"+String(date.getMonth()+1)+"-"+date.getDate();
      }
    },
    methods:{
      // next: function(){
      //   this.$router.push({name:'emoInput',params: {status: this.emoRecord}})
      // }
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
  }
  .odd_row{
    border: 10px solid transparent;
    background: aliceblue;
  }
  .even_row{
    border: 10px solid transparent;
    background: floralwhite;
  }
  .label{
    width: 110px;
  }
</style>
