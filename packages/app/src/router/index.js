import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mobile from '../views/Mobile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mobile',
    name: 'Mobile',
    component: Mobile
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
