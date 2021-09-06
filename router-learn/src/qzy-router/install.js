let Vue;

export function install(_vue) {
  Vue = _vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 保存根实例
        this._routerRoot = this;
        this._router = this.$options.router;
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
      // 上面的方法写完之后 所有的组件都可以通过 this._routerRoot._router 访问路由实例
    },
  });
}
