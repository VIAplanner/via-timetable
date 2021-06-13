import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../views/Home.vue';
import about from '../views/About.vue';
import timetable from '../views/Timetable.vue';
import program from '../views/Program.vue';

Vue.use(VueRouter);

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
      {
        name: 'program',
        path: 'program',
        component: program,
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: about,
  },
  {
    path: '*',
    redirect: {
      name: 'home',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
