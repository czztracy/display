const getters = {
  // 灾情快报 台账弹窗title
  DISASTERBULLETINTITLE: state => state.communal.DISASTERBULLETINTITLE,
  // 报灾标准确认
  disasterStandard: state => state.communal.disasterStandard,
  // 灾情快报 报灾/标准 id
  disasterId: state => state.disasterReport.theDisasterId,
  // 灾情快报 报灾/标准 title
  standardDisaster: state => state.disasterReport.standardDisaster
}

export default getters
