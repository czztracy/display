const disasterReport = {
  state: {
    theDisasterId: '',
    standardDisaster: ''
  },
  mutations: {
    // 报灾/标准 id
    GET_DISASTERID: (state, id) => {
      state.theDisasterId = id
    },
    // 报灾/标准 title
    GET_standardDisaster: (state, title) => {
      state.standardDisaster = title
    }
  },
  actions: {
    getDisasterId ({ commit }, id) {
      commit('GET_DISASTERID', id)
    },
    getStandardDisaster ({ commit }, title) {
      commit('GET_standardDisaster', title)
    }
  }
}

export default disasterReport
