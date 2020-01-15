const actions = {
  onPlay({
    commit,
    state
  }, {
    list,
    index
  }) {
    commit('setSequenceList', list)
    commit('setCurrentIndex', index)
    commit('setFullScreen', true)
    commit('setPlayingState', true)
  }
}

export default actions
