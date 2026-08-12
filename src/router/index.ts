import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/HomeView.vue'
import about from '../views/AboutView.vue'
import timetable from '../views/TimetableView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
    redirect: { name: 'timetable' },
    children: [
      {
        name: 'timetable',
        path: 'timetable',
        component: timetable,
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: about,
  },
  {
    path: '/:catchAll(.*)',
    redirect: {
      name: 'home',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
