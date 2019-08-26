<template>
  <!-- 灾情快报 -->
  <div class="chuckBox" v-loading="overallLoading">
    <!-- 查询条件部分 -->
    <div class="search" style="min-width: 1440px;">
      <el-form :inline="true" :model="formInline" label-position="right" class="demo-form-inline" size="small">
        <!-- 查询条件第一行 -->
        <div class="row first">
          <el-form-item label="灾种选择：">
            <el-input v-model="formInline.disasterKindIds" placeholder="" autocomplete="off" @focus="handleFocusMinedOutArea"></el-input>
          </el-form-item>
          <el-form-item label="受灾区域：">
            <el-input v-model="formInline.subRelationIds" placeholder="" autocomplete="off" @focus="handleFocusAffectedArea"></el-input>
          </el-form-item>
          <el-form-item label="月份统计：">
            <el-date-picker
              v-model="formInline.disasterStatMonth"
              type="month"
              value-format="yyyy-MM"
              placeholder="">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- 查询条件第二行 -->
        <div class="row second">
          <el-form-item label="发生时间：">
            <el-select v-model="occurrenceTime" placeholder="" style="margin-right: 10px;" @change="handleOccurrenceTime">
              <el-option
                v-for="item in timeHorizon"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="formInline.disasterStartTime.queryStartTime"
              type="datetime"
              placeholder=""
              :disabled="disasterStartTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="hanleOccurrenceStart">
            </el-date-picker> -
            <el-date-picker
              v-model="formInline.disasterStartTime.queryEndTime"
              type="datetime"
              placeholder=""
              :disabled="disasterEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="hanleOccurrenceEnd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上报时间：">
            <el-select v-model="reportTime" placeholder="" style="margin-right: 10px;" @change="handleReportTime">
              <el-option
                v-for="item in timeHorizon"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="formInline.reportTime.queryStartTime"
              type="datetime"
              :disabled="reportStartTime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="hanleReportStart">
            </el-date-picker> -
            <el-date-picker
              v-model="formInline.reportTime.queryEndTime"
              type="datetime"
              :disabled="reportEndTime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="hanleReportEnd">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- 查询条件第三行 autocomplete="off"-->
        <div class="row third">
          <el-form-item label="死亡失踪人口：">
            <el-input v-model="formInline.itemValue1" placeholder="" autocomplete="off" @keyup.native="missProving"></el-input>人
          </el-form-item>
          <el-form-item label="紧急转移救助：">
            <el-input v-model="formInline.itemValue2" placeholder="" autocomplete="off" @keyup.native="salvationProving"></el-input>人
          </el-form-item>
          <el-form-item label="倒塌严损房屋：">
            <el-input v-model="formInline.itemValue3" placeholder="" autocomplete="off" @keyup.native="houseProving"></el-input>间
          </el-form-item>
          <el-form-item label="直接经济损失：">
            <el-input v-model="formInline.itemValue4" placeholder="" autocomplete="off" @keyup.native="economicsProving" @blur="blurEconomicsProving"></el-input>万元
          </el-form-item>
          <el-form-item>
            <el-button style="width: 90px;" @click="hanleSearchClear">清除</el-button>
            <el-button style="width: 90px;" @click="handleSearchDefault">默认</el-button>
            <el-button type="primary" style="width: 164px;" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <!-- <i class="fa fa-search"></i> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 灾种选择选择窗口 -->
    <minedOutAreaDialog :toMinedOutArea="minedOutAreaObj" @toFather="getMinedOutArea" />
    <!-- 受灾区域选择窗口 -->
    <affectedAreaDialog :toAffectedArea="affectedAreaObj" @toFather="getaffectedArea" />
    <!-- 列表部分 -->
    <div class="list">
      <div class="condition">
        <el-button size="small" style="margin-right: 30px;" @click="handleRefreshData">刷新数据</el-button>
        <el-radio-group v-model="listDataTypeRadio" @change="handleRadioChange">
          <el-radio v-for="(item, index) in listDataRadio" :label="item.label" :key="index">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- 待接收灾情列表 -->
        <div v-if="listDataTypeRadio === '待接收灾情'">
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
            :key="1111"
            v-loading="loading"
            height="469px"
            stripe
            border
            style="width: 100%; margin-top: 20px; min-header: 469px;">
            <el-table-column type="index" width="50" label="序号">
              <template slot-scope="scope"><span>{{ scope.$index + (currentPage - 1) * formInline.paged.maxResults + 1 }} </span></template>
            </el-table-column>
            <el-table-column prop="disaster.creditionRelation.civilRegionalism.civilRegionalismName" label="区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterKind.disasterKindName" label="灾种" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterStartTime" label="发生时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportStage.reportStageName" label="报表类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportTime" label="上报时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.flowActionStatus.flowActionStatusName" label="审核状态" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 已接收灾害过程列表 -->
        <div v-else-if="listDataTypeRadio === '已接收灾害过程'">
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
            :key="1112"
            v-loading="loading"
            height="469px"
            stripe
            border
            style="width: 100%; margin-top: 20px; min-header: 469px;">
            <el-table-column type="index" width="50" label="序号">
              <template slot-scope="scope"><span>{{ scope.$index + (currentPage - 1) * formInline.paged.maxResults + 1 }} </span></template>
            </el-table-column>
            <el-table-column prop="disaster.creditionRelation.civilRegionalism.civilRegionalismName" label="区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterKind.disasterKindName" label="灾种" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterStartTime" label="发生时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportTime" label="上报时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportStage.reportStageName" label="报表类型" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" :key=Math.random() width="400">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleText(scope.$index, scope.row)">文本</el-button>
                <el-button size="mini" @click="handleArea(scope.$index, scope.row)">区域</el-button>
                <el-button size="mini" @click="handleDisaster(scope.$index, scope.row)">报灾</el-button>
                <el-button size="mini" @click="handleStandard(scope.$index, scope.row)">标准</el-button>
                <el-button size="mini" @click="handleHistory(scope.$index, scope.row)">历史</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 全部灾害过程列表 -->
        <div v-else-if="listDataTypeRadio === '全部灾害过程'">
          <el-table
            :data="tableData"
            :key="1113"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
            v-loading="loading"
            height="469px"
            stripe
            border
            style="width: 100%; margin-top: 20px; min-header: 469px;">
            <el-table-column type="index" width="50" label="序号">
              <template slot-scope="scope"><span>{{ scope.$index + (currentPage - 1) * formInline.paged.maxResults + 1 }} </span></template>
            </el-table-column>
            <el-table-column prop="disaster.creditionRelation.civilRegionalism.civilRegionalismName" label="区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterKind.disasterKindName" label="灾种" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disaster.disasterStartTime" label="发生时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportStage.reportStageName" label="报表类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.reportTime" label="上报时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disasterReport.flowActionStatus.flowActionStatusName" label="审核状态" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" :key=Math.random() width="400">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleText(scope.$index, scope.row)">文本</el-button>
                <el-button size="mini" @click="handleArea(scope.$index, scope.row)">区域</el-button>
                <el-button size="mini" @click="handleDisaster(scope.$index, scope.row)">报灾</el-button>
                <el-button size="mini" @click="handleStandard(scope.$index, scope.row)">标准</el-button>
                <el-button size="mini" @click="handleHistory(scope.$index, scope.row)">历史</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页组件 -->
        <div style="text-align: center; margin-top: 40px;">
          <el-pagination
            background
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            :current-page='formInline.paged.firstResult'
            :page-size="formInline.paged.maxResults"
            @current-change="handleCurrentChange"
            :total="total">
          </el-pagination>
        </div>
        <!-- 文本弹窗 -->
        <el-dialog
          v-dialogDrag
          title="点击关闭自动复制到剪贴板"
          :visible.sync="textDialogVisible"
          :close-on-press-escape="false"
          class="text"
          width="420px">
          <div class="dialogBox">
            <p style="line-height: 32px; font-weight: 600;">{{ text1 }}</p>
            <p style="line-height: 32px;">{{ text2 }}</p>
            <p style="margin-top: 20px; line-height: 32px; font-weight: 600;">{{ text3 }}</p>
            <p style="line-height: 32px;">{{ text4 }}</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button v-clipboard:copy="allText" type="primary" size="small" @click="textDialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <!-- 区域弹窗 -->
        <el-dialog
          v-dialogDrag
          title="受灾区域信息"
          :visible.sync="areaDialogVisible"
          :close-on-press-escape="false"
          class="area"
          width="860px">
          <div class="dialogBox" style="height: 378px;">
            <p class="areaTilte">省[{{ areaProvinceNum }}]：</p>
            <p class="areaText">{{ areaProvince }}</p>
            <p class="areaTilte">市[{{ citiesNum }}]：</p>
            <p class="areaText">{{ areaCities }}</p>
            <p class="areaTilte">乡镇[{{ townsNum }}]：</p>
            <p class="areaText">{{ areaVillagesTowns }}</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="areaDialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <!-- 报灾/标准弹窗 -->
        <disasterDialog :toDisasterObj="disasterObj" />
        <!-- 历史弹窗 -->
        <el-dialog
          v-dialogDrag
          title="详情信息"
          :visible.sync="historyDialogVisible"
          :close-on-press-escape="false"
          class="historyDialog"
          width="800px">
          <div class="historyDialogBox" v-loading="historyLoading">
            <div class="historyDialogBoxTitle">
              <span style="margin-right: 10px;">{{ historyTitle }}</span>
              <span>{{ historyTime }}</span>
            </div>
            <div class="Content">
              <div class="left">
                <div class="title">历史列表</div>
                <div style="overflow: hidden; box-shadow:0px 2px 10px 0px rgba(0,0,0,0.1);">
                  <el-table
                    :data="historyGridData"
                    :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                    :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                    stripe
                    height="396px"
                    border>
                    <el-table-column property="reportStage.reportStageName" label="报表"  show-overflow-tooltip></el-table-column>
                    <el-table-column property="flowActionStatus.flowActionStatusName" label="状态" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column property="reportTime" label="上报时间" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <img class="Image" src="@/assets/images/disasterIndex.png" @click="hanleDisasterIndexClick(scope.$index, scope.row)" />
                        <img class="Image" src="@/assets/images/disasterReliefWork.png" @click="handleDisasterReliefWorkClick(scope.$index, scope.row)" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="right">
                <p class="text">提示：</p>
                <p class="text">图示按钮示意</p>
                <div class="text">
                  <img src="@/assets/images/disasterIndex.png"  class="Image" />
                  <span>灾情指标</span>
                </div>
                <div class="text">
                  <img src="@/assets/images/disasterReliefWork.png"  class="Image" />
                  <span>救灾工作</span>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { disasterReceived, disasterYet, disasterAll, translateTextTemplate01, listArea, listHistory, disasterIndex } from '@/api/DisasterLetters/disasterReport'
