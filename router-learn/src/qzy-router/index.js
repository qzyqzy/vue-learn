import { createMatcher } from "./create-matcher";
class VueRouter {
  constructor(options) {
    console.log(options, "options");
    this.matcher = createMatcher(options.routes || [], this);
    console.log(this.matcher);
  }
}
VueRouter.install = function() {};

export default VueRouter;
