import { History } from "./base";

export class HashHistory extends History {
  constructor(router) {
    super(router);

    // 确保存在 /
    ensureSlash();
  }
  getCurrentLocation() {
    return getHash();
  }
  setupListeners() {
    // popstate  hashchange
    window.addEventListener("hashchange", () => {
      this.transitionTo(getHash());
    });
  }
}
function getHash() {
  // 不能直接使用 window.location.hash 因为火狐不兼容
  let href = window.location.href;
  let index = href.indexOf("#");
  if (index < 0) return "";

  href = href.slice(index + 1);
  return href;
}

function ensureSlash() {
  if (window.location.hash) {
    return;
  }
  window.location.hash = "/";
}
