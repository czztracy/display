<template>
  <div class="disasterImage">
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
  </div>
</template>

<script>
export default {
  name: 'disasterImage',
  data () {
    return {
      summarizeTextarea: '灾情报告',
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
.disasterImage {
  margin-top: 20px;
  overflow: hidden;
}
.disasterImage .leftContent,.middleContent {
  margin-right: 20px;
  overflow: hidden;
  border: 1px solid #29378F;
  border-radius: 4px;
}
.disasterImage .leftContent {
  float: left;
  width: 16%;
}
.disasterImage .middleContent {
  float: right;
  width: 81%;
  overflow: hidden;
}
.disasterImage .middleContent .content {
  height: 640px;
  width: 100%;
  overflow: auto;
}
.disasterImage .leftContent .content {
  height: 620px;
  overflow: auto;
  padding: 10px 2%;
}
.disasterImage .middleContent .content {
  padding: 0 2%;
}
.disasterImage .leftContent .title,.middleContent .title {
  color: #FFFFFF;
  background: #29378F;
  height: 48px;
  text-indent: 20px;
  width: 100%;
  font-weight: 600;
}
.disasterImage .leftContent,.middleContent {
  line-height: 48px;
}
</style>
