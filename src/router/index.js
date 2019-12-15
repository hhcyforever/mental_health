import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import emoStatus from '@/components/keeper/emoStatus'
import emoChart from '@/components/keeper/emoChart'
import login from '@/components/login'
import signUp from '@/components/signup'
import calendar from '@/components/keeper/calendar'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: signUp
    },
    {
      path: '/home',
      name: 'emoStatus',
      component: emoStatus
    },
    {
      path: '/keeper/emoChart',
      name: 'emoChart',
      component: emoChart
    },
    {
      path:'/keeper/calendar',
      name:'calendar',
      component: calendar
    }
  ]
})
