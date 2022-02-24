/* eslint-disable */

import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import ToggleButton from 'vue-js-toggle-button';
import VueMobileDetection from 'vue-mobile-detection';
import VueAnalytics from 'vue-analytics';
import VueHtml2Canvas from 'vue-html2canvas';
import ICS from 'vue-ics';
import SmoothScrollbar from 'vue-smooth-scrollbar';
import VCalendar from 'v-calendar';

Vue.config.productionTip = false;

Vue.use(SmoothScrollbar);
Vue.use(VueHtml2Canvas);
Vue.use(ToggleButton);
Vue.use(VueMobileDetection);
Vue.use(ICS);
Vue.use(VueAnalytics, {
  id: 'UA-165919387-2',
  router,
});
Vue.use(VCalendar, {
  componentPrefix: 'vc',
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
