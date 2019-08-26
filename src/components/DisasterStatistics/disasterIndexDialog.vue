<template>
  <!-- 灾情指标选择弹窗 -->
  <el-dialog
    v-dialogDrag
    title="灾情指标查询设置"
    :visible.sync="toDisasterIndexObj.disasterDialogVisible"
    :close-on-press-escape="false"
    class="DisasterIndex"
    width="620px">
    <div class="box">
      <div class="titles">
        <span>指标项</span>
        <span>关系运算符</span>
        <span>值</span>
        <span>逻辑运算符</span>
      </div>
      <el-form label-position="left" size="small" label-width="70px" :model="formDisasterIndex">
        <el-form-item :label="`条件 ${iIndex + 1}：`" v-for="(i, iIndex) in 5" :key="iIndex">
          <el-select v-model="formDisasterIndex.IndexItems[iIndex]" placeholder="请选择指标项">
            <el-option
              v-for="(item, itemIndex) in IndexItemsOptions"
              :key="itemIndex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="formDisasterIndex.Operators[iIndex]" placeholder="">
            <el-option
              v-for="(item, itemIndex) in operatorsOptions"
              :key="itemIndex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="formDisasterIndex.value[iIndex]" autocomplete="off"></el-input>
          <el-select v-model="formDisasterIndex.logic[iIndex]" placeholder="">
            <el-option
              v-for="(item, itemIndex) in logicOptions"
              :key="itemIndex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSure">确 定</el-button>
      <el-button size="small" @click="handleCheckClear">清空</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    toDisasterIndexObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      // 指标项
      IndexItemsOptions: [
        { value: 'A008', label: '受灾人口' },
        { value: 'A009', label: '因灾死亡人口' },
        { value: 'A010', label: '因灾失踪人口' },
        { value: 'A012', label: '紧急转移安置人口' },
        { value: 'A020', label: '农作物受灾面积' },
        { value: 'A022', label: '农作物绝收面积' },
        { value: 'A026', label: '坍塌房屋' },
        { value: 'A030', label: '严重损坏房屋' },
        { value: 'A043', label: '直接经济损失' }
      ],
      // 关系运算符
      operatorsOptions: [
        { value: 'gt', label: '大于' },
        { value: 'ge', label: '大于等于' },
        { value: 'eq', label: '等于' },
        { value: 'le', label: '小于等于' },
        { value: 'lt', label: '小于' }
      ],
      // 逻辑运算符
      logicOptions: [
        { value: 'and', label: '且' },
        { value: 'or', label: '或' }
      ],
      // 条件数据
      formDisasterIndex: {
        IndexItems: [], // 指标项
        Operators: ['gt', 'gt', 'gt', 'gt', 'gt'], // 关系运算符
        value: [], // 值
        logic: ['and', 'and', 'and', 'and', 'and'] // 逻辑运算符
      },
      // 全属性数组
      // 指标项label
      indexItems: '',
      // 关系运算符label
      operators: '',
      // 逻辑运算符label
      logics: ''
    }
  },
  methods: {
    // 确定按钮
    handleSure () {
      // 编码数组承接
      var paramsCodeArr = []
      this.formDisasterIndex.Operators.map((item, itemIndex) => {
        // console.log(this.formDisasterIndex.IndexItems[itemIndex])
        if (this.formDisasterIndex.IndexItems[itemIndex] !== undefined) {
          var str = `${this.formDisasterIndex.IndexItems[itemIndex]} ${item} ${this.formDisasterIndex.value[itemIndex]} ${this.formDisasterIndex.logic[itemIndex]}`
          paramsCodeArr.push(str)
        }
      })
      // 转为所需的传参类型
      var reportItemValues = []
      // input放的值arr
      var inputArr = []
      paramsCodeArr.map((i, iIndex) => {
        var obj = {}

        // 指标项code转label
        this.IndexItemsOptions.map(a => {
          if (a.value === i.split(' ')[0]) {
            this.indexItems = a.label
          }
        })
        // 关系运算符code转label
        this.operatorsOptions.map(b => {
          if (b.value === i.split(' ')[1]) {
            this.operators = b.label
          }
        })
        // 逻辑运算符
        obj.relation = i.split(' ')[3]
        // 逻辑运算符code转label
        this.logicOptions.map(c => {
          if (c.value === i.split(' ')[3]) {
            this.logics = c.label
          }
        })
        // 关系运算符
        obj.operator = i.split(' ')[1]
        // 指标项
        obj.indexItemCode = i.split(' ')[0]
        // 值
        if (i.split(' ')[2] !== 'undefined') {
          obj.itemValue = i.split(' ')[2]
        } else {
          obj.itemValue = ''
        }
        var labelStr = `${this.indexItems} ${this.operators} ${i.split(' ')[2]} ${this.logics}`
        inputArr.push(labelStr)
        reportItemValues.push(obj)
      })
      // input中显示label

      var object = {
        reportItemValues: reportItemValues, // 所需的传参格式（接口）
        inputValue: inputArr.join(' ')
      }
      this.$emit('toFather', object)
      this.toDisasterIndexObj.disasterDialogVisible = false
    },
    // 清空按钮
    handleCheckClear () {
      this.formDisasterIndex.IndexItems = []
      this.formDisasterIndex.value = []
      // console.log('清空')
    }
  }
}
</script>

<style scoped>
.DisasterIndex /deep/ .el-dialog__header {
  text-align: left;
  background: #29378F;
  padding: 10px 20px;
}
.DisasterIndex /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
  font-size: 16px;
}
.DisasterIndex /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
.DisasterIndex /deep/ .el-dialog__headerbtn {
  top: 16px;
}
.DisasterIndex /deep/ .el-dialog__footer {
  text-align: center;
  background: #ECEAEA;
}
.DisasterIndex /deep/ .el-dialog__body {
  padding: 20px 40px;
}
.DisasterIndex /deep/ .el-form-item__label {
  padding: 0;
  font-weight: 600;
}
.DisasterIndex /deep/ .el-form-item--small.el-form-item .el-select:nth-child(1) {
  width: 180px;
}
.DisasterIndex /deep/ .el-form-item--small.el-form-item .el-select:nth-child(2) {
  width: 80px;
  margin-left: 8px;
}
.DisasterIndex /deep/ .el-form-item--small.el-form-item .el-input--small:nth-child(3) {
  width: 80px;
  margin-left: 8px;
}
.DisasterIndex /deep/ .el-form-item--small.el-form-item .el-select:nth-child(4) {
  width: 80px;
  margin-left: 8px;
}
.DisasterIndex .titles {
  font-weight: 600;
  margin-bottom: 12px;
}
.DisasterIndex .titles span:nth-child(1) {
  margin-left: 130px;
}
.DisasterIndex .titles span:nth-child(2) {
  margin-left: 90px;
}
.DisasterIndex .titles span:nth-child(3) {
  margin-left: 46px;
}
.DisasterIndex .titles span:nth-child(4) {
  margin-left: 46px;
}
</style>
