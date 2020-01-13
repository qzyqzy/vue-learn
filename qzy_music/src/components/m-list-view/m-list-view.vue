<template>
  <m-scroll class="listview" ref="listview" :data="data" :listen-scroll="true" :probe-type="3" @scroll="onListViewScroll">
    <ul>
      <template v-for="(group, index) in data">
        <li :key="index" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{ group.title }}</h2>
          <uL>
            <template v-for="(item, cIndex) in group.items">
              <li :key="'' + index + cIndex" class="list-group-item">
                <img class="avatar" v-lazy="item.avatar" />
                <span class="name">{{ item.name }}</span>
              </li>
            </template>
          </uL>
        </li>
      </template>
    </ul>
    <div class="list-shortcut">
      <ul @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
        <template v-for="(item, index) in shortcutList">
          <li :key="index" :data-index="index" class="item" :class="{ current: currentIndex === index }">{{ item }}</li>
        </template>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
  </m-scroll>
</template>

<script>
import MScroll from 'components/m-scroll/m-scroll';
import { getData } from 'common/js/dom.js';
const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;
export default {
  name: 'listView',
  components: {
    MScroll
  },
  props: {
    data: {
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      if (!this.data.length) {
        return;
      }
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.calculateHeight();
      }, 20);
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY >= 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    }
  },
  created() {
    this.listHeight = [];
    // 记录在右侧导航滑动的距离
    this.touch = {};
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this.scrollToList(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let distance = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + distance;
      this.scrollToList(anchorIndex);
    },
    scrollToList(anchorIndex) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
    },
    onListViewScroll(pos) {
      this.scrollY = pos.y;
    },
    calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import 'scss/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
