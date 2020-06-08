import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import mobile from '../views/Mobile.vue'
import about from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: mobile
  },
  {
    path: '/about',
    name: 'about',
    component: about
  },
  {
    path: '*',
    redirect: {
        name: "home"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
