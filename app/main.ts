import Vue from 'nativescript-vue'
import App from './components/App.vue'
// import FontIcon from 'nativescript-vue-fonticon';
// import './app.scss'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Vue.use(FontIcon, {
//   componentName:'FIcon',
//   debug:false,
//   paths: {
//     far:'./assets/css/font-awesome.css',
//   }
// })

Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);


new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
