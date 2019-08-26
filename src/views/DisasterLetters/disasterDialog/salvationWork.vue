<template>
  <div class="salvationWork">
    <!-- tab -->
    <div class="tab">
      <el-radio-group v-model="radioContent" @change="handleChangeValue">
        <el-radio-button :label="item.label" :key="itemIndex" v-for="(item, itemIndex) in radioList">
          <i style="margin-right: 10px;" :class="item.icon"></i>{{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <!-- treedata -->
    <!-- :expand-row-keys=[]默认展开 -->
    <div v-if="disasterStandard === '报灾'">
      <!-- 救助工作 -->
      <el-table
        :data="tableData"
        :key="1"
        v-if="radioContent === '救助工作'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        border
        stripe
        height="574"
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="本地区已支出自然灾害生活补助资金">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.hitPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="发放衣被数量">
          <el-table-column
            prop="deathPeople"
            label="套"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="搭建帐篷数量">
          <el-table-column
            prop="missPeople"
            label="顶"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其他生活类物资投入折款">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.transferPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级已支出自然灾害生活补助资金">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.woundPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级发放衣被数量">
          <el-table-column
            prop="bailoutPeople"
            label="套"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级搭建帐篷数量">
          <el-table-column
            prop="droughtPeople"
            label="顶"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级其他生活类物资投入折款">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.droughtDrinkWaterPeople | number }} </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 应急响应 -->
      <el-table
        :data="tableData"
        :key="2"
        v-if="radioContent === '应急响应'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        border
        stripe
        height="574"
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>>
          <template slot-scope="scope">
            <!-- "scope.row.foldBool ? 'fa fa-folder-open' : 'fa fa-folder'" -->
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="应急响应级别">
          <el-table-column
            prop="source"
            label="级"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- {{ scope.$index }} -->
              <el-checkbox-group v-model="responseLevelList[scope.$index]" @change="handleCheck" style="display: inline-block; margin-right: 30px;">
                <el-checkbox v-for="(item, itemIndex) in checkBoxList" :label="item.label" :key="itemIndex">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
              <el-button size="mini" @click="handleCancelChoice(scope.$index, scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="应急响应时间">
          <el-table-column
            prop="cropDamage"
            label="年-月-日 时:分:秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="disasterStandard === '标准'">
      <!-- 救助工作 -->
      <el-table
        :data="tableData"
        :key="11111111111111"
        v-if="radioContent === '救助工作'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="本地区已支出自然灾害生活补助资金">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.hitPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="发放衣被数量">
          <el-table-column
            prop="deathPeople"
            label="套"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="搭建帐篷数量">
          <el-table-column
            prop="missPeople"
            label="顶"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其他生活类物资投入折款">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.transferPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级已支出自然灾害生活补助资金">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.woundPeople | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级发放衣被数量">
          <el-table-column
            prop="bailoutPeople"
            label="套"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级搭建帐篷数量">
          <el-table-column
            prop="droughtPeople"
            label="顶"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下级其他生活类物资投入折款">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.droughtDrinkWaterPeople | number }} </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 应急响应 -->
      <el-table
        :data="tableData"
        :key="2222222222222"
        v-if="radioContent === '应急响应'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>>
          <template slot-scope="scope">
            <!-- "scope.row.foldBool ? 'fa fa-folder-open' : 'fa fa-folder'" -->
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0"  style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="应急响应级别">
          <el-table-column
            prop="source"
            label="级"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- {{ scope.$index }} -->
              <el-checkbox-group v-model="responseLevelList[scope.$index]" @change="handleCheck" style="display: inline-block; margin-right: 30px;">
                <el-checkbox v-for="(item, itemIndex) in checkBoxList" :label="item.label" :key="itemIndex">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
              <el-button size="mini" @click="handleCancelChoice(scope.$index, scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="应急响应时间">
          <el-table-column
            prop="cropDamage"
            label="年-月-日 时:分:秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="text-align: center; margin-top: 20px;">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :page-size="12"
        @current-change="handleCurrentChange"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { disasterIndex, theNormIndex } from '@/api/DisasterLetters/disasterReport'
import { mapGetters } from 'vuex'
export default {
  name: 'salvationWork',
  data () {
    return {
      // radio 切换
      radioContent: '救助工作',
      // 分页页数
      total: 1,
      // 应急响应级别
      responseLevelList: [],
      // radiolist
      radioList: [
        {
          value: '救助工作',
          label: '救助工作',
          icon: 'fa fa-plus-circle'
        }, {
          value: '应急响应',
          label: '应急响应',
          icon: 'fa fa-bullseye'
        }
      ],
      // 列表报灾弹窗中 总列表数据
      tableData: [],
      // 承接数组 市级
      citiesArr: [],
      // table中的复选按钮
      checkBoxList: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }],
      // table loading
      loading: false,
      // 记录checkbox渲染问题
      numIndex: 0
    }
  },
  computed: {
    ...mapGetters(['disasterId', 'disasterStandard'])
  },
  filters: {
    number (val) {
      return parseFloat(val).toFixed(2)
    }
  },
  methods: {
    // change tab
    handleChangeValue (val) {
      this.radioContent = val
      // console.log(val)
    },
    // table expand
    handleTreeExpand (row, expanded) {
      // 控制文件夹关闭打开
      row.foldBool = expanded
      // console.log('111111111111111111111111', row, expanded)
    },
    // table load
    handleLoadMainIndex (tree, treeNode, resolve) {
      let params = {}
      let id = tree.reportId
      let arrTableList = []
      disasterIndex(params, id).then(res => {
        if (res.resultSet.reports && res.resultSet.reports.length > 0) {
          let pid = res.resultSet.reportId
          res.resultSet.reports.map(i => {
            const id = i.reportId
            disasterIndex(params, id).then(res => {
              res.resultSet.id = this.GenNonDuplicateID()
              if (res.resultSet.reports && res.resultSet.reports.length > 0) {
                res.resultSet.hasChildren = true
                res.resultSet.children = []
              } else {
                res.resultSet.hasChildren = false
              }
              // 对接自动补全表头数据
              var headerObj = {
                source: '来源',
                hitPeople: '本地区已支出自然灾害生活补助资金',
                deathPeople: '发放衣被数量',
                missPeople: '搭建帐篷数量',
                transferPeople: '其他生活类物资投入折款',
                woundPeople: '下级已支出自然灾害生活补助资金',
                bailoutPeople: '下级发放衣被数量',
                droughtPeople: '下级搭建帐篷数量',
                droughtDrinkWaterPeople: '下级其他生活类物资投入折款',
                cropDamage: '应急响应时间'
              }
              // 拿出所需数据
              res.resultSet.reportItemValues.map(item => {
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
              headerObj.area = res.resultSet.creditionRelation.civilRegionalism.civilRegionalismName
              // reportId
              headerObj.reportId = res.resultSet.reportId
              // 父级id
              headerObj.pid = pid
              // 应急响应时间
              headerObj.cropDamage = ''
              // 添加id
              headerObj.id = this.GenNonDuplicateID()
              // 是否存在子级
              if (res.resultSet.reports && res.resultSet.reports.length > 0) {
                headerObj.hasChildren = true
                headerObj.children = []
              } else {
                headerObj.hasChildren = false
              }
              // console.log('标准按钮数据', res.resultSet, 'headerObj', headerObj, res.resultSet.reports)
              arrTableList.push(headerObj)
              resolve(arrTableList)
              // 处理checkbox渲染问题
              if (this.radioContent === '应急响应') {
                this.numIndex++
                this.$set(this.responseLevelList, this.numIndex, [])
              }
              // console.log(this.numIndex)
            }).catch(err => {
              console.log(err)
            })
          })
        }
      }).catch(err => {
        console.log(err)
      })

      // console.log(tree, treeNode)
    },
    // 行中复选按钮change事件
    handleCheck (value) {
      // console.log(value)
    },
    // 取消这一行中的复选按钮
    handleCancelChoice (index, row) {
      this.$set(this.responseLevelList, index, [])
      // console.log(index, row)
    },
    // 当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    },
    // 生成不同的ID
    GenNonDuplicateID () {
      let idStr = Date.now().toString(36)
      idStr += Math.random().toString(36).substr(3)
      return idStr
    },
    // 获取主要指标第一节节点数据 (报灾)
    getMainIndexList () {
      let arrTableList = []
      this.loading = true
      let params = ''
      let id = this.disasterId
      disasterIndex(params, id).then(res => {
        res.resultSet.id = this.GenNonDuplicateID()
        if (!res.resultSet.reports) {
          res.resultSet.hasChildren = true
          res.resultSet.children = []
        } else {
          res.resultSet.hasChildren = false
        }
        // 对接自动补全表头数据
        var headerObj = {
          source: '来源',
          hitPeople: '本地区已支出自然灾害生活补助资金',
          deathPeople: '发放衣被数量',
          missPeople: '搭建帐篷数量',
          transferPeople: '其他生活类物资投入折款',
          woundPeople: '下级已支出自然灾害生活补助资金',
          bailoutPeople: '下级发放衣被数量',
          droughtPeople: '下级搭建帐篷数量',
          droughtDrinkWaterPeople: '下级其他生活类物资投入折款',
          cropDamage: '应急响应时间'
        }
        // 拿出所需数据
        res.resultSet.reportItemValues.map(item => {
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
        headerObj.area = res.resultSet.creditionRelation.civilRegionalism.civilRegionalismName
        // reportId
        headerObj.reportId = res.resultSet.reportId
        // pid （若没有父级 存本级id）
        headerObj.pid = res.resultSet.reportId
        // 应急响应时间
        headerObj.cropDamage = ''
        // 添加id
        headerObj.id = this.GenNonDuplicateID()
        // 是否存在子级
        if (res.resultSet.reports && res.resultSet.reports.length !== 0) {
          headerObj.hasChildren = true
          headerObj.children = []
        } else {
          headerObj.hasChildren = false
        }
        // console.log(res.resultSet, 'headerObj', headerObj, res.resultSet.reports)
        arrTableList.push(headerObj)
        // 承接数组
        this.tableData = arrTableList
        // 给数组设置监听的内容(处理复选框不渲染问题)
        this.responseLevelList = []
        this.numIndex = 0
        this.tableData.map((item, itemIndex) => {
          this.$set(this.responseLevelList, itemIndex, [])
        })
        if (this.responseLevelList.length > 0) {
          this.numInde = this.responseLevelList.length - 1
        }
        // 总长度
        this.total = this.tableData.length
        // 市级处理（点击省  使用市级id请求市
        if (res.resultSet.reports) {
          res.resultSet.reports.map(i => {
            i.id = this.GenNonDuplicateID()
          })
        }
        // 承接数据
        this.citiesArr = res.resultSet.reports
        this.loading = false
        // 获取title
        // this.$store.dispatch('getStandardDisaster', '11111')
        // console.log('报灾数据', res, this.tableData, this.citiesArr)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 获取主要指标第一节节点数据 (标准)
    getMainIndexListNorm () {
      this.tableData = []
      this.loading = true
      let params = ''
      let id = this.disasterId
      // disasterStandard
      theNormIndex(params, id).then(res => {
        let arr = []
        this.loading = false
        // 对接自动补全表头数据
        var headerObj = {
          source: '来源',
          hitPeople: '本地区已支出自然灾害生活补助资金',
          deathPeople: '发放衣被数量',
          missPeople: '搭建帐篷数量',
          transferPeople: '其他生活类物资投入折款',
          woundPeople: '下级已支出自然灾害生活补助资金',
          bailoutPeople: '下级发放衣被数量',
          droughtPeople: '下级搭建帐篷数量',
          droughtDrinkWaterPeople: '下级其他生活类物资投入折款',
          cropDamage: '应急响应时间'
        }
        // 承接以下数据
        var obj1 = headerObj
        // 拿出所需数据
        res.resultSet.reportItemValues.map(item => {
          for (let i in obj1) {
            if (obj1[i] === item.indexItem.indexItemName) {
              obj1[i] = item.reportItemValue
            }
          }
        })
        // 对象中带有中文的变为 0
        for (let i in obj1) {
          if (escape(obj1[i]).indexOf('%u') < 0) {
          } else {
            obj1[i] = '0'
          }
        }
        // 区域单独添加
        obj1.area = res.resultSet.creditionRelation.civilRegionalism.civilRegionalismName
        // 应急响应时间
        obj1.cropDamage = ''
        // reportId(本级id)
        obj1.reportId = res.resultSet.reportId
        // pid （若没有父级 存本级id）
        obj1.pid = res.resultSet.reportId
        // 添加id
        obj1.id = this.GenNonDuplicateID()
        if (res.resultSet.reports) {
          obj1.children = []
          for (let a = 0; a < res.resultSet.reports.length; a++) {
            var obj2 = {
              source: '来源',
              hitPeople: '本地区已支出自然灾害生活补助资金',
              deathPeople: '发放衣被数量',
              missPeople: '搭建帐篷数量',
              transferPeople: '其他生活类物资投入折款',
              woundPeople: '下级已支出自然灾害生活补助资金',
              bailoutPeople: '下级发放衣被数量',
              droughtPeople: '下级搭建帐篷数量',
              droughtDrinkWaterPeople: '下级其他生活类物资投入折款',
              cropDamage: '应急响应时间'
            }
            res.resultSet.reports[a].reportItemValues.map(item => {
              for (let i in obj2) {
                if (obj2[i] === item.indexItem.indexItemName) {
                  obj2[i] = item.reportItemValue
                }
              }
            })
            // 对象中带有中文的变为 0
            for (let i in obj2) {
              if (escape(obj2[i]).indexOf('%u') < 0) {
              } else {
                obj2[i] = '0'
              }
            }
            // 区域单独添加
            obj2.area = res.resultSet.reports[a].creditionRelation.civilRegionalism.civilRegionalismName
            // 应急响应时间
            obj2.cropDamage = ''
            // reportId(本级id)(无)
            obj2.reportId = ''
            // pid （若没有父级 存本级id）
            obj2.pid = obj1.id
            // 添加id
            obj2.id = this.GenNonDuplicateID()
            obj1.children.push(obj2)
            if (res.resultSet.reports[a].reports) {
              obj2.children = []
              res.resultSet.reports[a].reports.map(item => {
                var obj3 = {
                  source: '来源',
                  hitPeople: '本地区已支出自然灾害生活补助资金',
                  deathPeople: '发放衣被数量',
                  missPeople: '搭建帐篷数量',
                  transferPeople: '其他生活类物资投入折款',
                  woundPeople: '下级已支出自然灾害生活补助资金',
                  bailoutPeople: '下级发放衣被数量',
                  droughtPeople: '下级搭建帐篷数量',
                  droughtDrinkWaterPeople: '下级其他生活类物资投入折款',
                  cropDamage: '应急响应时间'
                }
                item.reportItemValues.map(item => {
                  for (let i in obj3) {
                    if (obj3[i] === item.indexItem.indexItemName) {
                      obj3[i] = item.reportItemValue
                    }
                  }
                })
                // 对象中带有中文的变为 0
                for (let i in obj3) {
                  if (escape(obj3[i]).indexOf('%u') < 0) {
                  } else {
                    obj3[i] = '0'
                  }
                }
                // 区域单独添加
                obj3.area = item.creditionRelation.civilRegionalism.civilRegionalismName
                // 应急响应时间
                obj3.cropDamage = ''
                // reportId(本级id)(无)
                obj3.reportId = item.reportId
                // pid （若没有父级 存本级id）
                obj3.pid = ''
                // 添加id
                obj3.id = this.GenNonDuplicateID()
                obj2.children.push(obj3)
              })
            }
            // console.log(res.resultSet.reports[a], obj2, obj1.children)
          }
        }
        arr.push(obj1)
        this.tableData = arr
        // 给数组设置监听的内容(处理复选框不渲染问题)
        this.responseLevelList = []
        let checkBox = [0]
        this.tableData.map(item => {
          if (item.children) {
            item.children.map((a, aIndex) => {
              checkBox.push(aIndex)
              if (a.children) {
                a.children.map((i, iIndex) => { checkBox.push(iIndex) })
              }
            })
          }
        })
        checkBox.map((item, itemIndex) => {
          this.$set(this.responseLevelList, itemIndex, [])
        })
        // console.log('标准数据', res, this.tableData)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  },
  mounted () {
    if (this.disasterStandard === '标准') {
      // 标准list
      this.getMainIndexListNorm()
    } else if (this.disasterStandard === '报灾') {
      // 报灾list
      this.getMainIndexList()
    }
  }
}
</script>

<style scoped>
.salvationWork /deep/ .el-table--border {
  overflow: auto;
}
.tab {
  text-align: center;
  padding: 20px 0;
}
</style>
