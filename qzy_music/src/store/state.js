import {
  playMode
} from 'common/js/config'
const state = {
  singer: {}, // 歌手信息
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
}

export default state
