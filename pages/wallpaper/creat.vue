<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">
			<view slot="right">
			  <i class="create-icon mini-icon mini-a-weibiaoti-10_huaban1" @tap.stop.prevent="addWallpaper"></i>
			</view>
		</navBar>
		<view class="wallpaper-creat-page">
			<view class="inner">
				<view class="text-area">
					<u--textarea class="_u__textarea" v-model="formData.title" :height="170" :placeholder="'为你的'+config2_page_wallpapers_name+'加点描述吧...'" border='none' placeholderClass="_input_place_holder" :maxlength="100"></u--textarea>
					<view class="add-location-wrap">
						<block v-if="formData.address_detailed && formData.address_detailed.length > 0">
							<view class="add-location" @tap.stop.prevent="delAddsTap"><i class="mini-icon mini-dizhi2"></i>{{ formData.address_detailed }}</view>
						</block>
						<block v-else>
							<view class="add-location" @tap.stop.prevent="onLocationClick"><i class="mini-icon mini-dizhi2"></i>添加地点</view>
						</block>
						
					</view>
				</view>
				<view class="images-area">
					<mini-upload-img ref="miniUploader" style="width: 650rpx;" @uploading=" isUploading = true " :number="30"
						@change="miniUploadImgChange" :showAdd="true" :scene="153"></mini-upload-img>
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

import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		miniUploadImg
	},
	computed:{
		config2_page_wallpapers_name:{
			get(){
				let that = this;
				if(that.$store.state.config2.page.wallpapers && that.$store.state.config2.page.wallpapers.name){
					return that.$store.state.config2.page.wallpapers.name;
				}else{
					return '图集';
				}
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 153,
			id: 0,
			bureau_id: 0,
			formData: {
				title: '',
				imgList: [],
				latitude: 0,
				longitude: 0,
				address_name: '',
				address_detailed: ''
			},
			isUploading: false
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(153, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		
		if(options.id && options.id > 0){
			that.id = options.id;
			that.getWallpaperDetail();
		}
		
		if(options.bureau && options.bureau > 0){
			that.bureau_id = options.bureau;
		}
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		// 选择位置
		onLocationClick: function () {
		  var that = this;
		  
		  // #ifdef MP
		  uni.wen.util.checkMpPermission('scope.userLocation', '请到设置页面授权“位置信息”权限', () => {
		  	that.startChooseLocation()
		  });
		  // #endif
		  
		  // #ifdef APP
		  uni.wen.util.checkAppPermission('location', '[位置权限]获取您的位置等信息，用于标记笔记的位置', () => {
		  	that.startChooseLocation()
		  }, that);
		  // #endif
		  
		  // #ifdef H5
		  that.startChooseLocation()
		  // #endif
		},
		
		startChooseLocation: function () {
		  var that = this;
		  uni.chooseLocation({
		    success: function (a) {
		      that.formData.latitude = a.latitude;
		      that.formData.longitude = a.longitude;
		      that.formData.address_name = a.address;
		      that.formData.address_detailed = a.name;
		    },
			fail: function(err){
				console.log(err);
			}
		  });
		},
		
		// 清空位置
		delAddsTap() {
		  this.formData.latitude = 0;
		  this.formData.longitude = 0;
		  this.formData.address_name = '';
		  this.formData.address_detailed = '';
		},
		miniUploadImgChange(data) {
		  let that = this;
		  let image_urls = [];
		  for (var i = 0; i < data.urls.length; i++) {
		    image_urls.push(data.urls[i]);
		  }
		  that.isUploading = false;
		  that.formData.imgList = image_urls;
		},
		addWallpaper(){
			let that = this;
			if(!(that.formData.title.length > 0 && that.formData.imgList.length > 0)){
				uni.showToast({
					title: '请填写描述和上传图片',
					icon: 'none'
				});
				return false;
			}
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/wallpaper_process', {
				id: that.id,
				bureau_id: that.bureau_id,
				type: 'add',
				title: that.formData.title,
				imgs: that.formData.imgList.join(','),
				latitude: that.formData.latitude,
				longitude: that.formData.longitude,
				address_name: that.formData.address_name,
				address_detailed: that.formData.address_detailed
			}).then(function(res) {
				uni.loading(false);
				if (res.status) {
					uni.showToast({
						icon: 'none',
						title: '发布成功'
					})
					setTimeout(function(){
						uni.wen.toUrl(-6, '/pages/wallpaper/detail?id=' + res.data);
					}, 400);
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		getWallpaperDetail() {
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/detail', {
				id: that.id
			}).then(function(res) {
				uni.loading(false);
				if (res.status) {
					that.setData({
						imgList: res.data.imgs,
						imgLength: res.data.imgNum,
						icCollect: res.data.iscollect,
						title: res.data.title,
					});
					that.formData = {
						title: res.data.title,
						imgList: res.data.imgs
					};
					that.$refs.miniUploader.setInitValue(that.formData.imgList);
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error'
					});
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
.mini-page-body{
	@include background_color(page-body2-background-color);
}
.lxy-nav-bar__right .create-icon {
  color: $uni-color-primary;
  font-size: 70rpx;
}
.wallpaper-creat-page{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.images-area{
			margin-top: 30rpx;
			@include background_color(page-box-background-color);
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			display: flex;
		}
		.text-area{
			margin-top: 30rpx;
			@include background_color(page-box-background-color);
			display: flex;
			flex-direction: column;
			justify-content: left;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			._u__textarea{
				@include color(color-light-dark);
			}
			.add-location-wrap{
				.add-location{
					@include background_color(page-body2-background-color);
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-width: 130rpx;
					font-size: $uni-font-size-sm;
					white-space: nowrap;
					@include color(color-lightest-est-er-dark);
					text-align: center;
					height: 50rpx;
					line-height: 50rpx;
					border-radius: 200rpx;
					padding: 0 20rpx;
					.mini-icon{
						@include color(color-lightest-est-er-dark);
						font-size: $uni-font-size-sm;
						margin-right: 10rpx;
					}
				}
			}
			
		}
	}
	
}
</style>