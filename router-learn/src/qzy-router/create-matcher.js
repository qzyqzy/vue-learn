import { createRouteMap } from "./create-route-map";
export function createMatcher(routes) {
  let { pathList, pathMap } = createRouteMap(routes);
  console.log(pathMap, "pathMap");
  function match() {}

  function addRoutes() {}

  return {
    match,
    addRoutes,
  };
}
