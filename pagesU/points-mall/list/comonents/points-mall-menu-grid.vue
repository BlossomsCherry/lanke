<script>
export default {
  name: "points-mall-menu-grid",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
}
</script>

<template>
  <view class="points-mall-menu-grid-wrapper">
    <view class="grid-wrapper" v-for="item in list" :key="item.id" @click="toSliderUrl(item.type, item.target)">
      <image class="img" :src="item.img"/>
      <view class="label">{{ item.name }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.points-mall-menu-grid-wrapper {
  margin: 20rpx 20rpx 0 20rpx;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 26rpx;
  grid-row-gap: 26rpx;

  .grid-wrapper {
    display: flex;
    gap: 8rpx;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .img {
      border-radius: 50%;
      width: 90rpx;
      height: 90rpx;
    }

    .label {

    }
  }
}
</style>
