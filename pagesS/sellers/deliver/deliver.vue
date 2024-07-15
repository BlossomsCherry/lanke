<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="商品发货" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="sales-page-content">
			
			<view class="tabs">
				<view class="inner">
					<view class="tabs-inner">
						<view :class="'tab-item ' + ( active === 0 ? 'active' : '' )" @tap.stop.prevent="tabChange(0)">
							<text class="_text">邮寄</text>
						</view>
						<view :class="'tab-item ' + ( active === 1 ? 'active' : '' )" @tap.stop.prevent="tabChange(1)">
							<text class="_text">扫码核销</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="page-block-gap"></view>
			<view class="tab-content tab-0" v-if=" active === 0 ">
				<view class="inner">
					<view class="list-item">
						<view class="label">
							物流公司
						</view>
						<view class="value">
							<picker mode = "selector" :range="range" range-key="name" @change="expressChange">{{ express_name }}</picker>
						</view>
					</view>
					<view class="line"></view>
					<view class="list-item">
						<view class="label">
							运单号码
						</view>
						<view class="value">
							<input placeholder="填写快递单号" v-model="express_no" class="_input"/>
						</view>
					</view>
					<view class="line"></view>
					<view class="list-item">
						<view class="label">
							备注
						</view>
						<view class="value">
							<textarea placeholder="选填" v-model="remark" class="_textarea"/>
						</view>
					</view>
				</view>
				<view class="page-block-gap"></view>
			</view>
			<view :class="'btn0 ' + ( express_no.length > 0 && express_type.length > 0 ? 'yes' : 'no' ) " @tap.stop.prevent="pushDeliver" v-if=" active === 0 ">确认发货</view>
			<view class="tab-content tab-1" v-if=" active === 1 ">
				
				<view class="tip">
					<view class="inner">
						提示：该步骤结束代表本次订单完结，卖家应提醒买家检查货物是否合格，核销完成后，卖家资金会立即到账
					</view>
				</view>
				<view class="way way1">
					<view class="inner">
						<view class="title">方式一：输入买家的取件码</view>
						<view class="code-wrap">
							<view class="code">
								<input class="_input" placeholder="取件码" v-model="coupon_code"/>
							</view>
							<view class="btn1" @tap.stop.prevent="pushDeliver">
								确定
							</view>
						</view>
					</view>
				</view>
				<view class="page-block-gap"></view>
				<view class="way way2">
					<view class="inner">
						<view class="title">方式二：请买家出示取件码并进行扫码核销</view>
						<view class="btn2 scan" @tap.stop.prevent="toSliderUrl(9, null)">
							扫码核销
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
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
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 102,
			order_id: 0,
			active: 0,
			
			express_no: '',
			express_name: '选择物流公司',
			express_type: '',
			range: [],
			remark: '',
			
			coupon_code: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(102, 0);
		
		let coupon_code = uni.getStorageSync('shop:order:coupon:code');
		if(coupon_code && coupon_code.length > 0){
			that.coupon_code = options.code;
			that.active = 1;
			that.pushDeliver();
		}
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(options.code && options.code.length > 0){
			that.coupon_code = options.code;
			that.active = 1;
			that.pushDeliver();
		}else{
			that.order_id = options.oid;
			that.getExpressRange();
		}
		// todo: 验证该订单是否可以发货
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		pushDeliver(){
			let that = this;
			
			if(that.active === 0){
				if(that.express_no.length <= 0 || that.express_type.length <= 0){
					uni.showToast({
						title: '请先输入快递公司和运单号码',
						icon: 'none'
					});
					return false;
				}
			}else{
				if(that.coupon_code.length <= 0){
					uni.showToast({
						title: '请先输入自提码',
						icon: 'none'
					});
					return false;
				}
			}
			
			
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/deliver', {
				order_id: that.order_id,
				action: that.active === 0 ? 'express' : 'coupon',
				express_type: that.express_type,
				express_no: that.express_no,
				remark: that.remark,
				code: that.coupon_code
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					if(that.active === 0){
						uni.showToast({
							title: '发货成功',
							icon: 'none',
							duration: 2500
						});
						setTimeout(function(){
							uni.wen.toUrl(6, '/pagesA/shop/logistics/logistics?nu=' + res.data.express_no + '&type=' + res.data.express_type);
						},2500);
					}else{
						uni.showToast({
							title: '发货成功，您的收益已到账余额',
							icon: 'none',
							duration: 2500
						});
						setTimeout(function(){
							uni.wen.toUrl(-2, null);
						}, 2500);
					}
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		expressChange(e){
			let that = this;
			that.express_name = that.range[e.detail.value].name;
			that.express_type = that.range[e.detail.value].type;
		},
		getExpressRange(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/express_range').then(function(res) {
				if(res.status){
					that.range = res.data;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		tabChange(which){
			let that = this;
			that.active = which;
		}
	}
}
</script>

<style lang="scss" scoped>
@import './deliver.scss';
</style>