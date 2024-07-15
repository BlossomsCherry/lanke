<script>
export default {
  name: 'pet-adoption-home-navbar',
  props: {
    city: { type: String, default: '定位中' },
	back: { type: Boolean, default: true }
  }
}
</script>

<template>
  <u-navbar placeholder :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
    <view class="u-nav-left-slot" slot="left">
		<block v-if="back">
			<u-icon name="arrow-left" size="38" @click="toSliderUrl(-2)" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"/>
			<u-line direction="column" :hairline="false" length="32" margin="0 16rpx" :color="global__theme__ == 'black' ? '#e6e6e6' : '#1a1a1a'"/>
		</block>
		
		<view class="location-wrapper" @click="toSliderUrl(6, '/pagesP/pet-adoption/city-index-list/index')">
			<i class="icon1 mini-icon-p mini-dingwei"/>
			<view>{{ city }}</view>
			<i class="icon2 mini-icon-p mini-xialafuhao"/>
		</view>
		
    </view>
  </u-navbar>
</template>

<style scoped lang="scss">
@import "@/pagesP/app.scss";

.u-nav-left-slot {
  display: flex;
  align-items: center;
  @include color(color-darkest);
  .location-wrapper {
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-sm;

    .icon1 {
      margin-top: 2rpx;
    }

    .icon2 {
      margin-top: 4rpx;
    }
  }
}
</style>
