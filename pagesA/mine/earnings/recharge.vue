<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body recharge-page">
		<navBar :back="true" :home="fph" title="我的余额" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="earnings-wrap">
			<i class="mini-icon mini-yue earning-icon"></i>
			<view class="title">我的余额</view>
			<view class="num">
				￥<u-count-to :endVal="restBalance" :decimals="2" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" fontSize="42"></u-count-to>
			</view>
		</view>
		<view class="button-wrap">
			<view class="button recharge-btn" @tap="rechargeTap">充值</view>
			<view class="button withdrawal-btn" @tap="withdrawalTap" v-if="config_audit_is_withdrawal">提现</view>
		</view>
		<u-popup :show="withdrawalPopup" @close="withdrawalTap">
		    <view class="withdrawal-add-box">
		        <image class="withdrawal-add-box-image" src="https://img.mini.minisns.cn/icons/tixian.png" mode="aspectFill" />
		        <view class="withdrawal-add-box-view">
		            <view
		                :class="index == idx ? 'bd' : '' || item > withdrawalBalance ? 'hd' : ''"
		                @tap="parseEventDynamicCode($event, item > withdrawalBalance ? 'notWithdrawal' : 'addwithdrawalPrice')"
		                :data-idx="index"
		                :data-price="item"
		                v-for="(item, index) in withdrawalPrice"
		                :key="item.id"
		            >
		                ¥{{ item }}
		            </view>
		        </view>
				<view class="withdrawal-add-input-box">
				    <text class="_text">真实姓名：</text>
				    <input
				        class="withdrawal-add-input"
				        @input="withdrawalRealName"
				        :value="real_name"
				        placeholder-class="_input_place_holder"
				        placeholder="在这里输入真实姓名"
				    />
				</view>
				<block v-if="config2_app_withdrawal_type == 1">
					<view class="withdrawal-add-input-box">
					    <text class="_text">微信手机号：</text>
					    <input
					        class="withdrawal-add-input"
					        @input="withdrawalWechatPhone"
					        :value="wechat_phone"
					        placeholder-class="_input_place_holder"
					        placeholder="在这里输入微信手机号"
					    />
					</view>
				</block>
				<block v-else-if="config2_app_withdrawal_type == 2">
					<view class="withdrawal-add-input-box">
					    <text class="_text">支付宝手机号：</text>
					    <input
					        class="withdrawal-add-input"
					        @input="withdrawalAlipayPhone"
					        :value="aliay_phone"
					        placeholder-class="_input_place_holder"
					        placeholder="在这里输入支付宝手机号"
					    />
					</view>
				</block>
				<block v-else>
					<view class="withdrawal-add-input-box">
					    <text class="_text">支行名称：</text>
					    <input
					        class="withdrawal-add-input"
					        @input="withdrawalbankName"
					        :value="bankName"
					        placeholder-class="_input_place_holder"
					        placeholder="在这里输入支行名称"
					    />
					</view>
					<view class="withdrawal-add-input-box">
					    <text class="_text">银行卡号：</text>
					    <input
					        class="withdrawal-add-input"
					        @input="withdrawalbankId"
					        :value="bankId"
					        placeholder-class="_input_place_holder"
					        type="digit"
					        placeholder="在这里输入银行卡号"
					    />
					</view>
				</block>
		        
		        <view class="withdrawal-add-box-btn" @tap.stop.prevent="withdrawalPay">确认提现</view>
		        <view class="details">注：由于微信，支付宝费率等原因，提现默认到账金额将会扣除{{ config2_app_withdrawal_platform_percent }}%手续费</view>
		    </view>
		</u-popup>
		
		<u-popup :show="rechargePopup" @close="rechargeTap">
		    <view class="withdrawal-add-box recharge-select-box">
		        <i class="mini-icon mini-yue earning-icon"></i>
		        <view class="withdrawal-add-box-view">
		            <view v-for="(item, r_index) in rechargePrice" :key="r_index" :class="(seletedPrice == item ? 'cur' : '')" @tap.stop.prevent="seletedPriceTap(item)">
		                ¥{{ item }}
		            </view>
		        </view>
				<view class="recharge-sure-btn" @tap.stop.prevent="onRechargeEarningsCheck()">
					立即充值
				</view>
		        <view class="details">若出现充值错误，请提供微信/支付宝的支付截图，联系客服处理</view>
		    </view>
		</u-popup>
		
		
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import NumberAnimate from '@/utils/numberAnimate';
const common = require('@/mixins/common');
const user = require('@/mixins/user');
const pay = require('@/mixins/pay');

