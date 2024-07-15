<script>
export default {
  name: "pet-adoption-home-grid",
  props: {
    nav: { type: Array, default: () => [] }
  },
  data() {
    return {
    }
  }
}
</script>

<template>
  <view class="grid-wrapper">
    <u-grid :border="false" col="3" align="center">
      <u-grid-item v-for="(item,index) in nav" :key="index" @click="toSliderUrl(item.type, item.target_id)">
        <u--image :showLoading="true" :src="item.img" width="70rpx" height="70rpx"/>
        <text class="grid-text">{{ item.name }}</text>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<style scoped lang="scss">
.grid-wrapper {
  margin: $uni-spacing-col-lg $page-row-spacing;

  .grid-text {
    margin-top: $uni-spacing-row-sm;
    font-size: $uni-font-size-base;
	@include color(color-dark);
  }
}
</style>
