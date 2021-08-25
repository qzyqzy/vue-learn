// 将 install 中传递的 vue 全局保存
let Vue;

// 插件必须提供的 install 方法，接收的参数为 Vue构造函数
function install(_vue) {
  Vue = _vue;
  applyMixin(Vue);
}
// 使用混入为每个组件生成一个 $store
function applyMixin(Vue) {
  Vue.mixin({
    beforeCreate: vuexInit,
  });
}
// 获取根组件注入的 store 实例、为每个组件注册 $store
function vuexInit() {
  let options = this.$options;
  if (options.store) {
    this.$store =
      typeof options.store === "function" ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    // this.$parent || options.parent  都可以
    this.$store = options.parent.$store;
  }
}

class Store {
  constructor(options) {
    console.log("options", options);
    // 借助 Vue 的 data 将 state 中的数据变为响应式的
    // 结合 get state
    // 借助 computed 实现 getters
    let state = options.state;
    let getters = options.getters;
    this.getters = {};
    let computed = {};
    // 循环 getters
    forEachValue(getters, (fn, key) => {
      // 这样写也可以 但没有利用计算属性的缓存
      // Object.defineProperty(this.getters, key, {
      //   get: () => {
      //     return fn(this.state);
      //   },
      //   enumerable: true,
      // });

      // 计算属性绑定时计算值
      computed[key] = () => {
        return fn(this.state);
      };
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this.vm[key];
        },
        enumerable: true,
      });
    });
    // mutations
    // 因为是箭头函数，this 指向不用特殊处理
    let mutations = options.mutations;
    this.mutations = {};
    forEachValue(mutations, (fn, key) => {
      this.mutations[key] = (data) => {
        fn(this.state, data);
      };
    });
    // actions
    let actions = options.actions;
    this.actions = {};
    forEachValue(actions, (fn, key) => {
      this.actions[key] = (data) => {
        fn(this, data);
      };
    });
    this.vm = new Vue({
      data: {
        state,
      },
      computed,
    });
  }
  get state() {
    return this.vm.state;
  }
  commit = (name, data) => {
    this.mutations[name](data);
  };
  dispatch = (name, data) => {
    this.actions[name](data);
  };
}

/**
 * forEach for object
 */
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}
export default { Store, install };
