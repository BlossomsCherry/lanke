<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="订单确认" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="container">
			<block>
				<block v-if="isNoAddress">
					
				</block>
				<block v-else>
					<view class="box">
						<view class="title" @tap.stop.prevent="toAdds">
							<text class="_text">您的收货地址</text>
							<view class="arrow-y"></view>
						</view>
						<view class="adds" v-if="addsinfo.name">
							<i class="mini-icon mini-dizhi3"></i>
							<view class="adds-box">
								<view class="txt1">{{ addsinfo.name }} {{ addsinfo.mobile }}</view>
								<view class="txt2">{{ addsinfo.province }} {{ addsinfo.city }} {{ addsinfo.county }}
									{{ addsinfo.adds }}
								</view>
							</view>
						</view>
						<view v-else class="adds-null">
							<view class="t1">您需要我们送到哪里？</view>
							<view class="t2">您还没有收货地址，请添加后继续结算</view>
							<view class="btn" @tap.stop.prevent="toAdds">
								去添加收货地址
								<view class="arrow-y"></view>
							</view>
						</view>
					</view>
				</block>
			</block>
			
			<view class="box">
				<view class="title"><text>您的商品清单</text></view>
				<view class="goods">
					<view class="goods-box" v-for="(item, index) in goodslist" :key="item.id">
						<image :src="item.goods_pic" mode="aspectFill"></image>

						<view class="goods-info">
							<view class="goods-info-name">
								<text class="_text">{{ item.goods_name }}</text>
								<view class="icon flex-column" v-if="item.goods_type == 6">
									<i class="mini-icon2 mini-ershou"></i>
								</view>
							</view>
							
							<view class="goods-info-doc">{{ item.goods_product }}</view>
							
								<block v-if="item.credit_type == 1">
									<view class="goods-info-number">
										<text class="txt">{{ item.num }} x</text>
										<block v-if="myUserInfo.is_member">
											￥<u-count-to :endVal="item.vip_price" :bold="true" :decimals="2"
												:color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="26"></u-count-to>
										</block>
										<block v-else>
											￥<u-count-to :endVal="item.price" :bold="true" :decimals="2"
												:color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="26"></u-count-to>
										</block>
									</view>
								</block>
								<block v-else-if="item.credit_type === 0">
									<view class="goods-info-number gold">
										<text class="txt">{{ item.num }} x</text>
										<block v-if="myUserInfo.is_member">
											<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
											<u-count-to :endVal="item.vip_price" :bold="true" :decimals="2"
												:color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="26"></u-count-to>
										</block>
										<block v-else>
											<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
											<u-count-to :endVal="item.price" :bold="true" :decimals="2"
												:color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="26"></u-count-to>
										</block>
									</view>
								</block>
						</view>
					</view>
				</view>
			</view>
			<view class="box">
				<view class="title"><text>备注（选填）</text></view>
				<view class="pr">
					<textarea class="textarea" @input="bindTextAreaBlur" auto-height maxlength="200"
						:value="user_remark" placeholder="下单后商家可见"></textarea>
					<view class="lng-txt">{{ user_remark.length }}/200</view>
				</view>
			</view>
			<view class="box">
				<view class="title"><text>订单明细</text></view>
				<view class="order">
					<text class="t1">商品合计</text>
					<view class="t2">
						<view class="blance" v-if="amount > 0">
							¥{{ amount }}
						</view>
						<view v-if="amount > 0 && amount_coin > 0" class="jia"> + </view>
						<view class="blance gold" v-if="amount_coin > 0">
							<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
							<text>{{ amount_coin }}</text>
						</view>
					</view>
				</view>
				<view class="order">
					<text :class="'t1 ' + (myUserInfo.is_member ? '' : 'line-through')">VIP合计</text>
					<view :class="'t2 ' + (myUserInfo.is_member ? '' : 'line-through')">
						<view class="blance" v-if="vipAmount > 0">
							¥{{ vipAmount }}
						</view>
						<view v-if="vipAmount > 0 && vipAmount_coin > 0" class="jia"> + </view>
						<view class="blance gold" v-if="vipAmount_coin > 0">
							<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
							<text>{{ vipAmount_coin }}</text>
						</view>
					</view>
				</view>
				<view class="order">
					<text :class="'t1 ' + (myUserInfo.is_member ? '' : 'line-through')">会员优惠</text>
					<view :class="'t2 ' + (myUserInfo.is_member ? '' : 'line-through')">
						<view class="blance" v-if="discountsAmount > 0">
							¥{{ discountsAmount }}
						</view>
						<view v-if="discountsAmount > 0 && discountsAmount_coin > 0" class="jia"> + </view>
						<view class="blance gold" v-if="discountsAmount_coin > 0">
							<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
							<text>{{ discountsAmount_coin }}</text>
						</view>
					</view>
				</view>
				<view class="order">
					<text class="t1">需付</text>
					<view class="t2">
						<block v-if="myUserInfo.is_member">
							<view class="blance" v-if="vipAmount > 0">
								¥{{ vipAmount }}
							</view>
							<view v-if="vipAmount > 0 && vipAmount_coin > 0" class="jia"> + </view>
							<view class="blance gold" v-if="vipAmount_coin > 0">
								<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
								{{ vipAmount_coin }}
							</view>
						</block>
						<block v-else>
							<view class="blance" v-if="amount > 0">
								¥{{ amount }}
							</view>
							<view v-if="amount > 0 && amount_coin > 0" class="jia"> + </view>
							<view class="blance gold" v-if="amount_coin > 0">
								<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
								{{ amount_coin }}
							</view>
						</block>
					</view>
				</view>
			</view>

			<view class="footer">
				<view class="footer-box">
					<block v-if="myUserInfo.is_member">
						<view class="footer-price">
							<view class="total-price">
								
								<view class="blance" v-if="vipAmount > 0">
									￥<u-count-to :endVal="vipAmount" :bold="true" :decimals="2" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="38"></u-count-to>
								</view>
								<view v-if="vipAmount > 0 && vipAmount_coin > 0" class="jia"> + </view>
								<view class="blance gold" v-if="vipAmount_coin > 0">
									<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
									{{ vipAmount_coin }}
								</view>
								
							</view>
							<view class="footer-text">
								会员优惠
								<view class="blance" v-if="discountsAmount > 0">
									¥{{ discountsAmount }}
								</view>
								<view v-if="discountsAmount > 0 && discountsAmount_coin > 0" class="jia"> + </view>
								<view class="blance gold" v-if="discountsAmount_coin > 0">
									<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
									{{ discountsAmount_coin }}
								</view>
								 
							 </view>
						</view>
						<view :class="'pay-btn ' + (showCheckoutOrder ? 'tbg1' : 'tbg2')" @tap.stop.prevent="checkoutOrder">提交订单</view>
					</block>
					<block v-else>
						<view class="footer-price">
							<view class="total-price">
								
								<view class="blance" v-if="amount > 0">
									￥<u-count-to :endVal="amount" :bold="true" :decimals="2" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'" fontSize="38"></u-count-to>
								</view>
								<view v-if="amount > 0 && amount_coin > 0" class="jia"> + </view>
								<view class="blance gold" v-if="amount_coin > 0">
									<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
									{{ amount_coin }}
								</view>
							</view>
							<view class="footer-text">
								若开通vip优惠
								 <view class="blance" v-if="discountsAmount > 0">
								 	¥{{ discountsAmount }}
								 </view>
								 <view v-if="discountsAmount > 0 && discountsAmount_coin > 0" class="jia"> + </view>
								 <view class="blance gold" v-if="discountsAmount_coin > 0">
								 	<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
								 	{{ discountsAmount_coin }}
								 </view>
							</view>
						</view>
						<view :class="'pay-btn ' + (showCheckoutOrder ? 'tbg1' : 'tbg2')" @tap.stop.prevent="checkoutOrder">提交订单</view>
					</block>
				</view>
			</view>
		</view>

		<u-popup :show="payPopup" @close="toOrder">
			<view class="pay-box">
				<image class="pay-box-image" src="https://img.mini.minisns.cn/icons/cyber.png" mode="aspectFill" />
				<view class="pay-box-text">{{ payTitle }}</view>
				<view class="pay-box-btn" @tap="toOrder">查看订单</view>
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
	
	
	const shop = require('@/mixins/shop');
	const pay = require('@/mixins/pay');
	var options = {};

	shop(options);
	pay(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
		},
		computed:{
			config_app_coins_name:{
				get(){
					let that = this;
					if(that.$store.state.config.app.coins){
						return that.$store.state.config.app.coins.name;
					}
					return '硬币';
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 45,
				aid: -1,
				addsinfo: {
					name: '',
					mobile: '',
					province: '',
					city: '',
					county: '',
					adds: ''
				},
				cart_id: 0,
				goodslist: [],
				
				amount: 0,
				vipAmount: 0,
				discountsAmount: 0,
				amount_coin: 0,
				vipAmount_coin: 0,
				discountsAmount_coin: 0,
				
				user_remark: '',
				payPopup: false,
				payTitle: '支付成功',
				showCheckoutOrder: true,
				
				isUsedOrder: false,
				isNoAddress: false,
			};
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			if(options.cart_id && options.cart_id > 0){
				that.cart_id = options.cart_id;
			}
			
			that.getShopPliceOrderGoods();
		},
		onShow: function() {
			let that = this;
			that.updateScene(45, 0, true);
			
			this.getAdds();
		},
		onShareAppMessage: function(res) {},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			//提交订单
			checkoutOrder() {
				let that = this;
				
				// 截
				if(that.amount < 0.01){
					that.coinPay({
						type: 1,
						cart_id: that.cart_id,
						user_remark: that.user_remark,
						aid: that.aid
					});
					return false;
				}

				if (that.isNoAddress || that.addsinfo.name) {
					
					let paywaylist = [0];
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

					if (that.showCheckoutOrder) {
						that.myToast({
							type:'payway',
							content: 'SHOP购物',
							price: (that.$store.state.userInfo.is_member ? that.vipAmount : that.amount),
							timeout: 2000,
							isClick:true,
							paywaylist: paywaylist,
							order: {
								type: 5,
								aid: that.aid,
								user_remark: that.user_remark,
								goods_amount: that.amount,
								discounts_amount: (that.$store.state.userInfo.is_member ? that.discountsAmount : 0),
								order_amount: (that.$store.state.userInfo.is_member ? that.vipAmount : that.amount),
								order_goods: that.goodslist,
								cart_id: that.cart_id,
								is_used_order: that.isUsedOrder
							}
						});
					}
					
				} else {
					uni.showToast({
						title: '暂未选择收货地址',
						icon: 'none'
					});
				}
			},

			toOrder() {
				this.setData({
					payPopup: false
				});
				uni.reLaunch({
					url: '/pagesA/shop/order/order'
				});
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
				
				let is_all_goodstype_5 = true;
				for (let v of goodslist) {
					
					if(v.goods_type == 6){
						that.isUsedOrder = true;
						is_all_goodstype_5 = false;
					}else if(v.goods_type == 5){
						
					}else{
						is_all_goodstype_5 = false;
					}
					
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
					
					isNoAddress: is_all_goodstype_5 ? true : false
				});
			},

			bindTextAreaBlur(e) {
				this.setData({
					user_remark: e.detail.value
				});
			},

			getAdds(id) {
				if (id) {
					this.setData({
						aid: id
					});
				}

				this.getShopGetCheckAdds();
			},

			toAdds() {
				let that = this;
				let addsinfo = that.addsinfo;
				let id = that.aid;

				if (addsinfo) {
					id = addsinfo.id;
				}

				uni.wen.toUrl(6, '/pagesA/mine/address/address?isChoose=1&id=' + id, null);
			}
		}
	};
</script>
<style lang="scss">
	@import './place-order.scss';
</style>