var options = {};
common(options);
user(options);
pay(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		config_audit_is_withdrawal:{
			get(){
				let that = this;
				return (that.$store.state.config.audit.is_withdrawal == 1) && (that.$store.state.config.app.mode != 'examine');
			},
			set(v){}
		},
		config2_app_withdrawal_platform_percent:{
			get(){
				let that = this;
				if(that.$store.state.config2.app && that.$store.state.config2.app.withdrawal){
					return that.$store.state.config2.app.withdrawal.platform_percent;
				}
				return '10';
			},
			set(v){}
		},
		config2_app_withdrawal_type:{
			get(){
				let that = this;
				if(that.$store.state.config2.app && that.$store.state.config2.app.withdrawal){
					return that.$store.state.config2.app.withdrawal.type;
				}
				return 0;
			},
			set(v){}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 26,
			restBalance: '0',
			real_name: '',
			bankName: '',
			bankId: '',
			totalCoins: 0,
			wechat_phone: '',
			aliay_phone: '',
			withdrawalPopup: false,
			rechargePopup: false,
			idx: -1,
			withdrawal: [
			    {
			        n: '昨日余额',
			        i: '0'
			    },
			    {
			        n: '可提现',
			        i: '0'
			    },
			    {
			        n: '已提现',
			        i: '0'
			    }
			],
			withdrawalPrice: [10, 50, 100, 200],
			withdrawalBalance: 0,
			seletedPrice: 1,
			rechargePrice: [1, 3, 6, 12, 28, 48, 78, 98, 128, 168, 198, 228],
			
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.myFinancial();
	},
	onShow: function () {
		let that = this;
		that.updateScene(26, 0, false, false, 0, 2);
	},
	onPullDownRefresh: function () {
	    let that = this;
		that.setData({
			withdrawalPopup: false,
			rechargePopup: false,
			idx: -1
		})
	    that.myFinancial();
		uni.stopPullDownRefresh();
	},
	methods: {
	  seletedPriceTap(price){
		  let that = this;
		  that.seletedPrice = price;
	  },
	  animate: function () {
	      let that = this;
	      let restBalance = that.restBalance;
	      let number = new NumberAnimate({
	          from: restBalance,
	          speed: 500,
	          refreshTime: 150,
	          decimals: 2,
	          onUpdate: () => {
	              that.setData({
	                  restBalance: number.tempValue
	              });
	          }
	      });
	  },
	  withdrawalTap() {
	      let that = this;
	      that.setData({
	          withdrawalPopup: !that.withdrawalPopup
	      });
	  },
	  rechargeTap() {
	      let that = this;
	      that.setData({
	          rechargePopup: !that.rechargePopup
	      });
	  },
	  
	  addwithdrawalPrice(e) {
	      let price = e.currentTarget.dataset.price;
	      let idx = e.currentTarget.dataset.idx;
	      let that = this;
	      that.setData({
	          price: price,
	          idx: idx
	      });
	  },
	  withdrawalWechatPhone(e){
		  this.setData({
		      wechat_phone: e.detail.value
		  });
	  },
	  withdrawalAlipayPhone(e){
		  this.setData({
		      aliay_phone: e.detail.value
		  });
	  },
	  withdrawalRealName(e){
		  this.setData({
		      real_name: e.detail.value
		  });
	  },
	  withdrawalbankName(e) {
	      this.setData({
	          bankName: e.detail.value
	      });
	  },
	  
	  withdrawalbankId(e) {
	      this.setData({
	          bankId: e.detail.value
	      });
	  },
	  
	  notWithdrawal(e) {
	      let price = e.currentTarget.dataset.price;
	      uni.showToast({
	          title: '可提现金额不足¥' + price + ' !',
	          icon: 'none',
	          duration: 1500
	      });
	  },
	  onRechargeEarningsCheck(){
		  let that = this;
		  let paywaylist = [1,2];
		  
		  that.myToast({
		  	type:'payway',
		  	content: '余额充值￥'+ that.seletedPrice,
		  	price: that.seletedPrice,
		  	isVipPrice: false,
		  	timeout: 2000,
		  	isClick:true,
		  	paywaylist: paywaylist,
		  	order: {
		  		type: 3,
				recharge: that.seletedPrice
		  	}
		  });
	  }
	}
}
</script>

