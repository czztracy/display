<template>
  <div class="nav">
    <template>
      <div class="sidebar">
        <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal">
          <template v-for="(item, itemIndex) in $router.options.routes[0].children">
            <template v-if="item.hidden">
              <el-menu-item :index="item.path" :key="itemIndex">
                <span>{{item.meta.title}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    // console.log(this.$router.options.routes[0].children)
  }
}
</script>

<style scoped>
.nav {
  padding: 0 20px;
  box-shadow:0px 1px 3px 0px rgba(0,0,0,0.1)
}
.nav /deep/ .el-menu.el-menu--horizontal {
  border-bottom: 0;
}
.nav /deep/ .el-menu--horizontal > .el-menu-item {
  height: 52px;
  line-height: 52px;
}
.nav /deep/ .el-menu--horizontal > .el-menu-item {
  /* color: #333333; */
  font-weight: 600;
}
.nav /deep/ .el-menu--horizontal > .el-menu-item.is-active {
  color: #29378F;
}
</style>
