export function createRouteMap(routes, oldPathList, oldPathMap) {
  // 存储路由信息 ['/a', '/b']
  let pathList = oldPathList || [];
  // 存储路由信息对应表 比如每个路径对应的组件 ['/a':'组件a']
  let pathMap = oldPathMap || Object.create(null);

  // 循环处理，如果存在子路由，遍历处理
  routes.forEach((route) => {
    addRouteRecord(route, pathList, pathMap);
  });
  return {
    pathList,
    pathMap,
  };
}
// 嵌套路由的路径会根据 parent 进行处理
function addRouteRecord(route, pathList, pathMap, parent) {
  let { path, component } = route;
  if (parent) {
    path = `${parent.path}/${path}`;
  }
  let record = {
    path,
    component,
    parent,
  };
  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }
  if (route.children) {
    route.children.forEach((child) => {
      addRouteRecord(child, pathList, pathMap, record);
    });
  }
}
