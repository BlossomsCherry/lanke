<script>
export default {
  data() {
    return {
      pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
	    backgroundSrc: 'https://pic2.zhimg.com/80/v2-7e193f603a6de13d6da8815bea38a14d_1440w.webp',
      tabList: [
        { id: 1, label: '首页', type: 6, target: '/pages/tabbaar/index' },
        { id: 2, label: '关于我们', type: 6, target: '/pagesA/mine/about/about' }
      ],
    }
  },
  computed: {
    config_about() {
      return this.$store.state.config.about
    },
    config_app() {
      return this.$store.state.config.app
    },
    config_code() {
      return this.$store.state.config.code
    }
  },
  methods: {
    handle() {
      uni.wen.util.openOrDownloadApp()
    }
  }
}
</script>

<template>
  <view class="app-download-page" :style="{ backgroundImage: `url(${backgroundSrc})` }">
    <view class="top-wrapper">
      <view class="logo-wrapper">
        <image class="logo" :src="config_about.logo"/>
        <view class="name">{{ config_about.name }}</view>
      </view>

      <view class="tab-wrapper">
        <view>首页</view>
        <view>关于我们</view>
      </view>
    </view>

    <!-- 中间下载区域 -->
    <view class="middle-wrapper">
      <view class="slogan">拥抱每一种生活</view>

      <view class="contain">
        <view class="mini-qr-wrapper">
          <image class="image" :src="config_code.mini"/>
          <view class="text">保存到相册，微信扫一扫</view>
        </view>

        <view class="download-wrapper">
          <view class="btn-wrapper" @click="handle()">
            <u-icon name="apple-fill" color="white" size="46"/>
            <view>AppStore</view>
          </view>

          <view class="btn-wrapper" @click="handle()">
            <u-icon name="android-fill" color="white" size="46"/>
            <view>Android</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="bottom-wrapper">
      <view class="tab-wrapper">
        <view></view>
      </view>
      <view class="copyright">{{ config_about.copyright }}</view>
      <view class="icp">{{ config_about.icp }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.app-download-page {
  padding: $uni-spacing-col-lg $page-row-spacing;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: white;

  .top-wrapper {
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-lg;

      .logo {
        width: 96rpx;
        height: 96rpx;
      }

      .name {
        font-size: 60rpx;
        font-weight: 900;
      }
    }

    .tab-wrapper {
      margin-top: 42rpx;
      display: flex;
      gap: $uni-spacing-row-lg;
      text-shadow: 0 4rpx 6rpx rgba(0, 0, 0, .5);
      font-size: $uni-font-size-sm;
    }

  }

  .middle-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .slogan {
      font-size: 76rpx;
    }

    .contain {
      margin-top: $uni-spacing-col-lg;
      width: 100%;
      height: 240rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $uni-spacing-row-lg;

      .mini-qr-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .image {
          width: 180rpx;
          height: 180rpx;
          border-radius: $uni-border-radius-lg;
        }

        .text {
          font-size: $uni-font-size-sm;
          color: #d8d8d8;
        }
      }

      .download-wrapper {
        height: 240rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: $uni-spacing-row-lg;

        .btn-wrapper {
          width: 360rpx;
          height: 100rpx;
          display: flex;
          padding-left: 40rpx;
          align-items: center;
          gap: $uni-spacing-row-base;
          border-radius: 50rpx;
          cursor: pointer;
          color: #fff;
          font-size: 48rpx;
          border: 1rpx white solid;
          background: rgba(255, 255, 255, .2);
          box-sizing: border-box;
        }
      }
    }
  }

  .bottom-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: $uni-font-size-sm;
  }
}
</style>
