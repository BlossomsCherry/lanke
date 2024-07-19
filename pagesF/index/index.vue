<script>
  import myToast from '@/contrib/components/common/toast/toast'
  import navBar from '@/components/common/navbar/navbar'
  import hoverBall from '@/contrib/components/common/hover-ball/hover-ball'

  import OpendateWindow from '@/pages/common/components/opendate-Window/opendate-Window.vue'

  const mixins = require('@/mixins/user')
  const common = require('@/mixins/common')
  var options = {}
  mixins(options)
  common(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      myToast,
      hoverBall,
      navBar,
      OpendateWindow
    },
    computed: {
      global_ipad: {
        get() {
          let that = this
          return that.$store.state.ipad
        },
        set(v) {}
      },
      config_app_mode: {
        get() {
          let that = this
          return that.$store.state.config.app.mode
        },
        set(v) {}
      },
      config_page_login_bg_style: {
        get() {
          let that = this
          if (
            that.$store.state.config.page.login &&
            that.$store.state.config.page.login.bg
          ) {
            return (
              'background-image: url(' +
              that.$store.state.config.page.login.bg +
              ');'
            )
          }
          return ''
        },
        set(v) {}
      },
      config_page_login_scroll: {
        get() {
          let that = this
          return that.$store.state.config.page.login.scroll
        },
        set(v) {}
      },
      config_about_slogan: {
        get() {
          let that = this
          return that.$store.state.config.about.slogan
        },
        set(v) {}
      },
      config_about_logo: {
        get() {
          let that = this
          return that.$store.state.config.about.logo
        },
        set(v) {}
      },
      config_about_name: {
        get() {
          let that = this
          return that.$store.state.config.about.name
        },
        set(v) {}
      },
      config_user_login_force: {
        get() {
          let that = this
          return that.$store.state.config.user.login_force
        },
        set(v) {}
      },
      config_user_login_style: {
        get() {
          let that = this

          if (
            that.$store.state.config.user &&
            that.$store.state.config.user.login_style
          ) {
            return that.$store.state.config.user.login_style
          }
          return [0]
        },
        set(v) {}
      }
    },
    data() {
      return {
        pagebgcolorClass: 'pagebg_white',
        fph: false,
        mytoast_data: {},
        pageTheme: 'default',
        page__scene__: 14,
        video: false,
        btnState: false,
        btnState2: false,
        btnState3: false,
        unique: '',
        showSelectAvatarModel: false,
        is_argeen_policy: false,
        showApplogin: false,
        showClausePopup: false,
        next: 0,
        showMoreLoginPopup: false,

        mpPrivacyName: '《隐私政策》',
        isNeedAgreeMpPrivacy: false
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
      that.globalOnloadProcess(options)

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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let that = this
      uni.stopPullDownRefresh()
      that.updateScene(14, 0)

      if (uni.$store.state.token) {
        uni.wen.toUrl(-3, 0, null)
      }
    },
    onPullDownRefresh: function () {
      uni.stopPullDownRefresh()
    },
    methods: {
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
      shutShowMoreLoginPopup() {
        let that = this
        that.setData({
          showMoreLoginPopup: !that.showMoreLoginPopup
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
            that.qqLogin()
          }
        }
      },
      shutShowClausePopup() {
        let that = this
        that.setData({
          showClausePopup: !that.showClausePopup
        })
      },
      qqLogin() {
        let that = this
        if (!that.is_argeen_policy) {
          uni.wen.util.doVibrateShort()
          that.setData({
            showClausePopup: true,
            next: 3
          })
          return
        }

        that.setData({
          btnState3: true
        })

        uni.login({
          provider: 'qq',
          success: function (loginRes) {
            // 登录成功
            uni.getUserInfo({
              provider: 'qq',
              success: function (info) {
                // 获取用户信息成功, info.authResult中保存登录认证数据
                if (info && info.errMsg === 'getUserInfo:ok' && info.userInfo) {
                  uni.wen.util
                    .request(
                      uni.wen.api.ApiRootUrl + 'app/login/qq',
                      info.userInfo,
                      'POST'
                    )
                    .then(function (res) {
                      uni.loading(false)
                      if (res.code == 200) {
                        that.setData({
                          btnState: false
                        })

                        uni.setStorageSync('token', res.data.token)
                        uni.$store.commit('updateToken', res.data.token)

                        uni.setStorageSync('userInfo', res.data.user)
                        that.$store.commit('updateUserInfo', res.data.user)
                        that.$store.commit('userUpdateTimes', 1)
                        uni.wen.util
                          .request(uni.wen.api.ApiRootUrl + 'user/plate')
                          .then(function (res2) {
                            uni.$store.dispatch('userAddPlateAction', res2.data)
                          })
                        // #ifdef MP-WEIXIN
                        wx.setBackgroundFetchToken({
                          token: res.data.token
                        })
                        // #endif
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

                        uni.wen.toUrl(-2, 0, null)
                      } else {
                        uni.showModal({
                          title: '登录失败',
                          content: res.message,
                          showCancel: false,
                          confirmText: '朕知道了',
                          confirmColor: that.primaryColor
                        })
                      }
                    })
                } else {
                  uni.wen.util.log(info)
                  that.setData({
                    btnState3: false
                  })
                }
              }
            })
          },
          fail: function (err) {
            uni.showToast({
              title: '错误码' + err.code,
              icon: 'none'
            })
            uni.wen.util.log(err)
            that.setData({
              btnState3: false
            })
          }
        })
      },
      appleLogin() {
        let that = this
        if (!that.is_argeen_policy) {
          uni.wen.util.doVibrateShort()
          that.setData({
            showClausePopup: true,
            next: 2
          })
          return
        }

        that.setData({
          btnState2: true
        })

        uni.login({
          provider: 'apple',
          success: function (loginRes) {
            // 登录成功
            uni.getUserInfo({
              provider: 'apple',
              success: function (info) {
                // 获取用户信息成功, info.authResult中保存登录认证数据
                if (info && info.errMsg === 'getUserInfo:ok' && info.userInfo) {
                  uni.wen.util
                    .request(
                      uni.wen.api.ApiRootUrl + 'app/login/apple',
                      info.userInfo,
                      'POST'
                    )
                    .then(function (res) {
                      uni.loading(false)
                      if (res.code == 200) {
                        that.setData({
                          btnState: false
                        })

                        uni.setStorageSync('token', res.data.token)
                        uni.$store.commit('updateToken', res.data.token)

                        uni.setStorageSync('userInfo', res.data.user)
                        that.$store.commit('updateUserInfo', res.data.user)
                        that.$store.commit('userUpdateTimes', 1)
                        // #ifdef MP-WEIXIN
                        wx.setBackgroundFetchToken({
                          token: res.data.token
                        })
                        // #endif
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

                        uni.wen.toUrl(-2, 0, null)
                      } else {
                        that.setData({
                          btnState2: false
                        })
                        uni.showModal({
                          title: '登录失败',
                          content: res.message,
                          showCancel: false,
                          confirmText: '朕知道了',
                          confirmColor: that.primaryColor
                        })
                      }
                    })
                } else {
                  uni.wen.util.log(info)
                }
              }
            })
          },
          fail: function (err) {
            uni.showToast({
              title: '错误码' + err.code,
              icon: 'none'
            })
            uni.wen.util.log(err)
            that.setData({
              btnState2: false
            })
          }
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
      /***
       * 获取用户信息
       */
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
                // uni.wen.toUrl(-2, 0, null)
                const userInfo = that.$store.state.userInfo
                uni.navigateTo({
                  url: `/pagesF/gender/index?avatar=${userInfo.user_avatar}&nickName=${userInfo.user_name}`
                })
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
                // uni.wen.toUrl(-2, 0, null)
                const userInfo = that.$store.state.userInfo
                uni.navigateTo({
                  url: `/pagesF/gender/index?avatar=${userInfo.user_avatar}&nickName=${userInfo.user_name}`
                })
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

        // #ifdef APP
        that
          .appLoginByWeixin()
          .then(res => {
            if (
              that.$store.state.userInfo.phone &&
              that.$store.state.userInfo.phone.length > 5
            ) {
              uni.wen.toUrl(-2, 0, null)
            } else if (that.$store.state.config.app.phone.pages.includes(14)) {
              // that.myToast({
              // 	type:'getPhone',
              // 	content: '绑定手机号',
              // 	timeout: 2000,
              // 	isClick:true,
              // });
              uni.wen.toUrl(-2, 0, null)
            } else {
              uni.wen.toUrl(-2, 0, null)
            }
            that.setData({
              btnState: false
            })
          })
          .catch(err => {
            uni.showToast({
              title: err.message,
              icon: 'none'
            })
            that.setData({
              btnState: false
            })
          })
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

      toTiaoKuan() {
        uni.wen.toUrl(6, '/pages/common/clause?type=21', null)
      },

      /**
       * 返回登陆
       */
      back: function () {
        uni.reLaunch({
          url: '/pages/tabbar/index/index'
        })
      },
      toMpAuth() {
        let that = this
        // 传入一个唯一值，后端唯一值作为键存储token
        let unique = Date.now() + Math.floor(Math.random() * 100)
        let pre_scene = that.$store.state.pre_scene
        let pre_scene_id = that.$store.state.pre_scene_id
        let url =
          uni.wen.api.WebRootUrl +
          'common/webview?action=mplogin&unique=' +
          unique +
          '&pre_scene=' +
          pre_scene +
          '&pre_scene_id=' +
          pre_scene_id

        window.open(url)
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
    <navBar
      :back="true"
      :iconTheme="iconTheme"
      :color="'rgba(' + color + ', ' + navbarTrans + ')'"
      :home="fph"
      :placeholder="false"
    ></navBar>

    <view
      :class="
        'mini-page-body ' +
        config_app_mode +
        ' ' +
        global__platform__ +
        (global_ipad ? ' ipad' : '')
      "
    >
      <view class="title1">
        <view class="hello">你好,</view>
        <view class="welcome">
          <text>欢迎来到岚客 </text>
          <text class="weixin">DISCOVER</text>
        </view>
      </view>

      <view class="contain">
        <view class="login_bg">
          <!-- #ifdef MP-WEIXIN -->
          <button
            class="mb20 wechat"
            :loading="btnState"
            @tap.stop.prevent="getUserInfo"
            formType="submit"
            v-if="config_user_login_style.includes(0)"
          >
            <!-- <block v-if="config_app_mode == 'examine'"> 立即登录 </block> -->
            <!-- <block v-else> -->
            <image src="../../static/tabbar/weixing.svg"></image>
            通过微信登录
            <!-- </block> -->
          </button>
          <!-- #endif -->
          <button
            class="mb20"
            style="background-color: #fff; color: #c8c8c8"
            @tap.stop.prevent="shutShowMoreLoginPopup"
          >
            手机号登录/注册
          </button>
          <view class="toTiaoKuan">
            <view
              :class="['icon', { active: !is_argeen_policy }]"
              @tap.stop.prevent="argeen_policy"
            >
              <image
                v-if="is_argeen_policy"
                src="../../static/tabbar/213.svg"
              ></image>
            </view>
            我已阅读并同意
            <view @tap.stop.prevent="to_policy(21)" class="clause"
              >《用户协议》</view
            >
            与
            <!-- #ifdef MP-WEIXIN -->
            <view @tap.stop.prevent="openPrivacyContract" class="clause"
              >《隐私政策》</view
            >
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <view @tap.stop.prevent="to_policy(22)" class="clause"
              >《隐私政策》</view
            >
            <!-- #endif -->
          </view>

          <!-- 图片 -->
          <view class="img" style="position: fixed; bottom: 30rpx">
            <image src="../../static/tabbar/login.svg" mode="aspectFit">
            </image>
          </view>
        </view>
      </view>
      <u-popup
        :show="showClausePopup"
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
      </u-popup>
      <u-popup
        :show="showMoreLoginPopup"
        @close="shutShowMoreLoginPopup"
        mode="bottom"
        :safe-area-inset-bottom="false"
        :zIndex="999999910"
      >
        <view class="more-login-box">
          <view class="inner flex-column">
            <view class="title"
              >选择登录方式
              <i
                class="chacha mini-icon mini-shanchu2"
                @tap.stop.prevent="shutShowMoreLoginPopup"
              ></i>
            </view>
            <view class="content">
              <view
                class="item"
                @tap.stop.prevent="qqLogin"
                v-if="
                  config_user_login_style.includes(0) &&
                  config_user_login_style.includes(3)
                "
              >
                <i class="qq-icon mini-icon mini-QQ"></i>
              </view>
              <view
                class="item"
                @tap.stop.prevent="
                  toSliderUrl(
                    6,
                    '/pages/common/phone?agreed=' + (is_argeen_policy ? 1 : 0)
                  )
                "
                v-if="config_user_login_style.includes(2)"
              >
                <i class="shoujihao-icon mini-icon mini-shoujihao"></i>
              </view>
            </view>
            <view class="bottom">
              <view class="toTiaoKuan">
                <i
                  @tap.stop.prevent="argeen_policy"
                  class="mini-icon mini-duigouxiao argeened"
                  v-if="is_argeen_policy"
                  style="font-size: 15px"
                ></i>
                <i
                  @tap.stop.prevent="argeen_policy"
                  class="mini-icon mini-quan"
                  v-else
                  style="font-size: 17px"
                ></i>
                我已阅读并同意
                <view @tap.stop.prevent="to_policy(21)" class="clause"
                  >《用户协议》</view
                >
                ,
                <!-- #ifdef MP-WEIXIN -->
                <view @tap.stop.prevent="openPrivacyContract" class="clause"
                  >《隐私政策》</view
                >
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->
                <view @tap.stop.prevent="to_policy(22)" class="clause"
                  >《隐私政策》</view
                >
                <!-- #endif -->
              </view>
            </view>
          </view>
        </view>
      </u-popup>
      <OpendateWindow
        v-model="showSelectAvatarModel"
        @send="getAvatarNicknameValue"
        @close="toSliderUrl(-2, 0)"
      ></OpendateWindow>
      <hover-ball v-if="isOfficial > 1" />
      <my-toast
        ref="mytoast"
        :isdistance="true"
        :toast="mytoast_data"
      ></my-toast>
    </view>
  </view>
</template>

<style lang="scss">
  .title1 {
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

  @keyframes scroll {
    100% {
      background-position: 0px -2300px;
    }
  }

  .login_bg {
    width: 100%;
    z-index: 100;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    bottom: 20px;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .login_bg .mb20 {
    width: 656rpx;
    height: 80rpx;
    background: #242424;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #ffffff;
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 26px;

    image {
      margin-right: 18rpx;
      width: 50rpx;
      height: 50rpx;
    }
    .chars {
      display: inline;
      letter-spacing: 0;
      margin-right: 4rpx;
    }
  }

  .examine {
    .login_bg .mb20 {
      /* #ifdef MP-WEIXIN */
      .mini-icon {
        display: none;
      }

      /* #endif */
    }
  }

  .login_bg .mb20.apple {
    background-color: #ffffff;
    border-color: #000000;
    color: #000000;
  }

  .login_bg .mb20.qq {
    background-color: #7bd4ef;
    border-color: #7bd4ef;
    color: #ffffff;
  }

  .login_bg .toTiaoKuan {
    display: flex;
    align-items: center;
    font-size: 24rpx;
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

    .clause {
      font-weight: bold;
    }
  }

  .login_bg .back {
    border: none !important;
    color: #f5f5f5 !important;
    background: transparent !important;
    font-size: $uni-font-size-sm-base;

    .mini-icon {
      font-size: $uni-font-size-sm-base;
      display: inline;
    }
  }

  .android {
    .mb20.apple {
      display: none !important;
    }
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

  .more-login-box {
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
        position: relative;

        .chacha {
          position: absolute;
          right: 0;
          top: 0;
          @include color(color-lightest-dark);
        }
      }

      .content {
        display: flex;
        margin: auto;

        .item {
          font-size: $uni-font-size-sm-base;
          border: 3rpx solid #e9e9e9;
          border-radius: 50%;
          width: 90rpx;
          height: 90rpx;
          line-height: 90rpx;
          margin: 0 40rpx;
          .shoujihao-icon {
            font-size: 50rpx;
            @include color(color-light-dark);
          }
          .qq-icon {
            font-size: 50rpx;
            color: #7bd4ef;
          }
        }
      }

      .bottom {
        .toTiaoKuan {
          justify-content: center;
          font-size: $uni-font-size-sm;
          @include color(color-lightest-dark);
          display: flex;
          align-items: center;

          .mini-icon {
            @include color(color-lightest-dark);
            margin-right: 10rpx;
            display: inline;
          }

          .mini-icon.argeened {
            @include color(color-light-dark);
          }

          .clause {
            font-weight: bold;
            font-size: 24rpx;
            color: #000000;
          }
        }
      }
    }
  }

  .ipad .mb20.wechat,
  .global-device-app .examine.ios .mb20.wechat {
    display: none;
  }
</style>
