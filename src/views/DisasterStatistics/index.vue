<template>
  <!-- 灾情统计 -->
  <div class="DisasterStatistics">
    <div class="tab">
      <!-- tab -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 阶段性灾情统计 -->
        <el-tab-pane label="阶段性灾情统计" name="first">
          <div class="stageBox" style="padding: 7px 32px 0">
            <el-form :inline="true" :model="stageFormInline" label-position="right" size="small" class="demo-form-inline">
              <!-- 第一行选择条件 -->
              <div class="firstSearch">
                <el-form-item label="灾种选择：">
                  <el-input v-model="stageFormInline.disasterKindIds" placeholder="" autocomplete="off" @focus="handleFocusMinedOutArea"></el-input>
                </el-form-item>
                <el-form-item label="受灾区域：">
                  <el-input v-model="stageFormInline.subRelationIds" placeholder="" autocomplete="off" @focus="handleFocusAffectedArea"></el-input>
                </el-form-item>
              </div>
              <!-- 第二行选择条件 -->
              <div class="secondSearch" style="min-width: 1616px;">
                <el-form-item  label="发生时间：">
                  <el-date-picker
                    v-model="stageFormInline.disasterStartTime.queryStartTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker> -
                  <el-date-picker
                    v-model="stageFormInline.disasterStartTime.queryEndTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item  label="月份统计：">
                  <el-date-picker
                    v-model="stageFormInline.disasterStatMonth"
                    type="month"
                    placeholder=""
                    value-format="yyyy-MM">
                  </el-date-picker>
                </el-form-item>
                <el-form-item  label="查询范围：">
                  <el-select v-model="stageFormInline.searchLevelNumber" placeholder="">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="hanleStatisticsClick" style="float: right; padding: 9px 60px;" size="small" icon="el-icon-share">统计</el-button>
              </div>
            </el-form>
          </div>
          <div class="stageContent">
            <div class="switchOver" style="min-width: 680px;">
              <el-radio-group v-model="stageRadioContent" size="small" @change="handleChangeValue">
                <el-radio-button :label="item.label" :key="itemIndex" v-for="(item, itemIndex) in radioList">
                  <i style="margin-right: 10px;" :class="item.icon"></i>{{ item.label }}
                </el-radio-button>
              </el-radio-group>
              <el-button size="small" style="float: right; padding: 9px 30px; background: rgba(244,244,244,1);" @click="handleStageExport">导出</el-button>
            </div>
            <div class="stageList">
              <!-- 受灾人口 -->
              <el-table
                v-if="stageRadioContent === '受灾人口'"
                :data="affectedPopulationTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                v-loading="loading"
                :key="103"
                height="469px"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">{{ scope.$index+(currentPage - 1) * pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column prop="areaName" label="区域" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="affectedPopulation" label="受灾人口（人）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deaths" label="因灾死亡人口（人）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="missingPersons" label="因灾失踪人口（人）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="placeTransfer" label="紧急转移安置人口（人）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="lifeRescue" label="需紧急生活救助人口（人）" show-overflow-tooltip></el-table-column>
              </el-table>
              <!-- 农作物 -->
              <el-table
                v-if="stageRadioContent === '农作物'"
                :data="affectedPopulationTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                v-loading="loading"
                height="469px"
                :key="2"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">{{ scope.$index+(currentPage - 1) * pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column prop="areaName" label="区域" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="农作物受灾面积（公顷）" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.affectedArea | number}}</template>
                </el-table-column>
                <el-table-column prop="bourgeonArea" label="其中：农作物绝收面积（公顷）" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.bourgeonArea | number}}</template>
                </el-table-column>
              </el-table>
              <!-- 房屋信息 -->
              <el-table
                v-if="stageRadioContent === '房屋信息'"
                :data="affectedPopulationTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                height="469px"
                v-loading="loading"
                :key="3"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">{{ scope.$index+(currentPage - 1) * pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column prop="areaName" label="区域" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="housesCollapsed" label="倒塌房屋间数（间）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="housesDamaged" label="严重损坏房屋间数（间）" show-overflow-tooltip></el-table-column>
                <el-table-column prop="housesGeneral" label="一般损坏房屋间数（间）" show-overflow-tooltip></el-table-column>
              </el-table>
              <!-- 直接经济损失 -->
              <el-table
                v-if="stageRadioContent === '直接经济损失'"
                :data="affectedPopulationTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                v-loading="loading"
                height="469px"
                :key="4"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">{{ scope.$index+(currentPage - 1) * pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column prop="areaName" label="区域" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="directEconomic" label="直接经济损失（万元）" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.directEconomic | number}}</template>
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
                :page-size="pageSize"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange"
                :total="stageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- 受灾区域统计 -->
        <el-tab-pane label="受灾区域统计" name="second">
          <div class="stageBox areaStatistics" style="padding: 7px 32px 0">
            <el-form :inline="true" :model="rangeStatisticsFormInline" label-position="right" size="small" class="demo-form-inline">
              <!-- 第一行选择条件 -->
              <div class="firstSearch">
                <el-form-item label="灾种选择：">
                  <el-input v-model="rangeStatisticsFormInline.disasterKindIds" placeholder="" autocomplete="off" @focus="handleFocusArea"></el-input>
                </el-form-item>
                <el-form-item  label="月份统计：">
                  <el-date-picker
                    v-model="rangeStatisticsFormInline.disasterStatMonth"
                    type="month"
                    placeholder=""
                    value-format="yyyy-MM">
                  </el-date-picker>
                </el-form-item>
              </div>
              <!-- 第二行选择条件 -->
              <div class="secondSearch" style="min-width: 900px;">
                <el-form-item  label="发生时间：">
                  <el-date-picker
                    v-model="rangeStatisticsFormInline.disasterStartTime.queryStartTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker> -
                  <el-date-picker
                    v-model="rangeStatisticsFormInline.disasterStartTime.queryEndTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="hanleStatisticsAreaClick" style="float: right; padding: 9px 46px;" size="small" icon="el-icon-share">统计</el-button>
              </div>
            </el-form>
          </div>
          <div class="areaContent">
            <div class="btn" style="overflow: hidden; min-width: 680px;">
              <el-button size="small" style="float: right; padding: 9px 30px; background: rgba(244,244,244,1);" @click="handleAreaExport">导出</el-button>
            </div>
            <div class="areaList">
              <el-table
                class="AreaTable"
                :data="areaStatisticsTableData"
                :key="100"
                v-loading="areaLoading"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF' }"
                :cell-style="{'padding': '0' }"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column prop="date" label="" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="受灾省名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type" label="受灾市名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="受灾县名称" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <!-- 灾害事件个数及灾情统计 -->
        <el-tab-pane label="灾害事件个数及灾情统计" name="third">
          <div class="stageBox eventsNumber" style="padding: 7px 32px 0">
            <el-form :inline="true" :model="eventsNumberFormInline" label-position="right" size="small" class="demo-form-inline">
              <!-- 第一行选择条件 -->
              <div class="firstSearch">
                <el-form-item label="受灾区域：">
                  <el-input v-model="eventsNumberFormInline.disasterKindIds" placeholder="" autocomplete="off"  @focus="handleFocusEventsNumber"></el-input>
                </el-form-item>
                <el-form-item label="灾情指标：">
                  <el-input v-model="disasterIndex" placeholder="" autocomplete="off" @focus="handleFocusDisasterIndex"></el-input>
                </el-form-item>
              </div>
              <!-- 第二行选择条件 -->
              <div class="secondSearch" style="min-width: 1600px;">
                <el-form-item  label="发生时间：">
                  <el-date-picker
                    v-model="eventsNumberFormInline.disasterStartTime.queryStartTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker> -
                  <el-date-picker
                    v-model="eventsNumberFormInline.disasterStartTime.queryEndTime"
                    type="datetime"
                    placeholder=""
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item  label="月份统计：">
                  <el-date-picker
                    v-model="eventsNumberFormInline.disasterStatMonth"
                    type="month"
                    placeholder=""
                    value-format="yyyy-MM">
                  </el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="hanleEventsNumberClick" style="float: right; padding: 9px 46px;" size="small" icon="el-icon-share">统计</el-button>
              </div>
            </el-form>
          </div>
          <div class="eventsNumberContent">
            <div class="btn" style="overflow: hidden; min-width: 680px;">
              <el-button size="small" style="float: right; padding: 9px 30px; background: rgba(244,244,244,1);" @click="handleEventsNumberaExport">导出</el-button>
            </div>
            <div class="eventsNumberList">
              <el-table
                :data="eventsNumberList.slice((eventsCurrentPage-1)*eventPageSize,eventsCurrentPage*eventPageSize)"
                :key="1222221"
                :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
                :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
                height="469px"
                v-loading="eventLoading"
                stripe
                border
                style="width: 100%; margin-top: 20px; min-header: 469px;">
                <el-table-column prop="areaName" label="区域" show-overflow-tooltip></el-table-column>
                <el-table-column prop="drought" label="干旱" show-overflow-tooltip></el-table-column>
                <el-table-column prop="snowDisaster" label="雪灾" show-overflow-tooltip></el-table-column>
                <el-table-column prop="storm" label="沙尘暴" show-overflow-tooltip></el-table-column>
                <el-table-column prop="landslide" label="滑坡" show-overflow-tooltip></el-table-column>
                <el-table-column prop="debrisFlow" label="泥石流" show-overflow-tooltip></el-table-column>
                <el-table-column prop="stormTide" label="风暴潮" show-overflow-tooltip></el-table-column>
                <el-table-column prop="tsunami" label="海啸" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ForestGrasslandFire" label="森林草原火灾" show-overflow-tooltip></el-table-column>
                <el-table-column prop="flood" label="洪涝" show-overflow-tooltip></el-table-column>
                <el-table-column prop="hailstorm" label="风雹" show-overflow-tooltip></el-table-column>
                <el-table-column prop="typhoon" label="台风" show-overflow-tooltip></el-table-column>
                <el-table-column prop="earthquake" label="地震" show-overflow-tooltip></el-table-column>
                <el-table-column prop="lowTemperatureFreezing" label="低温冷冻" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mountainCollapses" label="山体崩塌" show-overflow-tooltip></el-table-column>
                <el-table-column prop="biohazard" label="生物灾害" show-overflow-tooltip></el-table-column>
                <el-table-column prop="else" label="其他" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div style="text-align: center; margin-top: 40px;">
              <el-pagination
                background
                layout="prev, pager, next"
                prev-text="上一页"
                next-text="下一页"
                :current-page.sync="eventsCurrentPage"
                :page-size="eventPageSize"
                @current-change="handleEventsNumberCurrentChange"
                :total="eventsTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 阶段性 -->
      <!-- 灾种选择选择窗口 -->
      <minedOutAreaDialog :toMinedOutArea="stageMinedOutAreaObj" @toFather="getstageMinedOutArea" />
      <!-- 受灾区域选择窗口 -->
      <affectedAreaDialog :toAffectedArea="stageAffectedAreaObj" @toFather="getstageAffectedArea" />
      <!-- 受灾区域 -->
      <!-- 灾种选择选择窗口 -->
      <minedOutAreaDialog :toMinedOutArea="areaMinedOutAreaObj" @toFather="getareaMinedOutArea" />
      <!-- 灾害事件个数 -->
      <!-- 灾种区域选择窗口 -->
      <affectedAreaDialog :toAffectedArea="eventsNumberMinedOutAreaObj" @toFather="getEventsMinedOutArea" />
      <!-- 灾情指标选择窗口 -->
      <disasterIndexDialog :toDisasterIndexObj="disasterIndexObj" @toFather="getDisasterIndex" />
    </div>
  </div>
