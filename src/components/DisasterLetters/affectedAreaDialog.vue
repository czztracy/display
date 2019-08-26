<template>
  <!-- 受灾区域选择弹窗 -->
  <el-dialog
    v-dialogDrag
    title="受灾区域选择窗口"
    :visible.sync="toAffectedArea.affectedAreaDialogVisible"
    :close-on-press-escape="false"
    class="MinedOutArea"
    width="688px">
    <div class="box">
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(city, index) in checkList" :label="city.creditionRelationId" :key="index" :title="city.civilRegionalism.civilRegionalismName">{{city.civilRegionalism.civilRegionalismName}}</el-checkbox>
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
import { affectedArea } from '@/api/communal/lotsData'
export default {
  props: {
    // 受灾区域选择数据
    toAffectedArea: {
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
      console.log(value)
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
      this.toAffectedArea.affectedAreaDialogVisible = false
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
    let id = '2f8ae8904f5647c9b15661c85a7a822f'
    let param = ''
    affectedArea(param, id).then(res => {
      this.checkList = res.resultSet
      res.resultSet.map(i => {
        this.cityOptions.push(i.creditionRelationId)
      })
      // 区域的id
      sessionStorage.setItem('areaList', JSON.stringify(res.resultSet))
      // console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // console.log(this.toAffectedArea)
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
