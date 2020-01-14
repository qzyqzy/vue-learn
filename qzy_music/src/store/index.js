import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'



export default new Vuex.Store({
  state: state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
