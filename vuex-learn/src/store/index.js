import Vue from "vue";
import Vuex from "./../qvuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // 严格模式
  strict: true,
  state: {
    count: 2,
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  // mutations 中严格需要放置同步的修改
  mutations: {
    add(state, value) {
      state.count += value;
    },
  },
  actions: {
    add({ commit }, value) {
      setTimeout(() => {
        commit("add", value);
      }, 1000);
    },
  },
  modules: {},
});
