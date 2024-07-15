<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import JoinActivityInfoCard from '@/pagesZ/organize-bureau/join/components/join-activity-info-card.vue';
import JoinPayInfoCard from '@/pagesZ/organize-bureau/join/components/join-pay-info-card.vue';
import JoinInsureInfoCard from '@/pagesZ/organize-bureau/join/components/join-insure-info-card.vue';
import JoinPayExplainCard from '@/pagesZ/organize-bureau/join/components/join-pay-explain-card.vue';
import JoinBottomTools from '@/pagesZ/organize-bureau/join/components/join-bottom-tools.vue';
import JoinPickInsurePopup from '@/pagesZ/organize-bureau/join/components/join-pick-insure-popup.vue';
import JoinAddRecipientPopup from '@/pagesZ/organize-bureau/join/components/join-add-recipient-popup.vue';
import customForm from "@/components/custom-form/custom-form";


const shop = require('@/mixins/shop');
const pay = require('@/mixins/pay');
var options = {};

shop(options);
pay(options);

export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,
    JoinAddRecipientPopup,
    JoinPickInsurePopup,
    JoinBottomTools,
    JoinPayExplainCard,
    JoinInsureInfoCard,
    JoinPayInfoCard,
    JoinActivityInfoCard,
	customForm
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 149,
      // 领取保险弹窗
      pickInsurePopupShow: false,
      // 领取人信息完善
      addRecipientPopupShow: false,
      detailsInfo: {
		  user_info_fill: {},
		  service_time_tip: ''
	  },
      payInfoForm: {
        // 购买数量
        number: 1,
        // 保险领取人
        recipient: {}
      },
	  
	  bureau_id: 0,
	  team_id: 0,
	  
	  // 下单信息
	  cart_id: 0,
	  goodslist: [],
	  amount: 0,
	  vipAmount: 0,
	  discountsAmount: 0,
	  amount_coin: 0,
	  vipAmount_coin: 0,
	  discountsAmount_coin: 0,
	  showCheckoutOrder: false,
	  
	  // 自定义表单
	  formPop: 0,
	  userInfoFillData: []
    }
  },
  computed: {

  },
  onShow: function () {
  	let that = this;
  	that.updateScene(149, 0, true);
  },
  onLoad: function (options) {
  	let that = this;
  	that.globalOnloadProcess(options);
	
	if(options.cart_id && options.cart_id > 0){
		that.cart_id = options.cart_id;
	}
	
	if(options.bureau && options.bureau > 0){
		that.bureau_id = options.bureau;
	}
	if(options.team && options.team > 0){
		that.team_id = options.team;
	}
	
	that.getShopPliceOrderGoods();
	that.getBureauDetail();
  },
  onPullDownRefresh: function () {
    uni.stopPullDownRefresh();
  },
  methods: {
	//提交订单
	checkoutOrder() {
		let that = this;
		if(that.detailsInfo?.user_info_fill?.data?.length > 0 && that.userInfoFillData.length == 0){
			that.formPop += 1;
			return false;
		}
		// 截
		let paywaylist = [0];
		if((that.$store.state.userInfo.is_member ? that.vipAmount : that.amount) >= 0.01){
			if(that.$store.state.platform == 'ios' && that.$store.state.device == 'app'){
				paywaylist.push(1);
				paywaylist.push(2);
			}else{
				paywaylist.push(1);
				paywaylist.push(2);
			}
			
			if(that.$store.state.config.app.coins.pay == true){
				paywaylist.push(3);
			}
		}
			
		if (that.showCheckoutOrder) {
			that.myToast({
				type:'payway',
				content: '参加组局活动',
				price: (that.$store.state.userInfo.is_member ? that.vipAmount : that.amount),
				timeout: 2000,
				isClick:true,
				paywaylist: paywaylist,
				order: {
					type: 5,
					aid: 0,
					user_remark: JSON.stringify(that.userInfoFillData),
					goods_amount: that.amount,
					discounts_amount: (that.$store.state.userInfo.is_member ? that.discountsAmount : 0),
					order_amount: (that.$store.state.userInfo.is_member ? that.vipAmount : that.amount),
					order_goods: that.goodslist,
					cart_id: that.cart_id
				}
			});
		}
	},
	getBureauDetail(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/detail', {
			id: that.bureau_id
		}, 'GET', 149).then(function(res) {
			uni.loading(false);
			if (res.status) {
				that.detailsInfo = res.data;
			} else {
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
    popupHandle(e) {
      if (e.type === 'pick-insure-popup') {
        // 领取保险弹窗中的事件
        if (e.fn === 'close') {
          this.pickInsurePopupShow = false
        } else if (e.fn === 'openAddRecipientPopup') {
          // 打开领取人信息完善弹窗，并关闭领取保险的弹窗
          this.pickInsurePopupShow = false
          this.addRecipientPopupShow = true
        } else if (e.fn === 'submitBtn') {
          this.pickInsurePopupShow = false
          this.toSliderUrl(6, '/pagesZ/organize-bureau/details/index')
        }
      } else if (e.type === 'add-recipient-popup') {
        // 领取人信息填写弹窗中的事件
        if (e.fn === 'close') {
          // 关闭领取人信息完善弹窗，并打开领取保险的弹窗
          this.addRecipientPopupShow = false
          this.pickInsurePopupShow = true
        } else if (e.fn === 'submitBtn') {
          // 提交按钮事件
          this.payInfoForm.recipient = e.data
          this.addRecipientPopupShow = false
          this.pickInsurePopupShow = true
        }
      }
    },
	calculateFun() {
		let that = this;
		let goodslist = that.goodslist;
		
		let amount = 0;
		let vipAmount = 0;
		let discountsAmount = 0;
		
		let amount_coin = 0;
		let vipAmount_coin = 0;
		let discountsAmount_coin = 0;
		
		for (let v of goodslist) {
			if(v.credit_type == 1){
				amount = amount + parseFloat(v.price * v.num);
				vipAmount = vipAmount + parseFloat(v.vip_price * v.num);
			}else{
				amount_coin = amount_coin + parseInt(v.price * v.num);
				vipAmount_coin = vipAmount_coin + parseInt(v.vip_price * v.num);
			}
		}
	
		discountsAmount = amount.toFixed(2) - vipAmount.toFixed(2);
		discountsAmount_coin = amount_coin - vipAmount_coin;
		
		amount = amount.toFixed(2);
		vipAmount = vipAmount.toFixed(2);
		discountsAmount = discountsAmount.toFixed(2);
		
		
		that.setData({
			amount: amount,
			vipAmount: vipAmount,
			discountsAmount: discountsAmount,
			
			amount_coin: amount_coin,
			vipAmount_coin: vipAmount_coin,
			discountsAmount_coin: discountsAmount_coin,
			showCheckoutOrder: true
		});
	},
	customConfirm(formdata){
		this.detailsInfo.user_info_fill = {
			update: 1,
			data: formdata.data,
			title: this.detailsInfo.user_info_fill.title
		};
		this.userInfoFillData = formdata.data;
	}
  }
}
</script>
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="确认加入" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="join-page">
		  <!-- 活动基本信息 -->
		  <join-activity-info-card :info="detailsInfo"/>
		
		  <!-- 支付信息 -->
		  <join-pay-info-card :total-price="amount" :number="payInfoForm.number" :time=" detailsInfo.service_time_tip" @change="e => payInfoForm.number = e"/>
		
		  <!-- 保险信息 -->
		  <!-- <join-insure-info-card :info="detailsInfo"/> -->
		  
		  <!-- 问卷信息 -->
		  <view v-if="userInfoFillData && userInfoFillData.length > 0" class="user-info-fill-card">
		   <view class="title">问卷填写
				<view class="update-tip" @tap.stop.prevent="()=>{ formPop += 1; }">修改</view>
		   </view>
			<view class="fill-item flex-row" v-for="(fillitem, findex) in userInfoFillData" :key="findex">
				<view class="left-label">{{ fillitem.name }}</view>
				<view class="right-value">{{ fillitem.value }}</view>
			</view>
		  </view>
		  
		
		  <!-- 支付说明 -->
		  <join-pay-explain-card :info="detailsInfo"/>
		
		  <!-- 底部操作栏 -->
		  <join-bottom-tools :info="detailsInfo" :total-price="amount" @click="checkoutOrder"/>
		
		  <!-- 领取保险弹窗 -->
		  <join-pick-insure-popup :show="pickInsurePopupShow" :recipient="payInfoForm.recipient" @popup="popupHandle"/>
		
		  <!-- 领取人信息填写 -->
		  <join-add-recipient-popup :show="addRecipientPopupShow" @popup="popupHandle"/>
		</view>
		
		<custom-form :pop="formPop" :formdata="detailsInfo.user_info_fill" @confirm="customConfirm" title="活动方要求填写问卷" v-if="detailsInfo.user_info_fill"></custom-form>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<style scoped lang="scss">
.join-page {
  min-height: 100vh;
  padding: 25rpx 20rpx calc(env(safe-area-inset-bottom) + 173rpx) 20rpx;
  @include background_color(page-body2-background-color);
  .user-info-fill-card {
	position: relative;
	margin-top: 20rpx;
	padding: 40rpx 20rpx 30rpx 20rpx;
	@include background_color(page-box-background-color);
	border-radius: 20rpx;
	.title {
	  font-size: $uni-font-size-base;
	  font-weight: bold;
	  @include color(color-darkest);
	  line-height: 32rpx;
	  position: relative;
	  .update-tip{
		  position: absolute;
		  right: 0;
		  top: 0;
		  font-size: $uni-font-size-medium;
		  @include color(color-primary);
		  font-weight: normal;
	  }
	}
	.fill-item{
		justify-content: space-between;
		margin-top: 30rpx;
		.left-label{
			font-size: $uni-font-size-medium;
			@include color(color-darkest);
			line-height: 32rpx;
		}
		.right-value{
			font-size: $uni-font-size-medium;
			@include color(color-darkest);
			line-height: 32rpx;
		}
	}
  }
}
</style>
