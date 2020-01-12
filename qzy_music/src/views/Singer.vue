<template>
  <div class="singer"><m-list-view :data="singerList"></m-list-view></div>
</template>
<script>
import { ERR_OK } from 'common/api/config';
import { getSingerList } from 'common/api/singer';
import MListView from 'components/m-list-view/m-list-view.vue';
import Singer from 'common/js/singer';
const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';
export default {
  name: 'singer',
  components: {
    MListView
  },
  data() {
    return {
      singerList: ''
    };
  },
  created() {
    this.getSingerData();
  },
  methods: {
    normalizeSinger(list) {
      if (!list) {
        return;
      }
      let mapData = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        let singer = new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        });
        if (index < HOT_SINGER_LEN) {
          mapData.hot.items.push(singer);
        }
        const key = item.Findex;
        if (!mapData[key]) {
          mapData[key] = {
            title: key,
            items: []
          };
        }
        mapData[key].items.push(singer);
      });
      // 为了得到有序列表，我们需要处理 mapData
      let ret = [];
      let hot = [];
      for (let key in mapData) {
        let val = mapData[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    getSingerData() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this.normalizeSinger(res.data.list);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
