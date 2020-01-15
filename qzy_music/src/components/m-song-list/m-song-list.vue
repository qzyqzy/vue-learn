<template>
  <div class="song-list">
    <ul>
      <template v-for="(song, index) in songs">
        <li :key="index" class="item" @click="onSong(song, index)">
          <div class="content">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ getDesc(song) }}</p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'songList',
  props: {
    songs: {
      type: [Array, String]
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}/${song.album}`;
    },
    onSong(item, index) {
      this.$emit('onSong', item, index);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'scss/variable';
@import 'scss/mixin';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('first');
        }
        &.icon1 {
          @include bg-image('second');
        }
        &.icon2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
