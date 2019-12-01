import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import emoStatus from '@/components/keeper/emoStatus'
import emoChart from '@/components/keeper/emoChart'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/keeper/emoStatus',
      name: 'emoStatus',
      component: emoStatus
    },
    {
      path: '/aaaa',
      name: 'emoChart',
      component: emoChart
    }
  ]
})
