<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body content">
      <navBar :back="true" :iconTheme="iconTheme" :background="'rgba(255, 255, 255, ' + navbarTrans + ')'"
              :color="'rgba(' + color + ', ' + navbarTrans + ')'" title="我的团队" :home="fph">
      </navBar>
      <view class="bg-primary">
      </view>
      <view class="main-content">
        <view class="user-info">
          <view class="left" v-if="myUserInfo">
            <view class="avatar" @tap.stop.prevent="toSliderUrl(4, myUserInfo.id)">
              <image class="_image" :src="myUserInfo.user_avatar" mode=""></image>
            </view>
            <view class="name">
              <view class="username">{{ myUserInfo.user_name }}</view>
              <view class="invite-lv">{{ inviterInfo.benifit.invitelv }}
              </view>
            </view>
          </view>
          <view class="right">
            <i class="mini-icon mini-31erweima" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/invite/qr?qr='+ inviterInfo.qr)"></i>
          </view>
        </view>
        <view class="box-item">
          <view class="invite-card">
            <view class="top">
              <view class="left" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/earnings/earnings')">
                <view class="tip">
                  钱包余额
                </view>
                ￥
                <u-count-to :endVal="restBalance" :decimals="2" color="#333" fontSize="42"></u-count-to>
              </view>
              <view class="right">
                <view class="btn" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/earnings/recharge')">提现</view>
				<!-- #ifndef MP -->
				<text class="btn" @tap.stop.prevent="inviteUserTap">邀请</text>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button open-type="share" class="btn">邀请</button>
				<!-- #endif -->
              </view>
            </view>
            <view class="bottom">
              <view class="item left">
                <view class="text">累积收入<i class="mini-icon mini-bangzhu" @tap.stop.prevent="toShowRulePopup" style="display: inline-block;margin-left: 10px; opacity: 0.6;"></i>
                </view>
                <view class="num">{{ inviterInfo.benifit.total || 0 }}</view>
              </view>
              <view class="item mid">
                <view class="text">今日收入</view>
                <view class="num">{{ inviterInfo.benifit.today || 0 }}</view>
              </view>
              <view class="item right">
                <view class="text">团队人数</view>
                <view class="num">{{ inviterInfo.team.total || 0 }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="page-block-gap" v-if="inviterInfo.myinviter && inviterInfo.myinviter.id"></view>
        <view class="box-item" v-if="inviterInfo.myinviter && inviterInfo.myinviter.id">
          <view class="title">
            <view class="left">我的邀请人</view>
            <view class="right"></view>
          </view>
          <view class="users">
            <view class="user" @tap.stop.prevent="toSliderUrl(4, inviterInfo.myinviter.id)">
              <view class="left">
                <image class="_image" :src="inviterInfo.myinviter.user_avatar" mode=""></image>
              </view>
              <view class="right">
                <view class="name">
                  {{ inviterInfo.myinviter.user_name }}
                  <view class="invite-lv" v-if="inviterInfo.myinviter.benifit.invitelv">
                    {{ inviterInfo.myinviter.benifit.invitelv }}
                  </view>
                </view>
                <view class="desc">
                  ta的团队收益：{{ inviterInfo.myinviter.benifit.total }}元
                </view>
              </view>
            </view>
          </view>
        </view>
		<block v-if="inviterInfo.notice && inviterInfo.notice.length > 0">
			<view class="page-block-gap"></view>
			<view class="box-item-notice">
				<u-notice-bar :text="inviterInfo.notice" mode="closable" style="border-radius: 20rpx;"></u-notice-bar>
			</view>
		</block>
		
        <view class="page-block-gap"></view>
        <view class="box-item">
          <view class="title">
            <view class="left">订单提成</view>
            <view class="right"></view>
          </view>
          <view class="orders">
            <block v-if="inviterInfo.orders && inviterInfo.orders.length > 0">
              <view class="order-item" v-for="(item, index) in inviterInfo.orders" :key="index">
                <mp-html class="order-item-text" :content="item" :scene="51" :lazy-load="false"/>
              </view>
            </block>
            <block v-else>
              <u-empty text="一个订单也没有" width="300" height="300" text-size="28"/>
            </block>
          </view>
        </view>
        <view class="page-block-gap"></view>
        <view class="box-item">
          <view class="title">
            <view class="left">
              <view class="tabs">
                <view @tap.stop.prevent="switch_tab(1)" :class="'tab ' + (tabindex == 1 ? 'cur' : '') " v-if="1 <= config2_invite_max_layer ">一级成员</view>
                <view @tap.stop.prevent="switch_tab(2)" :class="'tab ' + (tabindex == 2 ? 'cur' : '')" v-if="2 <= config2_invite_max_layer ">二级成员</view>
                <view @tap.stop.prevent="switch_tab(3)" :class="'tab ' + (tabindex == 3 ? 'cur' : '')" v-if="3 <= config2_invite_max_layer ">三级成员</view>
              </view>
            </view>
            <view class="right"></view>
          </view>
          <view class="users">
            <block v-if="team_show_list && team_show_list.length > 0">
              <view class="user" v-for="(item, index) in team_show_list" :key="index" @tap.stop.prevent="toSliderUrl(4, item.id)">
                <view class="left">
                  <image class="_image" :src="item.user_avatar" mode=""></image>
                </view>
                <view class="right">
                  <view class="name">
                    {{ item.user_name }}
                    <view class="invite-lv" v-if="item.benifit.invitelv">
                      {{ item.benifit.invitelv }}
                    </view>
                  </view>
                  <view class="desc">
                    ta的团队收益：{{ item.benifit.total }}元
                  </view>
                </view>
              </view>
            </block>
            <block v-else>
              <u-empty v-if="!load_more_show" text="没有该等级的队员" width="300" height="300" text-size="28"/>
            </block>
            <view class="loading" v-if="load_more_show">
              <view class="spinner">
                <view class="rect rect1"></view>
                <view class="rect rect2"></view>
                <view class="rect rect3"></view>
                <view class="rect rect4"></view>
                <view class="rect rect5"></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <u-popup :show="showRulePopup" @close="toShowRulePopup">
        <view class="rule-tip-wrap">
          <view class="title">邀请说明</view>
          <view class="tip-content">
            <view class="line">
              1、您在平台内分享出去的所有内容，以及二维码都会自动地带上您的推广标识
            </view>
            <view class="line">
              2、别人从您分享的内容进入并进行了登录，如果该用户为第一次登录，则ta和您会自动建立绑定关系
            </view>
            <view class="line">
              3、如果用户进入暂时未登录，推广标识会暂时存在该用户的缓存里，直至有新的推广标识进入，或者用户主动清除缓存数据。
            </view>
            <view class="line">
              4、绑定关系为永久的，如A邀请B，B邀请C，若B注销了账号，但A和C的间接绑定关系不会中断。
            </view>
            <view class="line">
              5、微信/支付宝的支付完后，其一层上级用户 ，二层上级用户，三层上级用户均能获取平台的奖励，此奖励由平台发放，用户的权益不受影响。
            </view>
            <view class="line">
              6、遵守相关法律法规，我们平台最多保留三层绑定关系。
            </view>
          </view>
        </view>
      </u-popup>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

import NumberAnimate from '@/utils/numberAnimate';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
  mixins: [{ methods: options }],
  components: {
  	  myToast,navBar,hoverBall,
	  mpHtml
  },
  computed: {
    config2_invite_max_layer: {
      get() {
        let that = this;
        if (that.$store.state.config2.invite && that.$store.state.config2.invite.max_layer) {
          return that.$store.state.config2.invite.max_layer;
        }
        return 3;
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 51,
      navbarTrans: 0,
      color: '0,0,0',
      iconTheme: 'white',
      scrollTop: 0,
      tabindex: 1,
      isloadingList: true,
      inviterInfo: {
		notice: '',
        invitelv: '',
        benifit: {
          invitelv: '',
          total: 0,
          today: 0,
          lv1_total: 0,
          lv2_total: 0,
          lv3_total: 0,
          financial: {
            balance: 0,
            sum_price: 0,
            withdrawal_price: 0,
          }
        },
        myinviter: {
          id: 0,
          user_name: '未登录用户',
          user_avatar: '',
          benifit: {
            total: 0
          }
        },
        team: {
          total: 0,
          lv1_team: 0,
          lv2_team: 0,
          lv3_team: 0,
        },
        orders: [],
		qr: ''
      },

      load_more_show: false,

      team_show_list: [],

      team_lv1_list: [],
      team_lv1_page: 0,
      team_lv1_last_page: false,

      team_lv2_list: [],
      team_lv2_page: 0,
      team_lv2_last_page: false,

      team_lv3_list: [],
      team_lv3_page: 0,
      team_lv3_last_page: false,
	  
      showRulePopup: false,
      restBalance: 0,
    }
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.getUserInviteInfo();
    that.getInviteUserList();
  },
  onShow: function () {
    let that = this;
    that.updateScene(51, 0, true, false, 20, 2);
  },
  onPageScroll: function onPageScroll(e) {
    let that = this;
    var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

    if (trans > 1 && that.navbarTrans > 1) {
      return false;
    }

    var frontColor = '#ffffff';
    var backgroundColor = '#000000';
    var iconTheme = 'white';

    if (trans == 0) {
      frontColor = '#ffffff';
      backgroundColor = '#19191e';
      iconTheme = 'white';
    } else if (trans >= 0.4) {
      frontColor = '#000000';
      backgroundColor = '#EBEBEB';
      iconTheme = 'black';
    }

    that.setData({
      navbarTrans: trans,
      iconTheme: iconTheme,
    });
    uni.setNavigationBarColor({
      frontColor: frontColor,
      backgroundColor: backgroundColor,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    }); //发帖按钮
    //判断浏览器滚动条上下滚动

    if (e.scrollTop > that.scrollTop) {
      //向下滚动
      if (!that.showmenu) {
        that.setData({
          showmenu: true
        });
      }
    } else {
      //向上滚动
      if (that.showmenu) {
        that.setData({
          showmenu: false
        });
      }
    }

    that.scrollTop = e.scrollTop;
  },
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: that.$store.state.config.share.format.app_share_right,
      path: '/pages/tabbar/index/index?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  
  onShareTimeline: function (res) {
    let that = this;
    return {
      title: that.$store.state.config.share.format.app_share_right,
      query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  onReachBottom: function () {
    let that = this;
    that.setData({
      load_more_show: true,
    });
    that.getInviteUserList();
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
	inviteUserTap() {
	  let that = this;
	  uni.wen.util.inviteUser('/pages/tabbar/index/index', '分享了' + that.$store.state.config.about.name, '', '');
	},
    toShowRulePopup() {
      let that = this;
      that.setData({
        showRulePopup: !that.showRulePopup
      });
    },
    switch_tab(index) {
      let that = this;
      that.tabindex = index;
      if (index == 1) {
        that.setData({
          team_show_list: [],
          team_lv1_list: [],
          team_lv1_page: 0,
          team_lv1_last_page: false,
        })
      } else if (index == 2) {
        that.setData({
          team_show_list: [],
          team_lv2_list: [],
          team_lv2_page: 0,
          team_lv2_last_page: false,
        })
      } else if (index == 3) {
        that.setData({
          team_show_list: [],
          team_lv3_list: [],
          team_lv3_page: 0,
          team_lv3_last_page: false,
        })
      }
      that.getInviteUserList();
    },
    getUserInviteInfo() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/invite/info').then(function (res) {
        if (res.status) {
          that.inviterInfo = res.data;

          let number = new NumberAnimate({
            from: res.data.benifit.financial.balance,
            speed: 500,
            refreshTime: 150,
            decimals: 2,
            onUpdate: () => {
              that.setData({
                restBalance: number.tempValue
              });
            }
          });
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      });
    },
    getInviteUserList() {
      let that = this;

      if (that.tabindex == 1) {
        if (that.team_lv1_last_page) {
          that.load_more_show = false;
          return false;
        }
        that.setData({
          load_more_show: true,
          team_lv1_page: that.team_lv1_page + 1,
        })
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/invite/list', {
          type: that.tabindex,
          page: that.team_lv1_page,
        }).then(function (res) {
          if (res.status) {
			  
			if(res.data.current_page != that.team_lv1_page){
				return false;
			}
			  
            let data = res.data;
            let args = {};

            if (data.data && data.data.length > 0) {
              args.team_lv1_page = data.current_page;
              args.team_show_list = that.team_show_list.concat(data.data);
              args.team_lv1_list = that.team_lv1_list.concat(data.data);
              args.team_lv1_last_page = false;
            } else {
              args.team_lv1_last_page = true;
            }
            args.load_more_show = false;
            that.setData(args);
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        });
      } else if (that.tabindex == 2) {
        if (that.team_lv2_last_page) {
          that.load_more_show = false;
          return false;
        }
        that.setData({
          load_more_show: true,
          team_lv2_page: that.team_lv2_page + 1,
        })
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/invite/list', {
          type: that.tabindex,
          page: that.team_lv2_page,
        }).then(function (res) {
          if (res.status) {
			
			if(res.data.current_page != that.team_lv2_page){
				return false;
			}  
			
            let data = res.data;
            let args = {};

            if (data.data && data.data.length > 0) {
              args.team_lv2_page = data.current_page;
              args.team_show_list = that.team_show_list.concat(data.data);
              args.team_lv2_list = that.team_lv2_list.concat(data.data);
              args.team_lv2_last_page = false;
            } else {
              args.team_lv2_last_page = true;
            }
            args.load_more_show = false;
            that.setData(args);
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        });
      } else if (that.tabindex == 3) {
        if (that.team_lv3_last_page) {
          that.load_more_show = false;
          return false;
        }
        that.setData({
          load_more_show: true,
          team_lv3_page: that.team_lv3_page + 1,
        })
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/invite/list', {
          type: that.tabindex,
          page: that.team_lv3_page,
        }).then(function (res) {
          if (res.status) {
			
			if(res.data.current_page != that.team_lv3_page){
				return false;
			}
			
            if (res.code == 200003) {
              let data = res.data;
              let args = {};
              args.team_lv3_last_page = true;
              args.load_more_show = false;
              that.setData(args);
            } else {
              let data = res.data;
              let args = {};

              if (data.data && data.data.length > 0) {
                args.team_lv3_page = data.current_page;
                args.team_show_list = that.team_show_list.concat(data.data);
                args.team_lv3_list = that.team_lv3_list.concat(data.data);
                args.team_lv3_last_page = false;
              } else {
                args.team_lv3_last_page = true;
              }
              args.load_more_show = false;
              that.setData(args);
            }

          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        });
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  width: 750rpx;
  padding-bottom: env(safe-area-inset-bottom);
  @include background_color(page-body-background-color);

  .bg-primary {
    background-color: $uni-color-primary;
    width: 750rpx;
    height: 400rpx;
    position: absolute;
    top: 0;
  }

  .main-content {
    position: relative;

    .user-info {
      width: $page-content-body-width;
      display: flex;
      justify-content: space-between;
      margin: auto;
      box-sizing: border-box;
      padding: 80rpx 26rpx 20rpx;
      overflow: hidden;

      .left {
        display: flex;

        .avatar {
          margin-right: 20px;

          ._image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }
        }

        .name {
          .username {
            color: #ffffff;
            margin-bottom: 3px;
          }

          .invite-lv {
            color: #ffffff;
            font-size: 25rpx;
            opacity: 0.7;
          }
        }
      }

      .right {
        .mini-icon {
          font-size: 50rpx;
          color: #eeeeee;
        }
      }
    }
	.box-item-notice{
		width: $page-content-body-width;
		border-radius: 20rpx;
		box-sizing: border-box;
		margin: auto;
	}

    .box-item {
      width: $page-content-body-width;
      @include background_color(page-box-background-color);
      border-radius: 20rpx;
      box-sizing: border-box;
      margin: auto;
      padding: 20rpx 30rpx;

      .invite-card {
        padding: 10rpx;

        .top {
          display: flex;
          justify-content: space-between;

          .left {
            .tip {
              @include color(color-lightest-dark);
            }
          }

          .right {
			display: flex;
			margin-top: 24rpx;
            .btn {
				color: #fff;
				background-color: #ffb504;
				padding: 16rpx 40rpx;
				border-radius: 50rpx;
				line-height: 30rpx;
				height: 62rpx;
				box-sizing: border-box;
				font-size: $uni-font-size-medium;
				margin-left: 15rpx;
            }
			.btn.invite{
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
			}
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 40rpx;

          .item {
            flex: 1;
            border-top: 2rpx solid;
            @include border_color(border-color-box-item-background-color);
            box-sizing: border-box;
            text-align: center;
            padding-top: 20rpx;

            .text {
              @include color(color-lightest-dark);
              font-size: $uni-font-size-sm;
              margin-bottom: 10rpx;
            }
          }

          .mid {
            border-right: 2rpx solid;
            border-left: 2rpx solid;
            @include border_color(border-color-box-item-background-color);
          }
        }
      }

      .title {
        font-size: $uni-font-size-lg;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;

        .left {
          font-size: $uni-font-size-medium;
          @include color(color-light-dark);

          .tabs {
            display: flex;

            .tab {
              font-size: $uni-font-size-base;
              @include color(color-lightest-dark);
              margin-right: 30rpx;
              transition: font-size .3;
            }

            .tab.cur {
              font-size: $uni-font-size-medium;
              @include color(color-light-dark);
            }
          }
        }

        .right {
          @include color(color-lightest-dark);
          font-size: 25rpx;
        }
      }

      .users {
        .user {
          display: flex;
          padding: 20rpx 0;

          .left {
            margin-right: 20rpx;

            ._image {
              width: 70rpx;
              height: 70rpx;
              border-radius: 50%;
            }
          }

          .right {
            .name {
              display: flex;

              .invite-lv {
                background-color: lightgray;
                border-radius: 17px;
                font-size: 12px;
                padding: 0 13px;
                height: 20px;
                line-height: 20px;
                margin-left: 10px;
                opacity: 0.6;
              }
            }

            .desc {
              @include color(color-lightest-dark);
              font-size: 25rpx;
            }
          }

        }
      }

      .orders {
        .order-item {
          .order-item-text {
            font-size: 25.5rpx;
            color: #444444;
            opacity: 0.9;
            padding: 8rpx 0 !important;
          }
        }
      }
    }
  }

}

.rule-tip-wrap {
  @include background_color(page-box-background-color);
  width: 600rpx;
  height: 900rpx;
  border-radius: $uni-border-radius-lg-er;

  .title {
    text-align: center;
    width: 600rpx;
    padding: 30rpx 0 40rpx;
    font-weight: 600;
  }

  .tip-content {
    width: 600rpx;
    padding: 0 20rpx;
    box-sizing: border-box;

    .line {
      margin-bottom: 20rpx;
      font-size: $uni-font-size-base;
      color: #444;
    }
  }
}
</style>
