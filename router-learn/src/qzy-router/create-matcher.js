import { createRouteMap } from "./create-route-map";
import { createRoute } from "./history/base";
export function createMatcher(routes) {
  let { pathList, pathMap } = createRouteMap(routes);
  console.log(pathMap, "pathMap");
  function match(location) {
    let record = pathMap[location];
    if (record) {
      return createRoute(record, {
        path: location,
      });
    }
    return createRoute(null, {
      path: location,
    });
  }

  function addRoutes() {}

  return {
    match,
    addRoutes,
  };
}
