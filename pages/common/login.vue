<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view :class="'mini-page-body ' +config_app_mode + ' ' + global__platform__ +  (global_ipad ? ' ipad' : '') ">
      <view class="contain">
        <navBar :back="true" :home="true" iconTheme="white" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent" />
        <view :class="'mask-layer ' + (config_page_login_scroll == 1 ? 'bg-scroll' : '') " :style="config_page_login_bg_style" />
        <view class="mask-layer2"></view>
        <!-- <image class="back-image" mode="aspectFill" :src="config_user_login_bg"></image> -->
        <view class="logo-box">
          <image :src="config_about_logo" class="logo"></image>
          <view class="logosub">{{ config_about_slogan }}</view>
        </view>
        <view class="login_bg">
          <!-- #ifdef H5 -->
          <button class="mb20 wechat" :loading="btnState" @tap.stop.prevent="toMpAuth" v-if="config_user_login_style.includes(0)">
			<block v-if="config_app_mode == 'examine'">
				立即登录
			</block>
			<block v-else>
				<i class="mini-icon mini-weixin1"></i>
				通过微信登录
			</block>
          </button>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <button class="mb20 wechat" :loading="btnState" @tap.stop.prevent="getUserInfo" formType="submit" v-if="config_user_login_style.includes(0)">
            <block v-if="config_app_mode == 'examine'">
            	立即登录
            </block>
            <block v-else>
				<i class="mini-icon mini-weixin1"></i>
				通过微信登录
            </block>
          </button>
          <!-- #endif -->
          <!-- #ifdef APP -->
          <button class="mb20 wechat" :loading="btnState" @tap.stop.prevent="getUserInfo" formType="submit" v-if="config_user_login_style.includes(0)">
            <block v-if="config_app_mode == 'examine'">
            	立即登录
            </block>
            <block v-else>
            	<i class="mini-icon mini-weixin1"></i>
            	通过微信登录
            </block>
          </button>
          <!-- #endif -->
          <!-- #ifdef APP || H5 -->
          <button :loading="btnState2" class="mb20 apple" @tap.stop.prevent="appleLogin" v-if="config_user_login_style.includes(1)">
            <i class="mini-icon mini-pingguo"></i>
            通过
            <view class="chars">Apple</view>
            登录
          </button>
          <!-- #endif -->
		  <!-- #ifndef MP -->
		  <button class="mb20 qq" :loading="btnState3" @tap.stop.prevent="qqLogin" formType="submit" v-if="!config_user_login_style.includes(0) && config_user_login_style.includes(3)">
		    <i class="mini-icon mini-QQ"></i>
		    通过QQ登录
		  </button>
		  <!-- #endif -->

          <button class="back" @tap.stop.prevent="shutShowMoreLoginPopup">
            其他登录方式
            <i class="mini-icon mini-youjiantou"></i>
          </button>
          <view style="height: 15vh;display: block;"></view>
          <view class="toTiaoKuan">
            <i @tap.stop.prevent="argeen_policy" class="mini-icon mini-duigouxiao argeened" v-if="is_argeen_policy"></i>
            <i @tap.stop.prevent="argeen_policy" class="mini-icon mini-quan" v-else></i>
            我已阅读并同意
            <view @tap.stop.prevent="to_policy(21)" style="color: #eee">《用户协议》</view>
            ,
			<!-- #ifdef MP-WEIXIN -->
			<view @tap.stop.prevent="openPrivacyContract" style="color: #eee">《隐私政策》</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view @tap.stop.prevent="to_policy(22)" style="color: #eee">《隐私政策》</view>
			<!-- #endif -->

          </view>
        </view>
      </view>
      <u-popup :show="showClausePopup" @close="shutShowClausePopup" mode="bottom" :safe-area-inset-bottom="false" :zIndex="99999991009">
        <view class="clause-box">
          <view class="inner flex-column">
            <view class="title">请阅读并同意以下条款</view>
            <view class="content">
              <view @tap.stop.prevent="to_policy(21)" class="item">《用户协议》</view>
              <view style="width: 10rpx;"></view>
			  <!-- #ifdef MP-WEIXIN -->
			  <view @tap.stop.prevent="openPrivacyContract" class="item">{{ mpPrivacyName }}</view>
			  <!-- #endif -->
			  <!-- #ifndef MP-WEIXIN -->
			  <view @tap.stop.prevent="to_policy(22)" class="item">《隐私政策》</view>
			  <!-- #endif -->

            </view>
            <view class="bottom">
              <!-- #ifdef MP-WEIXIN -->
              <button class="u-reset-button agree_button" id="agree-btn" open-type="agreePrivacyAuthorization" @tap.stop.prevent="button_agree" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意并继续</button>
              <!-- #endif -->
			  <!-- #ifndef MP-WEIXIN -->
			  <view class="agree_button" @tap.stop.prevent="button_agree">同意并继续</view>
			  <!-- #endif -->
            </view>
          </view>

        </view>
      </u-popup>
      <u-popup :show="showMoreLoginPopup" @close="shutShowMoreLoginPopup" mode="bottom" :safe-area-inset-bottom="false" :zIndex="999999910">
        <view class="more-login-box">
          <view class="inner flex-column">
            <view class="title">选择登录方式
              <i class="chacha mini-icon mini-shanchu2" @tap.stop.prevent="shutShowMoreLoginPopup"></i>
            </view>
            <view class="content">
				<view class="item" @tap.stop.prevent="qqLogin" v-if="config_user_login_style.includes(0) && config_user_login_style.includes(3)">
				  <i class="qq-icon mini-icon mini-QQ"></i>
				</view>
				<view class="item" @tap.stop.prevent="toSliderUrl(6, '/pages/common/phone?agreed=' + ( is_argeen_policy ? 1 : 0 ))" v-if="config_user_login_style.includes(2)">
				<i class="shoujihao-icon mini-icon mini-shoujihao"></i>
				</view>
            </view>
            <view class="bottom">
              <view class="toTiaoKuan">
                <i @tap.stop.prevent="argeen_policy" class="mini-icon mini-duigouxiao argeened" v-if="is_argeen_policy" style="font-size: 15px;"></i>
                <i @tap.stop.prevent="argeen_policy" class="mini-icon mini-quan" v-else style="font-size: 17px;"></i>
                我已阅读并同意
                <view @tap.stop.prevent="to_policy(21)" class="clause">《用户协议》</view>
                ,
				<!-- #ifdef MP-WEIXIN -->
				<view @tap.stop.prevent="openPrivacyContract" class="clause">《隐私政策》</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view @tap.stop.prevent="to_policy(22)" class="clause">《隐私政策》</view>
				<!-- #endif -->
              </view>
            </view>
          </view>
        </view>
      </u-popup>
      <OpendateWindow v-model="showSelectAvatarModel" @send="getAvatarNicknameValue" @close="toSliderUrl(-2, 0)"></OpendateWindow>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import OpendateWindow from '@/pages/common/components/opendate-Window/opendate-Window.vue';

