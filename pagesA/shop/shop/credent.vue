<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="店铺资质" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="credent-page-content">
			<view class="inner">
				<view style="height: 30rpx;"></view>
				<block v-if="shop.shop_type == 1">
					<view class="line"> 
						<view class="left">店铺类型：</view>
						<view class="right">
							{{ shop.shop_type_name }}
						</view>
					</view>
					
					<view class="line">
						<view class="left">店铺名称：</view>
						<view class="right">
							{{ shop.shop_name }}
						</view>
					</view>
					
					<view class="line">
						<view class="left">负责人姓名：</view>
						<view class="right">{{ shop.head_name }}</view>
					</view>
					
					<view class="line">
						<view class="left">负责人身份证号：</view>
						<view class="right">{{ shop.head_id_card_num }}</view>
					</view>
					
				</block>
				
				<view class="tip">注：以上信息，由商家依据《电子商务法》规定发布公示。如需进一步核实，可联系商家客服咨询</view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 114,
			shop_id: 0,
			shop: {
				shop_type: 1,
				shopClassifys: [],
				margin_least: 0,
				status: 0,
				status_tip: '',
				is_follow: false
			},
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(114, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.shop_id = options.id;
		that.shopInfo();
	},
	onPullDownRefresh: function () {
		let that = this;
		that.shopInfo();
	},
	methods: {
		shopInfo(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/info', {shop_id: that.shop_id }).then(function(res) {
				uni.loading(false);
				uni.stopPullDownRefresh();
				if(res.status){
					that.shop = res.data.shop;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
.credent-page-content{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.line{
			display: flex;
			margin-bottom: 20rpx;
			.left{
				margin-right: 20rpx;
				@include color(color-lightest-dark);
				font-size: $uni-font-size-sm-base;
			}
			.right{
				@include color(color-light-dark);
				font-size: $uni-font-size-sm-base;
			}
		}
	}
	.tip{
		position: fixed;
		bottom: 40rpx;
		@include color(color-light-dark);
		font-size: $uni-font-size-sm-base;
		width: $page-content-body-width;
	}
}
</style>