<style lang="scss">
.earnings-wrap {
    text-align: center;
    display: flex;
    flex-direction: column;
	box-sizing: border-box;
	top: 280rpx;
	position: fixed;
	width: 750rpx;
	justify-content: center;
	.mini-icon.earning-icon{
		color: #ffc300;
		font-size: 90rpx;
		margin: auto;
		display: block;
	}
	.title{
		@include color(color-dark);
		margin: 30rpx auto;
	}
	.num{
		@include color(color-dark);
	}
}
.button-wrap{
	text-align: center;
	width: 750rpx;
	position: fixed;
	bottom: 160rpx;
	.button {
	    width: 164rpx;
	    margin: 30rpx auto;
	    white-space: nowrap;
	    background-color: #f2f2f2;
	    padding: 20rpx;
	    border-radius: $uni-border-radius-lg;
		color: $uni-color-primary;
	}
	.button.recharge-btn{
		background-color: $uni-color-follow;
		color: $uni-color-follow-font;
	}
}
.withdrawal-add-box {
    width: 700rpx;
    height: 760rpx;
    border-radius: 30rpx;
    @include background_color(page-box-background-color);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
}

.withdrawal-add-box-image {
    position: absolute;
    top: -50rpx;
    width: 200rpx;
    height: 200rpx;
}

.withdrawal-add-input-box {
    margin-top: 20rpx;
    width: 540rpx;
    height: 70rpx;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    @include background_color(page-box-item-background-color);
    font-size: $uni-font-size-sm-base;
    font-weight: 500;
    @include color(color-light-dark);
    display: flex;
    align-items: center;
	box-sizing: border-box;
}

.withdrawal-add-input-box text {
    width: 160rpx;
    @include color(color-light-dark);
    font-size: $uni-font-size-sm-base;
    font-weight: 500;
    line-height: 50rpx;
	white-space: nowrap;
}

.withdrawal-add-input {
    width: 320rpx;
    height: 50rpx;
}

.withdrawal-add-input-phs {
    font-size: $uni-font-size-sm-base;
    @include color(color-lightest-dark);
}

.withdrawal-add-box-view {
    margin: 20rpx 0 20rpx;
    width: 540rpx;
	flex-flow: wrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
	view {
	    padding: 10rpx 24rpx;
	    @include color(color-light-dark);
	    border-radius: 8rpx;
	    font-size: $uni-font-size-sm-base;
	    font-weight: 500;
	    @include background_color(page-box-item-background-color);
	}
	.cur{
		@include background_color(follow-background-color);
		@include color(color-follow-font);
	}
	.bd {
	    @include background_color(follow-background-color);
	    @include color(color-follow-font);
	}
	
	.hd {
	    color: $uni-text-color-grey !important;
	}
}

.withdrawal-add-box-btn {
    margin: 40rpx 0 10rpx;
    width: 300rpx;
    height: 80rpx;
    border-radius: 80rpx;
    font-size: $uni-font-size-base;
    font-weight: bold;
    background: $uni-color-follow;
	color: $uni-color-follow-font;
    display: flex;
    align-items: center;
    justify-content: center;
}
.recharge-sure-btn{
	margin: 40rpx 0 10rpx;
	width: 300rpx;
	height: 90rpx;
	border-radius: 80rpx;
	font-size: $uni-font-size-base;
	font-weight: bold;
	background: $uni-color-follow;
	color: $uni-color-follow-font;
	display: flex;
	align-items: center;
	justify-content: center;
}
.details {
    width: 500rpx;
    padding: 20rpx 30rpx;
    @include color(color-light-dark);
    font-size: 22rpx;
}
.recharge-select-box{
	height: 650rpx;
	.mini-icon.earning-icon{
		color: #ffc300;
		font-size: 90rpx;
	}
	.withdrawal-add-box-view{
		view{
			width: 146rpx;
			min-width: 146rpx;
			max-width: 146rpx;
			box-sizing: border-box;
			margin:10rpx;
		}
	}
}
</style>