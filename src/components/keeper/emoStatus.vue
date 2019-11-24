<template>
  <el-container>

    <el-header>Header</el-header>
    <el-main>
      <div class="block">
        <span class="demonstration">默认不区分颜色</span>
        <el-rate v-model="value1"></el-rate>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "emoStatus",
    data() {
      return {
        value1: 2
      }
    }
  }
</script>

<style scoped>

</style>
