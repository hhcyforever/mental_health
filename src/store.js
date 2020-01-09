import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
  user: "",
  date:{
    year: null,
    month: null,
    day: null
  }
};

const mutations = {
  update (state, username) {
    state.user = username;
  },
  setDate(state, dateList){
    state.date.year = dateList[0];
    state.date.month = dateList[1];
    state.date.day = dateList[2];
  }
};

export default new Vuex.Store({
  state,
  mutations
})
