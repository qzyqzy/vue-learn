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
    this.mutations = {};
    this.actions = {};
    this._wrappedGetters = {};

    // 收集依赖
    this.modules = new ModuleCollection(options);
    let state = this.modules.root.state;

    // 安装依赖
    installModule(this, state, [], this.modules.root);

    // state 与 getters 处理
    resetStoreVM(this, state);
  }
  get state() {
    return this._vm.state;
  }
  // 动态注册
  registerModule(path, rawModule) {
    if (typeof path === "string") {
      path = [path];
    }
    this.modules.register(path, rawModule);
    // 安装依赖
    installModule(this, this.state, path, this.modules.get(path));
    resetStoreVM(this, rawModule.state);
  }
  commit = (name, payload) => {
    this.mutations[name].forEach((fn) => fn(payload));
  };
  dispatch = (name, payload) => {
    this.actions[name].forEach((fn) => fn(payload));
  };
}
// 借助 Vue 的 data 将 state 中的数据变为响应式的
// 结合 get state
// 借助 computed 实现 getters
function resetStoreVM(store, state) {
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    computed[key] = () => fn();
    Object.defineProperty(store.getters, key, {
      get: function () {
        return store._vm[key];
      },
      enumerable: true, // for local getters
    });
  });
  store._vm = new Vue({
    data: {
      state: state,
    },
    computed: computed,
  });
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
  forEachGetters(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  }
  forEachMutations(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  }
  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
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

  // 将 getters 存储到 _wrappedGetters
  rawModule.forEachGetters((getter, key) => {
    // 如果需要配置命名空间
    // 此时的 getter 对应的属性 key 就可以处理为 a/add
    // key = 'a/add'
    store._wrappedGetters[key] = () => {
      return getter(rawModule.state);
    };
  });

  // 将 mutations 存储到 mutations
  rawModule.forEachMutations((mutation, key) => {
    // 如果需要配置命名空间 设置 key
    let mutationsList = store.mutations[key] || (store.mutations[key] = []);
    mutationsList.push((payload) => {
      mutation(rawModule.state, payload);
    });
  });

  // 将 actions 存储到 actions
  rawModule.forEachAction((action, key) => {
    // 如果需要配置命名空间 设置 key
    let actionsList = store.actions[key] || (store.actions[key] = []);
    actionsList.push((payload) => {
      action(store, payload);
    });
  });

  // 便利子元素
  forEachValue(rawModule._children, (curRawModule, moduleName) => {
    installModule(store, rootState, path.concat(moduleName), curRawModule);
    resetStoreVM(store, curRawModule.state);
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
