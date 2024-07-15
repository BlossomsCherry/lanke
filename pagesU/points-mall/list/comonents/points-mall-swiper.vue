<script>
export default {
  name: "points-mall-swiper",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 当前选中索引
      currentIdx: 0
    }
  },
  methods: {
    //轮播图切换
    changeCurrentIdx(e) {
      this.currentIdx = e.detail.current
    },
  }
}
</script>

<template>
  <view v-if="list.length > 0" class="swiper-wrapper">
    <swiper circular enableFlex :autoplay="true" @change="changeCurrentIdx" class="banners" :duration="500" interval="5000">
      <swiper-item class="item" v-for="(item, index) in list" :key="item.id" @tap.stop.prevent="toSliderUrl(item.type, item.target)">
        <image :class="['image', index === currentIdx ? 'active' : '']" mode="aspectFill" :src="item.img"></image>
      </swiper-item>
    </swiper>
    <view class="indicators">
      <view :class="['indicator', index === currentIdx ? 'active' : '']" v-for="(item, index) in list" :key="item.link"></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.swiper-wrapper {
  position: relative;
  padding: 20rpx 20rpx 0 20rpx;
  @include background_color(page-box-background-color);

  .banners {
    overflow: hidden;
    border-radius: 16rpx;

    .image {
      width: 100%;
      height: 100%;
      border-radius: $uni-border-radius-sm;
      transition: all 300ms ease-in;
      -webkit-transform: scale(0.95);
      transform: scale(0.95);
       box-shadow: 0 12rpx 40rpx 0 #dddddd;
      animation: fadeIn 1s ease;
      @include background_color(page-body-background-color);

      &.active {
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
  }

  .indicators {
    position: absolute;
    bottom: 50rpx;
    left: 70rpx;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    -webkit-flex-flow: row nowrap;
    flex-flow: row nowrap;

    .indicator {
      width: 10rpx;
      height: 8rpx;
      margin-right: 10rpx;
      border-radius: 3rpx;
      background-color: #ffffff60;
      transition: all 300ms ease-in;

      &.active {
        width: 30rpx;
        border-radius: 5rpx;
        @include background_color(page-box-background-color);
      }
    }
  }
}
</style>
