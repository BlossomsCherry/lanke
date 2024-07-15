<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="订单核销" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
			:background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">

		</navBar>
		<view class="selfpick-page-content">
			<view class="page-block-gap"></view>
			<view class="inner">
				<view class="inner_head">
					<view class="inner_head--status">
						<u-icon name="clock" size="40" bold v-if="coupon.status === 0"></u-icon>
						<text class="text">{{ coupon.status_tip || '  ' }}</text>
					</view>
					<view class="inner_head--time">
						<!-- <text>请在2024/02/21(含)前到店消费</text> -->
					</view>
				</view>
				<view class="inner_qrCont">
					
					<block v-if="order">
						<view class="inner_qrCont_shop" @tap.stop.prevent="toGood">
							<image class="inner_qrCont_shop--image" :src="order.order_image" mode="aspectFill"></image>
							<view class="inner_qrCont_shop_box">
								<view class="shopName">
									<view class="icon flex-column">
										<i class="mini-icon2 mini-ershou" v-if="order.is_used"></i>
									</view>
									<text class="text">{{ order.order_title }}</text>
									<u-icon name="arrow-right" size="26rpx" color="#666666"></u-icon>
								</view>
								<view class="time">
									<!-- <text>周一至周日 到店吃</text> -->
								</view>
								<view class="tip">
									<text>实际支付：{{ order.pay_way }}</text>
								</view>
								<view class="pirce">
									<view class="blance" v-if="order.order_amount > 0">
										¥{{ order.order_amount }}
									</view>
									<view v-if="order.order_amount > 0 && order.order_amount_coin > 0" class="jia"> + </view>
									<view class="blance gold" v-if="order.order_amount_coin > 0">
										<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
										{{ order.order_amount_coin }}
									</view>
									
								</view>
							</view>
						</view>
					</block>
					
					<view class="inner_qrCont_code">
						<image :src="coupon.qrcode" :class="'qrCode status_' + coupon.status" mode="aspectFill"></image>
						<view style="width: 24rpx;"></view>
						<view class="barCode">
							<image :src="coupon.barcode" :class="'barCode-image status_' + coupon.status" mode="aspectFill"></image>
						</view>
					</view>
					<view class="inner_qrCont--detail">
						<view class="title"><text>券码信息</text></view>
						<block v-if="goods && goods.length == 1">
							<view class="button" @tap.stop.prevent="orderRefund">{{ goods[0].state_tip }}</view>
						</block>
						<block v-else>
							<view class="button" @tap.stop.prevent="orderRefund">申请退款</view>
						</block>
					</view>
					<view class="inner_qrCont--time">
						<!-- <text>2024-02-2123:59到期</text> -->
					</view>
					<view class="inner_qrCont_list">
						<view class="box" v-if="coupon.code_tip">
							<view class="flex">
								<view class="dian"></view>
								<view class="code">
									<text class="_text">{{ coupon.code_tip }}</text>
									<view class="icon flex-column" @tap.stop.prevent="toSliderUrl(17, coupon.code_tip)"><i class="mini-icon mini-fuzhi"></i></view>
								</view>
							</view>
							<view class="status" v-if="coupon.status_tip">{{ coupon.status_tip }}</view>
						</view>
					</view>
				</view>
				<view class="inner_store">
					<view class="inner_store_head">
						<view class="title">
							<text>{{ order.address_detailed || '' }}</text>
						</view>
						<block v-if="order.seller_phone">
							<view class="phone flex" @tap.stop.prevent="toSliderUrl(22, order.seller_phone)"><u-icon name="phone-fill" size="28rpx"></u-icon><text class="text">联系商家</text></view>
						</block>
						<block v-else>
							<view class="phone flex" @tap.stop.prevent="toSliderUrl(18, order.seller_user_id)"><u-icon name="chat" size="28rpx"></u-icon><text class="text">联系商家</text></view>
						</block>
						
					</view>
					<view class="inner_store--tip flex">
						<!-- <u-icon name="clock" size="30rpx"></u-icon> -->
						<!-- <text class="text">休息中11:00-14:00 17:00-21:00</text> -->
					</view>
					<view class="inner_store--tip flex" v-if="order.address_tip" @tap.stop.prevent="toSliderUrl(30, order.longitude + '|' + order.latitude + '|' + order.address_name + '|8' )">
						<u-icon name="map" size="30rpx"></u-icon>
						<text class="text">{{ order.address_tip }}</text>
					</view>
					<!-- <view class="inner_store--btn">
						<text>更多适用门店</text>
						<u-icon name="arrow-right" size="26rpx" color="#666666"></u-icon>
					</view> -->
				</view>
				<view class="inner_detail">
					<view class="title">套餐详情</view>
					<block v-for="(item, index) in goods" :key="index">
						<view class="box" @tap.stop.prevent="toGoodDetail(item.goods_type, item.goods_id)">
							<view class="flex-row">
								<view class="flex-column" style="justify-content: center;"><view class="dian"></view></view>
								<view class="title">{{ item.name }}</view>
								<view class="num">({{ item.quantity }}份)</view>
							</view>
							<view class="price">
								<block v-if="item.credit_type === 0">
									<view class="icon flex-column">
										<i class="gold-color mini-icon mini-Gold_coin_01"></i>
									</view>
									<text class="_text">{{ item.price }}</text>
								</block>
								<block v-else>
									￥{{ item.price }}
								</block>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		
