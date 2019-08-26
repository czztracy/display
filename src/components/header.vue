<template>
  <div class="header">
    <div class="headerLeft">
      <img src="@/assets/images/logo.png" />
      <span class="title">自然灾害灾情报送系统</span>
    </div>
    <div class="headerRight">
      <div class="chuck">
        <img src="@/assets/images/welcome.png" style="margin-top: 11px; margin-right: 8px;" @click="handleWelcome" />
        <span class="text">欢迎您：应急管理部</span>
      </div>
      <div class="chuck">
        <img src="@/assets/images/switch.png" style="margin-top: 16px; margin-right: 10px;" @click="hanleLoginout" />
        <span class="text">安全退出</span>
      </div>
      <!--  child power-off -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
    }
  },
  methods: {
    // 点击欢迎您图标
    handleWelcome () {
      // console.log('欢迎您')
    },
    // 点击安全退出图标
    hanleLoginout () {
      // console.log('安全退出')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  height: 70px;
  background: #29378F;
}
.header .headerLeft {
  overflow: hidden;
  text-align: left;
  float: left;
  margin-left: 30px;
}
.header .headerLeft img {
  margin-top: 18px;
  float: left;
}
.header .headerLeft .title {
  font-size: 22px;
  color: #FFFFFF;
  float: left;
  margin-left: 24px;
  margin-top: 20px;
}
.header .headerRight {
  overflow: hidden;
  text-align: right;
  float: right;
  margin-right: 40px;
  height: 100%;
}
.header .headerRight .chuck {
  display: inline-block;
  color: #FFFFFF;
  font-size: 16px;
  height: 100%;
  margin-left: 20px;
  line-height: 70px;
}
.header .headerRight .chuck img {
  float: left;
}
.header .headerRight .chuck img:hover {
  cursor: pointer;
}
.header .headerRight .chuck .text {
  font-size: 14px;
}
</style>
