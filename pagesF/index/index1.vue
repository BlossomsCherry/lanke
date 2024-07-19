<script>
  import navBar from '@/components/common/navbar/navbar'
  import loginPhone from '../components/login-phone.vue'
  import loginWechat from '../components/login-wechat.vue'

  export default {
    components: {
      navBar,
      loginPhone,
      loginWechat
    },
    data() {
      return {
        phoneNumber: '',
        code: '',
        flag: false, // 默认选中的值
        isNeedAgreeMpPrivacy: false
      }
    },
    methods: {
      change() {
        this.flag = !this.flag
      },
      openPrivacyContract() {
        wx.openPrivacyContract({
          success: () => {
            this.isRead = true
          },
          fail: () => {
            uni.showToast({
              title: '遇到错误',
              icon: 'error'
            })
          }
        })
      },
      to_policy(type) {
        // #ifdef APP
        plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=' + type)
        // #endif
        // #ifdef H5
        window.open(uni.wen.api.homeUrl + '/common/clause?id=' + type)
        // #endif
        // #ifdef MP
        uni.wen.toUrl(
          6,
          '/pages/web-view/index?url=' +
            encodeURIComponent(
              uni.wen.api.homeUrl + '/common/clause?id=' + type
            ),
          null
        )
        // #endif
      },
      getAvatarNicknameValue(res) {
        let that = this
        let obj = {}
        obj.avatar = res.avatarUrl
        obj.nickName = res.nickName
        obj.signature = ''
        obj.birth = ''
        obj.imagesubject = ''
        that.updateInfo(obj).finally(function () {
          setTimeout(function () {
            uni.wen.toUrl(-2, 0, null)
          }, 500)
        })
        return false
      },
      handleAgreePrivacyAuthorization() {
        let that = this
        if (that.isNeedAgreeMpPrivacy) {
          that.isNeedAgreeMpPrivacy = false
        }
      },
      button_agree() {
        let that = this
        that.setData({
          showClausePopup: false,
          is_argeen_policy: true
        })
        if (that.next > 0) {
          // 微信登录
          if (that.next == 1) {
            // #ifdef H5
            that.toMpAuth()
            // #endif
            // #ifndef H5
            that.getUserInfo()
            // #endif
          } else if (that.next == 2) {
            // apple登录
            that.appleLogin()
          } else if (that.next == 3) {
            that.qqLogin()
          }
        }
      }
    }
  }
</script>

<template>
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
    <view :class="'mini-page-body ' + global__platform__">
      <navBar
        :back="true"
        :iconTheme="iconTheme"
        :color="'rgba(' + color + ', ' + navbarTrans + ')'"
        :home="fph"
        :placeholder="false"
      >
      </navBar>

      <view class="title">
        <view class="hello">你好,</view>
        <view class="welcome">
          <text>欢迎来到岚客 </text>
          <text class="weixin">DISCOVER</text>
        </view>
      </view>

      <loginWechat v-if="true"></loginWechat>
      <loginPhone v-else></loginPhone>

      <!-- 是否同意协议 -->
      <view class="protocal">
        <view class="uni-padding-wrap">
          <view :class="['icon', { active: !flag }]" @click="change">
            <image v-if="flag" src="../../static/tabbar/213.svg"></image>
          </view>
          <view class="text">
            <text class="read" @click="change"> 阅读并同意 </text>
            <text style="font-weight: bold" @tap.stop.prevent="to_policy(21)"
              >《用户协议》</text
            >
            <text>与 </text>
            <text
              style="font-weight: bold"
              @tap.stop.prevent="openPrivacyContract"
            >
              《隐私政策》
            </text>
          </view>
        </view>
      </view>
      <!-- 图片 -->
      <view class="img">
        <image src="../../static/tabbar/login.svg" mode="aspectFit"> </image>
      </view>

      <u-popup
        :show="true"
        @close="shutShowClausePopup"
        mode="bottom"
        :safe-area-inset-bottom="false"
        :zIndex="99999991009"
      >
        <view class="clause-box">
          <view class="inner flex-column">
            <view class="title">请阅读并同意以下条款</view>
            <view class="content">
              <view @tap.stop.prevent="to_policy(21)" class="item"
                >《用户协议》</view
              >
              <view style="width: 10rpx"></view>
              <!-- #ifdef MP-WEIXIN -->
              <view @tap.stop.prevent="openPrivacyContract" class="item">{{
                mpPrivacyName
              }}</view>
              <!-- #endif -->
              <!-- #ifndef MP-WEIXIN -->
              <view @tap.stop.prevent="to_policy(22)" class="item"
                >《隐私政策》</view
              >
              <!-- #endif -->
            </view>
            <view class="bottom">
              <!-- #ifdef MP-WEIXIN -->
              <button
                class="u-reset-button agree_button"
                id="agree-btn"
                open-type="agreePrivacyAuthorization"
                @tap.stop.prevent="button_agree"
                @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
              >
                同意并继续
              </button>
              <!-- #endif -->
              <!-- #ifndef MP-WEIXIN -->
              <view class="agree_button" @tap.stop.prevent="button_agree"
                >同意并继续</view
              >
              <!-- #endif -->
            </view>
          </view>
        </view>
      </u-popup></view
    ></view
  >
