<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
	:data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="等级说明" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="">
			<view class="lv-box">
				<view class="inner">
					<view class="lv-item lv-1">lv-1：0-60</view>
					<view class="lv-item lv-2">lv-2：60-800</view>
					<view class="lv-item lv-3">lv-3：800-3500</view>
					<view class="lv-item lv-4">lv-4：3500-10800</view>
					<view class="lv-item lv-5">lv-5：10800-38800</view>
					<view class="lv-item lv-6">lv-6：38800</view>
				</view>
			</view>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
	  
	}
}
</script>

<style lang="scss" scoped>
.lv-box{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.lv-item{
			
		}
	}
	
}
</style>