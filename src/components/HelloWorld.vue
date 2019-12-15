<template>
  <div class="hello">
    <router-link :to="{path: '/keeper/emoStatus'}">
      <el-button>homePage</el-button>
    </router-link>
    <mt-button type="default">button</mt-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome',
      rating: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
