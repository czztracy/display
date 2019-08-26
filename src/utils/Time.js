// 将中国标准时间 转为YYYY-MM-mm HH:mm:ss类型 支持近一周 不支持月
export function format (date) {
  const str = date.toISOString()
  const dateStr = str.split('T')[0]
  const timeStr = date.toTimeString().split(' ')[0]
  return dateStr + ' ' + timeStr
}
// 月处理
export function getPassFormatDate (num) {
  var date = new Date()
  date.setDate(date.getDate() - num)
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hours + ':' + minutes + ':' + seconds
  return currentdate
}

export function recursionData (obj) {
  var headerObj = {
    hitPeople: '受灾人口',
    deathPeople: '因灾死亡人口',
    missPeople: '因灾失踪人口',
    transferPeople: '紧急转移安置人口',
    woundPeople: '因灾伤病人口',
    bailoutPeople: '需紧急生活救助人口',
    droughtPeople: '因旱需生活救助人口',
    droughtDrinkWaterPeople: '其中：因旱饮水困难救助人口',
    cropDamage: '农作物受灾面积',
    cropFailure: '其中：农作物绝收面积',
    livestock: '饮水困难大牲畜',
    housesCollapsed: '倒塌房屋间数',
    houseNumber: '倒塌房屋户数',
    theFarmhouse: '其中：倒塌农房间数',
    farmhouseDoor: '其中：倒塌农房户数',
    seriousFarmRoom: '其中：严重损坏农房间数',
    seriousFarmDoor: '其中：严重损坏农房户数',
    badlyDamaged: '严重损坏房屋间数',
    badlyDamagedDoor: '严重损坏房屋户数',
    generalDamage: '一般损坏房屋间数',
    generalFarmRoom: '其中：一般损坏农房间数',
    damageRoomDoor: '一般损坏房屋户数',
    inDamageRoomDoor: '其中：一般损坏农房户数',
    directEconomicLoss: '直接经济损失',
    agriculturalLosses: '其中：农业损失',
    enterprisesLosses: '工矿企业损失',
    infrastructureLosses: '基础设施损失',
    publicLosses: '公益设施损失',
    familyLosses: '家庭财产损失',
    centralizedSettlement: '集中安置人口',
    scatteredPeople: '分散安置人口',
    transitivityPeople: '需过渡性救助人口',
    getTrappedPeople: '被困人口',
    causeDisaster: '其中：农作物成灾面积',
    thePastures: '草场受灾面积',
    destroyLand: '毁坏耕地面积',
    theDeathlivestock: '因灾死亡大牲畜',
    theDeathSheep: '因灾死亡羊只',
    typhoonNumber: '台风编号',
    earthquake: '地震震级',
    submergedCityship: '受淹城区',
    submergedTownship: '受淹镇区',
    floodedCountry: '受淹乡村',
    minedoutArea: '灾种名称',
    startTime: '灾害发生时间',
    endTime: '灾害结束时间',
    sticMonth: '灾害统计月',
    areaInfor: '受灾区域信息',
    housesCollapsedList: '因灾倒塌损坏住房户一览表',
    governmentRescue: '受灾人员灾后政府救助一览表'
  }
  // 拿出所需数据
  obj.reportItemValues.map(item => {
    for (let i in headerObj) {
      if (headerObj[i] === item.indexItem.indexItemName) {
        headerObj[i] = item.reportItemValue
      }
    }
  })
  // 对象中带有中文的变为 0
  for (let i in headerObj) {
    if (escape(headerObj[i]).indexOf('%u') < 0) {
    } else {
      headerObj[i] = '0'
    }
  }
  // 区域单独添加
  headerObj.area = obj.creditionRelation.civilRegionalism.civilRegionalismName
  // 添加id
  headerObj.id = GenNonDuplicateID()
  if (obj.reports && obj.reports.length !== 0) {
    obj.children = []
    obj.children.push(headerObj)
    obj.reports.map(a => {
      recursionData(a)
    })
  }
  return obj
}

export function GenNonDuplicateID () {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3)
  return idStr
}
