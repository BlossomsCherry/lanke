<script>
  const mixins = require('@/mixins/user')
  const common = require('@/mixins/common')
  var options = {}
  mixins(options)
  common(options)

  export default {
    mixins: [{ methods: options }],

    data() {
      return {
        showClausePopup: false,
        isNeedAgreeMpPrivacy: false
      }
    },
    methods: {
      getUserInfo: function (e) {
        let that = this
        if (!that.is_argeen_policy) {
          uni.wen.util.doVibrateShort()
          that.setData({
            showClausePopup: true,
            next: 1
          })
          return
        }

        that.setData({
          btnState: true
        })

        // #ifdef MP-WEIXIN
        that
          .loginByWeixin()
          .then(res => {
            if (res.select == 1 && uni.wen.util.hostVersionSupport('2.21.2')) {
              that.setData({
                showSelectAvatarModel: true,
                btnState: false
              })
            } else {
              that.setData({
                btnState: false
              })

              if (
                that.$store.state.userInfo.phone &&
                that.$store.state.userInfo.phone.length > 5
              ) {
                uni.wen.toUrl(-2, 0, null)
              } else if (
                that.$store.state.config.app.phone.pages.includes(14)
              ) {
                that.myToast({
                  type: 'getPhone',
                  content: '绑定手机号',
                  timeout: 2000,
                  isClick: true
                })
              } else {
                uni.wen.toUrl(-2, 0, null)
              }
            }
          })
          .catch(err => {
            console.log(err)
            that.setData({
              btnState: false
            })
          })
        // #endif
      }
    }
  }
</script>

<template>
  <view class="login-wechat">
    <view class="weChat" @tap.stop.prevent="getUserInfo">
      <image src="../../static/tabbar/weixing.svg"></image>
      <text>一键授权登录</text>
    </view>
    <view class="phone">
      <text>手机号登录/注册</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .login-wechat {
    display: flex;
    flex-direction: column;
    row-gap: 40rpx;
    width: 700rpx;
    box-sizing: border-box;
    padding-left: 48rpx;
    padding-right: 46rpx;
    margin-bottom: 60rpx;

    .weChat,
    .phone {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 656rpx;
      height: 80rpx;
      font-size: 28rpx;
      color: #ffffff;
      background: #242424;
      border-radius: 40rpx;

      image {
        margin-right: 18rpx;
        width: 50rpx;
        height: 50rpx;
      }
    }

    .phone {
      background-color: #fff;
      color: #c8c8c8;
    }
  }
</style>
