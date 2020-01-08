<template>
  <div class="recommend">
    <m-scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!-- 轮播图-->
        <div v-if="recommendList.length" class="slider-wrapper" ref="sliderWrapper">
          <m-slider>
            <template v-for="list in recommendList">
              <div :key="list.id" class="slider-item">
                <a :href="list.linkUrl" target="_blank"><img :src="list.picUrl" @load="loadImage" /></a>
              </div>
            </template>
          </m-slider>
        </div>
        <!-- 热门推荐-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <template v-for="(item, index) in discList">
              <li @click="selectItem(item)" :key="index" class="item">
                <div class="icon"><img width="60" height="60" v-lazy="item.imgurl" /></div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </m-scroll>
  </div>
</template>
<script>
import MSlider from 'components/m-slider/m-slider';
import MScroll from 'components/m-scroll/m-scroll';
import { getRecommend, getDiscList } from 'common/api/recommend';
import { ERR_OK } from 'common/api/config';
export default {
  name: 'recommend',
  components: {
    MSlider,
    MScroll
  },
  data() {
    return {
      recommendList: '',
      discList: '',
      checkloaded: false
    };
  },
  created() {
    this.getRecommenData();
    this.getDiscData();
  },
  methods: {
    getRecommenData() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList = res.data.slider;
        }
      });
    },
    getDiscData() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    },
    selectItem() {}
  }
};
</script>
<style scoped lang="scss">
@import 'scss/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
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
