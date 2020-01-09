// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import Calendar from 'vue-calendar-component';
import VueSocketIO from 'vue-socket.io'
import Vuex from 'vuex'
import store from './store'
import echarts from "echarts"


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.use(MintUI);
Vue.use(Calendar);
Vue.use(Vuex);
Vue.use(echarts);

/* eslint-disable no-new */
Vue.use(new VueSocketIO({
  debug: true,
  // connection: 'http://10.188.222.154:3000',
  // local
  connection: 'http://127.0.0.1:3000',
  vuex: {

  }
}));

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