</template>

<style lang="scss">
  .clause-box {
    @include background_color(page-box-background-color);
    height: 400rpx;
    border-top-right-radius: $uni-border-radius-lg-er;
    border-top-left-radius: $uni-border-radius-lg-er;
    padding-bottom: env(safe-area-inset-bottom);

    .inner {
      height: 400rpx;
      width: $page-content-body-width;
      margin: auto;
      justify-content: space-between;
      text-align: center;
      padding: 20rpx 0;
      box-sizing: border-box;

      .title {
        @include color(color-light-dark);
        font-size: $uni-font-size-lg;
      }

      .content {
        display: flex;
        margin: auto;

        .item {
          color: #23375a;
          font-size: $uni-font-size-sm-base;
        }
      }

      .bottom {
        .agree_button {
          background-color: $uni-color-follow;
          color: $uni-color-follow-font;
          height: 80rpx;
          line-height: 80rpx;
          width: $page-content-body-width;
          margin: auto;
          border-radius: $uni-border-radius-lg-er;
        }
      }
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .read {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 24rpx;
  }
  .img {
    margin-top: 298rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 367rpx;
      height: 420rpx;
    }
  }
  .custom-checkbox-input {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .custom-checkbox-input::before {
    position: absolute;
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
  }
  .custom-checkbox-input:checked::before {
    position: absolute;
    background-color: #b99b42; /* 选中状态的背景颜色 */
  }
  .welcome {
    position: relative;
    font-size: 24rpx;
    .weixin {
      margin-left: 20rpx;
      color: #20cd99;
    }
    .weixin::before {
      content: '';
      position: absolute;
      left: 77px;
      top: 54%;
      transform: translateY(-50%);
      width: 2rpx;
      height: 34rpx;
      background-color: #d8d8d8;
    }
  }

  .protocal {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60rpx;
    margin-left: 48rpx;

    .uni-padding-wrap {
      display: flex;
      align-items: center;
      column-gap: 12rpx;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22rpx;
        height: 22rpx;
        background: #000000;
        border-radius: 4rpx;
        border: 2rpx solid #000000;

        &.active {
          background-color: #fff;
        }

        image {
          width: 22rpx;
          height: 22rpx;
        }
      }

      .text {
        display: flex;
        align-items: center;
        font-size: 24rpx;
      }
    }
  }
  .login {
    box-sizing: border-box;
    width: 656rpx;
    height: 80rpx;
    background: #242424;
    border-radius: 40rpx 40rpx 40rpx 40rpx;
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    width: 100%px;
    height: 200rpx;
    padding-left: 48rpx;
    padding-top: 236rpx;
    .hello {
      width: 65px;
      height: 41px;
      margin-bottom: 20rpx;
      font-weight: bold;
      font-size: 28px;
      color: #000000;
    }
    span {
      width: 144px;
      height: 17px;
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      line-height: 17px;
      i {
        display: inline-block;
        font-family: Source Han Sans-Bold;
        font-weight: 700;
        font-size: 12px;
        color: #00c78b;
      }
    }
  }
  .container {
    width: 700rpx;
    height: 400rpx;
    box-sizing: border-box;
    padding-left: 48rpx;
    padding-right: 46rpx;
    .input {
      box-sizing: border-box;
      width: 656rpx;
      height: 80rpx;
      background: #ffffff;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 400;
      font-size: 28rpx;
      color: #c8c8c8;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-left: 88rpx;
    }
    .input-wrapper {
      position: relative;
      width: 100%;
      .code {
        box-sizing: border-box;
        margin-top: 40rpx;
        width: 656rpx;
        height: 80rpx;
        background: #ffffff;
        border-radius: 40rpx 40rpx 40rpx 40rpx;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 28rpx;
        color: #c8c8c8;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        padding-left: 88rpx;
      }

      .btn {
        font-family: Source Han Sans, Source Han Sans;
        position: absolute;
        right: 10rpx;
        top: 50%;
        transform: translateY(-50%);
        color: #000000;
        font-weight: 400;
        font-size: 28rpx;
        background-color: transparent;
      }
      .btn::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 2rpx;
        height: 40rpx;
        background-color: #d8d8d8;
      }
    }
  }
</style>
