<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.order_amount}}</text>
		</view>

		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType('wxpay')">
				<text class="mini-icon mini-weixin" style="color: #28c445;"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='orderInfo.provider == "wxpay"' />
					</radio>
				</label>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view class="type-item b-b" @click="changePayType('alipay')">
				<text class="mini-icon mini-zhifubao" style="color: #02a9f1;"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='orderInfo.provider == "alipay"' />
					</radio>
				</label>
			</view>
			<!-- #endif -->
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	
	const pay = require('@/mixins/pay');
	const shop = require('@/mixins/shop');
	var options = {};
	pay(options);
	shop(options);

	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 69,
				orderInfo: {
					"provider": "wxpay",
					"pay_type": "app",
					"orderSn": "16xxxxxxxxxxxxxxxxxxx",
					"order_amount": 1.01
				},
				price: "",
			};
		},
		computed: {

		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.price = options.rewardPrice || ""
			//
			that.orderInfo = JSON.parse(options.params)
			that.orderInfo.provider = "wxpay"
		},
		onShow: function () {
			let that = this;
			that.updateScene(69, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			//选择支付方式
			changePayType(type) {
				console.log("changePayType", type)
				this.orderInfo.provider = type;
				this.$forceUpdate()
			},
			//确认支付
			confirm: async function() {
				let that = this
				var provider = this.orderInfo.provider
				if (provider === "wxpay") {
					this.orderInfo.pay_type = that.$store.state.config.pay.wechat || "app"
				} else if (provider == "alipay") {
					this.orderInfo.pay_type = that.$store.state.config.pay.alipay || "app"
				}

				console.log("支付前：", this.orderInfo)

				//支付
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'app/shop/payment', this.orderInfo,
					'POST'
				).then(function(res) {
					let payData = null;
					if(typeof(res) == 'string'){
						payData = res;
					}else{
						payData = res.data;
					}
					if(payData){
						that.appPay(payData, provider, function(res) {
							if(res.status == 1){
								that.$store.commit('forceUpdatePage', true);
								uni.wen.toUrl(-2, 0, null);
								// todo: 无法刷新状态
							}else if(res.status == -1){
								// h5
							}
							
						}, function(reason) {
							uni.showToast({
								title: '支付失败',
								icon: 'none',
								duration: 1500
							});
						}, {'test': 1} )
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		@include background_color(page-box-background-color);
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		@include background_color(page-box-background-color);
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.mini-zhifubao,.mini-weixin{
			width: 100upx;
			font-size: 52upx;
		}

		.tit {
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $uni-font-size-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
