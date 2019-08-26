<template>
  <!-- 案例选择弹窗 -->
  <el-dialog
    v-dialogDrag
    title="案例选择"
    :visible.sync="toCaseSelection.caseSelectionDialogVisible"
    :close-on-press-escape="false"
    class="caseSelection"
    width="500px">
    <div class="box">
      <el-tree
        :data="toCaseSelection.data"
        show-checkbox
        node-key="id"
        ref="tree"
        @check-change="handleCheckChange"
        highlight-current
        :props="toCaseSelection.defaultProps">
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSure">确 定</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    toCaseSelection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 承接显示inputValue的数组
      inputValueArr: []
    }
  },
  methods: {
    // 选中的节点
    handleCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    // 确定按钮
    handleSure () {
      // 清空数据
      this.inputValueArr = []
      // 处理选中的节点
      this.$refs.tree.getCheckedNodes().map(item => {
        if (!item.children || item.children.length === 0) {
          this.inputValueArr.push(item)
        }
      })
      this.$emit('toFather', this.inputValueArr)
      this.toCaseSelection.caseSelectionDialogVisible = false
      // console.log('确定', this.inputValueArr)
    },
    // 取消按钮
    handleCancel () {
      this.toCaseSelection.caseSelectionDialogVisible = false
      // console.log('取消')
    }
  },
  mounted () {
    // console.log(this.toCaseSelection)
  }
}
</script>

<style scoped>
.caseSelection /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #909399 !important;
}
.caseSelection /deep/ .el-dialog__header .el-dialog__title {
  color: #FFFFFF !important;
  font-size: 16px;
}
.caseSelection /deep/ .el-dialog__header {
  background: #F4F4F4 !important;
  font-weight: 600;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
  padding-top: 10px;
}
.caseSelection /deep/ .el-dialog__headerbtn {
  top: 14px;
}
.caseSelection /deep/ .el-dialog__header .el-dialog__title {
  color: #333333 !important;
}
.caseSelection /deep/ .el-dialog__footer {
  text-align: center;
}
.caseSelection .box {
  height: 340px;
  overflow: auto;
}
/*滚动条整体样式 高宽分别对应横竖滚动条的尺寸*/
.caseSelection .box::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/*滚动条里面小方块*/
.caseSelection .box::-webkit-scrollbar-thumb {
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
/*滚动条里面轨道*/
.caseSelection .box::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>
