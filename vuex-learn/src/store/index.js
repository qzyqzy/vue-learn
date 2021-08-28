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
      console.log(1);
      return state.count.repeat(2);
    },
  },
  mutations: {
    add(state, payload) {
      console.log("root-add");
      state.count += payload;
    },
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        console.log("root-async-add");
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
          console.log("a-root");
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
                console.log("c-async-add");
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
          console.log(2);
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
});
export default store;
