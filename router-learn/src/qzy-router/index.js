import { install } from "./install";
import { createMatcher } from "./create-matcher";
class VueRouter {
  constructor(options) {
    console.log(options, "options");
    this.matcher = createMatcher(options.routes || [], this);
  }
}
VueRouter.install = install;

export default VueRouter;
