// 函数式组件

export default {
  name: "RouterView",
  functional: true,
  props: {
    name: {
      type: String,
      default: "default",
    },
  },
  render(h, { parent, data }) {
    // used by devtools to display a router-view badge
    data.routerView = true;
    const route = parent.$route;
    console.log(route, "route");
    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0;

    while (
      parent &&
      parent.$vnode &&
      parent.$vnode.data &&
      parent.$vnode.data.routerView
    ) {
      depth++;
      parent = parent.$parent;
    }

    const matched = route.matched[depth];
    const component = matched && matched.component;
    console.log(component, "component");
    // render empty node if no matched route or no config component
    if (!matched || !component) {
      return h();
    }
    return h(component, data);
  },
};