import { format, getPassFormatDate } from '@/utils/Time' // 区域选择communal
import { mapGetters } from 'vuex'
// 灾种选择窗口组件
import minedOutAreaDialog from '@/components/DisasterLetters/minedOutAreaDialog'
// 受灾区域选择窗口组件
import affectedAreaDialog from '@/components/DisasterLetters/affectedAreaDialog'
// 列表报灾弹窗
import disasterDialog from '@/components/DisasterLetters/disasterDialog'
export default {
  name: 'DisasterLetters',
  components: {
    minedOutAreaDialog,
    affectedAreaDialog,
    disasterDialog
  },
  data () {
    return {
      // 灾种选择受灾区域选择窗口数据
      minedOutAreaObj: {
        minedOutAreaDialogVisible: false
      },
      // 受灾区域选择窗口数据
      affectedAreaObj: {
        affectedAreaDialogVisible: false
      },
      // 查询条件数据
      formInline: {
        disasterKindIds: '', // 灾种选择：
        subRelationIds: '', // 受灾区域：
        disasterStatMonth: null, // 月份统计
        disasterStartTime: { // 发生时间
          queryStartTime: null,
          queryEndTime: null
        },
        reportTime: { // 上报时间
          queryStartTime: null,
          queryEndTime: null
        },
        itemValue1: '', // 死亡失踪人口
        itemValue2: '', // 紧急转移救助
        itemValue3: '', // 倒塌严损房屋
        itemValue4: '', // 直接经济损失
        paged: {
          firstResult: 1,
          maxResults: 12
        },
        currentRelationId: '2f8ae8904f5647c9b15661c85a7a822f' // id（登陆时返回的id）
      },
      // 发生时间选择范围
      occurrenceTime: '不限',
      // 上报时间选择范围
      reportTime: '不限',
      // 时间范围
      timeHorizon: [
        {
          value: '1',
          label: '不限'
        }, {
          value: '2',
          label: '最近一周'
        }, {
          value: '3',
          label: '最近一个月'
        }, {
          value: '4',
          label: '最近三个月'
        }, {
          value: '5',
          label: '最近六个月'
        }
      ],
      // 列表数据类型
      listDataTypeRadio: '待接收灾情',
      // 选择数据
      listDataRadio: [{ value: '待接收灾情', label: '待接收灾情' }, { value: '已接收灾害过程', label: '已接收灾害过程' }, { value: '全部灾害过程', label: '全部灾害过程' }],
      // 列表数据
      tableData: [],
      // table loading
      loading: false,
      // 全局loading
      overallLoading: false,
      // 总条数
      total: 1,
      // 当前页
      currentPage: 1,
      // 文本弹窗
      textDialogVisible: false,
      // 列表文本中的四段数据
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      // 区域弹窗
      areaDialogVisible: false,
      // 报灾弹窗部分数据
      disasterObj: {
        outerVisible: false
      },
      // 历史弹窗
      historyDialogVisible: false,
      // 历史弹窗中 table数据
      historyGridData: [],
      // 灾种选择要传的参数
      minedOutParam: [],
      // 区域选择要传的参数
      affectedParam: [],
      // 发生时间 开始时间 禁止选择控制
      disasterStartTime: false,
      // 发生时间 结束时间 禁止选择控制
      disasterEndTime: false,
      // 上报时间 开始时间 禁止选择控制
      reportStartTime: false,
      // 上报时间 结束时间 禁止选择控制
      reportEndTime: false,
      // 区域弹窗中的省
      areaProvince: '',
      // 省的数量
      areaProvinceNum: 1,
      // 区域弹窗中的市
      areaCities: '',
      // 市的数量
      citiesNum: 0,
      // 区域弹窗中的乡镇
      areaVillagesTowns: '',
      // 乡镇数量
      townsNum: 0,
      // 历史弹窗中 title
      historyTitle: '',
      // 历史弹窗中 time
      historyTime: '',
      // 历史弹窗loading
      historyLoading: false
    }
  },
  computed: {
    // 实现列表文本弹窗关闭 复制的数据换行
    allText () {
      // 匹配所有空格进行换行
      return `${this.text1} ${this.text2} ${this.text3} ${this.text4}`.replace(/\s+/g, '\n')
    },
    ...mapGetters(['disasterStandard'])
  },
  methods: {
    // 灾种选择
    handleFocusMinedOutArea (e) {
      this.minedOutAreaObj.minedOutAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 灾种组件传来的数据
    getMinedOutArea (data) {
      let toFatherInputValue = []
      this.minedOutParam = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.disasterKindId) {
            toFatherInputValue.push(i.disasterKindName)
          }
        })
      })
      this.formInline.disasterKindIds = toFatherInputValue.join(',')
      // this.minedOutAreaObj.minedOutAreaDialogVisible = false
      this.minedOutParam = data.inputArr
      // console.log(data, this.formInline.disasterKindIds)
    },
    // 受灾区域选择
    handleFocusAffectedArea (e) {
      this.affectedAreaObj.affectedAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 受灾区域传来的数据
    getaffectedArea (data) {
      let toFatherInputValue = []
      this.affectedParam = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.creditionRelationId) {
            toFatherInputValue.push(i.civilRegionalism.civilRegionalismName)
          }
        })
      })
      this.formInline.subRelationIds = toFatherInputValue.join(',')
      this.affectedParam = data.inputArr
      // this.affectedAreaObj
      // console.log('区域选择传来的数据', data, this.formInline.subRelationIds)
    },
    // 发生时间change
    handleOccurrenceTime (val) {
      if (val === '不限') {
        this.formInline.disasterStartTime.queryStartTime = null
        this.formInline.disasterStartTime.queryEndTime = null
        this.disasterStartTime = false
        this.disasterEndTime = false
      } else if (val === '最近一周') {
        this.formInline.disasterStartTime.queryStartTime = format(new Date(new Date() - 7 * 24 * 3600 * 1000))
        this.formInline.disasterStartTime.queryEndTime = format(new Date())
        this.disasterStartTime = true
        this.disasterEndTime = true
      } else if (val === '最近一个月') {
        this.formInline.disasterStartTime.queryStartTime = getPassFormatDate(30)
        this.formInline.disasterStartTime.queryEndTime = format(new Date())
        this.disasterStartTime = true
        this.disasterEndTime = true
      } else if (val === '最近三个月') {
        this.formInline.disasterStartTime.queryStartTime = getPassFormatDate(90)
        this.formInline.disasterStartTime.queryEndTime = format(new Date())
        this.disasterStartTime = true
        this.disasterEndTime = true
      } else if (val === '最近六个月') {
        this.formInline.disasterStartTime.queryStartTime = getPassFormatDate(180)
        this.formInline.disasterStartTime.queryEndTime = format(new Date())
        this.disasterStartTime = true
        this.disasterEndTime = true
      }
      // console.log('发生时间 时间限制', val)
    },
    // 发生时间 开始时间change
    hanleOccurrenceStart (val) {
      // console.log(val, this.formInline.disasterStartTime.queryStartTime)
    },
    // 发生时间 结束时间change
    hanleOccurrenceEnd (val) {
      // console.log(val, this.formInline.disasterStartTime.queryEndTime)
    },
    // 上报时间
    handleReportTime (val) {
      if (val === '不限') {
        this.formInline.reportTime.queryStartTime = null
        this.formInline.reportTime.queryEndTime = null
        this.reportStartTime = false
        this.reportEndTime = false
      } else if (val === '最近一周') {
        this.formInline.reportTime.queryStartTime = format(new Date(new Date() - 7 * 24 * 3600 * 1000))
        this.formInline.reportTime.queryEndTime = format(new Date())
        this.reportStartTime = true
        this.reportEndTime = true
      } else if (val === '最近一个月') {
        this.formInline.reportTime.queryStartTime = getPassFormatDate(30)
        this.formInline.reportTime.queryEndTime = format(new Date())
        this.reportStartTime = true
        this.reportEndTime = true
      } else if (val === '最近三个月') {
        this.formInline.reportTime.queryStartTime = getPassFormatDate(90)
        this.formInline.reportTime.queryEndTime = format(new Date())
        this.reportStartTime = true
        this.reportEndTime = true
      } else if (val === '最近六个月') {
        this.formInline.reportTime.queryStartTime = getPassFormatDate(180)
        this.formInline.reportTime.queryEndTime = format(new Date())
        this.reportStartTime = true
        this.reportEndTime = true
      }
      // console.log('上报时间 时间限制', val)
    },
    // 上报时间 开始时间change
    hanleReportStart (val) {
      // console.log(val, this.formInline.reportTime.queryStartTime)
    },
    // 死亡失踪人口input验证只能输入正整数
    missProving () {
      this.formInline.itemValue1 = this.formInline.itemValue1.replace(/[^.\d]/g, '')
      this.formInline.itemValue1 = this.formInline.itemValue1.replace('.', '')
    },
    // 紧急转移救助input验证只能输入正整数
    salvationProving () {
      this.formInline.itemValue2 = this.formInline.itemValue2.replace(/[^.\d]/g, '')
      this.formInline.itemValue2 = this.formInline.itemValue2.replace('.', '')
    },
    // 倒塌严损房屋input验证只能输入正整数
    houseProving () {
      this.formInline.itemValue3 = this.formInline.itemValue3.replace(/[^.\d]/g, '')
      this.formInline.itemValue3 = this.formInline.itemValue3.replace('.', '')
    },
    // 直接经济损失input验证只能输入>0的正数，小数点保留两位
    economicsProving () {
      // 只填写正数或者小数
      this.formInline.itemValue4 = this.formInline.itemValue4.replace(/[^\d.]/g, '')
      // 小数点保留两位
      if (this.formInline.itemValue4.indexOf('.') !== -1) {
        let arr = this.formInline.itemValue4.split('.')
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        let newArr = [arr[0], arr[1]]
        this.formInline.itemValue4 = newArr.join('.')
      }
    },
    // 失去焦点时触发  直接经济损失 去除多余的“.”
    blurEconomicsProving () {
      if (this.formInline.itemValue4.indexOf('.') !== -1) {
        let arr = this.formInline.itemValue4.split('.')
        if (arr[1].length === 0) {
          this.formInline.itemValue4 = arr[0]
        }
      }
    },
    // 上报时间 结束时间change
    hanleReportEnd (val) {
      // console.log(val, this.formInline.reportTime.queryEndTime)
    },
    // 清除按钮
    hanleSearchClear () {
      this.formInline.itemValue1 = ''
      this.formInline.itemValue2 = ''
      this.formInline.itemValue3 = ''
      this.formInline.itemValue4 = ''
      // console.log('清除按钮')
    },
    // 默认按钮
    handleSearchDefault () {
      this.formInline.itemValue1 = 1
      this.formInline.itemValue2 = 5000
      this.formInline.itemValue3 = 1000
      this.formInline.itemValue4 = 1000
      // console.log('默认')
    },
    // 搜索按钮
    handleSearch () {
      // 灾情类型切换
      if (this.listDataTypeRadio === '待接收灾情') {
        this.getDisasterReceived()
      } else if (this.listDataTypeRadio === '已接收灾害过程') {
        this.getDisasterYet()
      } else if (this.listDataTypeRadio === '全部灾害过程') {
        this.getDisasterAll()
      }
    },
    // 刷新数据
    handleRefreshData () {
      if (this.listDataTypeRadio === '待接收灾情') {
        this.getDisasterReceived()
      } else if (this.listDataTypeRadio === '已接收灾害过程') {
        this.getDisasterYet()
      } else if (this.listDataTypeRadio === '全部灾害过程') {
        this.getDisasterAll()
      }
      // console.log('刷新数据')
    },
    // change列表类型
    handleRadioChange (val) {
      if (val === '待接收灾情') {
        this.getDisasterReceived()
      } else if (val === '已接收灾害过程') {
        this.getDisasterYet()
      } else if (val === '全部灾害过程') {
        this.getDisasterAll()
      }
      // console.log(val)
    },
    // 当前页
    handleCurrentChange (val) {
      this.currentPage = val
      // 传给后台的当前页 （从0开始为第一页）
      if (this.listDataTypeRadio === '待接收灾情') {
        this.getDisasterReceived()
      } else if (this.listDataTypeRadio === '已接收灾害过程') {
        this.getDisasterYet()
      } else if (this.listDataTypeRadio === '全部灾害过程') {
        this.getDisasterAll()
      }
      // console.log(`当前页: ${this.formInline.paged.firstResult} ${val}`)
    },
    // 列表中的文本
    handleText (index, row) {
      let params = {}
      let id = row.disasterReport.reportId
      this.overallLoading = true
      translateTextTemplate01(params, id).then(res => {
        this.textDialogVisible = true
        this.overallLoading = false
        // 按照死亡...弹窗中信息
        this.text2 = res.resultSet.textForCode
        // 按照区划进行排序
        this.text4 = res.resultSet.textForLoss
        // console.log(res)
      }).catch(err => {
        this.overallLoading = false
        console.log(err)
      })
      // console.log('文本', index, row, row.disasterReport.reportId)
    },
    // 列表中的区域
    handleArea (index, row) {
      let params = {}
      let id = row.disasterReport.reportId
      this.overallLoading = true
      listArea(params, id).then(res => {
        this.areaDialogVisible = true
        this.overallLoading = false
        // 省
        this.areaProvince = res.resultSet.creditionRelation.civilRegionalism.civilRegionalismName
        // 市
        var provinces = []
        // 乡镇
        var towns = []
        res.resultSet.reports.map(item => {
          provinces.push(item.creditionRelation.civilRegionalism.civilRegionalismName)
          item.reports.map(i => {
            towns.push(i.creditionRelation.civilRegionalism.civilRegionalismName)
          })
        })
        // 市
        this.areaCities = provinces.join('、')
        // 乡镇
        this.areaVillagesTowns = towns.join('、')
        // 省的数量
        this.areaProvinceNum = this.areaProvince.split('、').length
        // 市的数量
        this.citiesNum = this.areaCities.split('、').length
        // 乡镇数量
        this.townsNum = this.areaVillagesTowns.split('、').length
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      console.log('区域', index, row)
    },
    // 列表中的报灾
    handleDisaster (index, row) {
      // 传递id
      let id = row.disasterReport.reportId
      this.$store.dispatch('getDisasterId', id)
      this.disasterObj.outerVisible = true
      this.$router.push({ path: '/disasterLetters/disasterIndex' })
      this.$store.dispatch('getDisasterStandard', '报灾')
      const title = `${row.disaster.creditionRelation.civilRegionalism.civilRegionalismName} ${row.disasterReport.reportTime} [ ${row.disaster.disasterKind.disasterKindName} ] 认定统计月份：${row.disaster.disasterStatMonth}`
      this.$store.dispatch('getStandardDisaster', title)
      console.log('报灾', index, row, this.$router.options.routes[0].children[0].children, this.disasterStandard)
    },
    // 列表中的标准
    handleStandard (index, row) {
      this.disasterObj.outerVisible = true
      // 传递id
      let id = row.disasterReport.reportId
      this.$store.dispatch('getDisasterId', id)
      this.$router.push({ path: '/disasterLetters/disasterIndex' })
      this.$store.dispatch('getDisasterStandard', '标准')
      const title = `${row.disaster.creditionRelation.civilRegionalism.civilRegionalismName} ${row.disasterReport.reportTime} [ ${row.disaster.disasterKind.disasterKindName} ] 认定统计月份：${row.disaster.disasterStatMonth}`
      this.$store.dispatch('getStandardDisaster', title)
      console.log('标准', index, row, this.disasterStandard)
    },
    // 列表中的历史
    handleHistory (index, row) {
      let params = {}
      let rid = row.disaster.creditionRelation.creditionRelationId
      let id = row.disaster.disasterId
      this.overallLoading = true
      listHistory(params, rid, id).then(res => {
        this.historyDialogVisible = true
        this.overallLoading = false
        let listData = res.resultSet
        listData.map(i => {
          if (i.reportStage.reportStageName !== '初报') {
            i.reportStage.reportStageName = i.reportStage.reportStageName + i.quantity
          } else {
            i.reportStage.reportStageName = i.reportStage.reportStageName
          }
        })
        this.historyGridData = listData.reverse()
        this.historyTitle = res.resultSet[0].disaster.disasterKindName
        this.historyTitle = res.resultSet[0].disaster.disasterStartTime
        // console.log(res, this.historyGridData)
      }).catch(err => {
        console.log(err)
        this.overallLoading = false
      })
      const title = `${row.disaster.creditionRelation.civilRegionalism.civilRegionalismName} ${row.disasterReport.reportTime} [ ${row.disaster.disasterKind.disasterKindName} ] 认定统计月份：${row.disaster.disasterStatMonth}`
      this.$store.dispatch('getStandardDisaster', title)
      let Id = row.disasterReport.reportId
      this.$store.dispatch('getDisasterId', Id)
      this.$store.dispatch('getDisasterStandard', '报灾')
      // console.log('历史', index, row)
    },
    // 历史弹窗中 灾情指标
    hanleDisasterIndexClick (index, row) {
      let params = {}
      let id = row.reportId
      this.historyLoading = true
      disasterIndex(params, id).then(res => {
        this.historyLoading = false
        // console.log(res)
        if (res.optResult) {
          this.disasterObj.outerVisible = true
          this.$store.dispatch('getDisasterId', id)
          this.$router.push({ path: '/disasterLetters/disasterIndex' })
          this.$store.dispatch('getDisasterStandard', '报灾')
        } else {
          this.$message.error(res.errorMsg)
        }
      }).catch(err => {
        this.historyLoading = false
        console.log(err)
      })

      // console.log(index, row, '灾情指标')
    },
    // 历史弹窗 救灾工作
    handleDisasterReliefWorkClick (index, row) {
      this.disasterObj.outerVisible = true
      this.$router.push({ path: '/disasterLetters/salvationWork' })
      this.$store.dispatch('getDisasterStandard', '报灾')
      // console.log(index, row, '救灾工作')
    },
    // 待接收灾情接口数据
    getDisasterReceived () {
      let params = {}
      params.currentRelationId = this.formInline.currentRelationId // 登录时的id标识
      params.paged = {}
      params.paged.maxResults = this.formInline.paged.maxResults // 分页
      var current = (this.currentPage - 1) * this.formInline.paged.maxResults
      params.paged.firstResult = current
      // 选择灾种
      if (this.minedOutParam.length > 0) {
        params.disasterKindIds = this.minedOutParam
      }
      // 区域选择
      if (this.affectedParam.length > 0) {
        params.subRelationIds = this.affectedParam
      }
      // 月份统计
      if (this.formInline.disasterStatMonth !== null) {
        params.disasterStatMonth = this.formInline.disasterStatMonth
      }
      // 死亡失踪人口
      if (this.formInline.itemValue1 !== '') {
        params.itemValue1 = this.formInline.itemValue1
      }
      // 紧急转移救助
      if (this.formInline.itemValue2 !== '') {
        params.itemValue2 = this.formInline.itemValue2
      }
      // 倒塌严损房屋
      if (this.formInline.itemValue3 !== '') {
        params.itemValue3 = this.formInline.itemValue3
      }
      // 直接经济损失
      if (this.formInline.itemValue4 !== '') {
        params.itemValue4 = this.formInline.itemValue4
      }
      // 发生时间 转为毫秒数时间戳 传参
      const disasterStartTime = {}
      if (this.formInline.disasterStartTime.queryStartTime !== null) {
        disasterStartTime.queryStartTime = new Date(this.formInline.disasterStartTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.disasterStartTime.queryEndTime !== null) {
        disasterStartTime.queryEndTime = new Date(this.formInline.disasterStartTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.disasterStartTime = disasterStartTime
      // 上报时间 转为毫秒数时间戳 传参
      const reportTime = {}
      if (this.formInline.reportTime.queryStartTime !== null) {
        reportTime.queryStartTime = new Date(this.formInline.reportTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.reportTime.queryEndTime !== null) {
        reportTime.queryEndTime = new Date(this.formInline.reportTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.reportTime = reportTime
      this.loading = true
      disasterReceived(params).then(res => {
        this.total = res.resultSet.totalQuantity // 总条数
        this.tableData = res.resultSet.dataList
        this.loading = false
        // console.log('待接收灾情', res)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 已接收灾害过程接口数据
    getDisasterYet () {
      let params = {}
      params.currentRelationId = this.formInline.currentRelationId // 登录时的id标识
      params.paged = {}
      params.paged.maxResults = this.formInline.paged.maxResults // 分页
      var current = (this.currentPage - 1) * this.formInline.paged.maxResults
      params.paged.firstResult = current
      // 选择灾种
      if (this.minedOutParam.length > 0) {
        params.disasterKindIds = this.minedOutParam
      }
      // 区域选择
      if (this.affectedParam.length > 0) {
        params.subRelationIds = this.affectedParam
      }
      // 月份统计
      if (this.formInline.disasterStatMonth !== null) {
        params.disasterStatMonth = this.formInline.disasterStatMonth
      }
      // 死亡失踪人口
      if (this.formInline.itemValue1 !== '') {
        params.itemValue1 = this.formInline.itemValue1
      }
      // 紧急转移救助
      if (this.formInline.itemValue2 !== '') {
        params.itemValue2 = this.formInline.itemValue2
      }
      // 倒塌严损房屋
      if (this.formInline.itemValue3 !== '') {
        params.itemValue3 = this.formInline.itemValue3
      }
      // 直接经济损失
      if (this.formInline.itemValue4 !== '') {
        params.itemValue4 = this.formInline.itemValue4
      }
      // 发生时间 转为毫秒数时间戳 传参
      const disasterStartTime = {}
      if (this.formInline.disasterStartTime.queryStartTime !== null) {
        disasterStartTime.queryStartTime = new Date(this.formInline.disasterStartTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.disasterStartTime.queryEndTime !== null) {
        disasterStartTime.queryEndTime = new Date(this.formInline.disasterStartTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.disasterStartTime = disasterStartTime
      // 上报时间 转为毫秒数时间戳 传参
      const reportTime = {}
      if (this.formInline.reportTime.queryStartTime !== null) {
        reportTime.queryStartTime = new Date(this.formInline.reportTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.reportTime.queryEndTime !== null) {
        reportTime.queryEndTime = new Date(this.formInline.reportTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.reportTime = reportTime
      this.loading = true
      disasterYet(params).then(res => {
        this.total = res.resultSet.totalQuantity // 总条数
        this.tableData = res.resultSet.dataList
        this.loading = false
        // console.log('已接收灾害过程', res)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 全部灾害过程接口数据
    getDisasterAll () {
      let params = {}
      params.currentRelationId = this.formInline.currentRelationId // 登录时的id标识
      params.paged = {}
      params.paged.maxResults = this.formInline.paged.maxResults // 分页
      var current = (this.currentPage - 1) * this.formInline.paged.maxResults
      params.paged.firstResult = current
      // 选择灾种
      if (this.minedOutParam.length > 0) {
        params.disasterKindIds = this.minedOutParam
      }
      // 区域选择
      if (this.affectedParam.length > 0) {
        params.subRelationIds = this.affectedParam
      }
      // 月份统计
      if (this.formInline.disasterStatMonth !== null) {
        params.disasterStatMonth = this.formInline.disasterStatMonth
      }
      // 死亡失踪人口
      if (this.formInline.itemValue1 !== '') {
        params.itemValue1 = this.formInline.itemValue1
      }
      // 紧急转移救助
      if (this.formInline.itemValue2 !== '') {
        params.itemValue2 = this.formInline.itemValue2
      }
      // 倒塌严损房屋
      if (this.formInline.itemValue3 !== '') {
        params.itemValue3 = this.formInline.itemValue3
      }
      // 直接经济损失
      if (this.formInline.itemValue4 !== '') {
        params.itemValue4 = this.formInline.itemValue4
      }
      // 发生时间 转为毫秒数时间戳 传参
      const disasterStartTime = {}
      if (this.formInline.disasterStartTime.queryStartTime !== null) {
        disasterStartTime.queryStartTime = new Date(this.formInline.disasterStartTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.disasterStartTime.queryEndTime !== null) {
        disasterStartTime.queryEndTime = new Date(this.formInline.disasterStartTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.disasterStartTime = disasterStartTime
      // 上报时间 转为毫秒数时间戳 传参
      const reportTime = {}
      if (this.formInline.reportTime.queryStartTime !== null) {
        reportTime.queryStartTime = new Date(this.formInline.reportTime.queryStartTime.replace(/-/g, '/')).getTime()
      }
      if (this.formInline.reportTime.queryEndTime !== null) {
        reportTime.queryEndTime = new Date(this.formInline.reportTime.queryEndTime.replace(/-/g, '/')).getTime()
      }
      params.reportTime = reportTime
      this.loading = true
      disasterAll(params).then(res => {
        this.total = res.resultSet.totalQuantity // 总条数
        this.tableData = res.resultSet.dataList
        this.loading = false
        // console.log('全部灾害过程', res)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  },
  mounted () {
    // 待接收灾情
    this.getDisasterReceived()
  }
}
</script>

<style scoped>
.historyDialog /deep/ .el-dialog__body {
  padding: 10px 20px 30px;
}
.historyDialogBox {
  overflow: hidden;
}
.historyDialogBoxTitle {
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 2px solid #d1d3d4;
  width: 608px;
  font-size: 18px;
  color: #000000;
}
.historyDialogBox .Content {
  overflow: hidden;
}
.historyDialogBox .Content .left {
  float: left;
  width: 80%;
}
.historyDialogBox .Content .left .title {
  background: #d1d3d4;
  color: #333333;
  padding: 10px;
  font-weight: 600;
  box-shadow:0px 2px 10px 0px rgba(0,0,0,0.1);
}
.historyDialogBox .Content .right {
  /* display: flex; */
  padding: 0 10px;
  float: right;
  width: 16%;
}
.historyDialogBox .Content .right .text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #000000;
}
/* .historyDialog .Content /deep/ .el-table__body-wrapper {
  height: 396px;
  overflow: auto;
} */
.Image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  vertical-align: middle;
}
.Image:nth-child(2) {
  margin-right: 0;
}
.Image:hover {
  cursor: pointer;
}
.search {
  background: #ECEAEA;
  padding: 20px 32px 0;
  text-align: left;
}
.row {
  min-width: 1440px;
  height: 51px;
  text-align: left;
  white-space: nowrap;
}
.first /deep/ .el-form-item--small.el-form-item {
  width: 32%;
}
.first /deep/ .el-form-item--small .el-form-item__label {
  width: 14%;
}
.first /deep/ .el-form-item--small .el-form-item__content {
  width: 86%;
}
.first /deep/ .el-form-item--small.el-form-item:last-child {
  margin-right: 0;
}
.first /deep/ .el-date-editor.el-input {
  width: 100%;
}
.first /deep/  .el-form-item--small.el-form-item:last-child {
  float: right;
}
.second /deep/ .el-form-item--small.el-form-item:last-child {
  float: right;
  margin-right: 0;
}
.second /deep/ .el-form-item.el-form-item--small {
  margin-right: 0;
}
.second /deep/ .el-form-item.el-form-item--small:first-child {
  width: 50%;
}
.second /deep/ .el-input--small .el-input__inner {
  width: 196px;
}
.second /deep/ .el-date-editor.el-input {
  width: 196px;
}
/* .second /deep/ .el-form-item--small.el-form-item .el-date-editor.el-input {
  width: 31.3%;
  min-width: 294px;
} */
/* .second /deep/ .el-select {
  min-width: 200px;
}
.second /deep/ .el-select > .el-input {
  min-width: 200px;
}
.second /deep/ .el-input--small .el-input__inner {
  min-width: 200px;
}
.second /deep/ .el-date-editor.el-input {
  width: 202px;
} */
.third /deep/ .el-form-item--small.el-form-item {
  /* margin-right: 136px; */
  margin-right: 3%;
}
.third /deep/ .el-form-item--small.el-form-item:nth-child(4) {
  margin-right: 0;
}
.third /deep/ .el-form-item--small.el-form-item:last-child {
  margin-right: 0;
  float: right;
  /* margin-left: 208px; */
}
.third /deep/ .el-form-item--small.el-form-item .el-button--small:nth-child(1) {
  border: 1px solid #29378F;
}
.third /deep/ .el-form-item--small.el-form-item .el-button--small:nth-child(2) {
  border: 1px solid #29378F;
}
.third /deep/ .el-input--small {
  width: 94px;
  margin-right: 10px;
}
.third /deep/ .el-form-item__label {
  padding-right: 6px;
}
.list {
  padding: 20px 32px;
  text-align: left;
}
.list /deep/ .el-table th.is-leaf, .el-table td {
  border-bottom: 1px solid #B8D0EA;
}
.list /deep/ .el-pagination.is-background .btn-prev {
  padding-left: 10px;
  padding-right: 10px;
}
.list /deep/ .el-pagination.is-background .btn-next {
  padding-left: 10px;
  padding-right: 10px;
}
.list /deep/ .el-table__body-wrapper .el-button--mini {
  padding: 4px 15px;
}
.list /deep/ .el-dialog__header {
  background: #29378F;
  padding: 10px 20px;
}
.list /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
  font-size: 16px;
}
.list /deep/ .el-dialog__headerbtn {
  top: 16px;
}
.list /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
.condition .dialogBox {
  max-height: 360px;
  overflow: auto;
}
.condition /deep/ .el-dialog__wrapper .el-dialog__body {
  padding: 30px 20px 10px;
}
.area .dialogBox .areaTilte {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  padding: 20px 0;
}
.area .dialogBox .areaText {
  text-indent: 48px;
  color: #333333;
}
/*滚动条整体样式 高宽分别对应横竖滚动条的尺寸*/
.condition .dialogBox::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/*滚动条里面小方块*/
.condition .dialogBox::-webkit-scrollbar-thumb {
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
/*滚动条里面轨道*/
.condition .dialogBox::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>
