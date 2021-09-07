import { install } from "./install";
import { createMatcher } from "./create-matcher";
import { HashHistory } from "./history/hash";
class VueRouter {
  constructor(options) {
    console.log(options, "options");
    this.matcher = createMatcher(options.routes || [], this);

    // 路由
    let mode = options.mode || "hash";
    this.mode = mode;

    switch (this.mode) {
      case "hash":
        this.history = new HashHistory(this);
        break;

      default:
        break;
    }
  }
  init(app) {
    let history = this.history;
    let setupListeners = () => {
      history.setupListeners();
    };
    history.transitionTo(history.getCurrentLocation(), setupListeners);
    history.listen((route) => {
      app._route = route;
    });
  }
  match(location) {
    return this.matcher.match(location);
  }
}
VueRouter.install = install;

export default VueRouter;
