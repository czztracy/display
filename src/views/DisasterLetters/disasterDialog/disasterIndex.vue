<template>
  <div class="disasterIndex">
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
      <!-- 主要指标 -->
      <el-table
        :data="tableData"
        :key="1"
        v-if="radioContent === '主要指标'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        class="tableList"
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
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- :class="scope.row.foldBool ? 'fa fa-folder-open' : 'fa fa-folder'" -->
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="受灾人口">
          <el-table-column
            prop="hitPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡人口">
          <el-table-column
            prop="deathPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.deathPeople }}<el-button size="mini" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, `[ ${scope.row.area} ] - 因灾死亡人口`)">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾失踪人口">
          <el-table-column
            prop="missPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.missPeople }}<el-button size="mini" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, `[ ${scope.row.area} ] - 因灾失踪人口`)">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="紧急转移安置人口">
          <el-table-column
            prop="transferPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需紧急生活救助人口">
          <el-table-column
            prop="bailoutPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因旱需生活救助人口">
          <el-table-column
            prop="droughtPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：因旱饮水困难救助人口">
          <el-table-column
            prop="droughtDrinkWaterPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="农作物受灾面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropDamage | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农作物绝收面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropFailure | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="饮水困难大牲畜">
          <el-table-column
            prop="livestock"
            label="头只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="倒塌房屋间数">
          <el-table-column
            prop="housesCollapsed"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋间数">
          <el-table-column
            prop="badlyDamaged"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋间数">
          <el-table-column
            prop="generalDamage"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="直接经济损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.directEconomicLoss | number }} </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 受灾人口 -->
      <el-table
        :data="tableData"
        :key="2"
        v-if="radioContent === '受灾人口'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
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
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="受灾人口">
          <el-table-column
            prop="hitPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡人口">
          <el-table-column
            prop="deathPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.deathPeople }}<el-button size="mini" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, '因灾死亡人口')">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾失踪人口">
          <el-table-column
            prop="missPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.missPeople }}<el-button size="mini" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, '因灾失踪人口')">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾伤病人口">
          <el-table-column
            prop="woundPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="紧急转移安置人口">
          <el-table-column
            prop="transferPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="集中安置人口">
          <el-table-column
            prop="centralizedSettlement"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="分散安置人口">
          <el-table-column
            prop="scatteredPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需紧急生活救助人口">
          <el-table-column
            prop="bailoutPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需过渡性救助人口">
          <el-table-column
            prop="transitivityPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因旱需生活救助人口">
          <el-table-column
            prop="droughtPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：因旱饮水困难救助人口">
          <el-table-column
            prop="droughtDrinkWaterPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被困人口">
          <el-table-column
            prop="getTrappedPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 农作物牲畜 -->
      <el-table
        :data="tableData"
        :key="3"
        v-if="radioContent === '农作物牲畜'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="农作物受灾面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropDamage | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农作物成灾面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.causeDisaster | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农作物绝收面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropFailure | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="草场受灾面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.thePastures | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="毁坏耕地面积">
          <el-table-column
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.destroyLand | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="饮水困难大牲畜">
          <el-table-column
            prop="livestock"
            label="头只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡大牲畜">
          <el-table-column
            prop="theDeathlivestock"
            label="头只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡羊只">
          <el-table-column
            prop="theDeathSheep"
            label="只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 倒塌房屋 -->
      <el-table
        :data="tableData"
        :key="4"
        v-if="radioContent === '倒塌房屋'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="倒塌房屋间数">
          <el-table-column
            prop="housesCollapsed"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：倒塌农房间数">
          <el-table-column
            prop="theFarmhouse"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="倒塌房屋户数">
          <el-table-column
            prop="houseNumber"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：倒塌农房户数">
          <el-table-column
            prop="farmhouseDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋间数">
          <el-table-column
            prop="badlyDamaged"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：严重损坏农房间数">
          <el-table-column
            prop="seriousFarmRoom"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋户数">
          <el-table-column
            prop="badlyDamagedDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：严重损坏农房户数">
          <el-table-column
            prop="seriousFarmDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋间数">
          <el-table-column
            prop="generalDamage"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：一般损坏农房间数">
          <el-table-column
            prop="generalFarmRoom"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋户数">
          <el-table-column
            prop="damageRoomDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：一般损坏农房户数">
          <el-table-column
            prop="inDamageRoomDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 直接经济损失 -->
      <el-table
        :data="tableData"
        :key="5"
        v-if="radioContent === '直接经济损失'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        height="574"
        stripe
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="直接经济损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.directEconomicLoss | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农业损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.agriculturalLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="工矿企业损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.enterprisesLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="基础设施损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.infrastructureLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="公益设施损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.publicLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="家庭财产损失">
          <el-table-column
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.familyLosses | number }} </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 特征指标 -->
      <el-table
        :data="tableData"
        :key="6"
        v-if="radioContent === '特征指标'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
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
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="台风编号">
          <el-table-column
            prop="typhoonNumber"
            label="年/号"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="地震震级">
          <el-table-column
            prop="earthquake"
            label="里氏级"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹城区">
          <el-table-column
            prop="submergedCityship"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹镇区">
          <el-table-column
            prop="submergedTownship"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹乡村">
          <el-table-column
            prop="floodedCountry"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 时间灾种区域 -->
      <el-table
        :data="tableData"
        :key="7"
        v-if="radioContent === '时间灾种区域'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        height="574"
        stripe
        lazy
        :load="handleLoadMainIndex"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="灾种名称">
          <el-table-column
            prop="minedoutArea"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="灾害发生时间">
          <el-table-column
            prop="startTime"
            label="年-月-日 时：分：秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="灾害结束时间">
          <el-table-column
            prop="endTime"
            label="年-月-日 时：分：秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column> -->
        <el-table-column label="灾害统计月">
          <el-table-column
            prop="sticMonth"
            label="年-月-日"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受灾区域信息">
          <el-table-column
            prop="areaInfor"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini"  v-if="scope.row.hasChildren"
                @click="handleLookOver(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 倒房台账 -->
      <el-table
        :data="tableData"
        :key="8"
        v-if="radioContent === '倒房台账'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
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
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.hasChildren" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="因灾倒塌损坏住房户一览表">
          <el-table-column
            prop="housesCollapsedList"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下载查看">
          <el-table-column
            prop="name"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受灾人员灾后政府救助一览表">
          <el-table-column
            prop="governmentRescue"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下载查看">
          <el-table-column
            prop="name"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 时间灾种区域 查看弹窗 -->
      <el-dialog
        v-dialogDrag
        title="受灾区域信息"
        :visible.sync="areaDialogVisible"
        :close-on-press-escape="false"
        class="area"
        width="860px"
        append-to-body>
        <div class="dialogBox" style="height: 378px; overflow: auto;">
          <div v-if="citiesVisible">
            <p class="areaTilte">市[ {{ cityNum }} ]：</p>
            <p class="areaText">{{ cities }}</p>
          </div>
          <div v-if="countiesVisible">
            <p class="areaTilte">县[ {{ countyNum }} ]：</p>
            <p class="areaText">{{ counties }}</p>
          </div>
          <div v-if="townsVisible">
            <p class="areaTilte">乡镇[ {{ townNum }} ]：</p>
            <p class="areaText">{{ towns }}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="areaDialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 主要指标/受灾人口 台账弹窗 -->
      <el-dialog
        v-dialogDrag
        :title="`${this.DISASTERBULLETINTITLE}`"
        :visible.sync="ledgerDialogVisible"
        :close-on-press-escape="false"
        class="area"
        width="1200px"
        append-to-body>
        <div class="dialogBox">
          <el-table
            :data="ledgerTableData"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
            ref="multipleTable"
            tooltip-effect="dark"
            v-loading="leadgerLoading"
            @selection-change="handleSelectionChange"
            style="width: 100%;"
            height="544px"
            border
            stripe>
            <el-table-column
              label="选择"
              type="selection"
              width="60px"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="60px"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column :label=" DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡人员情况' : '失踪人员情况' ">
              <el-table-column prop="value1"
                label="姓名"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value2"
                label="性别"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value3"
                label="年龄"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value4"
                label="民族"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value5"
                label="户口所在地"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value6"
                label="身份证号"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value7"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡地点' : '失踪地点' "
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value8"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡时间' : '失踪时间' "
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value9"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡原因' : '失踪原因' "
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value10"
                label="灾害种类"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value12"
                label="抚慰金发放金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value13"
                label="抚慰金发放形式"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value14"
                label="领款人姓名"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value15"
                label="领款人身份证号"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value16"
                label="领款人住址"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value17"
                :label=" DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '与死亡人员关系' : '与失踪人员关系' "
                show-overflow-tooltip>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="value11"
              label="备注"
              width="160"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="margin-bottom: 10px;" size="small" @click="handleLedgerExport">导 出</el-button><br />
          <el-button size="small" @click="ledgerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-else-if="disasterStandard === '标准'">
      <!-- 主要指标 -->
      <el-table
        :data="tableData"
        :key="111"
        v-if="radioContent === '主要指标'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        v-loading="loading"
        class="tableList"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- :class="scope.row.foldBool ? 'fa fa-folder-open' : 'fa fa-folder'" -->
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="受灾人口">
          <el-table-column
            prop="hitPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡人口">
          <el-table-column
            prop="deathPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.deathPeople }}<el-button size="mini" v-if="scope.row.reportId !== '' && scope.row.pid !== ''" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, `[ ${scope.row.area} ] - 因灾死亡人口`)">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾失踪人口">
          <el-table-column
            prop="missPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
               {{ scope.row.missPeople }}<el-button size="mini" v-if="scope.row.reportId !== '' && scope.row.pid !== ''" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, `[ ${scope.row.area} ] - 因灾失踪人口`)">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="紧急转移安置人口">
          <el-table-column
            prop="transferPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需紧急生活救助人口">
          <el-table-column
            prop="bailoutPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因旱需生活救助人口">
          <el-table-column
            prop="droughtPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：因旱饮水困难救助人口">
          <el-table-column
            prop="droughtDrinkWaterPeople"
            label="人"
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
        <el-table-column label="其中：农作物绝收面积">
          <el-table-column
            prop="cropFailure"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropFailure | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="饮水困难大牲畜">
          <el-table-column
            prop="livestock"
            label="头只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="倒塌房屋间数">
          <el-table-column
            prop="housesCollapsed"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋间数">
          <el-table-column
            prop="badlyDamaged"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋间数">
          <el-table-column
            prop="generalDamage"
            label="间"
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
      </el-table>
      <!-- 受灾人口 -->
      <el-table
        :data="tableData"
        :key="22222"
        v-if="radioContent === '受灾人口'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="受灾人口">
          <el-table-column
            prop="hitPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡人口">
          <el-table-column
            prop="deathPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.deathPeople }}<el-button size="mini" v-if="scope.row.reportId !== '' && scope.row.pid !== ''" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, '因灾死亡人口')">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾失踪人口">
          <el-table-column
            prop="missPeople"
            label="人"
            width="140"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.missPeople }}<el-button size="mini" v-if="scope.row.reportId !== '' && scope.row.pid !== ''" style="margin-left: 12px;" @click="handleStandingBook(scope.$index, scope.row, '因灾失踪人口')">台账</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾伤病人口">
          <el-table-column
            prop="woundPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="紧急转移安置人口">
          <el-table-column
            prop="transferPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="集中安置人口">
          <el-table-column
            prop="centralizedSettlement"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="分散安置人口">
          <el-table-column
            prop="scatteredPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需紧急生活救助人口">
          <el-table-column
            prop="bailoutPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需过渡性救助人口">
          <el-table-column
            prop="transitivityPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因旱需生活救助人口">
          <el-table-column
            prop="droughtPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：因旱饮水困难救助人口">
          <el-table-column
            prop="droughtDrinkWaterPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被困人口">
          <el-table-column
            prop="getTrappedPeople"
            label="人"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 农作物牲畜 -->
      <el-table
        :data="tableData"
        :key="333333"
        v-if="radioContent === '农作物牲畜'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="农作物受灾面积">
          <el-table-column
            prop="cropDamage"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropDamage | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农作物成灾面积">
          <el-table-column
            prop="causeDisaster"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.causeDisaster | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农作物绝收面积">
          <el-table-column
            prop="cropFailure"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.cropFailure | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="草场受灾面积">
          <el-table-column
            prop="thePastures"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.thePastures | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="毁坏耕地面积">
          <el-table-column
            prop="destroyLand"
            label="公顷"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.destroyLand | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="饮水困难大牲畜">
          <el-table-column
            prop="livestock"
            label="头只"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.livestock | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡大牲畜">
          <el-table-column
            prop="theDeathlivestock"
            label="头只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="因灾死亡羊只">
          <el-table-column
            prop="theDeathSheep"
            label="只"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 倒塌房屋 -->
      <el-table
        :data="tableData"
        :key="44444"
        v-if="radioContent === '倒塌房屋'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="倒塌房屋间数">
          <el-table-column
            prop="housesCollapsed"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：倒塌农房间数">
          <el-table-column
            prop="theFarmhouse"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="倒塌房屋户数">
          <el-table-column
            prop="houseNumber"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：倒塌农房户数">
          <el-table-column
            prop="farmhouseDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋间数">
          <el-table-column
            prop="badlyDamaged"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：严重损坏农房间数">
          <el-table-column
            prop="seriousFarmRoom"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="严重损坏房屋户数">
          <el-table-column
            prop="badlyDamagedDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：严重损坏农房户数">
          <el-table-column
            prop="seriousFarmDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋间数">
          <el-table-column
            prop="generalDamage"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：一般损坏农房间数">
          <el-table-column
            prop="generalFarmRoom"
            label="间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="一般损坏房屋户数">
          <el-table-column
            prop="damageRoomDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：一般损坏农房户数">
          <el-table-column
            prop="inDamageRoomDoor"
            label="户"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 直接经济损失 -->
      <el-table
        :data="tableData"
        :key="566666"
        v-if="radioContent === '直接经济损失'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        height="574"
        stripe
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="直接经济损失">
          <el-table-column
            prop="directEconomicLoss"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.directEconomicLoss | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中：农业损失">
          <el-table-column
            prop="agriculturalLosses"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.agriculturalLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="工矿企业损失">
          <el-table-column
            prop="enterprisesLosses"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.enterprisesLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="基础设施损失">
          <el-table-column
            prop="infrastructureLosses"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.infrastructureLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="公益设施损失">
          <el-table-column
            prop="publicLosses"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.publicLosses | number }} </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="家庭财产损失">
          <el-table-column
            prop="familyLosses"
            label="万元"
            show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.familyLosses | number }} </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 特征指标 -->
      <el-table
        :data="tableData"
        :key="666666"
        v-if="radioContent === '特征指标'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="台风编号">
          <el-table-column
            prop="typhoonNumber"
            label="年/号"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="地震震级">
          <el-table-column
            prop="earthquake"
            label="里氏级"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹城区">
          <el-table-column
            prop="submergedCityship"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹镇区">
          <el-table-column
            prop="submergedTownship"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受淹乡村">
          <el-table-column
            prop="floodedCountry"
            label=""
            sortable>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 时间灾种区域 -->
      <el-table
        :data="tableData"
        :key="777777"
        v-if="radioContent === '时间灾种区域'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        height="574"
        stripe
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          prop="date"
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="灾种名称">
          <el-table-column
            prop="minedoutArea"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="灾害发生时间">
          <el-table-column
            prop="startTime"
            label="年-月-日 时：分：秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="灾害结束时间">
          <el-table-column
            prop="endTime"
            label="年-月-日 时：分：秒"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column> -->
        <el-table-column label="灾害统计月">
          <el-table-column
            prop="sticMonth"
            label="年-月-日"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受灾区域信息">
          <el-table-column
            prop="areaInfor"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini" v-if="scope.row.hasChildren"
                @click="handleLookOver(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 倒房台账 -->
      <el-table
        :data="tableData"
        :key="88888888"
        v-if="radioContent === '倒房台账'"
        :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
        :cell-style="{'text-align': 'left', 'padding': '6px 0'}"
        style="width: 100%"
        row-key="id"
        border
        stripe
        height="574"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="handleTreeExpand">
        <el-table-column
          label="行政区划"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-folder" v-if="scope.row.children && scope.row.children.length > 0" style="margin-right: 8px; font-size: 18px; color: #29378F;"></i>{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column label="因灾倒塌损坏住房户一览表">
          <el-table-column
            prop="housesCollapsedList"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下载查看">
          <el-table-column
            prop="name"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="受灾人员灾后政府救助一览表">
          <el-table-column
            prop="governmentRescue"
            label=""
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下载查看">
          <el-table-column
            prop="name"
            label="">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 时间灾种区域 查看弹窗 -->
      <el-dialog
        v-dialogDrag
        title="受灾区域信息"
        :visible.sync="areaDialogVisible"
        :close-on-press-escape="false"
        class="area"
        width="860px"
        append-to-body>
        <div class="dialogBox" style="height: 378px; overflow: auto;">
          <div v-if="citiesVisible">
            <p class="areaTilte">市[ {{ cityNum }} ]：</p>
            <p class="areaText">{{ cities }}</p>
          </div>
          <div v-if="countiesVisible">
            <p class="areaTilte">县[ {{ countyNum }} ]：</p>
            <p class="areaText">{{ counties }}</p>
          </div>
          <div v-if="townsVisible">
            <p class="areaTilte">乡镇[ {{ townNum }} ]：</p>
            <p class="areaText">{{ towns }}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="areaDialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 主要指标/受灾人口 台账弹窗 -->
      <el-dialog
        v-dialogDrag
        :title="`${this.DISASTERBULLETINTITLE}`"
        :visible.sync="ledgerDialogVisible"
        :close-on-press-escape="false"
        class="area"
        width="1200px"
        append-to-body>
        <div class="dialogBox">
          <el-table
            :data="ledgerTableData"
            :header-cell-style="{ 'text-align': 'center', 'background': '#29378F', 'color': '#FFFFFF', 'padding': '6px 0' }"
            :cell-style="{'text-align': 'center', 'padding': '6px 0'}"
            ref="multipleTable"
            tooltip-effect="dark"
            v-loading="leadgerLoading"
            @selection-change="handleSelectionChange"
            style="width: 100%;"
            height="544px"
            border
            stripe>
            <el-table-column
              label="选择"
              type="selection"
              width="60px"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="60px"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column :label=" DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡人员情况' : '失踪人员情况' ">
              <el-table-column prop="value1"
                label="姓名"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value2"
                label="性别"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value3"
                label="年龄"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value4"
                label="民族"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value5"
                label="户口所在地"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value6"
                label="身份证号"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value7"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡地点' : '失踪地点' "
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value8"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡时间' : '失踪时间' "
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value9"
                :label=" DISASTERBULLETINTITLE === DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '死亡原因' : '失踪原因' "
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value10"
                label="灾害种类"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value12"
                label="抚慰金发放金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value13"
                label="抚慰金发放形式"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value14"
                label="领款人姓名"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value15"
                label="领款人身份证号"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value16"
                label="领款人住址"
                width="180"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="value17"
                :label=" DISASTERBULLETINTITLE.indexOf('因灾死亡人口') !== -1 ? '与死亡人员关系' : '与失踪人员关系' "
                show-overflow-tooltip>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="value11"
              label="备注"
              width="160"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="margin-bottom: 10px;" size="small" @click="handleLedgerExport">导 出</el-button><br />
          <el-button size="small" @click="ledgerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
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
import { disasterIndex, theNormIndex, theDeathItnum, theDeathPid, theDeathRid, theMissingItnum, theMissingPid, theMissingRid, disasterTimeLookOver } from '@/api/DisasterLetters/disasterReport'
// 受灾区域选择窗口组件
import affectedAreaDialog from '@/components/DisasterLetters/affectedAreaDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'disasterIndex',
  components: {
    affectedAreaDialog
  },
  computed: {
    ...mapGetters(['DISASTERBULLETINTITLE', 'disasterId', 'disasterStandard'])
  },
  filters: {
    number (val) {
      return parseFloat(val).toFixed(2)
    }
  },
  data () {
    return {
      // 总条数
      total: 1,
      // radio 切换
      radioContent: '主要指标',
      // 主要指标/受灾人口 台账弹窗
      ledgerDialogVisible: false,
      // 时间灾种区域 查看弹窗
      areaDialogVisible: false,
      // 台账信息
      ledgerTableData: [],
      // 列表报灾弹窗中 总列表数据
      tableData: [],
      // radiolist
      radioList: [
        {
          value: '主要指标',
          label: '主要指标',
          icon: 'fa fa-bar-chart'
        }, {
          value: '受灾人口',
          label: '受灾人口',
          icon: 'fa fa-address-book-o'
        }, {
          value: '农作物牲畜',
          label: '农作物牲畜',
          icon: 'fa fa-object-ungroup'
        }, {
          value: '倒塌房屋',
          label: '倒塌房屋',
          icon: 'fa fa-home'
        }, {
          value: '直接经济损失',
          label: '直接经济损失',
          icon: 'fa fa-money'
        }, {
          value: '特征指标',
          label: '特征指标',
          icon: 'fa fa-dot-circle-o'
        }, {
          value: '时间灾种区域',
          label: '时间灾种区域',
          icon: 'fa fa-database'
        }, {
          value: '倒房台账',
          label: '倒房台账',
          icon: 'fa fa-list'
        }
      ],
      // table loading
      loading: false,
      // 自带id
      childrenId: '',
      // 承接数组 市级
      citiesArr: [],
      // 加载处理
      num: 0,
      // 判断死亡与失踪
      DeathMissing: true,
      // 台账list loading
      leadgerLoading: false,
      // 时间灾种区域信息 市
      cities: '',
      // 市数量
      cityNum: '',
      // 县
      counties: '',
      // 县的数量
      countyNum: '',
      // 乡镇
      towns: '',
      // 乡镇数量
      townNum: '',
      // 市显示隐藏
      citiesVisible: true,
      // 县
      countiesVisible: true,
      // 乡
      townsVisible: true
    }
  },
  methods: {
    // change tab
    handleChangeValue (val) {
      this.radioContent = val
      // console.log(val)
    },
    // 时间灾种区域 table list 查看
    handleLookOver (index, row) {
      this.cities = ''
      this.cityNum = ''
      this.counties = ''
      this.countyNum = ''
      this.towns = ''
      this.townNum = ''
      this.areaDialogVisible = true
      let id = row.reportId
      let pid = row.pid
      disasterTimeLookOver(id, pid).then(res => {
        if (res.resultSet) {
          // this.cityNum = res.resultSet.length
          let cityArr = [] // 市级
          let countyArr = [] // 县级
          let townArr = [] // 乡镇
          res.resultSet.map(item => {
            cityArr.push(item.c)
            if (item.f) {
              item.f.map(a => {
                countyArr.push(a.c)
                if (a.A004 !== null) {
                  townArr.push(a.A004)
                }
              })
            }
          })
          // 省 市 县都存在
          // console.log(cityArr, countyArr, townArr, '1111111111111111')
          if (cityArr.length > 0 && countyArr.length > 0 && townArr.length > 0) {
            // 市部分
            this.cities = cityArr.join(', ')
            this.cityNum = cityArr.length
            // 县部分
            this.counties = countyArr.join(', ')
            this.countyNum = countyArr.length
            // 乡镇部分
            var arr = townArr.join(',').split(',')
            this.towns = arr.join(', ')
            this.townNum = arr.length
            // 控制
            this.citiesVisible = true
            this.countiesVisible = true
            this.townsVisible = true
          } else if (cityArr.length > 0 && countyArr.length > 0 && townArr.length === 0) {
            // 县部分
            this.counties = cityArr.join(', ')
            this.countyNum = cityArr.length
            // 乡镇部分
            this.towns = countyArr.join(', ')
            this.townNum = countyArr.length
            // 控制
            this.citiesVisible = false
            this.countiesVisible = true
            this.townsVisible = true
            // // 乡镇部分
            // var arr = townArr.join(',').split(',')
            // this.towns = arr.join(', ')
            // this.townNum = arr.length
          } else if (cityArr.length > 0 && countyArr.length === 0 && townArr.length === 0) {
            // 乡镇部分
            this.towns = cityArr.join(', ')
            this.townNum = cityArr.length
            // 控制
            this.citiesVisible = false
            this.countiesVisible = false
            this.townsVisible = true
          }
          // console.log(cityArr, countyArr, townArr, '1111111111111111')
          // this.cities = cityArr.join('， ')
        } else {
          this.cityNum = 0
          this.countyNum = 0
          this.townNum = 0
        }
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // console.log(index, row, '查看')
    },
    // 台账按钮
    handleStandingBook (index, row, title) {
      this.$store.dispatch('getDisasterBulletinTitle', title)
      this.ledgerDialogVisible = true
      // theDeathItnum, theDeathPid, theDeathRid
      // 三接口
      if (title.indexOf('因灾死亡人口') !== -1) {
        theDeathItnum().then(res => { console.log('台账1', res) }).catch(err => { console.log(err) })
        // 表头接口
        theDeathPid().then(res => { console.log('台账2', res) }).catch(err => { console.log(err) })
        // 数据接口
        this.leadgerLoading = true
        theDeathRid(row.reportId).then(res => {
          let arr = []
          if (res.resultSet) {
            res.resultSet.map(i => {
              // console.log(i)
              // 承接转为的对象
              let obj = {}
              i.tabDataProperties.map((item, itemIndex) => {
                obj['value' + itemIndex] = item.value
              })
              arr.push(obj)
            })
            this.ledgerTableData = arr
          }
          this.leadgerLoading = false
          console.log('台账3死亡', res, '数据', arr)
        }).catch(err => {
          this.leadgerLoading = false
          console.log(err)
        })
      } else if (title.indexOf('因灾失踪人口') !== -1) {
        theMissingItnum().then(res => { console.log(res) }).catch(err => { console.log(err) })
        // 表头接口
        theMissingPid().then(res => { console.log(res) }).catch(err => { console.log(err) })
        // 数据接口
        this.leadgerLoading = true
        theMissingRid(row.reportId).then(res => {
          let arr = []
          if (res.resultSet) {
            res.resultSet.map(i => {
              // console.log(i)
              // 承接转为的对象
              let obj = {}
              i.tabDataProperties.map((item, itemIndex) => {
                obj['value' + itemIndex] = item.value
              })
              arr.push(obj)
            })
            this.ledgerTableData = arr
          }
          this.leadgerLoading = false
          console.log('台账3失踪', res, '数据', arr)
        }).catch(err => {
          this.leadgerLoading = false
          console.log(err)
        })
      }
      console.log(index, row, title, '台账')
    },
    // 台账列表中多选列
    handleSelectionChange (val) {
      console.log(val)
    },
    // 下载查看
    handleDownload (index, row) {
      console.log(index, row)
    },
    // table load (标准)
    handleLoadMainIndex (tree, treeNode, resolve) {
      let params = {}
      let id = tree.reportId
      let arrTableList = []
      if (this.disasterStandard === '报灾') {
        disasterIndex(params, id).then(res => {
          // 记录父级id
          let pid = res.resultSet.reportId
          if (res.resultSet.reports && res.resultSet.reports.length > 0) {
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
                // reportId(本级id)
                headerObj.reportId = res.resultSet.reportId
                // 父级id
                headerObj.pid = pid
                // 添加id
                headerObj.id = this.GenNonDuplicateID()
                // 是否存在子级
                if (res.resultSet.reports && res.resultSet.reports.length > 0) {
                  headerObj.hasChildren = true
                  headerObj.children = []
                } else {
                  headerObj.hasChildren = false
                }
                console.log(res.resultSet, 'headerObj', headerObj, res.resultSet.reports)
                arrTableList.push(headerObj)
                resolve(arrTableList)
              }).catch(err => {
                console.log(err)
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      // } else if (this.disasterStandard === '标准') {

        // theNormIndex(params, id).then(res => {
        //   if (res.resultSet.reports && res.resultSet.reports.length > 0) {
        //     // 记录父级id
        //     let pid = res.resultSet.reportId
        //     res.resultSet.reports.map(i => {
        //       const id = i.reportId
        //       theNormIndex(params, id).then(res => {
        //         res.resultSet.id = this.GenNonDuplicateID()
        //         if (res.resultSet.reports && res.resultSet.reports.length > 0) {
        //           res.resultSet.hasChildren = true
        //           res.resultSet.children = []
        //         } else {
        //           res.resultSet.hasChildren = false
        //         }
        //         // 对接自动补全表头数据
        //         var headerObj = {
        //           hitPeople: '受灾人口',
        //           deathPeople: '因灾死亡人口',
        //           missPeople: '因灾失踪人口',
        //           transferPeople: '紧急转移安置人口',
        //           woundPeople: '因灾伤病人口',
        //           bailoutPeople: '需紧急生活救助人口',
        //           droughtPeople: '因旱需生活救助人口',
        //           droughtDrinkWaterPeople: '其中：因旱饮水困难救助人口',
        //           cropDamage: '农作物受灾面积',
        //           cropFailure: '其中：农作物绝收面积',
        //           livestock: '饮水困难大牲畜',
        //           housesCollapsed: '倒塌房屋间数',
        //           houseNumber: '倒塌房屋户数',
        //           theFarmhouse: '其中：倒塌农房间数',
        //           farmhouseDoor: '其中：倒塌农房户数',
        //           seriousFarmRoom: '其中：严重损坏农房间数',
        //           seriousFarmDoor: '其中：严重损坏农房户数',
        //           badlyDamaged: '严重损坏房屋间数',
        //           badlyDamagedDoor: '严重损坏房屋户数',
        //           generalDamage: '一般损坏房屋间数',
        //           generalFarmRoom: '其中：一般损坏农房间数',
        //           damageRoomDoor: '一般损坏房屋户数',
        //           inDamageRoomDoor: '其中：一般损坏农房户数',
        //           directEconomicLoss: '直接经济损失',
        //           agriculturalLosses: '其中：农业损失',
        //           enterprisesLosses: '工矿企业损失',
        //           infrastructureLosses: '基础设施损失',
        //           publicLosses: '公益设施损失',
        //           familyLosses: '家庭财产损失',
        //           centralizedSettlement: '集中安置人口',
        //           scatteredPeople: '分散安置人口',
        //           transitivityPeople: '需过渡性救助人口',
        //           getTrappedPeople: '被困人口',
        //           causeDisaster: '其中：农作物成灾面积',
        //           thePastures: '草场受灾面积',
        //           destroyLand: '毁坏耕地面积',
        //           theDeathlivestock: '因灾死亡大牲畜',
        //           theDeathSheep: '因灾死亡羊只',
        //           typhoonNumber: '台风编号',
        //           earthquake: '地震震级',
        //           submergedCityship: '受淹城区',
        //           submergedTownship: '受淹镇区',
        //           floodedCountry: '受淹乡村',
        //           minedoutArea: '灾种名称',
        //           startTime: '灾害发生时间',
        //           endTime: '灾害结束时间',
        //           sticMonth: '灾害统计月',
        //           areaInfor: '受灾区域信息',
        //           housesCollapsedList: '因灾倒塌损坏住房户一览表',
        //           governmentRescue: '受灾人员灾后政府救助一览表'
        //         }
        //         // 拿出所需数据
        //         res.resultSet.reportItemValues.map(item => {
        //           for (let i in headerObj) {
        //             if (headerObj[i] === item.indexItem.indexItemName) {
        //               headerObj[i] = item.reportItemValue
        //             }
        //           }
        //         })
        //         // 对象中带有中文的变为 0
        //         for (let i in headerObj) {
        //           if (escape(headerObj[i]).indexOf('%u') < 0) {
        //           } else {
        //             headerObj[i] = '0'
        //           }
        //         }
        //         // 区域单独添加
        //         headerObj.area = res.resultSet.creditionRelation.civilRegionalism.civilRegionalismName
        //         // reportId
        //         headerObj.reportId = res.resultSet.reportId
        //         // 父级id
        //         headerObj.pid = pid
        //         // 添加id
        //         headerObj.id = this.GenNonDuplicateID()
        //         // 是否存在子级
        //         if (res.resultSet.reports && res.resultSet.reports.length > 0) {
        //           headerObj.hasChildren = true
        //           headerObj.children = []
        //         } else {
        //           headerObj.hasChildren = false
        //         }
        //         console.log('标准按钮数据', res.resultSet, 'headerObj', headerObj, res.resultSet.reports)
        //         arrTableList.push(headerObj)
        //         resolve(arrTableList)
        //       }).catch(err => {
        //         console.log(err)
        //       })
        //     })
        //   }
        // }).catch(err => {
        //   console.log(err)
        // })
      }
      console.log(tree, treeNode)
    },
    // table expand
    handleTreeExpand (row, expanded) {
      // 控制文件夹关闭打开
      row.foldBool = expanded
      // console.log(row, expanded)
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    // 生成不同的ID
    GenNonDuplicateID () {
      let idStr = Date.now().toString(36)
      idStr += Math.random().toString(36).substr(3)
      return idStr
    },
    // 台账中 导出
    handleLedgerExport () {
      // this.ledgerDialogVisible = false
      console.log('导出')
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
          res.resultSet.hasChildren = false
        } else {
          res.resultSet.hasChildren = true
          res.resultSet.children = []
        }
        // 对接自动补全表头数据
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
          submergedCityship: '受淹城区',
          submergedTownship: '受淹镇区',
          floodedCountry: '受淹乡村',
          // endTime: '灾害结束时间',
          areaInfor: '受灾区域信息',
          housesCollapsedList: '因灾倒塌损坏住房户一览表',
          governmentRescue: '受灾人员灾后政府救助一览表'
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
        // reportId(本级id)
        headerObj.reportId = res.resultSet.reportId
        // 台风编号 // 地震里氏级
        // typhoonNumber: '台风编号',
        //   earthquake: '地震震级',
        if (res.resultSet.disaster.disasterName === '台风') {
          console.log(res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName, '台风')
          // headerObj.typhoonNumber = res.resultSet.disasterRespond.contingencyreRespond.respondDescription
          headerObj.typhoonNumber = ''
        } else if (res.resultSet.disaster.disasterName === '地震') {
          // console.log(res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName, '地震')
          headerObj.earthquake = res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName
        }
        // 灾种名称
        headerObj.minedoutArea = res.resultSet.disaster.disasterName
        // 灾害发生时间
        headerObj.startTime = res.resultSet.disaster.disasterStartTime
        // 灾害统计月
        headerObj.sticMonth = res.resultSet.disaster.disasterStatMonth
        // pid （若没有父级 存本级id）
        headerObj.pid = res.resultSet.reportId
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
        console.log('报灾数据', res, this.tableData, this.citiesArr)
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
          submergedCityship: '受淹城区',
          submergedTownship: '受淹镇区',
          floodedCountry: '受淹乡村',
          // endTime: '灾害结束时间',
          areaInfor: '受灾区域信息',
          housesCollapsedList: '因灾倒塌损坏住房户一览表',
          governmentRescue: '受灾人员灾后政府救助一览表'
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
        // 台风编号 // 地震里氏级
        // typhoonNumber: '台风编号',
        //   earthquake: '地震震级',
        if (res.resultSet.disaster.disasterName === '台风') {
          // console.log(res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName, '台风')
          // headerObj.typhoonNumber = res.resultSet.disasterRespond.contingencyreRespond.respondDescription
          headerObj.typhoonNumber = ''
        } else if (res.resultSet.disaster.disasterName === '地震') {
          console.log(res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName, '地震')
          headerObj.earthquake = res.resultSet.disasterRespond.contingencyreRespond.contingencyreRespondName
        }
        // 灾种名称
        headerObj.minedoutArea = res.resultSet.disaster.disasterName
        // 灾害发生时间
        headerObj.startTime = res.resultSet.disaster.disasterStartTime
        // 灾害统计月
        headerObj.sticMonth = res.resultSet.disaster.disasterStatMonth
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
              submergedCityship: '受淹城区',
              submergedTownship: '受淹镇区',
              floodedCountry: '受淹乡村',
              // endTime: '灾害结束时间',
              areaInfor: '受灾区域信息',
              housesCollapsedList: '因灾倒塌损坏住房户一览表',
              governmentRescue: '受灾人员灾后政府救助一览表'
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
            if (res.resultSet.reports[a].disaster) {
              if (res.resultSet.reports[a].disaster.disasterName === '台风') {
                console.log(res.resultSet.reports[a].disasterRespond.contingencyreRespond.contingencyreRespondName, '台风')
                // headerObj.typhoonNumber = res.resultSet.disasterRespond.contingencyreRespond.respondDescription
                obj2.typhoonNumber = ''
              } else if (res.resultSet.reports[a].disaster.disasterName === '地震') {
                obj2.earthquake = res.resultSet.reports[a].disasterRespond.contingencyreRespond.contingencyreRespondName
              }
              // 灾种名称
              obj2.minedoutArea = res.resultSet.reports[a].disaster.disasterName
              // 灾害发生时间
              obj2.startTime = res.resultSet.reports[a].disaster.disasterStartTime
              // 灾害统计月
              obj2.sticMonth = res.resultSet.reports[a].disaster.disasterStatMonth
            }
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
                  submergedCityship: '受淹城区',
                  submergedTownship: '受淹镇区',
                  floodedCountry: '受淹乡村',
                  // endTime: '灾害结束时间',
                  areaInfor: '受灾区域信息',
                  housesCollapsedList: '因灾倒塌损坏住房户一览表',
                  governmentRescue: '受灾人员灾后政府救助一览表'
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
                if (item.disaster) {
                  if (item.disaster.disasterName === '台风') {
                    // console.log(item.disasterRespond.contingencyreRespond.contingencyreRespondName, '台风')
                    // headerObj.typhoonNumber = res.resultSet.disasterRespond.contingencyreRespond.respondDescription
                    obj3.typhoonNumber = ''
                  } else if (item.disaster.disasterName === '地震') {
                    obj3.earthquake = item.disasterRespond.contingencyreRespond.contingencyreRespondName
                  }
                  // 灾种名称
                  obj3.minedoutArea = item.disaster.disasterName
                  // 灾害发生时间
                  obj3.startTime = item.disaster.disasterStartTime
                  // 灾害统计月
                  obj3.sticMonth = item.disaster.disasterStatMonth
                }
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
        console.log('标准数据', res, this.tableData)
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
.disasterIndex /deep/ .el-table--border {
  overflow: auto;
}
.tab {
  text-align: center;
  padding: 20px 0;
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
.area /deep/ .el-dialog__body {
  padding: 30px 20px 10px;
}
.area /deep/ .el-dialog__header {
  background: #29378F;
  padding: 10px 20px;
}
.area /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
  font-size: 16px;
}
.area /deep/ .el-dialog__headerbtn {
  top: 16px;
}
.area /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
/* .tableList /deep/ .el-button--mini {
  margin-left: 12px;
} */
</style>
