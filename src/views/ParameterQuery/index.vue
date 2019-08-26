<template>
  <div class="ParameterQuery"
    v-loading="overAllLoading"
    :element-loading-text="overAllTitle">
    <!-- 查询条件部分 -->
    <div class="stageBox">
      <el-form :inline="true" :model="ledgerFormInline" label-position="right" size="small" class="demo-form-inline">
        <!-- 第一行选择条件 -->
        <div class="firstSearch">
          <el-form-item label="灾种选择：">
            <el-input v-model="ledgerFormInline.disasterKindIds" placeholder="" autocomplete="off" @focus="handleFocusMinedOutArea"></el-input>
          </el-form-item>
          <el-form-item label="受灾区域：">
            <el-input v-model="ledgerFormInline.subRelationIds" placeholder="" autocomplete="off" @focus="handleFocusAffectedArea"></el-input>
          </el-form-item>
        </div>
        <!-- 第二行选择条件 -->
        <div class="secondSearch">
          <el-form-item label="案例选择：">
            <el-input v-model="ledgerFormInline.disasterIds" placeholder="" autocomplete="off" @focus="handleLedgerFocus"></el-input>
          </el-form-item>
          <el-form-item  label="发生时间：">
            <el-date-picker
              v-model="ledgerFormInline.disasterStartTime.queryStartTime"
              type="datetime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker> -
            <el-date-picker
              v-model="ledgerFormInline.disasterStartTime.queryEndTime"
              type="datetime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" style="float: right; padding: 9px 60px;" size="small" icon="el-icon-search" @click="handleCasesSearch">查询</el-button>
        </div>
      </el-form>
    </div>
    <!-- 导出部分 -->
    <div class="exportBox">
      <p class="title">
        <span class="log"></span>
        台账信息列表（{{ ledgerTotal }}条）
      </p>
      <el-button size="small" style="float: right; padding: 9px 30px; background: rgba(244,244,244,1);" @click="handleLedgerExport">导出</el-button>
    </div>
    <!-- list -->
    <div class="list" style="margin-top: 20px;">
      <el-table
        :data="ledgerTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        v-loading="loading"
        :key="200"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
        stripe
        border
        style="width: 100%">
        <el-table-column type="index" width="50" label="序号">
          <template slot-scope="scope">{{ scope.$index+(currentPage - 1) * pageSize + 1 }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="age" label="年龄" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nation" label="民族" show-overflow-tooltip></el-table-column>
        <el-table-column prop="domicilePlace" label="户口所在地" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IDCardNo" label="身份证号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="death" label="死亡/失踪" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deathPlace" label="死亡/失踪地点" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deathTime" label="死亡/失踪时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deathCause" label="死亡/失踪原因" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disaster" label="受灾种类" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div style="text-align: center; margin-top: 40px;">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        :total="ledgerTotal">
      </el-pagination>
    </div>
    <!-- 灾种选择选择窗口 -->
    <minedOutAreaDialog :toMinedOutArea="minedOutAreaObj" @toFather="getMinedOutArea" />
    <!-- 受灾区域选择窗口 -->
    <affectedAreaDialog :toAffectedArea="affectedAreaObj" @toFather="getAffectedArea" />
    <!-- 案例选择选择窗口 -->
    <caseSelectionDialog :toCaseSelection="caseSelectionObj" @toFather="getCaseSelection" />
  </div>
</template>

<script>
import { selectCases, parameterList, parameterImportant } from '@/api/ParameterQuery/parameterQuery'
// 灾种选择窗口组件
import minedOutAreaDialog from '@/components/DisasterLetters/minedOutAreaDialog'
// 受灾区域选择窗口组件
import affectedAreaDialog from '@/components/DisasterLetters/affectedAreaDialog'
// 案例选择窗口组件
import caseSelectionDialog from '@/components/ParameterQuery/caseSelectionDialog'
export default {
  name: 'ParameterQuery',
  components: {
    minedOutAreaDialog,
    affectedAreaDialog,
    caseSelectionDialog
  },
  data () {
    return {
      // 台账统计查询条件
      ledgerFormInline: {
        disasterKindIds: '', // 灾种选择
        subRelationIds: '', // 受灾区域
        disasterStartTime: { // 发生时间
          queryStartTime: null,
          queryEndTime: null
        },
        disasterIds: '', // 案例选择
        disasterStateNumber: 0, // 默认
        disasterValidity: 0, // 默认
        paged: {
          firstResult: 1,
          maxResults: 12
        } // 分页
      },
      // 灾种选择受灾区域选择窗口数据
      minedOutAreaObj: {
        minedOutAreaDialogVisible: false
      },
      // 受灾区域选择窗口数据
      affectedAreaObj: {
        affectedAreaDialogVisible: false
      },
      // 案例选择窗口数据
      caseSelectionObj: {
        caseSelectionDialogVisible: false,
        // 树形图数据
        data: [
          {
            id: 1,
            label: '全部',
            children: [
              {
                id: 2,
                label: '一月',
                children: [{
                  id: 14,
                  label: '四川2019-12-04（洪涝）'
                }]
              }, {
                id: 3,
                label: '二月',
                children: [{
                  id: 15,
                  label: '内蒙古2019-02-04（森林草原火灾）'
                }]
              }, {
                id: 4,
                label: '三月',
                children: [{
                  id: 16,
                  label: '浙江2019-03-04（洪涝）'
                }]
              }, {
                id: 5,
                label: '四月',
                children: [{
                  id: 17,
                  label: '浙江2019-04-04（洪涝）'
                }]
              }, {
                id: 6,
                label: '五月',
                children: [{
                  id: 18,
                  label: '浙江2019-05-04（洪涝）'
                }]
              }, {
                id: 7,
                label: '六月',
                children: [{
                  id: 19,
                  label: '浙江2019-06-04（洪涝）'
                }]
              }, {
                id: 8,
                label: '七月',
                children: [{
                  id: 20,
                  label: '浙江2019-07-04（洪涝）'
                }]
              }, {
                id: 9,
                label: '八月',
                children: [{
                  id: 21,
                  label: '浙江2019-08-04（洪涝）'
                }]
              }, {
                id: 10,
                label: '九月',
                children: [{
                  id: 22,
                  label: '浙江2019-09-04（洪涝）'
                }]
              }, {
                id: 11,
                label: '十月',
                children: [{
                  id: 23,
                  label: '浙江2019-10-04（洪涝）'
                }]
              }, {
                id: 12,
                label: '十一月',
                children: [{
                  id: 24,
                  label: '浙江2019-11-04（洪涝）'
                }]
              }, {
                id: 13,
                label: '十二月',
                children: [{
                  id: 26,
                  label: '浙江2019-12-04（洪涝）'
                }]
              }
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      },
      // list table 数据
      ledgerTableData: [],
      // 总页数
      ledgerTotal: 0,
      // 灾种组件传来的
      MinedOutAreaArr: [],
      // 区域组件传来的
      affectedAreaArr: [],
      // 全局loading
      overAllLoading: false,
      // 标题
      overAllTitle: '',
      // table list loading
      loading: false,
      // 案例选择
      CaseSelectionArr: [],
      // 列表一页显示多少条
      pageSize: 12,
      // 当前页
      currentPage: 1
    }
  },
  computed: {
    caseSelection () {
      return this.caseSelectionObj.caseSelectionDialogVisible
    }
  },
  watch: {
    // caseSelection()
  },
  methods: {
    // 灾种选择 focus
    handleFocusMinedOutArea (e) {
      this.minedOutAreaObj.minedOutAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 受灾区域 focus
    handleFocusAffectedArea (e) {
      this.affectedAreaObj.affectedAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 案例选择focus
    handleLedgerFocus (e) {
      this.overAllLoading = true
      this.overAllTitle = '案例加载中...'
      let params = {}
      // 选择灾种
      if (this.ledgerFormInline.disasterKindIds === '') {
        params.dskinds = []
      } else {
        params.dskinds = this.MinedOutAreaArr
      }
      // 区域选择的
      if (this.ledgerFormInline.subRelationIds === '') {
        params.regions = []
        // JSON.parse(sessionStorage.getItem('areaList')).map(i => {
        //   params.regions.push(i.civilRegionalism.civilRegionalismCode)
        // })
      } else {
        params.regions = this.affectedAreaArr
        // JSON.parse(sessionStorage.getItem('areaList')).map(i => {
        //   this.affectedAreaArr.map(a => {
        //     if (a === i.creditionRelationId) {
        //       params.regions.push(i.civilRegionalism.civilRegionalismCode)
        //     }
        //   })
        // })
      }
      // 发生时间
      // if (this.ledgerFormInline.disasterStartTime.queryStartTime === null && this.ledgerFormInline.disasterStartTime.queryEndTime === null) {
      //   params.disasterStartTime = {}
      // } else {
      // ${val.split(' ')[0].split('-').join('')}${val.split(' ')[1].split(':').join('')}
      if (this.ledgerFormInline.disasterStartTime.queryStartTime === null) {
      } else {
        params.stime = `${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[1].split(':').join('')}`
      }
      if (this.ledgerFormInline.disasterStartTime.queryEndTime === null) {
      } else {
        params.etime = `${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[1].split(':').join('')}`
      }
      selectCases(params).then(res => {
        // 整理月
        let January = []
        let February = []
        let march = []
        let April = []
        let may = []
        let June = []
        let July = []
        let August = []
        let September = []
        let October = []
        let November = []
        let December = []
        if (res.resultData) {
          res.resultData.map(item => {
            if (item.disasterStatMonth.split('-')[1] === '01') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              January.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '02') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              February.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '03') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              march.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '04') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              April.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '05') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              may.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '06') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              June.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '07') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              July.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '08') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              August.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '09') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              September.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '10') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              October.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '11') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              November.push(obj)
            } else if (item.disasterStatMonth.split('-')[1] === '12') {
              let obj = {}
              let label = `${item.civilRegionalismName} ${item.disasterStartTime} (${item.disasterName})`
              obj.id = item.disasterId
              obj.label = label
              December.push(obj)
            }
          })
        }
        // 添加到属性组件中
        this.caseSelectionObj.data[0].children.map(item => {
          if (item.label === '一月') {
            item.children = January
          } else if (item.label === '二月') {
            item.children = February
          } else if (item.label === '三月') {
            item.children = march
          } else if (item.label === '四月') {
            item.children = April
          } else if (item.label === '五月') {
            item.children = may
          } else if (item.label === '六月') {
            item.children = June
          } else if (item.label === '七月') {
            item.children = July
          } else if (item.label === '八月') {
            item.children = August
          } else if (item.label === '九月') {
            item.children = September
          } else if (item.label === '十月') {
            item.children = October
          } else if (item.label === '十一月') {
            item.children = November
          } else if (item.label === '十二月') {
            item.children = December
          }
        })
        this.caseSelectionObj.caseSelectionDialogVisible = true
        this.overAllLoading = false
        // console.log('案例数据', res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 灾种组件传来的数据
    getMinedOutArea (data) {
      let toFatherInputValue = []
      this.MinedOutAreaArr = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.disasterKindId) {
            toFatherInputValue.push(i.disasterKindName)
          }
        })
      })
      this.ledgerFormInline.disasterKindIds = toFatherInputValue.join(',')
      // this.ledgerFormInline.disasterKindIds = data.join(',')
      this.MinedOutAreaArr = data.inputArr
      // console.log(data, this.ledgerFormInline.disasterKindIds)
    },
    // 受灾区域传来的数据
    getAffectedArea (data) {
      let toFatherInputValue = []
      this.affectedAreaArr = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.creditionRelationId) {
            toFatherInputValue.push(i.civilRegionalism.civilRegionalismName)
          }
        })
      })
      this.ledgerFormInline.subRelationIds = toFatherInputValue.join(',')
      // this.affectedAreaObj
      this.affectedAreaArr = data.inputArr
      // console.log('受灾区域传来的数据', data, this.ledgerFormInline.subRelationIds)
    },
    // 案例组件传来的数据
    getCaseSelection (data) {
      // this.ledgerFormInline.disasterIds
      let casesArr = []
      this.CaseSelectionArr = []
      data.map(item => {
        casesArr.push(item.label)
      })
      this.ledgerFormInline.disasterIds = casesArr.join(',')
      if (data.length > 0) {
        data.map(i => {
          this.CaseSelectionArr.push(i.id)
        })
      }
      // console.log(data)
    },
    // 查询按钮
    handleCasesSearch () {
      this.getParameterList()
      // console.log('查询')
    },
    // 导出按钮
    handleLedgerExport () {
      this.ledgerExport()
      // console.log('导出')
    },
    // 导出接口
    ledgerExport () {
      this.overAllLoading = true
      this.overAllTitle = '列表导出中...'
      let params = {}
      // 灾种选择
      if (this.ledgerFormInline.disasterKindIds === '') {
        params.dskinds = []
      } else {
        params.dskinds = this.MinedOutAreaArr
      }
      // 区域选择的
      if (this.ledgerFormInline.subRelationIds === '') {
        params.regions = []
      } else {
        // params.regions = []
        params.regions = this.affectedAreaArr
      }
      // 发生时间
      if (this.ledgerFormInline.disasterStartTime.queryStartTime === null) {
      } else {
        params.stime = `${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[1].split(':').join('')}`
      }
      if (this.ledgerFormInline.disasterStartTime.queryEndTime === null) {
      } else {
        params.etime = `${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[1].split(':').join('')}`
      }
      // 案例选择
      if (this.ledgerFormInline.disasterIds === '') {
        params.dsids = []
      } else {
        params.dsids = this.CaseSelectionArr
      }
      parameterImportant(params).then(res => {
        this.overAllLoading = false
        if (res.resultData) {
          window.open(res.resultData, '__blank')
        } else {
          this.$message.error(res.errorMsg)
        }
        // console.log('导出', res)
      }).catch(err => {
        this.overAllLoading = false
        console.log(err)
      })
    },
    // downloadFile ()
    // 当前页
    handleCurrentChange (val) {
      this.currentPage = val
      // console.log(`当前页: ${val}`)
    },
    // 案例查询接口
    getParameterList () {
      let params = {}
      // 默认传参
      // params.disaster.disasterStateNumber = 0
      // params.disaster.disasterValidity = 0
      // params.indexTypeNumber = 3
      // 灾种选择
      if (this.ledgerFormInline.disasterKindIds === '') {
        params.dskinds = []
      } else {
        params.dskinds = this.MinedOutAreaArr
      }
      // 区域选择的
      if (this.ledgerFormInline.subRelationIds === '') {
        params.regions = []
      } else {
        // params.regions = []
        params.regions = this.affectedAreaArr
        // JSON.parse(sessionStorage.getItem('areaList')).map(i => {
        //   this.affectedAreaArr.map(a => {
        //     if (a === i.creditionRelationId) {
        //       params.regions.push(i.civilRegionalism.civilRegionalismCode)
        //     }
        //   })
        // })
      }
      // 发生时间
      if (this.ledgerFormInline.disasterStartTime.queryStartTime === null) {
      } else {
        params.stime = `${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryStartTime.split(' ')[1].split(':').join('')}`
      }
      if (this.ledgerFormInline.disasterStartTime.queryEndTime === null) {
      } else {
        params.etime = `${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[0].split('-').join('')}${this.ledgerFormInline.disasterStartTime.queryEndTime.split(' ')[1].split(':').join('')}`
      }
      // 分页传参
      // params.disaster.paged = {}
      // params.disaster.paged.firstResult = (this.ledgerFormInline.paged.firstResult - 1) * this.ledgerFormInline.paged.maxResults
      // params.disaster.paged.maxResults = this.ledgerFormInline.paged.maxResults
      // 案例选择
      if (this.ledgerFormInline.disasterIds === '') {
        params.dsids = []
      } else {
        params.dsids = this.CaseSelectionArr
      }
      this.loading = true
      parameterList(params).then(res => {
        let arr = []
        if (res.resultData) {
          res.resultData.map(item => {
            let obj = {}
            item.property.map(a => {
              // 受灾种类
              if (a.key === '402880b1388e751a01388e751ae60a10') {
                obj.disaster = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b10') {
                obj.disaster = a.value
              }
              // 姓名
              if (a.key === '402880b1388e751a01388e751ae60a02') {
                obj.name = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b02') {
                obj.name = a.value
              }
              // 年龄
              if (a.key === '402880b1388e751a01388e751ae60a04') {
                obj.age = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b04') {
                obj.age = a.value
              }
              // 民族
              if (a.key === '402880b1388e751a01388e751ae60a05') {
                obj.nation = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b05') {
                obj.nation = a.value
              }
              // 户口所在地
              if (a.key === '402880b1388e751a01388e751ae60a06') {
                obj.domicilePlace = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b06') {
                obj.domicilePlace = a.value
              }
              // 身份证号码
              if (a.key === '402880b1388e751a01388e751ae60aa6') {
                obj.IDCardNo = a.value
              } else if (a.key === '402880b1388e751a01388e751ae60b16') {
                obj.IDCardNo = a.value
              }
              // 死亡/失踪 地点
              if (a.key === '402880b1388e751a01388e751ae60a07') {
                obj.deathPlace = a.value
                obj.death = '死亡'
              } else if (a.key === '402880b1388e751a01388e751ae60b07') {
                obj.deathPlace = a.value
                obj.death = '失踪'
              }
              // 死亡/失踪 时间 402880b1388e751a01388e751ae60a08
              if (a.key === '402880b1388e751a01388e751ae60a08' || a.key === '402880b1388e751a01388e751ae60b08') {
                obj.deathTime = a.value
              }
              // 死亡/失踪 原因
              if (a.key === '402880b1388e751a01388e751ae60a09' || a.key === '402880b1388e751a01388e751ae60b09') {
                obj.deathCause = a.value
              }
            })
            // 对象放到数组中
            arr.push(obj)
          })
        }
        // 列表数据
        this.ledgerTableData = arr
        // 台账总条数
        this.ledgerTotal = arr.length
        this.loading = false
        // console.log('列表数据', res, arr)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getParameterList()
  }
}
</script>

<style scoped>
.stageBox {
  background: #ECEAEA;
  padding: 28px 32px 10px;
  text-align: left;
}
.stageBox .secondSearch /deep/ .el-form-item--small:nth-child(2) .el-date-editor.el-input {
  width: 227px;
}
.stageBox .secondSearch /deep/ .el-form-item--small {
  margin-right: 40px;
}
/* .stageBox .secondSearch /deep/ .el-form-item--small:nth-child(2) {
  margin-right: 78px;
} */
.stageBox .secondSearch /deep/ .el-form-item--small .el-form-item__content {
  width: 466px;
}
.stageBox .firstSearch,.secondSearch {
  white-space: nowrap;
}
.stageBox .firstSearch /deep/ .el-form-item--small .el-form-item__content {
  width: 466px;
}
.stageBox .firstSearch /deep/ .el-form-item--small {
  margin-right: 40px;
}
.exportBox {
  overflow: hidden;
  padding: 20px 32px 0;
}
.exportBox .title {
  float: left;font-size: 16px;
  font-weight: 600;
  padding-left: 12px;
  position: relative
}
.exportBox .title .log {
  width: 4px;
  background: rgb(41, 55, 143);
  display: inline-block;
  height: 14px;
  position: absolute;
  left: 0;
  top: 4px;
}
.list {
  padding: 0px 32px;
}
.list /deep/ .el-table__body-wrapper.is-scrolling-none {
  height: 432px;
  overflow: auto;
}
</style>
