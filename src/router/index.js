import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import emoStatus from '@/components/keeper/emoStatus'
import daily_report from '@/components/keeper/daily_report'
import login from '@/components/login'
import signUp from '@/components/signup'
import calendar from '@/components/keeper/calendar'
import emoInput from '@/components/keeper/emoInput'
import weekly_report from '@/components/keeper/weekly_report'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path:'',
      redirect:'/login',
    },
    {
      path: '/home',
      name: 'home',
      component: home
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
      path: '/keeper_emoStatus',
      name: 'emoStatus',
      component: emoStatus
    },
    {
      path: '/keeper/emoInput',
      name: 'emoInput',
      component: emoInput
    },
    {
      path: '/keeper/daily_report',
      name: 'daily_report',
      component: daily_report
    },
    {
      path:'/keeper/calendar',
      name:'calendar',
      component: calendar
    },
    {
      path:'/keeper/weekly_report',
      name:'weekly_report',
      component: weekly_report
    }
  ]
})
