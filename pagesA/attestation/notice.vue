<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="notice-page-content">
			<view class="inner">
				<rich-text :nodes="richTextNodes"></rich-text>
			</view>

			<view class="bottomBox">
				<view class="nextbut" @click="toSliderUrl(6, '/pagesA/attestation/modality?sid=' + sid + '&term=' + term + '&role=' + role)">同意，下一步</view>
				<view class="nonextbut" @click="toSliderUrl(-2)">不同意，返回</view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 134,
			richTextNodes: '',
			sid: '',
			role: 'student',
			term: 2023,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(134, 0, true);
		
		if(that.myUserInfo.id > 0){
			if(that.myUserInfo.university && that.myUserInfo.university.length > 0){
				uni.showToast({
					title: '您已完成学生认证，无需再次认证',
					icon: 'none'
				});
				setTimeout(function(){
					uni.wen.toUrl(-2, null, that);
				}, 700);
				return false;
			}
		}
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.sid = options.sid;
		that.role = options.role;
		that.term = options.term;
		
		if(!that.sid){
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
			setTimeout(function(){
				uni.wen.toUrl(-2, null, that);
			}, 300);
			return false;
		}
		
		that.getClauseContent();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		getClauseContent(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/getClauseDetail', {id: 22}).then(res => {
				uni.loading(false);
			    if (res.status) {
					that.richTextNodes = res.data.content;
			    } else {
			        uni.showToast({title: res.message, icon: 'none', duration: 1500})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.notice-page-content{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
	}
	.bottomBox{
		width: 750rpx;
		height: 250rpx;
		position: fixed;
		bottom: 0;
		justify-content: center;
	}
	.nextbut{
		background: $uni-color-follow;
		color: $uni-color-follow-font;
		width: 688rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: $uni-font-size-sm-base;
		font-weight: bold;
		border-radius: 80rpx;
		margin: 0 auto;
	}
	.nonextbut{
		text-align: center;
		line-height: 80rpx;
		@include color(color-lightest-dark);
		font-size: $uni-font-size-sm-base;
		font-weight: bold;
	}
}

</style>
