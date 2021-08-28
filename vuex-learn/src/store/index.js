import Vue from "vue";
import Vuex from "./../qvuex";

Vue.use(Vuex);

let store = new Vuex.Store({
  // 严格模式
  strict: true,
  state: {
    count: "root",
  },
  getters: {
    rootDoubleCount(state) {
      return state.count.repeat(2);
    },
  },
  mutations: {
    add(state, payload) {
      state.count += payload;
    },
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        commit("add", payload);
      }, 1000);
    },
  },
  modules: {
    a: {
      state: {
        count: "a2",
      },
      // mutations 中严格需要放置同步的修改
      mutations: {
        add(state, value) {
          state.count += value;
        },
      },
    },
    b: {
      modules: {
        c: {
          state: {
            count: "c2",
          },
          actions: {
            add({ commit }, payload) {
              setTimeout(() => {
                commit("add", payload);
              }, 1000);
            },
          },
        },
      },
      state: {
        count: "b2",
      },
      // mutations 中严格需要放置同步的修改
      mutations: {
        add(state, value) {
          state.count += value;
        },
      },
    },
  },
});
// 注册模块 `myModule`
store.registerModule("myModule", {
  state: {
    count: "myModule",
  },
  getters: {
    db(state) {
      return state.count + 1;
    },
  },
});
export default store;
