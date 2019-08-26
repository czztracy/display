<template>
  <div class="main">
    <!-- header -->
    <Header />
    <!-- nav -->
    <Nav />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/header'
import Nav from '@/components/navigation'
export default {
  name: 'mainView',
  components: {
    Header,
    Nav
  }
}
</script>

<style scoped>

</style>