</template>

<script>
import { disasterReceived, areaStatistics, eventsNumber } from '@/api/DisasterStatistics/disasterStatistics'
// 灾种选择窗口组件
import minedOutAreaDialog from '@/components/DisasterLetters/minedOutAreaDialog'
// 受灾区域选择窗口组件
import affectedAreaDialog from '@/components/DisasterLetters/affectedAreaDialog'
// 灾情指标弹窗
import disasterIndexDialog from '@/components/DisasterStatistics/disasterIndexDialog'
export default {
  name: 'DisasterStatistics',
  components: {
    minedOutAreaDialog,
    affectedAreaDialog,
    disasterIndexDialog
  },
  data () {
    return {
      // tab切换控制
      activeName: 'first',
      // 阶段性灾情统计
      stageFormInline: {
        currentLevelNumber: 0, // 默认 （0代表中央级别）
        filterReviseDisaster: true, // 默认（修整数据）
        disasterKindIds: '', // 灾种选择
        subRelationIds: '', // 受灾区域
        disasterStartTime: { // 发生时间
          queryStartTime: null,
          queryEndTime: null
        },
        disasterStatMonth: null, // 月份统计
        searchLevelNumber: 1 // 查询范围 1代表省级
      },
      // 查询范围省市县
      options: [{ value: 1, label: '省级' }, { value: 2, label: '市级' }, { value: 3, label: '县级' }],
      // 阶段性灾情统计 tablist radioContent
      stageRadioContent: '受灾人口',
      // 阶段性灾情统计 tablist 选择
      radioList: [{
        value: '受灾人口',
        label: '受灾人口',
        icon: 'fa fa-address-book-o'
      }, {
        value: '农作物',
        label: '农作物',
        icon: 'fa fa-object-ungroup'
      }, {
        value: '房屋信息',
        label: '房屋信息',
        icon: 'fa fa-home'
      }, {
        value: '直接经济损失',
        label: '直接经济损失',
        icon: 'fa fa-money'
      }],
      // 阶段性灾情统计 受灾人口 列表数据
      affectedPopulationTableData: [],
      // 总页数
      stageTotal: 0,
      // 灾种选择受灾区域选择窗口数据（阶段性）
      stageMinedOutAreaObj: {
        minedOutAreaDialogVisible: false,
        tab: ''
      },
      // 受灾区域选择窗口数据（阶段性）
      stageAffectedAreaObj: {
        affectedAreaDialogVisible: false,
        tab: ''
      },
      // 灾种选择受灾区域选择窗口数据（区域）
      areaMinedOutAreaObj: {
        minedOutAreaDialogVisible: false
      },
      // 灾种选择受灾区域选择窗口数据（灾害事件个数）
      eventsNumberMinedOutAreaObj: {
        affectedAreaDialogVisible: false,
        tab: ''
      },
      // 灾情指标窗口数据
      disasterIndexObj: {
        disasterDialogVisible: false
      },
      // 受灾区域统计
      rangeStatisticsFormInline: {
        currentLevelNumber: 0, // 中央级别 0
        filterReviseDisaster: true, // 修正数据 传true
        disasterKindIds: '', // 灾种选择
        disasterStartTime: { // 发生时间
          queryStartTime: null,
          queryEndTime: null
        },
        disasterStatMonth: null // 月份统计
      },
      // 受灾统计 tableList
      areaStatisticsTableData: [
        {date: '受灾区域个数', name: '', type: '', status: ''},
        {date: '受灾区域', name: '', type: '', status: ''}
      ],
      // 灾害事件个数
      eventsNumberFormInline: {
        currentLevelNumber: 0, // 级别（0代表中央）
        filterReviseDisaster: true, // 修正数据 （传true）
        relationIds: ['2f8ae8904f5647c9b15661c85a7a822f'],
        disasterKindIds: '', // 灾种区域
        disasterStartTime: { // 发生时间
          queryStartTime: null,
          queryEndTime: null
        },
        disasterStatMonth: null // 月份统计
      },
      // 查询条件 灾情指标
      disasterIndex: '',
      // 灾情指标总条数
      eventsTotal: 0,
      // 灾害事件个数 table list
      eventsNumberList: [],
      // 阶段性灾情统计loading
      loading: false,
      // 受灾区域统计
      areaLoading: false,
      // 区域选择子组件传来的数组(阶段性)
      areaList: [],
      // 灾种选择子组件传来的数据(阶段性)
      minedList: [],
      // 灾种选择子组件传来的数据(受灾区域统计)
      minedStatisticsList: [],
      // 灾情指标传来的数据(事件个数)
      disasterArr: [],
      // 事件个数区域选择
      eventsAreaList: [],
      // 列表一页显示多少条
      pageSize: 12,
      // 当前页
      currentPage: 1,
      // 灾害事件个数及灾情统计
      eventPageSize: 12,
      // 当前页
      eventsCurrentPage: 1,
      // list loading
      eventLoading: false
    }
  },
  methods: {
    // tab 切换
    handleClick (tab, event) {
      if (tab.label === '阶段性灾情统计') {
        // 清空选项
        // this.stageFormInline = {
        //   currentLevelNumber: 0, // 默认 （0代表中央级别）
        //   filterReviseDisaster: true, // 默认（修整数据）
        //   disasterKindIds: '', // 灾种选择
        //   subRelationIds: '', // 受灾区域
        //   disasterStartTime: { // 发生时间
        //     queryStartTime: null,
        //     queryEndTime: null
        //   },
        //   disasterStatMonth: null, // 月份统计
        //   searchLevelNumber: 1 // 查询范围 1代表省级
        // }
        // console.log(this.stageFormInline)
      } else if (tab.label === '受灾区域统计') {
        // 清空选项
        // this.rangeStatisticsFormInline = {
        //   disasterKindIds: '', // 灾种选择
        //   disasterStartTime: { // 发生时间
        //     queryStartTime: null,
        //     queryEndTime: null
        //   },
        //   disasterStatMonth: null // 月份统计
        // }
        // this.getAreaStatistics()
        // console.log(this.rangeStatisticsFormInline)
      } else if (tab.label === '灾害事件个数及灾情统计') {
        // 清空选项
        // this.eventsNumberFormInline = {
        //   disasterKindIds: '', // 灾种选择
        //   disasterStartTime: { // 发生时间
        //     queryStartTime: null,
        //     queryEndTime: null
        //   },
        //   disasterStatMonth: null // 月份统计
        // }
        // console.log(this.eventsNumberFormInline)
      }
      // console.log(tab.label, event)
    },
    // 阶段性灾情统计列表 以及 统计按钮查询接口
    getDisasterReceived () {
      // let param = ''
      // let id = '2f8ae8904f5647c9b15661c85a7a822f'
      this.loading = true
      let params = {}
      // this.stageFormInline
      params.currentLevelNumber = this.stageFormInline.currentLevelNumber // 默认 （0代表中央级别）
      params.filterReviseDisaster = this.stageFormInline.filterReviseDisaster // 默认（修整数据）
      params.searchLevelNumber = this.stageFormInline.searchLevelNumber // 查询范围 1代表省级
      params.disaster = {
        disasterKindIds: [], // 选择的灾种（灾种的disasterKindId
        reviseStatMonth: this.stageFormInline.disasterStatMonth, // 月份统计
        disasterStartTime: this.stageFormInline.disasterStartTime // 发生时间
      }
      params.report = { creditionRelationIds: [], flowActionStatusIds: ['11113', '11115'] }
      params.disaster.relationIds = []
      // console.log(JSON.parse(sessionStorage.getItem('areaList')))
      // 区域选择处理
      if (this.stageFormInline.subRelationIds === '') {
        // 区域参数
        params.disaster.relationIds = []
        JSON.parse(sessionStorage.getItem('areaList')).map(i => {
          params.disaster.relationIds.push(i.creditionRelationId)
        })
      } else {
        // 处理数据
        params.disaster.relationIds = []
        let areaArr = this.stageFormInline.subRelationIds.split(',')
        JSON.parse(sessionStorage.getItem('areaList')).map(i => {
          areaArr.map(a => {
            if (a === i.civilRegionalism.civilRegionalismName) { params.disaster.relationIds.push(i.creditionRelationId) }
          })
        })
      }
      // 灾种处理
      if (this.stageFormInline.disasterKindIds === '') {
        params.disaster.disasterKindIds = []
      } else {
        params.disaster.disasterKindIds = this.minedList
      }
      disasterReceived(params).then(res => {
        // 数据第一级数组
        let datalist = []
        if (res.resultSet.subStageDisasterStats) {
          res.resultSet.subStageDisasterStats.map(item => {
            let obj = {}
            obj.areaName = item.areaName
            // 数据第二级数组
            let secondlist = []
            item.reportItemValues.map(i => {
              let objChild = {}
              if (i.indexItem.indexItemCode === 'A008') {
                objChild.affectedPopulation = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A009') {
                objChild.deaths = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A010') {
                objChild.missingPersons = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A012') {
                objChild.placeTransfer = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A015') {
                objChild.lifeRescue = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A020') {
                objChild.affectedArea = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A022') {
                objChild.bourgeonArea = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A026') {
                objChild.housesCollapsed = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A030') {
                objChild.housesDamaged = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A034') {
                objChild.housesGeneral = i.reportItemValue
                secondlist.push(objChild)
              } else if (i.indexItem.indexItemCode === 'A043') {
                objChild.directEconomic = i.reportItemValue
                secondlist.push(objChild)
              }
            })
            // 转接一下
            secondlist.map(i => {
              Object.assign(obj, i)
            })
            // 缺少的属性不齐
            var OBJ = {
              affectedPopulation: '0',
              deaths: '0',
              missingPersons: '0',
              placeTransfer: '0',
              lifeRescue: '0',
              affectedArea: '0',
              bourgeonArea: '0',
              housesCollapsed: '0',
              housesDamaged: '0',
              housesGeneral: '0',
              directEconomic: '0'
            }
            // 不存在该属性 补为OBJ的属性值
            Object.keys(OBJ).forEach(key => {
              if (obj[key] === undefined) {
                obj[key] = '0'
              }
            })
            datalist.push(obj)
          })
        }
        // 列表数据
        this.affectedPopulationTableData = datalist
        // 总条数
        this.stageTotal = datalist.length
        this.loading = false
        // console.log('开始数据', res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 阶段性 统计按钮
    hanleStatisticsClick () {
      this.getDisasterReceived()
      // console.log('统计', this.stageFormInline)
    },
    // 阶段性灾情统计 change list tab
    handleChangeValue (val) {
      this.stageRadioContent = val
      // console.log(val)
    },
    // 阶段性 导出按钮
    handleStageExport () {
      // console.log('导出')
    },
    // 阶段性灾情统计 当前页
    handleCurrentChange (val) {
      this.currentPage = val
      // console.log(`当前页: ${val}`)
    },
    // 受灾区域统计 按钮
    hanleStatisticsAreaClick () {
      this.getAreaStatistics()
      // console.log('受灾区域统计')
    },
    // 受灾区域统计列表数据以及统计按钮接口查询
    getAreaStatistics () {
      let params = {}
      // 中央级别
      params.currentLevelNumber = this.rangeStatisticsFormInline.currentLevelNumber
      // 修正数据
      params.filterReviseDisaster = this.rangeStatisticsFormInline.filterReviseDisaster
      // 必传项
      params.report = {flowActionStatusIds: ['11113', '11115']}
      params.disaster = {}
      // 受灾区域默认全部
      params.disaster.relationIds = []
      JSON.parse(sessionStorage.getItem('areaList')).map(i => {
        params.disaster.relationIds.push(i.creditionRelationId)
      })
      // 发生时间
      if (this.rangeStatisticsFormInline.disasterStartTime.queryStartTime === null && this.rangeStatisticsFormInline.disasterStartTime.queryEndtTime === null) {
        params.disaster.disasterStartTime = {}
      } else {
        params.disaster.disasterStartTime = this.rangeStatisticsFormInline.disasterStartTime
      }
      // 统计月份
      if (this.rangeStatisticsFormInline.disasterStatMonth === null) {
        // reviseStatMonth: "2019-06"
      } else {
        params.disaster.reviseStatMonth = this.rangeStatisticsFormInline.disasterStatMonth
      }
      // 灾种选择
      if (this.rangeStatisticsFormInline.disasterKindIds === '') {
        params.disaster.disasterKindIds = []
        // disasterKindIds
      } else {
        params.disaster.disasterKindIds = this.minedStatisticsList
      }
      // 处理loading
      this.areaLoading = true
      areaStatistics(params).then(res => {
        // areaStatisticsTableData[0]
        // 受灾省个数
        if (res.resultSet && JSON.stringify(res.resultSet) !== '{}') {
          this.areaStatisticsTableData[0].name = res.resultSet.disasterAreaStat.areaCount
          // 受灾市的个数
          this.areaStatisticsTableData[0].type = res.resultSet.disasterAreaStat.disasterAreaStat.areaCount
          // 受灾县的个数
          this.areaStatisticsTableData[0].status = res.resultSet.disasterAreaStat.disasterAreaStat.disasterAreaStat.areaCount
          // 受灾省名称
          let provinces = []
          res.resultSet.disasterAreaStat.civilRegionalismStats.map(item => {
            provinces.push(item.civilRegionalismName)
          })
          this.areaStatisticsTableData[1].name = provinces.join(',')
          // 受灾市名称
          let cities = []
          res.resultSet.disasterAreaStat.disasterAreaStat.civilRegionalismStats.map(item => {
            cities.push(item.civilRegionalismName)
          })
          this.areaStatisticsTableData[1].type = cities.join(',')
          // 受灾县名称
          let counties = []
          res.resultSet.disasterAreaStat.disasterAreaStat.disasterAreaStat.civilRegionalismStats.map(item => {
            counties.push(item.civilRegionalismName)
          })
          this.areaStatisticsTableData[1].status = counties.join(',')
        } else {
          this.areaStatisticsTableData = [
            {date: '受灾区域个数', name: '0', type: '0', status: '0'},
            {date: '受灾区域', name: '', type: '', status: ''}
          ]
        }
        this.areaLoading = false
        // console.log('受灾区域数据', res)
      }).catch(err => {
        this.areaLoading = false
        console.log(err)
      })
    },
    // 灾种组件传来的数据(阶段性)
    getstageMinedOutArea (data) {
      let toFatherInputValue = []
      this.minedList = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.disasterKindId) {
            toFatherInputValue.push(i.disasterKindName)
          }
        })
      })
      this.stageFormInline.disasterKindIds = toFatherInputValue.join(',')
      // this.stageFormInline.disasterKindIds = data.join(',')
      // this.minedOutAreaObj.minedOutAreaDialogVisible = false
      this.minedList = data.inputArr
      // console.log(data, this.stageFormInline.disasterKindIds)
    },
    // 受灾区域传来的数据(阶段性)
    getstageAffectedArea (data) {
      if (this.activeName === 'first') {
        let toFatherInputValue = []
        this.areaList = []
        data.inputArr.map(a => {
          data.list.map((i, iIndex) => {
            if (a === i.creditionRelationId) {
              toFatherInputValue.push(i.civilRegionalism.civilRegionalismName)
            }
          })
        })
        this.stageFormInline.subRelationIds = toFatherInputValue.join(',')
        // 区域选择的数组
        this.areaList = data.inputArr
        // console.log('受灾区域传来的数据', data, this.stageFormInline.subRelationIds)
      }
    },
    // 灾种组件传来的数据(受灾区域)
    getareaMinedOutArea (data) {
      let toFatherInputValue = []
      this.minedStatisticsList = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.disasterKindId) {
            toFatherInputValue.push(i.disasterKindName)
          }
        })
      })
      this.rangeStatisticsFormInline.disasterKindIds = toFatherInputValue.join(',')
      // this.rangeStatisticsFormInline.disasterKindIds = data.join(',')
      // this.minedOutAreaObj.minedOutAreaDialogVisible = false
      this.minedStatisticsList = data.inputArr
      // console.log(data, this.rangeStatisticsFormInline.disasterKindIds)
    },
    // 灾种组件传来的数据(灾害事件个数)
    getEventsMinedOutArea (data) {
      let toFatherInputValue = []
      this.eventsAreaList = []
      data.inputArr.map(a => {
        data.list.map((i, iIndex) => {
          if (a === i.creditionRelationId) {
            toFatherInputValue.push(i.civilRegionalism.civilRegionalismName)
          }
        })
      })
      this.eventsNumberFormInline.disasterKindIds = toFatherInputValue.join(',')
      this.eventsAreaList = data.inputArr
      // this.eventsNumberFormInline.disasterKindIds = data.join(',')
      // console.log(data, this.eventsNumberFormInline.disasterKindIds)
    },
    // 灾情指标传来的数据
    getDisasterIndex (data) {
      this.disasterIndex = data.inputValue
      this.disasterArr = data.reportItemValues
      // console.log('灾情指标传来的数据', data)
    },
    // 阶段性 灾种选择
    handleFocusMinedOutArea (e) {
      this.stageMinedOutAreaObj.minedOutAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 阶段性 受灾区域选择
    handleFocusAffectedArea (e) {
      this.stageAffectedAreaObj.affectedAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 区域统计 灾种选择按钮
    handleFocusArea (e) {
      this.areaMinedOutAreaObj.minedOutAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 区域统计 合计
    getAreaSummaries ({ columns, data }) {
      // console.log('11111', { columns, data })
    },
    // 区域统计 导出按钮
    handleAreaExport () {
      // console.log('区域统计导出按钮')
    },
    // 灾害事件个数 统计按钮
    hanleEventsNumberClick () {
      this.getEventsNumber()
      // console.log('灾害事件个数统计')
    },
    // 灾害事件个数统计接口数据
    getEventsNumber () {
      let params = {}
      // 级别（0代表中央）
      params.currentLevelNumber = this.eventsNumberFormInline.currentLevelNumber
      // 修正数据 （传true）
      params.filterReviseDisaster = this.eventsNumberFormInline.filterReviseDisaster
      params.disaster = {}
      params.disaster.relationIds = this.eventsNumberFormInline.relationIds
      params.report = {
        flowActionStatusIds: ['11113', '11115'] // 1113代表已接受 1115代表修正数据
      }
      // 区域选择处理
      if (this.eventsNumberFormInline.disasterKindIds === '') {
        // 区域参数
        params.report.creditionRelationIds = []
        JSON.parse(sessionStorage.getItem('areaList')).map(i => {
          params.report.creditionRelationIds.push(i.creditionRelationId)
        })
      } else {
        // 处理数据
        params.report.creditionRelationIds = this.eventsAreaList
      }
      // 发生时间
      if (this.eventsNumberFormInline.disasterStartTime.queryStartTime === null && this.eventsNumberFormInline.disasterStartTime.queryEndTime === null) {
        params.disaster.disasterStartTime = {}
      } else {
        params.disaster.disasterStartTime = this.eventsNumberFormInline.disasterStartTime
      }
      // 月份统计
      if (this.eventsNumberFormInline.disasterStatMonth === null) {} else {
        params.disaster.reviseStatMonth = this.eventsNumberFormInline.disasterStatMonth
      }
      // 灾情指标
      if (this.disasterIndex === '') {} else {
        params.report.reportItemValues = this.disasterArr
      }
      // 级别省份
      // params.searchLevelNumber = this.stageFormInline.searchLevelNumber
      this.eventLoading = true
      eventsNumber(params).then(res => {
        this.eventsNumberList = []
        if (res.resultSet) {
          res.resultSet.map(item => {
            let obj = {}
            obj.areaName = item.areaName
            // 第二级数据数组
            let secondList = []
            if (item.disasterCountStats) {
              item.disasterCountStats.map(i => {
                let objChild = {}
                if (i.disasterName === '干旱') {
                  objChild.drought = i.statCount
                } else if (i.disasterName === '雪灾') {
                  objChild.snowDisaster = i.statCount
                } else if (i.disasterName === '沙尘暴') {
                  objChild.storm = i.statCount
                } else if (i.disasterName === '滑坡') {
                  objChild.landslide = i.statCount
                } else if (i.disasterName === '泥石流') {
                  objChild.debrisFlow = i.statCount
                } else if (i.disasterName === '风暴潮') {
                  objChild.stormTide = i.statCount
                } else if (i.disasterName === '海啸') {
                  objChild.tsunami = i.statCount
                } else if (i.disasterName === '森林草原火灾') {
                  objChild.ForestGrasslandFire = i.statCount
                } else if (i.disasterName === '洪涝') {
                  objChild.flood = i.statCount
                } else if (i.disasterName === '风雹') {
                  objChild.hailstorm = i.statCount
                } else if (i.disasterName === '台风') {
                  objChild.typhoon = i.statCount
                } else if (i.disasterName === '地震') {
                  objChild.earthquake = i.statCount
                } else if (i.disasterName === '低温冷冻') {
                  objChild.lowTemperatureFreezing = i.statCount
                } else if (i.disasterName === '山体崩塌') {
                  objChild.mountainCollapses = i.statCount
                } else if (i.disasterName === '生物灾害') {
                  objChild.biohazard = i.statCount
                } else if (i.disasterName === '其他') {
                  objChild.else = i.statCount
                }
                secondList.push(objChild)
              // console.log('2222222', secondList)
              })
            }
            // 转接一下
            secondList.map(i => {
              Object.assign(obj, i)
            })
            // // 缺少的属性不齐
            var OBJ = {
              drought: '0',
              snowDisaster: '0',
              storm: '0',
              landslide: '0',
              debrisFlow: '0',
              stormTide: '0',
              tsunami: '0',
              ForestGrasslandFire: '0',
              flood: '0',
              hailstorm: '0',
              typhoon: '0',
              earthquake: '0',
              lowTemperatureFreezing: '0',
              mountainCollapses: '0',
              biohazard: '0',
              else: '0'
            }
            // 不存在该属性 补为OBJ的属性值
            Object.keys(OBJ).forEach(key => {
              if (obj[key] === undefined) {
                obj[key] = '0'
              }
            })
            this.eventsNumberList.push(obj)
          })
        }
        this.eventLoading = false
        // 总条数
        this.eventsTotal = this.eventsNumberList.length
        // console.log('灾害事件个数', res, this.eventsNumberList)
      }).catch(err => {
        this.eventLoading = false
        console.log(err)
      })
    },
    // 灾害事件个数 灾种区域
    handleFocusEventsNumber (e) {
      this.eventsNumberMinedOutAreaObj.affectedAreaDialogVisible = true
      // console.log(e, '获取焦点')
    },
    // 灾害事件个数 导出按钮
    handleEventsNumberaExport () {
      // console.log('灾害事件个数导出')
    },
    // 灾害事件个数 分页
    handleEventsNumberCurrentChange (val) {
      this.eventsCurrentPage = val
      // console.log(`当前页: ${val}`)
    },
    // 灾害事件个数 灾情指标弹窗focus出现
    handleFocusDisasterIndex (e) {
      this.disasterIndexObj.disasterDialogVisible = true
      // console.log(e)
    }
  },
  filters: {
    number (val) {
      return parseFloat(val).toFixed(2)
    }
  },
  mounted () {
    // 统计列表数据
    this.getDisasterReceived()
    // 受灾区域统计
    // this.getAreaStatistics()
    // 灾害事件个数及灾情统计
    this.getEventsNumber()
  }
}
</script>

<style scoped>
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(2) {
  height: 460px;
  background:#FFFFFF;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(2) td:first-child {
  background: #F5F5F5;
  font-weight: 600;
  text-align: center;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(2) td .el-tooltip {
  padding-top: 20px;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(2) td:first-child .el-tooltip {
  line-height: 460px;
  padding-top: 0;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(2) td .el-tooltip {
  height: 460px;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(1) {
  height: 48px;
  background:rgba(245,245,245,1);
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(1) td {
  background: #e0efff;
  text-align: center;
}
.areaContent .areaList /deep/ .el-table--enable-row-transition .el-table__body tr:nth-child(1) td:first-child {
  background: #F5F5F5;
  font-weight: 600;
}
.areaContent .areaList /deep/ .el-table--enable-row-hover .el-table__body tr:first-child:hover > td {
  background: #e0efff;
}
.areaContent .areaList /deep/ .el-table--enable-row-hover .el-table__body tr:first-child:hover > td:first-child {
  background: #F5F5F5;
}
.areaContent .areaList /deep/ .el-table--enable-row-hover .el-table__body tr:nth-child(2):hover > td {
  background: #FFFFFF;
}
.areaContent .areaList /deep/ .el-table--enable-row-hover .el-table__body tr:nth-child(2):hover > td:first-child {
  background: #F5F5F5;
}
.areaContent /deep/ .el-table .cell.el-tooltip {
  white-space: normal;
}
.areaContent /deep/ .el-table .cell {
  overflow: auto;
}
.areaStatistics /deep/ .el-date-editor.el-input {
  width: 600px;
}
.stageContent,.areaContent,.eventsNumberContent {
  padding: 20px 32px;
  background: #FFFFFF;
}
.stageContent /deep/ .el-pagination.is-background .btn-prev {
    padding-left: 10px;
    padding-right: 10px;
}
.stageContent /deep/ .el-pagination.is-background .btn-next {
    padding-left: 10px;
    padding-right: 10px;
}

.areaContent /deep/ .el-pagination.is-background .btn-prev {
    padding-left: 10px;
    padding-right: 10px;
}
.areaContent /deep/ .el-pagination.is-background .btn-next {
    padding-left: 10px;
    padding-right: 10px;
}
.eventsNumberContent /deep/ .el-pagination.is-background .btn-prev {
    padding-left: 10px;
    padding-right: 10px;
}
.eventsNumberContent /deep/ .el-pagination.is-background .btn-next {
    padding-left: 10px;
    padding-right: 10px;
}
.stageContent .switchOver {
  text-align: center;
}
.stageBox .secondSearch /deep/ .el-form-item--small:nth-child(1) .el-date-editor.el-input {
  width: 294px;
}
.stageBox .secondSearch /deep/ .el-form-item--small {
  margin-right: 40px;
}
.stageBox .secondSearch /deep/ .el-form-item--small:nth-child(2) {
  margin-right: 78px;
}
.stageBox .firstSearch,.secondSearch {
  white-space: nowrap;
}
.stageBox .firstSearch /deep/ .el-form-item--small .el-form-item__content {
  width: 600px;
}
.stageBox .firstSearch /deep/ .el-form-item--small {
  margin-right: 40px;
}
.DisasterStatistics {
  overflow: hidden;
}
.tab {
  background: #ECEAEA;
  padding: 20px 0 0 0;
  text-align: left;
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #ECEAEA;
  color:rgba(51,51,51,1);
  font-weight: 600;
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  background: #FFFFFF;
  color: rgb(185, 189, 195);
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #ECEAEA;
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-radius: 5px 0px 0px 0px;
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
  border-radius: 0px 0px 5x 0px;
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid rgba(193,193,193,1);
  margin-left: 32px;
}
.tab /deep/ .el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid rgba(193,193,193,1);
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left: 1px solid rgba(193,193,193,1);
}
.tab /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-left: 0;
}
</style>
<style>
.areaContent .el-table--border:after {
  background-color: #B8D0EA;
}
.areaContent .el-table--group:after {
  background-color: #B8D0EA;
}
.areaContent .el-table:before {
  background-color: #B8D0EA;
}
.areaContent .el-table--border {
  border-color: #B8D0EA;
}
.areaContent .el-table--group {
  border-color: #B8D0EA;
}
.areaContent .el-table td {
  border-bottom: 1px solid #B8D0EA;
}
.areaContent  .el-table th.is-leaf {
  border-bottom: 1px solid #B8D0EA;
}
.areaContent .el-table--border th {
  border-bottom: 1px solid #B8D0EA;
}
.areaContent .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #B8D0EA;
}
.areaContent .el-table--border td {
  border-right: 1px solid #B8D0EA;
}
.areaContent .el-table--border th {
  border-right: 1px solid #B8D0EA;
}
</style>