const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
var options = {};
mixins(options);
common(options);
export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,
    OpendateWindow,
  },
  computed: {
    global_ipad: {
      get() {
        let that = this;
        return that.$store.state.ipad;
      },
      set(v) {}
    },
    config_app_mode: {
      get() {
        let that = this;
        return that.$store.state.config.app.mode;
      },
      set(v) {}
    },
    config_page_login_bg_style: {
      get() {
        let that = this;
        if (that.$store.state.config.page.login && that.$store.state.config.page.login.bg) {
          return 'background-image: url(' + that.$store.state.config.page.login.bg + ');';
        }
        return '';
      },
      set(v) {}
    },
    config_page_login_scroll: {
      get() {
        let that = this;
        return that.$store.state.config.page.login.scroll;
      },
      set(v) {}
    },
    config_about_slogan: {
      get() {
        let that = this;
        return that.$store.state.config.about.slogan;
      },
      set(v) {}
    },
    config_about_logo: {
      get() {
        let that = this;
        return that.$store.state.config.about.logo;
      },
      set(v) {}
    },
    config_about_name: {
      get() {
        let that = this;
        return that.$store.state.config.about.name;
      },
      set(v) {}
    },
    config_user_login_force: {
      get() {
        let that = this;
        return that.$store.state.config.user.login_force;
      },
      set(v) {}
    },
    config_user_login_style: {
      get() {
        let that = this;
		
        if (that.$store.state.config.user && that.$store.state.config.user.login_style) {
          return that.$store.state.config.user.login_style;
        }
        return [0];
      },
      set(v) {}
    }
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 14,
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


	  mpPrivacyName: "《隐私政策》",
	  isNeedAgreeMpPrivacy: false,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);


	// #ifdef MP-WEIXIN
	if (wx.getPrivacySetting) {
		wx.getPrivacySetting({
			success: (res) => {
				if (res.needAuthorization) {
					that.mpPrivacyName = res.privacyContractName;
					that.isNeedAgreeMpPrivacy = true;
				}
			},
		});
	}
	// #endif
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    uni.stopPullDownRefresh();
    that.updateScene(14, 0);

    if (uni.$store.state.token) {
      uni.wen.toUrl(-3, 0, null);
    }
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
	handleAgreePrivacyAuthorization() {
		let that = this;
		if(that.isNeedAgreeMpPrivacy){
			that.isNeedAgreeMpPrivacy = false;
		}
	},
	openPrivacyContract() {
		wx.openPrivacyContract({
			success: () => {
				this.isRead = true;
			},
			fail: () => {
				uni.showToast({
					title: '遇到错误',
					icon: 'error',
				});
			},
		});
	},
    shutShowMoreLoginPopup() {
      let that = this;
      that.setData({
        showMoreLoginPopup: !that.showMoreLoginPopup
      })
    },
    button_agree() {
      let that = this;
      that.setData({
        showClausePopup: false,
        is_argeen_policy: true
      })
      if (that.next > 0) {
        // 微信登录
        if (that.next == 1) {
          // #ifdef H5
          that.toMpAuth();
          // #endif
          // #ifndef H5
          that.getUserInfo();
          // #endif
        } else if (that.next == 2) {
          // apple登录
			that.appleLogin();
        } else if (that.next == 3) {
			that.qqLogin();
		}
      }

    },
    shutShowClausePopup() {
      let that = this;
      that.setData({
        showClausePopup: !that.showClausePopup
      })
    },
	qqLogin(){
		let that = this;
		if (!that.is_argeen_policy) {
		  uni.wen.util.doVibrateShort();
		  that.setData({
		    showClausePopup: true,
		    next: 3
		  })
		  return;
		}
		
		that.setData({
		  btnState3: true
		});
		
		uni.login({
		  provider: 'qq',
		  success: function (loginRes) {
		    // 登录成功
		    uni.getUserInfo({
		      provider: 'qq',
		      success: function (info) {
		        // 获取用户信息成功, info.authResult中保存登录认证数据
		        if (info && info.errMsg === 'getUserInfo:ok' && info.userInfo) {
		          uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/login/qq', info.userInfo, 'POST').then(function (res) {
		            uni.loading(false);
		            if (res.code == 200) {
		              that.setData({
		                btnState: false
		              });
		
		              uni.setStorageSync('token', res.data.token);
		              uni.$store.commit('updateToken', res.data.token);
		
		              uni.setStorageSync('userInfo', res.data.user);
		              that.$store.commit('updateUserInfo', res.data.user);
		              that.$store.commit('userUpdateTimes', 1);
					  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
					      uni.$store.dispatch('userAddPlateAction', res2.data);
					  });
		              // #ifdef MP-WEIXIN
		              wx.setBackgroundFetchToken({
		                token: res.data.token
		              });
		              // #endif
		              let device = '';
		              // #ifdef APP
		              device = 'app';
		              // #endif
		              // #ifdef MP
		              device = 'mp';
		              // #endif
		              // #ifdef H5
		              device = 'h5';
		              // #endif
					  
		              if(uni.$store.state.websocket){
		              	uni.$store.state.websocket.restart();
		              }
		
		              uni.wen.toUrl(-2, 0, null);
		
		            } else {
		              uni.showModal({
		                title: '登录失败',
		                content: res.message,
		                showCancel: false,
		                confirmText: '朕知道了',
		                confirmColor: that.primaryColor
		              });
		            }
		          });
		        } else {
		          uni.wen.util.log(info);
				  that.setData({
				    btnState3: false
				  });
		        }
		      }
		    })
		  },
		  fail: function (err) {
		    uni.showToast({
		      title: '错误码' + err.code,
		      icon: 'none'
		    })
		    uni.wen.util.log(err);
			that.setData({
			  btnState3: false
			});
		  }
		});
		
	},
    appleLogin() {
      let that = this;
      if (!that.is_argeen_policy) {
        uni.wen.util.doVibrateShort();
        that.setData({
          showClausePopup: true,
          next: 2
        })
        return;
      }

      that.setData({
        btnState2: true
      });

      uni.login({
        provider: 'apple',
        success: function (loginRes) {
          // 登录成功
          uni.getUserInfo({
            provider: 'apple',
            success: function (info) {
              // 获取用户信息成功, info.authResult中保存登录认证数据
              if (info && info.errMsg === 'getUserInfo:ok' && info.userInfo) {
                uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/login/apple', info.userInfo, 'POST').then(function (res) {
                  uni.loading(false);
                  if (res.code == 200) {
                    that.setData({
                      btnState: false
                    });

                    uni.setStorageSync('token', res.data.token);
                    uni.$store.commit('updateToken', res.data.token);

                    uni.setStorageSync('userInfo', res.data.user);
                    that.$store.commit('updateUserInfo', res.data.user);
                    that.$store.commit('userUpdateTimes', 1);
                    // #ifdef MP-WEIXIN
                    wx.setBackgroundFetchToken({
                      token: res.data.token
                    });
                    // #endif
                    let device = '';
                    // #ifdef APP
                    device = 'app';
                    // #endif
                    // #ifdef MP
                    device = 'mp';
                    // #endif
                    // #ifdef H5
                    device = 'h5';
                    // #endif
                    
					if(uni.$store.state.websocket){
						uni.$store.state.websocket.restart();
					}

                    uni.wen.toUrl(-2, 0, null);

                  } else {
					that.setData({
					  btnState2: false
					});
                    uni.showModal({
                      title: '登录失败',
                      content: res.message,
                      showCancel: false,
                      confirmText: '朕知道了',
                      confirmColor: that.primaryColor
                    });
                  }
                });
              } else {
                uni.wen.util.log(info);
              }
            }
          })
        },
        fail: function (err) {
          uni.showToast({
            title: '错误码' + err.code,
            icon: 'none'
          })
          uni.wen.util.log(err);
		  that.setData({
		    btnState2: false
		  });
        }
      });

    },
    argeen_policy() {
		let that = this;
		// #ifdef MP-WEIXIN
		if(that.isNeedAgreeMpPrivacy){
			that.showClausePopup = !that.showClausePopup;
		}else{
			that.is_argeen_policy = !that.is_argeen_policy;
		}
		// #endif
		// #ifndef MP-WEIXIN
		that.setData({
			is_argeen_policy: !this.is_argeen_policy
		});
		// #endif
    },
    to_policy(type) {
      // #ifdef APP
      plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=' + type);
      // #endif
      // #ifdef H5
      window.open(uni.wen.api.homeUrl + '/common/clause?id=' + type);
      // #endif
      // #ifdef MP
      uni.wen.toUrl(6, '/pages/web-view/index?url=' + encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=' + type), null);
      // #endif
    },
    /***
     * 获取用户信息
     */
    getUserInfo: function (e) {
      let that = this;
      if (!that.is_argeen_policy) {
        uni.wen.util.doVibrateShort();
        that.setData({
          showClausePopup: true,
          next: 1
        })
        return;
      }

      that.setData({
        btnState: true
      });

      // #ifdef MP-WEIXIN
      that.loginByWeixin().then((res) => {
        if (res.select == 1 && uni.wen.util.hostVersionSupport('2.21.2')) {
          that.setData({
            showSelectAvatarModel: true,
			btnState: false
          });
        } else {
          that.setData({
            btnState: false
          });

          if (that.$store.state.userInfo.phone && that.$store.state.userInfo.phone.length > 5) {
            uni.wen.toUrl(-2, 0, null);
          } else if (that.$store.state.config.app.phone.pages.includes(14)) {
            that.myToast({
              type: 'getPhone',
              content: '绑定手机号',
              timeout: 2000,
              isClick: true,
            });
          } else {
            uni.wen.toUrl(-2, 0, null);
          }

        }
      }).catch((err) => {
        console.log(err);
        that.setData({
          btnState: false
        });
      });
      // #endif

      // #ifdef APP
      that.appLoginByWeixin().then((res) => {
        if (that.$store.state.userInfo.phone && that.$store.state.userInfo.phone.length > 5) {
          uni.wen.toUrl(-2, 0, null);
        } else if (that.$store.state.config.app.phone.pages.includes(14)) {
          // that.myToast({
          // 	type:'getPhone',
          // 	content: '绑定手机号',
          // 	timeout: 2000,
          // 	isClick:true,
          // });
          uni.wen.toUrl(-2, 0, null);
        } else {
          uni.wen.toUrl(-2, 0, null);
        }
        that.setData({
          btnState: false
        });
      }).catch((err) => {
        uni.showToast({
        	title: err.message,
			icon:'none'
        });
        that.setData({
          btnState: false
        });
      });
      // #endif

    },
    getAvatarNicknameValue(res) {
      let that = this;
      let obj = {};
      obj.avatar = res.avatarUrl;
      obj.nickName = res.nickName;
      obj.signature = '';
      obj.birth = '';
      obj.imagesubject = '';
      that.updateInfo(obj).finally(function () {
        setTimeout(function () {
          uni.wen.toUrl(-2, 0, null);
        }, 500);
      })
      return false;
    },

    toTiaoKuan() {
      uni.wen.toUrl(6, '/pages/common/clause?type=21', null);
    },

    /**
     * 返回登陆
     */
    back: function () {
      uni.reLaunch({
        url: '/pages/tabbar/index/index'
      });
    },
    toMpAuth() {
      let that = this;
      // 传入一个唯一值，后端唯一值作为键存储token
      let unique = Date.now() + Math.floor(Math.random() * 100);
	  let pre_scene = that.$store.state.pre_scene;
	  let pre_scene_id = that.$store.state.pre_scene_id;
      let url = uni.wen.api.WebRootUrl + 'common/webview?action=mplogin&unique=' + unique+'&pre_scene=' + pre_scene + '&pre_scene_id=' + pre_scene_id;

      window.open(url);
    }
  }
};
</script>
<style lang="scss">
.contain {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
    width: 135rpx;
    height: 135rpx;
    max-width: 135rpx;
    min-width: 135rpx;
    max-height: 135rpx;
    min-height: 135rpx;
  }
}

