<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="box mini-page-body">
		<navBar :back="true" :home="fph" title="深色模式" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">
		
		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">深色模式</view>
				</view>
				<view class="right">
					<switch class="_switch" :color=" primaryColor " :checked=" pageTheme == 'black' " @change="themeChange"/>
				</view>
			</view>
		</view>
		<view style="height: 30rpx;"></view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">跟随系统</view>
				</view>
				<view class="right">
					<switch class="_switch" :color=" primaryColor " :checked=" followSystemTheme " @change="followSystemThemeChange"/>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 82,
			followSystemTheme: false,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(82, 0, true);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(uni.getStorageSync('followSystemTheme') == 1){
			that.followSystemTheme = true;
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		followSystemThemeChange(e){
			let that = this;
			if(e.detail.value){
				that.followSystemTheme = true;
				uni.setStorageSync('followSystemTheme', 1);
				
				let systemInfo = uni.getSystemInfoSync();
				if (systemInfo.theme === 'dark') {
				  that.$store.commit('updateGlobalTheme', 'black');
				} else {
				  that.$store.commit('updateGlobalTheme', 'default');
				}
				
			}else{
				that.followSystemTheme = false;
				uni.setStorageSync('followSystemTheme', 0);
			}
		},
		themeChange(e){
			let that = this;
			
			if(e.detail.value){
				that.$store.commit('updateGlobalTheme', 'black');
			}else{
				that.$store.commit('updateGlobalTheme', 'default');
			}
			that.followSystemThemeChange({detail: {value: false}});
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/pagesA/static/css/setting.scss';
</style>