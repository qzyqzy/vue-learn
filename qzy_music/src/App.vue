<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <m-player></m-player>
    <keep-alive><router-view /></keep-alive>
  </div>
</template>
<script>
import MHeader from 'components/m-header/m-header';
import MTab from 'components/m-tab/m-tab';
import MPlayer from 'components/m-player/m-player';
export default {
  name: 'app',
  components: {
    MHeader,
    MTab,
    MPlayer
  }
};
</script>
<style lang="scss"></style>
