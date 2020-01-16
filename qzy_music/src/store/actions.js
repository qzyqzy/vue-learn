import {
  playMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
const actions = {
  onPlay({
    commit,
    state
  }, {
    list,
    index
  }) {
    commit('setSequenceList', list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit('setPlayList', randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit('setPlayList', list)
    }
    commit('setCurrentIndex', index)
    commit('setFullScreen', true)
    commit('setPlayingState', true)
  },
  randomPlay({
    commit
  }, {
    list
  }) {
    commit('setPlayMode', playMode.random)
    commit('setSequenceList', list)
    commit('setPlayList', shuffle(list))
    commit('setCurrentIndex', 0)
    commit('setFullScreen', true)
    commit('setPlayingState', true)
  }
}

export default actions
