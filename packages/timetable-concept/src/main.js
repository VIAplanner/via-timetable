import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
// import { creatseProvider } from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  // apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
