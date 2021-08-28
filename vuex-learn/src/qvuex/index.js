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
    // 借助 Vue 的 data 将 state 中的数据变为响应式的
    // 结合 get state
    // 借助 computed 实现 getters
    let state = options.state;
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this.vm = new Vue({
      data: {
        state,
      },
      // computed,
    });
    // let getters = options.getters;

    // let computed = {};
    // 收集依赖
    this.modules = new ModuleCollection(options);
    // 安装依赖
    installModule(this, this.state, [], this.modules.root);
    // // 循环 getters
    // forEachValue(getters, (fn, key) => {
    //   // 这样写也可以 但没有利用计算属性的缓存
    //   // Object.defineProperty(this.getters, key, {
    //   //   get: () => {
    //   //     return fn(this.state);
    //   //   },
    //   //   enumerable: true,
    //   // });

    //   // 计算属性绑定时计算值
    //   computed[key] = () => {
    //     return fn(this.state);
    //   };

    // // mutations
    // // 因为是箭头函数，this 指向不用特殊处理
    // let mutations = options.mutations;
    //
    // forEachValue(mutations, (fn, key) => {
    //   // 函数劫持
    //   this.mutations[key] = (data) => {
    //     fn(this.state, data);
    //   };
    // });
    // // actions
    // let actions = options.actions;
    //
    // forEachValue(actions, (fn, key) => {
    //   this.actions[key] = (data) => {
    //     fn(this, data);
    //   };
    // });
  }
  get state() {
    return this.vm.state;
  }
  // 动态注册
  registerModule(path, rawModule) {
    if (typeof path === "string") {
      path = [path];
    }
    this.modules.register(path, rawModule);
    // 安装依赖
    installModule(this, this.state, path, this.modules.get(path));
  }
  commit = (name, payload) => {
    this.mutations[name].forEach((fn) => fn(payload));
  };
  dispatch = (name, payload) => {
    this.actions[name].forEach((fn) => fn(payload));
  };
}

// 模块依赖收集
class ModuleCollection {
  constructor(options) {
    this.register([], options);
  }
  register(path, rootModule) {
    let newModule = new Module(rootModule);
    if (!this.root) {
      this.root = newModule;
    } else {
      let curModules = path.slice(0, -1).reduce((root, current) => {
        return root._children[current];
      }, this.root);
      curModules._children[path[path.length - 1]] = newModule;
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module);
      });
    }
  }
  get(path) {
    return path.reduce(function (module, key) {
      return module.getChild(key);
    }, this.root);
  }
}

// 单个模块

class Module {
  constructor(rawModule) {
    this._children = Object.create(null);
    this._rawModule = rawModule;
    this.state = rawModule.state;
  }
  getChild(key) {
    return this._children[key];
  }
}

// 安装模块
function installModule(store, rootState, path, rawModule) {
  // 处理 state
  if (path.length) {
    let parentState = path.slice(0, -1).reduce((root, curState) => {
      return root[curState];
    }, rootState);
    Vue.set(parentState, path[path.length - 1], rawModule.state);
  }

  // 处理 getters
  let getters = rawModule._rawModule.getters;
  if (getters) {
    forEachValue(getters, (fn, key) => {
      // 不是直接赋值 而是通过此方法修改可扩展
      Object.defineProperty(store.getters, key, {
        get: () => {
          return fn(rawModule.state);
        },
        enumerable: true,
      });
    });
  }

  // 处理 mutations
  let mutations = rawModule._rawModule.mutations;
  if (mutations) {
    forEachValue(mutations, (fn, mutationName) => {
      let mutationsList = store.mutations[mutationName];
      if (!mutationsList) {
        mutationsList = store.mutations[mutationName] = [];
      }
      mutationsList.push((payload) => {
        fn(rawModule.state, payload);
      });
    });
  }

  // 处理 actions
  // 处理 mutations
  let actions = rawModule._rawModule.actions;
  if (actions) {
    forEachValue(actions, (fn, actionsName) => {
      let actionsList = store.actions[actionsName];
      if (!actionsList) {
        actionsList = store.actions[actionsName] = [];
      }
      actionsList.push((payload) => {
        fn(store, payload);
      });
    });
  }

  // 便利子元素
  forEachValue(rawModule._children, (curRawModule, moduleName) => {
    installModule(store, rootState, path.concat(moduleName), curRawModule);
  });
}

// for in 遍历会遍历原型 性能差
/**
 * forEach for object
 */
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}
export default { Store, install };
