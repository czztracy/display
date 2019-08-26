// 灾情快报
import request from '@/utils/request'
// 待接收灾情
export function disasterReceived (params) {
  return request({
    url: '/bulletin/country/unaudited/reports/paged',
    method: 'POST',
    data: params
  })
}

// 已接收灾害过程
export function disasterYet (params) {
  return request({
    url: '/bulletin/country/audited/reports/paged',
    method: 'POST',
    data: params
  })
}

// 全部灾害过程
export function disasterAll (params) {
  return request({
    url: '/bulletin/country/audit/reports/all/paged',
    method: 'POST',
    data: params
  })
}

// 文本按钮接口
export function translateTextTemplate01 (params = {}, id) {
  return request({
    url: `/bulletin/country/translateTextTemplate01/${id}`,
    method: 'GET',
    params
  })
}

// 区域按钮接口
export function listArea (params = {}, id) {
  return request({
    url: `/historyreport/get/new/sd/${id}`,
    method: 'GET',
    params
  })
}

// 历史按钮接口
export function listHistory (params, rid, id) {
  return request({
    url: `/bulletin/country/history/report/cerid/${rid}/did/${id}`,
    method: 'GET',
    params
  })
}

// 历史中 灾情指标接口（包含报灾按钮）
export function disasterIndex (params, id) {
  return request({
    url: `/historyreport/get/new/${id}/1`,
    method: 'GET',
    params
  })
}

// 因灾死亡 台账
export function theDeathItnum (params) {
  return request({
    url: '/indextype/itnum/3',
    method: 'GET',
    params
  })
}

export function theDeathPid (params) {
  return request({
    url: '/indexitem/pid/null/itnum/3',
    method: 'GET',
    params
  })
}

export function theDeathRid (id, params) {
  return request({
    url: `/bulletin/province/historytabdata/rid/${id}/itnum/3`,
    method: 'GET',
    params
  })
}

// 失踪死亡 台账
export function theMissingItnum (params) {
  return request({
    url: '/indextype/itnum/4',
    method: 'GET',
    params
  })
}

export function theMissingPid (params) {
  return request({
    url: '/indexitem/pid/null/itnum/4',
    method: 'GET',
    params
  })
}

export function theMissingRid (id, params) {
  return request({
    url: `/bulletin/province/historytabdata/rid/${id}/itnum/4`,
    method: 'GET',
    params
  })
}

// 标准按钮
export function theNormIndex (params, id) {
  return request({
    url: `/historyreport/get/new/sd/${id}`,
    method: 'GET',
    params
  })
}

// 灾情指标下时间灾种区域查看接口
export function disasterTimeLookOver (id, pid, params) {
  return request({
    url: `/historyreport/disaster/areas/${pid}/${id}/A004`,
    method: 'GET',
    params
  })
}
