<template>
  <div class="disasterReport">
    <div class="leftContent">
      <div class="title">行政区划列表</div>
      <div class="content">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
          <span slot-scope="{ node }" :title="node.label" class="slot-t-node">
            <!-- <i :class="node.isLeaf ? 'fa fa-file-o' : 'fa fa-folder'"/> -->
            <i class="fa fa-file-o" v-if="node.isLeaf === true"></i>
            <i class="fa fa-folder" v-else-if="node.isLeaf === false && node.expanded===false"  style="color: #29378F; font-size: 16px;"></i>
            <i class="fa fa-folder-open" v-else  style="color: #29378F; font-size: 16px;"></i>
            {{ node.label }}
          </span>
        </el-tree>
      </div>
    </div>
    <div class="middleContent">
      <div class="title">灾情报告</div>
      <div class="content">
          {{ summarizeTextarea }}
      </div>
    </div>
    <div class="rightContent">
      <div class="title">
        <p>灾害和救灾工作</p>
        <p>概述（必填）：</p>
      </div>
      <div class="content">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="summarizeTextarea"
          maxlength="500"
          show-word-limit
        />
      </div>
      <div class="hint">提示：灾害和救灾工作概述字数不能超过500字。</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'disasterReport',
  data () {
    return {
      // 灾害和救灾工作概述
      summarizeTextarea: '安徽省',
      // 树形图数据
      data: [{
        label: '安徽省',
        children: [{
          label: '宿州市',
          children: [{
            label: '埇桥区'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 点击树节点触发事件
    handleNodeClick (node, data) {
      this.summarizeTextarea = node.label
      // console.log(node, data)
    }
  }
}
</script>

<style scoped>
.disasterReport {
  margin-top: 20px;
  overflow: hidden;
}
.disasterReport .leftContent,.middleContent {
  float: left;
  margin-right: 20px;
  overflow: hidden;
  border: 1px solid #29378F;
  border-radius: 4px;
}
.disasterReport .leftContent .content, .middleContent .content {
  height: 640px;
  overflow: auto;
}
.disasterReport .leftContent .content {
  height: 620px;
  padding: 10px 2%;
}
.disasterReport .rightContent .content {
  height: 480px;
  overflow: auto;
}
.disasterReport .rightContent .content /deep/ .el-textarea {
  height: 100%;
}
.disasterReport .rightContent .content /deep/ .el-textarea .el-textarea__inner {
  height: 100%;
}
.disasterReport .rightContent .hint {
  height: 129px;
  border-top: 1px solid #29378F;
  padding: 10px 5%;
  font-size: 16px;
  line-height: 32px;
  color: #000000;
}
.disasterReport .rightContent {
  float: right;
  border: 1px solid #29378F;
  border-radius: 4px;
}
.disasterReport .leftContent .title,.middleContent .title,.rightContent .title{
  color: #FFFFFF;
  background: #29378F;
  height: 48px;
  text-indent: 20px;
  font-weight: 600;
}
.disasterReport .rightContent .title {
  padding-top: 10px;
}
.disasterReport .leftContent,.middleContent {
  line-height: 48px;
}
.disasterReport .rightContent .title {
  color: red;
}
.disasterReport .leftContent {
  width: 16%;
}
.disasterReport .rightContent {
 width: 18%;
}
.disasterReport .middleContent {
  width: 63%;
}
.disasterReport .middleContent .content {
  padding: 0 2%;
}
</style>
