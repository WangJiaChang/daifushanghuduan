import Vue from 'vue'
import Router from 'vue-router'
import daifuguanli from '@/components/daifuguanli'
import login from '@/components/login'
import password from '@/components/password'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },{
      path: '/daifuguanli',
      name: 'daifuguanli',
      component: daifuguanli
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path:'/password',
      name:'password',
      component:password
    }
  ]
})
