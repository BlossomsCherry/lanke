<script>
export default {
  name: 'pet-adoption-home-tabs',
  props: {
    current: { type: Number, required: true },
    tabList: { type: Array, default: () => [] }
  },
  data() {
    return {
      activeStyle: 'color: #fc3a72; font-size: 32rpx; font-weight: bold;'
    }
  }
}
</script>

<template>
  <view class="tabs-wrapper">
    <u-tabs :list="tabList" lineColor="transparent" :activeStyle="activeStyle" :current="current" @click="e => $emit('setCurrent', e.index)">
      <view slot="right" class="right-wrapper" @tap="toSliderUrl(6, '/pagesP/pet-adoption/pet-filter/index')">
        <view>筛选</view>
        <i class="mini-icon-p mini-shaixuan" />
      </view>
    </u-tabs>
  </view>
</template>

<style scoped lang="scss">
@import "@/pagesP/app.scss";

.tabs-wrapper {
  z-index: 999999;
  position: sticky;
  top: 0;
  @include background_color(page-box-background-color);

  .right-wrapper {
    margin-right: $uni-spacing-row-lg;
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-sm;
	@include color(color-light-dark);
  }
}
</style>
