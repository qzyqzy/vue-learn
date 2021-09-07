import View from "./components/view";
import Link from "./components/link";
let Vue;

export function install(_vue) {
  Vue = _vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 保存根实例
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
      // 上面的方法写完之后 所有的组件都可以通过 this._routerRoot._router 访问路由实例
    },
  });

  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    },
  });

  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });

  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);
}
