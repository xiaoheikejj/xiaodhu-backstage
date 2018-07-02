// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import router from './router'
import md5 from 'js-md5'
import validator from 'vue-validator'
import Qs from 'qs'

Vue.use(ElementUI)
Vue.use(validator)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.withCredentials = true
Vue.prototype.$md5 = md5
Vue.prototype.$qs = Qs

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // render: h => h(App)
    components: { App },
    template: '<App/>'
}).$mount('#app')
