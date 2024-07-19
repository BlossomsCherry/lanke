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
    <view class="mini-page-body">
      <view class="phone-page">
        <navBar
          :back="true"
          :home="true"
          :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
          :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'"
        >
        </navBar>
        <block v-if="checkOk">
          <!-- <view class="smsCodeLogin_22">
            <text decode="true" class="smsCodeLogin_14">请输入验证码</text>
            <view class="smsCodeLogin_15">
              <text decode="true" class="smsCodeLogin_16"
                >验证码已通过短信发送至+{{ lastCheckIdd }}</text
              >
              <text decode="true" class="smsCodeLogin_17">{{
                lastCheckedMobile
              }}</text>
            </view>
            <view class="smsCodeLogin_18">
              <input
                placeholder="请输入验证码"
                :value="code"
                @input="code_input"
                class="code"
                type="number"
                :maxlength="4"
              />
              <text decode="true" class="dsj">{{ countdown }}</text>
            </view>
            <button
              @tap.stop.prevent="loginPhone"
              class="btLogin"
              :loading="logining"
            >
              登录
            </button>
          </view> -->
        </block>
        <block v-else>
          <!-- <view class="getSmsCode_1"> -->
          <view class="container">
            <view class="title1">
              <view class="hello">你好,</view>
              <view class="welcome">
                <text>欢迎来到岚客 </text>
                <text class="weixin">DISCOVER</text>
              </view>
            </view>

            <view class="phone-input">
              <input
                placeholder="请输入手机号"
                :value="mobile"
                @input="mobile_input"
                type="number"
                :maxlength="11"
              />
            </view>
            <view class="code_input">
              <input
                type="number"
                :maxlength="4"
                placeholder="请输入验证码"
                :value="code"
                @input="code_input"
              />
              <text @tap.stop.prevent="check_phone()">发送验证码</text>
            </view>
            <!-- <button
              @tap.stop.prevent="check_phone()"
              class="btLogin"
              :loading="btnState3"
            >
              获取短信验证码
            </button> -->

            <view @tap.stop.prevent="loginPhone" class="login-btn"
              >立即登录</view
            >
          </view>
          <!-- </view> -->
        </block>
        <u-popup
          :show="showClausePopup"
          @close="shutShowClausePopup"
          mode="bottom"
          :safe-area-inset-bottom="false"
          :zIndex="99999991009"
        >
          <view class="clause-box"> </view>
        </u-popup>
        <u-popup
          :show="showCountryCodePopup"
          @close="shutCountryCodePopup"
          mode="bottom"
          :safe-area-inset-bottom="false"
          :zIndex="99999991009"
        >
          <view class="country-code-warap">
            <view class="inner">
              <view class="title">
                选择国际区号
                <i
                  class="mini-icon mini-shanchu2"
                  @tap.stop.prevent="shutCountryCodePopup"
                ></i>
              </view>
              <country-code @change="countryCountChange"> </country-code>
            </view>
          </view>
        </u-popup>
        <hover-ball v-if="isOfficial > 1" /><my-toast
          ref="mytoast"
          :isdistance="true"
          :toast="mytoast_data"
          @captcha="captchaHanlder"
        ></my-toast>
      </view>
    </view>
  </view>
</template>