@keyframes scroll {
  100% {
    background-position: 0px -2300px;
  }
}

.contain .mask-layer {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  perspective: 1000px;
  background-size: cover;
}

.contain .mask-layer.bg-scroll {
  animation: scroll 70s linear infinite;
}

.contain .mask-layer2 {
  background: rgba(0, 0, 0, 0.45);
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.contain .back-image {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  animation: fadeIn 0.6s ease;
}

.contain .logo-box {
  margin-top: 66%;
  position: fixed;
  z-index: 99;
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.contain .logo-box .logo-title {
  font-size: 58rpx;
}

.contain .logo-box .logosub {
  margin-top: 25rpx;
  font-size: $uni-font-size-lg;
}

.login_bg {
  width: 100%;
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  bottom: 20px;
  padding-bottom: env(safe-area-inset-bottom);
}

.login_bg .mb20 {
  width: 430rpx;
  height: 90rpx;
  border: 2rpx solid $uni-color-primary;
  border-radius: 18rpx;
  font-size: $uni-font-size-lg-er;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  align-items: center;
  display: flex;
  justify-content: center;
  -webkit-animation: lgonMove 1s;
  animation: lgonMove 1s;
  background-color: $uni-color-follow;
  color: $uni-color-follow-font;
  letter-spacing: 4rpx;
  margin-bottom: 26px;

  .mini-icon {
    font-size: $uni-font-size-base;
    margin-right: 20rpx;
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
  font-size: $uni-font-size-sm;
  @include color(color-lightest-dark);
  display: flex;
  align-items: center;
}

.toTiaoKuan .mini-icon {
  color: rgb(238, 238, 238);
  margin-right: 10rpx;
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
          color: #182e5d;
        }
      }
    }
  }
}

.ipad .mb20.wechat, .global-device-app .examine.ios .mb20.wechat {
  display: none;
}
</style>
