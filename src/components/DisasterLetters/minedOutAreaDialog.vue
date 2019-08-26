<template>
  <!-- 灾种选择弹窗 -->
  <el-dialog
    v-dialogDrag
    title="灾种选择窗口"
    :visible.sync="toMinedOutArea.minedOutAreaDialogVisible"
    :close-on-press-escape="false"
    class="MinedOutArea"
    width="600px">
    <div class="box">
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(city, index) in checkList" :label="city.disasterKindId" :key="index" :title="city.disasterKindName">{{city.disasterKindName}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button size="small" @click="handleCheckClear">清空</el-button>
      <el-button size="small" type="primary" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { minedOutArea } from '@/api/communal/lotsData'
export default {
  props: {
    // 灾种选择数据
    toMinedOutArea: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 选中数据
      checkedCities: [],
      // 全选
      checkAll: false,
      // 全选样式类型控制
      isIndeterminate: true,
      // 多选数据
      checkList: [],
      // 全选按钮的数据
      cityOptions: []
    }
  },
  methods: {
    // 多选按钮change
    handleCheckedCitiesChange (value) {
      // console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length
    },
    // 全选按钮监听
    handleCheckAllChange (val) {
      this.checkedCities = val ? this.cityOptions : []
      this.isIndeterminate = false
      // console.log(val)
    },
    // 清空选中
    handleCheckClear () {
      this.checkedCities = []
      this.checkAll = false
      // console.log('清空')
    },
    // 确定按钮
    handleSure () {
      this.toMinedOutArea.minedOutAreaDialogVisible = false
      let obj = {
        inputArr: this.checkedCities,
        list: this.checkList
      }
      this.$emit('toFather', obj)
      // console.log('确定')
    }
  },
  created () {
    this.cityOptions = []
    // 灾种快报接口
    minedOutArea().then(res => {
      this.checkList = res.resultSet
      res.resultSet.map(i => {
        this.cityOptions.push(i.disasterKindId)
      })
      // console.log('res', res)
    }).catch(err => {
      console.log(err)
    })
    // console.log(this.toMinedOutArea)
  }
}
</script>

<style scoped>
.MinedOutArea /deep/ .el-dialog__header {
  text-align: left;
  background: #29378F;
  padding: 10px 20px;
}
.MinedOutArea /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
  font-size: 16px;
}
.MinedOutArea /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
.MinedOutArea /deep/ .el-dialog__headerbtn {
  top: 16px;
}
.MinedOutArea /deep/ .el-dialog__footer {
  text-align: center;
  background: #ECEAEA;
}
.MinedOutArea /deep/ .el-dialog__footer .el-checkbox {
  margin-right: 10px;
}
.MinedOutArea /deep/ .el-dialog__body {
  padding: 30px 20px 10px;
}
.box {
  text-align: left;
  min-height: 156px;
}
.box /deep/ .el-checkbox {
  width: 21%;
  margin: 0 20px 20px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
