<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup"><slot></slot></div>
    <div class="dots">
      <template v-for="(item, index) in dotNumber">
        <span class="dot" :key="index" :class="{ active: currentIndex === index }"></span>
      </template>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

import { addClass } from 'common/js/dom';
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      slider: '',
      childrenList: '',
      dotNumber: 0,
      currentIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this.setSliderWidth();
      this.initSlider();
      this.setAutpPlay();
    }, 20);

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return;
      }
      this.setSliderWidth(true);
      this.slider.refresh();
    });
  },
  activated() {
    this.setAutpPlay();
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    setSliderWidth(isResize) {
      this.childrenList = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      let len = this.childrenList.length;
      this.dotNumber = len;
      for (let i = 0; i < len; i++) {
        let child = this.childrenList[i];
        addClass(child, 'slider-item');
        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: true,
          threshold: 0.1
        }
      });
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentIndex = pageIndex;
        this.setAutpPlay();
      });
    },
    setAutpPlay() {
      if (!this.autoPlay) {
        return;
      }
      let pageIndex = this.currentIndex + 1;
      if (pageIndex >= this.dotNumber) {
        pageIndex = 0;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'scss/variable';
.slider {
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
