<template>
  <div id="app">
    <p>{{ $store.state.count }}</p>
    <p>{{ $store.getters.rootDoubleCount }}</p>
    <p>{{ $store.getters.db }}</p>
    <button @click="$store.commit('add', 2)">同步修改</button>
    <p></p>
    <button @click="$store.dispatch('add', 3)">异步修改</button>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
