<template>
  <div class="singer">歌手</div>
</template>
<script>
import { ERR_OK } from 'common/api/config';
import { getSingerList } from 'common/api/singer';
export default {
  name: 'singer',
  data() {
    return {
      singerList: ''
    };
  },
  created() {
    this.getSingerData();
  },
  methods: {
    getSingerData() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss"></style>
