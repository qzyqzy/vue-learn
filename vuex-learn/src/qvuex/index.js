// 将 install 中传递的 vue 全局保存
let Vue;

// 插件必须提供的 install 方法，接收的参数为 Vue
function install(_vue) {
  console.log(12);
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
    // 易写错 $parent
    this.$store = options.parent;
  }
}

class Store {
  constructor() {}
}
export default { Store, install };
