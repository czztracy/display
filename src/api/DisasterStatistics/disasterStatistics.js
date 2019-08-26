// 灾情统计
import request from '@/utils/request'
// 阶段性灾情统计
export function disasterReceived (params) {
  return request({
    url: '/bulletin/country/stat/stage',
    method: 'POST',
    data: params
  })
}

// 受灾区域统计
export function areaStatistics (params) {
  return request({
    url: '/bulletin/country/stat/area',
    method: 'POST',
    data: params
  })
}

// 灾害事件个数及灾情统计接口
export function eventsNumber (params) {
  return request({
    url: '/bulletin/country/stat/count',
    method: 'POST',
    data: params
  })
}
