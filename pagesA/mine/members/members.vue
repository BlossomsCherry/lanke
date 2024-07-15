<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
		<navBar :back="true" title="会员" iconTheme="white" color="#ffffff" :home="fph" background="#19191e" :placeholder="false">
		
		</navBar>
      <view class="head_bj"></view>
      <view class="arc_box">
        <image class="arc_img" mode="widthFix" src="/pagesA/static/image/mine/members/arc.png" v-if="global__theme__ == 'default'"></image>
      </view>
      <view class="card_vip">
        <image class="vip_bj" src="/pagesA/static/image/mine/members/jb_bj.png"></image>
        <view class="card_top_box">
          <view class="card_vip_info">
            <text class="vip_title">VIP 会员</text>
            <text v-if="vipEndTime == ''" class="vip_des">加入会员，让你与众不同！</text>
            <text v-else class="vip_des">尊贵会员，与众不同！</text>
          </view>
          <image class="vip_img" src="/pagesA/static/image/mine/members/vip1.png"></image>
        </view>
        <view class="card_vip_footer">
			<text class="vip_expire" v-if="vipEndTime == ''">邀请好友，免费领取会员</text>
			<text class="vip_expire" v-else>会员到期时间：{{ vipEndTime }}</text>
			<!-- #ifdef MP-WEIXIN -->
			<block v-if="global__platform__ == 'ios' && config_pay_mini2mp == 1">
				<text class="btn_vip" @tap.stop.prevent="vipBuy" v-if="vipEndTime == ''">联系客服</text>
				<text class="btn_vip" @tap.stop.prevent="vipBuy" v-else>联系客服</text>
			</block>
			<block v-else>
				<text class="btn_vip" @tap.stop.prevent="vipBuy" v-if="vipEndTime == ''">立即开通</text>
				<text class="btn_vip" @tap.stop.prevent="vipBuy" v-else>立即续费</text>
			</block>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<text class="btn_vip" @tap.stop.prevent="vipBuy" v-if="vipEndTime == ''">立即开通</text>
			<text class="btn_vip" @tap.stop.prevent="vipBuy" v-else>立即续费</text>
			<!-- #endif -->
        </view>
      </view>
      <view class="page_bg">
        <!-- 邀请好友的会员 -->
        <view class="card_box invite_box" style="padding-left: 20rpx; padding-right: 20rpx;">
          <view class="flex-row card_head">
            <view class="head_fgf"></view>
            <text class="card_title">邀请好友领{{ invitees_5_days }}天会员</text>
            <image class="card_timelimit" src="/pagesA/static/image/mine/members/timed.png"></image>
            <view class="head_fgf"></view>
          </view>
          <view class="card_content flex-row" style="flex-wrap: nowrap;">
            <view class="flex-row share_box">
              <view v-for="(item,index) in invitees" :key="index" class="card_invite_item">
                <view class="user_photo_box" @tap.stop.prevent="toSliderUrl(4, item.id)">
                  <image class="invtite_userPhoto" :src="item.user_avatar"></image>
                </view>
              </view>
              <view v-if="inviteUnList.length>0" class="flex-row">
                <view v-for="(item,index) in inviteUnList" :key="index" class="card_invite_item">
                  <view class="user_photo_box">
                    <text class="user_add">+</text>
                  </view>
                </view>
              </view>
            </view>
            <block v-if="invitees.length < 5">
              <!-- #ifndef MP -->
              <text v-if="vipEndTime == ''" class="btn_share" @tap.stop.prevent="inviteUserTap">邀请领会员</text>
              <text v-else class="btn_share" @tap.stop.prevent="inviteUserTap">邀请续费会员</text>
              <!-- #endif -->
              <!-- #ifdef MP -->
              <button v-if="vipEndTime == ''" open-type="share" class="btn_share">邀请领会员</button>
              <button v-else open-type="share" class="btn_share">邀请领会员</button>
              <!-- #endif -->
            </block>
            <block v-else>
              <text class="btn_share" @tap.stop.prevent="inviteRedemptionMembers">可兑换</text>
            </block>
          </view>
          <view class="card_footer">
            <text class="card_footer_left">已成功邀请{{ invitees.length }}/5位</text>

            <!-- 购买须知 -->
            <view class="page_pad_topbottom">
              <view class="flex-row">
                <text class="notice_txt">1、分享给好友</text>
              </view>
              <view class="flex-row">
                <text class="notice_txt">2、好友点击并登录，邀请成功。</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 会员特权 -->
      <view class="card_box">
        <view class="flex-row card_head">
          <view class="head_fgf"></view>
          <text class="head_title">{{ benefits_title }}</text>
          <view class="head_fgf"></view>
        </view>
        <view class="card_content card_margin" style="justify-content: space-between;">
          <view class="card_item" v-for="(item, index) in benefits" :key="index" @tap.stop.prevent="toSliderUrl(item.type, item.target)">
            <view class="icon_box">
              <image class="cate_icon" :src="item.img"></image>
            </view>
            <text class="cate_txt">{{ item.text }}</text>
          </view>
        </view>

      </view>

      <!-- 头像挂件 -->
      <view class="card_box">
        <view class="flex-row card_head">
          <view class="head_fgf"></view>
          <text class="head_title">头像挂件</text>
          <view class="head_fgf"></view>
        </view>
        <view class="card_content card_margin" v-if="avatar_frames && avatar_frames.length > 0" style="justify-content: space-between;">
          <view v-for="(item,index) in avatar_frames" :key="index" class="widget_item">
            <view class="widget_box" @tap.stop.prevent="setWidget(item.id)" :data-index="index">
              <view class="widget_photo_info">
                <image class="widget_photo" :src="myUserInfo.user_avatar"></image>
                <image class="widget_img" :src="item.image_url"></image>
              </view>
            </view>
            <text class="widget_title">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 底部说明 -->
      <view class="footer_box">
        <text class="footer_tip">更多特权上架中</text>
      </view>
      <view style="height: 5vh;"></view>

      <!-- 购买弹框 -->
      <uni-popup ref="popupBuy" type="share">
        <view class="buy_box">
          <view class="card_box">
            <view class="flex-row card_head">
              <view class="head_fgf"></view>
              <text class="head_title">会员套餐推荐</text>
              <view class="head_fgf"></view>
            </view>

            <scroll-view :scroll-x="true">
              <view class="card_content vip_buy_pad">
                <view v-for="(item,index) in vipBuyList" :key="index" class="vip_buy_item">
                  <view :class="item.select == '1' ?'vip_buy_item_border vip_buy_item_active':'vip_buy_item_border'" @tap.stop.prevent="changeBuyItem(index)">
                    <text :class="item.select == '1' ?'vip_buy_title vip_txt_active':'vip_buy_title'">{{ item.days + '天' }}</text>
                    <view class="flex-row vip_buy_info">
                      <text :class="item.select == '1' ?'vip_money_cuenry vip_txt_active':'vip_money_cuenry'">¥</text>
                      <text :class="item.select == '1' ?'vip_money vip_txt_active':'vip_money'">{{ item.price }}</text>
                    </view>
                    <text class="vip_old_money">¥ {{ item.price2 }}元</text>
                    <!-- 赠送积分 -->
                    <view class="give_box flex-row">
                      <i class="give_icon mini-icon mini-Gold_coin_01 gold-color"></i>
                      <text class="give_text">送{{ item.coins + config_app_coins_name }}</text>
                    </view>
                  </view>
                  <text class="buy_tip_sub" v-if="item.sales">{{ item.sales }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="buy_btn_wrap">
            <text class="btn_openvip" @tap.stop.prevent="buyVip">{{ btnBuyText }}</text>
          </view>


          <!-- 购买须知 -->
          <view class="vip_buy_notice_box">
            <text class="notice_title">购买须知</text>
            <view class="flex-row">
              <text class="notice_txt">1、购买前请须知</text>
              <text class="notice_active" @tap.stop.prevent="toSliderUrl(6, '/pages/common/clause?type=' + config_app_vip_clause )">《会员协议》</text>
            </view>
            <view class="flex-row">
              <text class="notice_txt">2、购买后即享受会员特权，不允许退款。</text>
            </view>
            <view class="flex-row">
              <text class="notice_txt">3、最终解释权归我司所有。</text>
            </view>
          </view>
        </view>
      </uni-popup>
	  
	  <servicer-popup :pop="popNum" :scene="31"></servicer-popup>
      <!-- 预览头像 -->
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import servicerPopup from "@/components/servicer-popup/servicer-popup";

import UniPopup from '@/pagesA/components/uni-popup/uni-popup';
const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
const pay = require('@/mixins/pay');

var options = {};
common(options);
mixins(options);
pay(options);

export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
	  UniPopup,
	  servicerPopup
  },
  computed: {
    config_user_members_poster: {
      get() {
        let that = this;
        return that.$store.state.config.user.members_poster;
      },
      set(v) {}
    },
    config_app_vip_clause: {
      get() {
        let that = this;
        return that.$store.state.config.app.vip.clause;
      },
      set(v) {}
    },
    config_app_coins_name: {
      get() {
        let that = this;
        if (that.$store.state.config.app.coins) {
          return that.$store.state.config.app.coins.name;
        }
        return '硬币';
      },
      set(v) {}
    },
	config_pay_mini2mp: {
	  get() {
	    let that = this;
	    return this.$store.state.config?.pay?.mini2mp;
	  },
	  set(v) {}
	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 31,
      vipEndTime: '',
      vipBuyList: [], //购买套餐
      btnBuyText: '', // 购买button显示文字
      invitees: [], //邀请好友
      inviteUnList: [], //还差多少好友
      avatar_frames: [],
      select_option_index: 0,
      benefits_title: '',
      benefits: [],
      invitees_5_days: 0,
	  popNum: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
	that.pageTheme = 'always-black';
    that.globalOnloadProcess(options);
	uni.setNavigationBarColor({
		frontColor: "#ffffff",
		backgroundColor: "#19191e",
		fail(err) {
			console.log(err)
		}
	});
    that.getUserMembersData();
	
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(31, 0, false, false, 16);
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
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    inviteRedemptionMembers() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/invite_member', {}, 'POST').then(function (res) {
        uni.loading(false);
        if (res.status) {
          uni.showToast({
            title: '恭喜您，成功兑换' + res.data.days + '天会员',
            icon: 'none'
          });
          uni.wen.util.updateUserInfo();
          that.getUserMembersData();
        } else {
          uni.showToast({
            title: res.message,
            icon: 'error'
          });
        }
      });
    },
    getUserMembersData() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/membersdata').then(function (res) {
        uni.loading(false);
        if (res.status) {
          that.setData({
            vipEndTime: res.data.end_time,
            benefits_title: res.data.benefits_title,
            benefits: res.data.benefits,
            avatar_frames: res.data.avatar_frames,
            invitees: res.data.invitees,
            invitees_5_days: res.data.invitees_5_days,
            options: res.data.options
          });
          that.vipBuyList = res.data.options;
		  
		  let apple_product_ids = [];
          that.vipBuyList.forEach(function (item, i) {
            if (item.select == '1') {
              item.select = true;
              that.btnBuyText = "立即" + (that.vipEndTime == '' ? "开通" : "续费") + item.price + "元"
            }
			apple_product_ids.push('apple_pay_product_vip_' + item.price);
          });
		  
		  if (that.$store.state.platform == 'ios') {
			  // #ifdef APP
			  setTimeout(function(){
			  	that._apple_init(apple_product_ids);
			  }, 500);
			  // #endif
		  }
		  
          let remainInvite = 5 - that.invitees.length;
          if (remainInvite > 0) {
            for (let i = 0; i < remainInvite; i++) {
              that.inviteUnList.push({});
            }
          }
        } else {
          uni.showToast({
            title: res.message,
            icon: 'error'
          });
        }
      });
    },
    buyVip() {
      let that = this;
	  if (uni.$store.state.token) {
	  		  
	  }else{
	  		uni.wen.toUrl(-4, null, that);
	  		return false;
	  }
      let the_option = null;
	  let apple_product_ids = [];
      that.vipBuyList.forEach(function (item, i) {
        if (item.select == true) {
          the_option = item;
        }
		apple_product_ids.push('apple_pay_product_vip_' + item.price);
      });
      if (the_option) {

        if (that.$store.state.ipad) {
          uni.showToast({
            title: 'ipad暂时不支持进行支付，您可以更换手机再进行',
            icon: 'none'
          });
          return false;
        }

        let paywaylist = [0];
        if (that.$store.state.platform == 'ios' && that.$store.state.device == 'app') {
          // paywaylist.push(1);
          // paywaylist.push(2);
          // paywaylist.push(4);
		  
		  paywaylist = [4];
		  
		  // #ifdef APP
		  that._apple_init(apple_product_ids);
		  that.apple_payment( 'apple_pay_product_vip_' + the_option.price, apple_product_ids );
		  return false;
		  // #endif
        } else {
          paywaylist.push(1);
          paywaylist.push(2);
		  if (that.$store.state.config.app.coins && that.$store.state.config.app.coins.pay == true) {
		    paywaylist.push(3)
		  }
        }

        that.myToast({
          type: 'payway',
          content: the_option.days + '天会员',
          price: the_option.price,
          timeout: 2000,
          isClick: true,
          paywaylist: paywaylist,
          order: {
            type: 1,
            price: the_option.price,
            days: the_option.days,
			product_ids: apple_product_ids
          }
        });
      }

    },
    inviteUserTap() {
      let that = this;
	  uni.wen.util.inviteUser('/pages/tabbar/index/index', '分享了' + that.$store.state.config.about.name, '', '');
    },
    changeBuyItem(index) {
      let that = this;
      that.vipBuyList.forEach(function (item, i) {
        if (index == i) {
          item.select = true;
          that.btnBuyText = "立即" + (that.vipEndTime == '' ? "开通" : "续费") + item.price + "元"
        } else {
          item.select = false;
        }
      })
    },
    vipBuy() {
		// #ifdef MP-WEIXIN
		if(this.$store.state.platform == 'ios' && this.$store.state.config?.pay?.mini2mp == 1){
			this.popNum += 1;
			return false;
		}
		// #endif
		
		this.$refs.popupBuy.open();
    },
    /**
     * 设置 头像挂件
     */
    setWidget(id) {
      let that = this;
      //判断是否会员
      if (!that.$store.state.userInfo.is_member) {
        uni.showToast({
          title: '非会员不允许佩戴',
          icon: 'none'
        })
        return;
      } else {
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/avatar_frame/wear', { id: id }, 'POST').then(function (res) {
          if (res.status) {
            uni.showToast({
              title: '佩戴成功',
              icon: 'none'
            })
            uni.wen.util.updateUserInfo();
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 1500
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './members.scss';
</style>
