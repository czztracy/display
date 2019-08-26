<template>
  <!-- 列表报灾弹窗 -->
  <div class="disasterDialog">
    <el-dialog v-dialogDrag :close-on-press-escape="false" :title="standardDisaster" width="1600px" top="31px" center :visible.sync="toDisasterObj.outerVisible">
      <div class="outBox" style="height: 772px; overflow: auto;">
        <!-- nav -->
        <div class="navBox">
          <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal">
            <template v-for="(item, itemIndex) in $router.options.routes[0].children[0].children">
              <el-menu-item :index="item.path" :key="itemIndex">
                  <span>{{item.meta.title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
          <div class="exportBtn">
            <el-button size="mini" @click="handleExport">导出</el-button>
            <el-button size="mini" @click="handleContrast" v-if="disasterStandard === '标准'">对比</el-button>
          </div>
        </div>
        <!-- 标准中对比 -->
        <el-dialog
          width="800px"
          :title="standardDisaster"
          v-dialogDrag
          class="ContrastDialog"
          :visible.sync="innerVisible"
          :close-on-press-escape="false"
          expand-change="handleTreeLoading"
          append-to-body>
          <el-table
            :data="gridData"
            v-loading="loading"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
            height="325px"
            :key="1111111111"
            row-key="id"
            stripe
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            border>
            <el-table-column
                label="行政区划"
                width="180"
                show-overflow-tooltip>
                <template slot-scope="scope">
                <!-- :class="scope.row.foldBool ? 'fa fa-folder-open' : 'fa fa-folder'" -->
                  <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0"  style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
              </template>
            </el-table-column>
            <el-table-column label="受灾人口">
              <el-table-column
                prop="hitPeople"
                label="人"
                show-overflow-tooltip>
              </el-table-column>
            </el-table-column>
            <el-table-column label="直接经济损失">
              <el-table-column
                prop="directEconomicLoss"
                label="万元"
                show-overflow-tooltip>
                <template slot-scope="scope"> {{ scope.row.directEconomicLoss | number }} </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="倒塌房屋间数">
              <el-table-column
                prop="housesCollapsed"
                label="间"
                show-overflow-tooltip>
              </el-table-column>
            </el-table-column>
            <el-table-column label="农作物受灾面积">
              <el-table-column
                prop="cropDamage"
                label="公顷"
                show-overflow-tooltip>
                <template slot-scope="scope"> {{ scope.row.cropDamage | number }} </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-dialog>
        <router-view />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { theNormIndex } from '@/api/DisasterLetters/disasterReport'
import { mapGetters } from 'vuex'
export default {
  props: {
    toDisasterObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 内层弹窗
      innerVisible: false,
      // table数据
      gridData: [],
      // table loading
      loading: false,
      // 承接数组 市级
      citiesArr: []
    }
  },
  computed: {
    visible () {
      return this.toDisasterObj.outerVisible
    },
    ...mapGetters(['disasterStandard', 'disasterId', 'standardDisaster'])
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$router.push({ path: '/disasterLetters' })
      }
    }
  },
  filters: {
    number (val) {
      return parseFloat(val).toFixed(2)
    }
  },
  methods: {
    // table tree loading
    handleTreeLoading (row, expandedRows) {
      console.log(row, expandedRows)
    },
    // 导出按钮
    handleExport () {
      console.log('导出')
    },
    // 对比按钮
    handleContrast () {
      this.innerVisible = true
      this.getMainIndexListNorm()
      console.log('对比', 'id', this.disasterId, this.disasterStandard)
    },
    // 获取主要指标第一节节点数据 (标准)
    getMainIndexListNorm () {
      this.gridData = []
      this.loading = true
      let params = ''
      let id = this.disasterId
      // disasterStandard
      theNormIndex(params, id).then(res => {
        let arr = []
        this.loading = false
        // 对接自动补全表头数据
        var headerObj = {
          hitPeople: '受灾人口',
          cropDamage: '农作物受灾面积',
          housesCollapsed: '倒塌房屋间数',
          directEconomicLoss: '直接经济损失'
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
        // 添加id
        obj1.id = this.GenNonDuplicateID()
        if (res.resultSet.reports) {
          obj1.children = []
          for (let a = 0; a < res.resultSet.reports.length; a++) {
            var obj2 = {
              hitPeople: '受灾人口',
              cropDamage: '农作物受灾面积',
              housesCollapsed: '倒塌房屋间数',
              directEconomicLoss: '直接经济损失'
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
            // 添加id
            obj2.id = this.GenNonDuplicateID()
            obj1.children.push(obj2)
            if (res.resultSet.reports[a].reports) {
              obj2.children = []
              res.resultSet.reports[a].reports.map(item => {
                var obj3 = {
                  hitPeople: '受灾人口',
                  cropDamage: '农作物受灾面积',
                  housesCollapsed: '倒塌房屋间数',
                  directEconomicLoss: '直接经济损失'
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
                // 添加id
                obj3.id = this.GenNonDuplicateID()
                obj2.children.push(obj3)
              })
            }
            // console.log(res.resultSet.reports[a], obj2, obj1.children)
          }
        }
        arr.push(obj1)
        this.gridData = arr
        // 总长度
        this.total = this.gridData.length

        // 承接数据
        // this.citiesArr = res.resultSet.reports
        this.loading = false
        // 获取title
        // this.$store.dispatch('getStandardDisaster', '11111')
        console.log('标准数据', res, this.gridData, this.citiesArr)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 生成不同的ID
    GenNonDuplicateID () {
      let idStr = Date.now().toString(36)
      idStr += Math.random().toString(36).substr(3)
      return idStr
    }
  },
  mounted () {
    // console.log(this.toDisasterObj)
  }
}
</script>

<style scoped>
.disasterDialog /deep/ .el-dialog__header {
  background: #F4F4F4 !important;
  font-weight: 600;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
}
.disasterDialog /deep/ .el-dialog__header .el-dialog__title {
  color: #333333 !important;
}
.disasterDialog /deep/ .el-menu.el-menu--horizontal {
  border-color: #DDDDDD;
}
.disasterDialog /deep/ .el-menu--horizontal > .el-menu-item {
  height: 52px;
  line-height: 52px;
}
.disasterDialog /deep/ .el-menu--horizontal > .el-menu-item {
  /* color: #333333; */
  font-weight: 600;
}
.disasterDialog /deep/ .el-menu--horizontal > .el-menu-item.is-active {
  color: #29378F;
}
.disasterDialog /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #909399 !important;
}
/* .contrastDialog {

} */
.ContrastDialog /deep/ .el-dialog__header {
  background: #29378F !important;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
}

.ContrastDialog /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF !important;
  font-size: 16px;
}
.ContrastDialog /deep/ .el-dialog__headerbtn {
  top: 24px;
}
.ContrastDialog /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF !important;
}
.navBox {
  position: relative;
}
.navBox .exportBtn {
  position: absolute;
  right: 0;
  top: 12px;
  /* padding: 7px 30px; */
}
.navBox .exportBtn .el-button {
  padding: 7px 30px;
}
</style>
