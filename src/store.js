import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
  user: ""
};

const mutations = {
  update (state, username) {
    state.user = username;
  },
};

export default new Vuex.Store({
  state,
  mutations
})
