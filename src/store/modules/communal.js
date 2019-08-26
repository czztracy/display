const communal = {
  state: {
    DISASTERBULLETINTITLE: '',
    disasterStandard: ''
  },
  mutations: {
    // 灾情快报 台账弹窗title
    GET_DISASTERBULLETINTITLE: (state, title) => {
      state.DISASTERBULLETINTITLE = title
    },
    // 灾情快报报灾按钮以及标准按钮触发
    GET_DISASTERSTANDARD: (state, data) => {
      state.disasterStandard = data
    }
  },
  actions: {
    getDisasterBulletinTitle ({ commit }, title) {
      commit('GET_DISASTERBULLETINTITLE', title)
    },
    getDisasterStandard ({ commit }, data) {
      commit('GET_DISASTERSTANDARD', data)
    }
  }
}

export default communal
