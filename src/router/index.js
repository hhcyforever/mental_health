import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import emoStatus from '@/components/keeper/emoStatus'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/ppp',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/keeper/emoStatus',
      name: 'emoStatus',
      component: emoStatus
    }
  ]
})
