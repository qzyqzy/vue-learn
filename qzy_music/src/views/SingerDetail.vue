<template>
  <transition name="slide"><m-music-list :title="title" :bg-image="bgImage" :songs="songs"></m-music-list></transition>
</template>

<script>
import { ERR_OK } from 'common/api/config';
import { getSingerDetail } from 'common/api/singer';
import { getSongVkey } from 'common/api/songs';
import { createSong } from 'common/js/songs';
import { mapGetters } from 'vuex';
import MMusicList from 'components/m-music-list/m-music-list';
export default {
  name: 'singerDetail',
  components: {
    MMusicList
  },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    }
  },
  created() {
    this.getSingerDetail();
  },
  methods: {
    getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongs(res.data.list);
        }
      });
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, ''));
          // getSongVkey(musicData.songmid).then((res)=>{
          //   let vKey=res.data.items[0].vkey

          // })
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="scss">
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