<!-- 		<view class="bottom_box">
			<view class="btn">再来一单</view>
		</view> -->
		
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


	const common = require('@/mixins/common');
	var options = {};
	common(options);
	export default {
		mixins: [{
			methods: options
		}],
		components: {
			myToast,
			navBar,
			hoverBall,
		},
		computed: {

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 103,
				order_id: 0,
				goods: [],
				order: {},
				coupon: {}
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(103, 0);
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

			that.order_id = options.oid;
			that.getShopOrderCoupon();
		},
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				goods: [],
				order: {},
				coupon: {}
			});
			that.getShopOrderCoupon();
		},
		methods: {
			orderRefund() {
			    let that = this;
				if(that.goods.length > 1){
					uni.showToast({
						title: '请前往订单页面，点击“订单详情”进行逐项退款',
						icon: 'none'
					});
					setTimeout(function(){
						uni.wen.toUrl(-6, '/pagesA/shop/order/order', that);
					}, 600);
					return false;
				}
				let order_good_id = that.goods[0].id;
				
				if(!(that.goods[0].refund_deadline == 1 && that.goods[0].state === 0)){
					uni.showToast({
						title: that.goods[0].state_tip,
						icon: 'none'
					});
					return false;
				}
				
				let orderRefund_ = function(order_good_id, that){
					uni.wen.util.request(
						uni.wen.api.ApiRootUrl + 'shop/orderRefund', {
							action: 'add',
							order_good_id: order_good_id,
						},
						'POST'
					).then(function(res) {
						if(res.status){
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 800
							});
							setTimeout(function(){
								that.getShopOrderCoupon();
							}, 800);
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
						}
					});
				};
				
			    uni.showModal({
			        title: '提示',
			        content: '确定要提交退款申请吗？退款申请操作是不可逆的。',
			        confirmText: '提交退款',
			
			        success(res) {
			            if (res.confirm) {
			                orderRefund_(order_good_id, that);
			            }
			        }
			    });
			},
			toGoodDetail(type, id){
				let that = this;
				if(type == 6){
					uni.wen.toUrl(28, id, that);
				}else if(type == 7){
					uni.wen.toUrl(34, id, that);
				}else{
					uni.wen.toUrl(3, id, that);
				}
			},
			toGood(){
				let that = this;
				if(that.goods && that.goods[0]){
					if(that.goods[0].goods_type == 6){
						uni.wen.toUrl(28, that.goods[0].goods_id, that);
					}else if(that.goods[0].goods_type == 7){
						uni.wen.toUrl(34, that.goods[0].goods_id, that);
					}else{
						uni.wen.toUrl(3, that.goods[0].goods_id, that);
					}
				}
				
			},
			getShopOrderCoupon(){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/orderCoupon', {
					order_id: that.order_id,
				}, 'POST').then(function(res) {
					uni.stopPullDownRefresh();
					if(res.status){
						that.goods = res.data.goods;
						that.order = res.data.order;
						that.coupon = res.data.coupon;
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					uni.loading(false);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './selfpick.scss';
</style>