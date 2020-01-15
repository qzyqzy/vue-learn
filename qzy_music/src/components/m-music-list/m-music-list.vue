<template>
  <div class="music-list">
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <m-scroll :data="songs" :listen-scroll="true" :probe-type="3" @scroll="onSongListScroll" class="list" ref="list">
      <div class="song-list-wrapper"><m-song-list :songs="songs" @onSong="onSong"></m-song-list></div>
      <div class="loading-container" v-show="!songs.length"><m-load></m-load></div>
    </m-scroll>
  </div>
</template>

<script>
import MScroll from 'components/m-scroll/m-scroll';
import MSongList from 'components/m-song-list/m-song-list';
import MLoad from 'components/m-load/m-load';
import { prefixStyle } from 'common/js/dom.js';
import { mapActions } from 'vuex';
const transform = prefixStyle('transform');
const RESERVED_HEIGHT = 40;
export default {
  name: 'musicList',
  components: {
    MScroll,
    MSongList,
    MLoad
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: [Array, String],
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  watch: {
    scrollY(newVal) {
      let zIndex = 0;
      let scale = 1;
      let translateY = Math.max(this.maxTransalteY, newVal);
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      }
      if (newVal < this.maxTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = 'none';
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = 'block';
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    ...mapActions(['onPlay']),
    back() {
      this.$router.back();
    },
    onSongListScroll(pos) {
      this.scrollY = pos.y;
    },
    onSong(item, index) {
      this.onPlay({ list: this.songs, index });
    }
  }
};
</script>

<style scoped lang="scss">
@import 'scss/variable';
@import 'scss/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
