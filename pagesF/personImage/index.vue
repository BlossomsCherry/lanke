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
      <view class="tag-title">形象，</view>
      <view class="tag-subtitle">打造个性ID，玩转岚客</view>

      <view class="tags-box">
        <image src="@/static/tabbar/212.svg"></image>
      </view>

      <view class="name">
        <input type="text" placeholder="昵称" />
      </view>

      <view
        class="begin-btn"
        @tap.stop.prevent="toSliderUrl(6, '/pagesF/tags/index')"
        >下一步</view
      >

      <view class="bottom">
        <image src="@/static/tabbar/211.svg"></image>
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
        position: relative;
        height: 176rpx;
        margin-bottom: 54rpx;
        border-radius: 10rpx;

        image {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 176rpx;
          height: 176rpx;
        }
      }

      .name {
        text-align: center;
        margin-bottom: 58rpx;
        font-size: 32rpx;
        color: #c8c8c8;
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