<script>
  import myToast from '@/contrib/components/common/toast/toast'
  import navBar from '@/components/common/navbar/navbar'
  import hoverBall from '@/contrib/components/common/hover-ball/hover-ball'

  import countryCode from '@/components/country-code/country-code'

  const common = require('@/mixins/common')
  var options = {}
  common(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      myToast,
      navBar,
      hoverBall,
      countryCode
    },
    computed: {},
    data() {
      return {
        pagebgcolorClass: 'pagebg_white',
        fph: false,
        mytoast_data: {},
        pageTheme: 'default',
        page__scene__: 76,
        is_argeen_policy: false,
        mobile: '', //手机号
        next: 3,
        showClausePopup: false,
        btnState3: false,
        checkOk: false,
        lastCheckedMobile: '',
        lastCheckIdd: '',
        code: '', //验证码
        countdown: 0,
        logining: false,
        idd: 86,

        mpPrivacyName: '《隐私政策》',
        isNeedAgreeMpPrivacy: false,

        showCountryCodePopup: false
      }
    },
    onShow: function () {
      let that = this
      that.updateScene(76, 0)
      if (uni.$store.state.token) {
        uni.wen.toUrl(-3, 0, null)
      }
    },
    onLoad: function (options) {
      let that = this
      that.globalOnloadProcess(options)
      if (options.agreed == 1) {
        that.is_argeen_policy = true
      }

      // #ifdef MP-WEIXIN
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: res => {
            if (res.needAuthorization) {
              that.mpPrivacyName = res.privacyContractName
              that.isNeedAgreeMpPrivacy = true
            }
          }
        })
      }
      // #endif
    },
    onPullDownRefresh: function () {
      uni.stopPullDownRefresh()
    },
    methods: {
      captchaHanlder(res) {
        let that = this
        if (res.status == 'ok') {
          if (res.next == 'Refresh') {
            that.Refresh()
          }
        }
      },
      countryCountChange(idd) {
        let that = this
        that.idd = idd
        that.shutCountryCodePopup()
      },
      shutCountryCodePopup() {
        let that = this
        that.showCountryCodePopup = !that.showCountryCodePopup
      },
      argeen_policy() {
        let that = this
        // #ifdef MP-WEIXIN
        if (that.isNeedAgreeMpPrivacy) {
          that.showClausePopup = !that.showClausePopup
        } else {
          that.is_argeen_policy = !that.is_argeen_policy
        }
        // #endif
        // #ifndef MP-WEIXIN
        that.setData({
          is_argeen_policy: !this.is_argeen_policy
        })
        // #endif
      },
      handleAgreePrivacyAuthorization() {
        let that = this
        if (that.isNeedAgreeMpPrivacy) {
          that.isNeedAgreeMpPrivacy = false
        }
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
      loginPhone() {
        let that = this
        if (that.logining === true) {
          return false
        }

        that.logining = true

        uni.wen.util.doVibrateShort()

        uni.wen.util
          .request(
            uni.wen.api.ApiRootUrl + 'login/phone',
            {
              phone: that.lastCheckedMobile,
              idd: that.idd,
              code: that.code
            },
            'POST'
          )
          .then(function (res) {
            that.logining = false
            if (res.status) {
              //存储用户token
              uni.setStorageSync('token', res.data.token)
              uni.$store.commit('updateToken', res.data.token)

              uni.setStorageSync('userInfo', res.data.user)
              that.$store.commit('updateUserInfo', res.data.user)
              that.$store.commit('userUpdateTimes', 1)
              let device = ''
              // #ifdef APP
              device = 'app'
              // #endif
              // #ifdef MP
              device = 'mp'
              // #endif
              // #ifdef H5
              device = 'h5'
              // #endif

              if (uni.$store.state.websocket) {
                uni.$store.state.websocket.restart()
              }

              uni.wen.util
                .request(uni.wen.api.ApiRootUrl + 'user/plate')
                .then(function (res2) {
                  uni.$store.dispatch('userAddPlateAction', res2.data)
                })

              setTimeout(function () {
                uni.wen.toUrl(-3, 0, null)
              }, 500)
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
      },
      startCountdown() {
        let that = this
        const timer = setInterval(() => {
          if (that.countdown > 0) {
            that.countdown--
          } else {
            clearInterval(timer) // 倒计时结束时清除定时器
            that.setData({
              checkOk: false,
              lastCheckedMobile: '',
              lastCheckIdd: '',
              countdown: 0,
              code: ''
            })
          }
        }, 1000) // 每秒执行一次
      },
      code_input(e) {
        let that = this
        that.code = e.target.value
      },
      mobile_input(e) {
        let that = this
        that.mobile = e.target.value
      },
      check_phone(e) {
        let that = this
        if (that.mobile == '') {
          uni.showToast({
            title: '手机号不能为空！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (that.idd == 86 && !uni.wen.util.validatePhoneNumber(that.mobile)) {
          uni.showToast({ title: '非法手机号！', icon: 'none', duration: 2000 })
          return
        }
        if (!that.is_argeen_policy) {
          uni.wen.util.doVibrateShort()
          that.setData({
            showClausePopup: true,
            next: 3
          })
          return
        }
        that.Refresh()
      },
      to_policy(type) {
        if (type == 21) {
          // #ifdef APP
          plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=21')
          // #endif
          // #ifdef H5
          window.open(uni.wen.api.homeUrl + '/common/clause?id=21')
          // #endif
          // #ifdef MP
          uni.wen.toUrl(
            6,
            '/pages/web-view/index?url=' +
              encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=21'),
            null
          )
          // #endif
        } else if (type == 22) {
          // #ifdef APP
          plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=22')
          // #endif
          // #ifdef H5
          window.open(uni.wen.api.homeUrl + '/common/clause?id=22')
          // #endif
          // #ifdef MP
          uni.wen.toUrl(
            6,
            '/pages/web-view/index?url=' +
              encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=22'),
            null
          )
          // #endif
        }
      },
      Refresh() {
        let that = this
        if (that.btnState3 === true) {
          return false
        }

        that.btnState3 = true

        uni.wen.util.doVibrateShort()

        uni.wen.util
          .request(
            uni.wen.api.ApiRootUrl + 'login/phone/code',
            {
              phone: that.mobile,
              idd: that.idd
            },
            'POST'
          )
          .then(function (res) {
            that.btnState3 = false
            if (res.status) {
              that.setData({
                lastCheckedMobile: res.data.phone,
                lastCheckIdd: res.data.idd,
                countdown: res.data.ttl,
                code: '',
                checkOk: true
              })
              that.startCountdown()
            } else {
              if (res.code == 200045) {
                that.myToast({
                  type: 'captcha',
                  timeout: 2000,
                  isClick: true,
                  mask: 3,
                  uuid: 'captcha-xxxx',
                  next: 'Refresh'
                })
              } else {
                uni.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          })
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
            that.Refresh()
          }
        }
      },
      shutShowClausePopup() {
        let that = this
        that.setData({
          showClausePopup: !that.showClausePopup
        })
      },
      argeen_policy() {
        let that = this
        // #ifdef MP-WEIXIN
        if (that.isNeedAgreeMpPrivacy) {
          that.showClausePopup = !that.showClausePopup
        } else {
          that.is_argeen_policy = !that.is_argeen_policy
        }
        // #endif
        // #ifndef MP-WEIXIN
        that.setData({
          is_argeen_policy: !this.is_argeen_policy
        })
        // #endif
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mini-page-body {
    .phone-page {
      background-color: #f7f7f9;
      min-height: 100vh;
    }

    .container {
      display: flex;
      flex-direction: column;
      row-gap: 40rpx;
      background-color: #f7f7f9;
      padding: 225rpx 48rpx 0 48rpx;

      .phone-input {
        display: flex;
        align-items: center;
        width: 656rpx;
        height: 80rpx;
        padding: 0 88rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        background-color: #fff;
        box-sizing: border-box;
      }

      .code_input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 656rpx;
        height: 80rpx;
        padding: 0 88rpx;
        padding-right: 62rpx;
        background: #ffffff;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #c8c8c8;
        box-sizing: border-box;

        text {
          position: relative;
          font-size: 28rpx;
          color: #000000;
          font-weight: bold;

          &::before {
            position: absolute;
            left: -26rpx;
            bottom: 0;
            content: '';
            width: 2rpx;
            height: 40rpx;
            background: #d8d8d8;
          }
        }
      }

      .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 656rpx;
        height: 80rpx;
        background: #242424;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #ffffff;
      }
    }
  }
  //本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm
  button::after {
    border: none;
    width: auto;
  }
  input {
    outline: none;
    border: none;
    list-style: none;
    width: auto;
  }

  .title1 {
    margin-bottom: 80rpx;
    .hello {
      width: 65px;
      height: 41px;
      margin-bottom: 20rpx;
      font-weight: bold;
      font-size: 28px;
      color: #000000;
    }
    .welcome {
      height: 17px;
      font-weight: 400;
      font-size: 24rpx;
      color: #000000;
      line-height: 17px;
      .weixin {
        position: relative;
        margin-left: 24rpx;
        font-weight: bold;
        color: #00c78b;

        &::before {
          position: absolute;
          top: 50%;
          left: -15rpx;
          transform: translateY(-50%);
          content: '';
          width: 2rpx;
          height: 23rpx;
          background-color: #000000;
        }
      }
    }
  }

  .getSmsCode_1 {
    width: 749rpx;
    min-height: 1288rpx;
    padding: 0 48rpx;
    background-color: #f7f7f9;
  }
  .getSmsCode_1 .getSmsCode_5 {
    white-space: normal;
    width: 420rpx;
    height: 39rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 42rpx;
    margin-left: 60rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    @include color(color-darkest);
    font-size: 37rpx;
    line-height: 39rpx;
  }
  .getSmsCode_1 .getSmsCode_6 {
    white-space: normal;
    width: 629rpx;
    height: 26rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 24rpx;
    margin-left: 60rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    font-size: 24rpx;
    line-height: 26rpx;
  }
  .getSmsCode_1 .getSmsCode_6 .mini-icon {
    display: inline;
  }
  .getSmsCode_6 .quanicon {
    float: left;
    margin-right: 10rpx;
    color: #c8c8c8;
  }
  .getSmsCode_1 .getSmsCode_6 .getSmsCode_7 {
    white-space: normal;
    width: auto;
    height: 26rpx;
    padding: 0rpx;
    margin-top: 0rpx;
    margin-left: 0rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #c8c8c8;
    font-size: 24rpx;
    line-height: 26rpx;
  }
  .getSmsCode_1 .getSmsCode_6 .getSmsCode_8 {
    white-space: normal;
    width: auto;
    height: 26rpx;
    padding: 0rpx;
    margin-top: 0rpx;
    margin-left: 4rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #0c4a80;
    font-size: 24rpx;
    line-height: 26rpx;
  }
  .getSmsCode_1 .getSmsCode_6 .getSmsCode_9 {
    white-space: normal;
    width: auto;
    height: 26rpx;
    padding: 0rpx;
    margin-top: 0rpx;
    margin-left: 4rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #c8c8c8;
    font-size: 24rpx;
    line-height: 26rpx;
  }
  .getSmsCode_1 .getSmsCode_6 .getSmsCode_10 {
    white-space: normal;
    width: auto;
    height: 26rpx;
    padding: 0rpx;
    margin-top: 0rpx;
    margin-left: 6rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #0c4a80;
    font-size: 24rpx;
    line-height: 26rpx;
  }
  .getSmsCode_1 .getSmsCode_11 {
    padding-left: 88rpx;
    width: 656rpx;
    height: 80rpx;
    background: #ffffff;
    border-radius: 40rpx;
    box-sizing: border-box;
  }
  .getSmsCode_1 .getSmsCode_11 .getSmsCode_12 {
    @include color(color-darkest);
    white-space: normal;
    min-width: 80rpx;
    max-width: 110rpx;
    height: 25rpx;
    padding: 0rpx;
    margin-top: 30rpx;
    margin-left: 22rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    font-size: 32rpx;
    line-height: 25rpx;
    text-align: right;
  }
  .getSmsCode_1 .getSmsCode_11 .mini-xiajiantou {
    @include color(color-lighter-er-dark);
    font-size: $uni-font-size-lg;
    line-height: 32rpx;
    float: left;
    margin-top: 30rpx;
    transform: scale(0.6);
  }
  .getSmsCode_1 .getSmsCode_11 .getSmsCode_13 {
    white-space: normal;
    width: 20rpx;
    height: 12rpx;
    padding: 0rpx;
    margin-top: 39rpx;
    margin-left: 2rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    font-size: 11rpx;
    line-height: 12rpx;
  }
  .getSmsCode_1 .getSmsCode_11 .getSmsCode_14 {
    white-space: normal;
    width: 2rpx;
    height: 26rpx;
    padding: 0rpx;
    margin-top: 32rpx;
    margin-left: 12rpx;
    float: left;
    background-color: #e1e1e1;
    text-align: left;
    border-radius: 0rpx;
    font-size: 19rpx;
    line-height: 20rpx;
  }
  .getSmsCode_1 .getSmsCode_11 .mobile {
    width: 656rpx;
    height: 80rpx;
    font-size: 28rpx;
    color: #c8c8c8;
    line-height: 40rpx;
  }
  .getSmsCode_1 .getSmsCode_16 {
    white-space: normal;
    width: 484rpx;
    height: 25rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 20rpx;
    margin-left: 61rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #c8c8c8;
    font-size: 23rpx;
    line-height: 25rpx;
  }
  .getSmsCode_1 .btLogin {
    white-space: normal;
    width: 629rpx;
    height: 86rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 32rpx;
    margin-left: 59rpx;
    float: left;
    background-color: $uni-color-follow;
    color: $uni-color-follow-font;
    text-align: center;
    justify-content: center;
    border-radius: 10rpx;
    cursor: pointer;
    font-size: 32rpx;
    line-height: 86rpx;
  }
  .smsCodeLogin_22 {
    white-space: normal;
    width: 749rpx;
    height: 1167rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 0rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    font-size: 8rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_14 {
    white-space: normal;
    width: 318rpx;
    height: 45rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 30rpx;
    margin-left: 57rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    @include color(color-darkest);
    font-size: 40rpx;
    line-height: 45rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_15 {
    white-space: normal;
    width: 634rpx;
    height: 31rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 19rpx;
    margin-left: 56rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    font-size: 24rpx;
    line-height: 31rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_15 .smsCodeLogin_16 {
    white-space: normal;
    width: auto;
    height: 40rpx;
    padding: 0rpx;
    margin-top: 0rpx;
    margin-left: 0rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    color: #c8c8c8;
    font-size: 28rpx;
    line-height: 40rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_15 .smsCodeLogin_17 {
    white-space: normal;
    width: auto;
    height: 40rpx;
    padding: 0rpx;
    display: block;
    margin-left: 4rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    @include color(color-lighter-er-dark);
    font-size: 28rpx;
    line-height: 38rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_18 {
    white-space: normal;
    width: 628rpx;
    height: 90rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 47rpx;
    margin-left: 60rpx;
    float: left;
    @include background_color(page-gray-background-color);
    text-align: left;
    border-radius: 10rpx;
    font-size: 41rpx;
    line-height: 65rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_18 .code {
    white-space: normal;
    width: 522rpx;
    height: 43rpx;
    min-height: 43rpx;
    padding: 0rpx;
    margin-top: 22rpx;
    margin-left: 20rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    @include color(color-light-dark);
    font-size: 27rpx;
    line-height: 43rpx;
  }
  .smsCodeLogin_22 .smsCodeLogin_18 .dsj {
    white-space: normal;
    width: 38rpx;
    height: 32rpx;
    padding: 0rpx;
    margin-top: 28rpx;
    margin-left: 18rpx;
    float: left;
    text-align: left;
    border-radius: 0rpx;
    @include color(color-lightest-dark);
    font-size: 26rpx;
    line-height: 32rpx;
  }
  .smsCodeLogin_22 .btLogin {
    white-space: normal;
    width: 629rpx;
    height: 86rpx;
    padding: 0rpx;
    clear: both;
    margin-top: 27rpx;
    margin-left: 59rpx;
    float: left;
    background-color: $uni-color-follow;
    color: $uni-color-follow-font;
    text-align: center;
    justify-content: center;
    border-radius: 10rpx;
    cursor: pointer;
    font-size: 32rpx;
    line-height: 86rpx;
  }

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

  .country-code-warap {
    width: 750rpx;
    @include background_color(page-box-item-background-color);
    border-top-right-radius: $uni-border-radius-lg-er;
    border-top-left-radius: $uni-border-radius-lg-er;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
    padding: 20rpx 0 40rpx;
    .inner {
      width: $page-content-body-width;
      /* #ifndef APP-NVUE */
      padding-bottom: env(safe-area-inset-bottom);
      margin: auto;
      /* #endif */
      /* #ifdef APP-NVUE */
      margin-left: 20rpx;
      margin-right: 20rpx;
      /* #endif */

      .title {
        width: 100%;
        @include color(color-lighter-er-dark);
        position: relative;
        text-align: center;
        margin-bottom: 20rpx;
        .mini-icon {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
</style>
