import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Carvue from 'carvue'
import 'carvue/dist/carvue.min.css'

Vue.config.productionTip = false

Vue.use(Carvue)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
