<script>
  import navBar from '@/components/common/navbar/navbar'
  export default {
    components: {
      navBar
    }
  }
</script>

<template>
  <view class="container">
    <view
      :class="
        'mini-page-wrap global-theme-' +
        global__theme__ +
        ' global-platform-' +
        global__platform__ +
        ' global-device-' +
        global__device__ +
        ' global-tenant-' +
        global__tenant__.tenant_id
      "
      :data-theme="global__theme__"
    >
      <navBar
        :back="true"
        :iconTheme="iconTheme"
        :color="'rgba(' + color + ', ' + navbarTrans + ')'"
        :home="fph"
        :placeholder="false"
      ></navBar>
    </view>

    <view class="tag-header">
      <view class="tag-title">选择标签，</view>
      <view class="tag-subtitle">展示风格，个性化定制</view>

      <view class="tags-box">
        <block v-for="(item, index) in 10" :key="index">
          <view class="item">爱旅游</view>
        </block>
        <image src="@/static/tabbar/209.svg"></image>
      </view>

      <view
        class="begin-btn"
        @tap.stop.prevent="toSliderUrl(6, '/pages/tabbar/index/index')"
        >开始体验</view
      >

      <view class="bottom">
        <image src="@/static/tabbar/210.svg"></image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  page {
    background: #f7f7f9;
  }
  .container {
    padding: 225rpx 48rpx 0 48rpx;
    .tag-header {
      .tag-title {
        margin-bottom: 20rpx;
        font-weight: bold;
        font-size: 56rpx;
        color: #000000;
      }

      .tag-subtitle {
        margin-bottom: 62rpx;
        font-size: 24rpx;
        color: #000000;
      }

      .tags-box {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        position: relative;
        width: 656rpx;
        height: 320rpx;
        padding: 54rpx 34rpx;
        margin-bottom: 60rpx;
        background: #d8d8d8;
        border-radius: 10rpx;
        box-sizing: border-box;

        .item {
          padding: 6rpx 24rpx;
          height: 46rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 25rpx;
          font-size: 24rpx;
          color: #000000;
          z-index: 2;
        }

        image {
          position: absolute;
          left: 0;
          top: 0;
          width: 656rpx;
          height: 320rpx;
        }
      }

      .begin-btn {
        width: 656rpx;
        height: 80rpx;
        margin-bottom: 290rpx;
        background: #242424;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #ffffff;
        text-align: center;
        line-height: 80rpx;
      }

      .bottom {
        display: flex;
        justify-content: center;

        image {
          width: 371rpx;
          height: 420rpx;
        }
      }
    }
  }
</style>
