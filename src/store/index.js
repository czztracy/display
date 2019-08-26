import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import communal from './modules/communal'
import disasterReport from './modules/disasterReport'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    communal,
    disasterReport
  },
  getters
})

export default store
