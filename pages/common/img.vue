<template>
	<view @click="back" :data-theme="global__theme__" :data-platform="global__platform__" :data-device="global__device__">
		
		<swiper class="swiper-img" :current="currentImg" :duration="300" @change="changeSwiper">
			<swiper-item class="swiper-item" v-for="(item, index) in imgs" :key="index">
				<view class="img-page">
					<movable-area scale-area>
						<movable-view direction="all" :scale="true" :scale-min="1" :scale-max="4" :out-of-bounds="true" @scale.stop.prevent="scale_action">
							<image :src="item.url" mode="widthFix" :lazy-load="true" @longpress.stop.prevent="saveCurrentImg()" @tap.stop.prevent="uni_preview"/>
						</movable-view>
					</movable-area>
				</view>
			</swiper-item>
		</swiper>
		<view class="item-bottom">
			<view class="small-list-page">
				<scroll-view class="small-list" v-if="imgs.length > 1" :scroll-x="true" :enable-flex="true">
					<view class="img-page" :class="currentImg == index ? 'img-page-checked' : ''"
						v-for="(item, index) in imgs" :key="index" @click.stop="toImg(index)">
						<image class="img" border-radius="10rpx" :src="item.url" mode="aspectFill" />
					</view>
				</scroll-view>
			</view>
			<view :class=" 'origin-img-button ' + (isOrigin == true ? 'done' : '') " @tap.stop.prevent="originImg">{{ (isOrigin == true ? '已完成' : '查看原图') }}</view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 72,
				imgs: [],
				currentImg: 0,
				isOrigin: false,
				downing: true,
			};
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			let imgs = options.imgs;
			let current = options.current;
			let src = decodeURIComponent(options.src);
			if(imgs){
				that.imgs = JSON.parse(imgs);
			}else if(src){
				that.imgs = [{url: src}];
			}
			that.currentImg = current;
			if(src && !current){
				for(let i = 0; i < that.imgs.length ; i++){
					if(that.imgs[i].url == src){
						that.currentImg = i;
						break;
					}
				}
			}
		},
		onShow: function () {
			let that = this;
			that.updateScene(72, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			uni_preview(){
				let that = this;
				that.originImg();
				uni.previewImage({
					current: that.imgs[that.currentImg].url,
					urls: [that.imgs[that.currentImg].url]
				});
			},
			scale_action(e){
				e.stopPropagation();
				return false;
			},
			saveCurrentImg:function(e){

				let that = this
				// #ifdef MP
				uni.wen.util.checkMpPermission('scope.writePhotosAlbum', '请先在设置页面打开“保存相册”使用权限', () => {
					that.saveImgToLocal()
				});
				// #endif
				
				// #ifdef APP
				uni.wen.util.checkAppPermission('photoLibrary-write', '[相册写入权限]用于保存图片', () => {
					that.saveImgToLocal()
				}, that);
				// #endif
				
				// #ifdef H5
				that.saveImgToLocal()
				// #endif
				
			},
			saveImgToLocal:function(e){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定保存到相册吗',
					success: function (res) {
						if (res.confirm) {
							uni.downloadFile({
									url: that.imgs[that.currentImg].url,//图片地址
									success: (res) =>{
										if (res.statusCode === 200){
											uni.saveImageToPhotosAlbum({
												filePath: res.tempFilePath,
												success: function() {
													uni.showToast({
														title: "保存成功",
														icon: "none"
													});
												},
												fail: function() {
													uni.showToast({
														title: "保存失败",
														icon: "none"
													});
												}
											});
										}else{
											console.log(res);
										}
									}
								})
							
							
						} else if (res.cancel) {
							
						}
					}
				});
			},
			changeSwiper(e) {
				let that = this;
				that.currentImg = e.detail.current;
				if(that.imgs[that.currentImg].is_origin == true){
					that.isOrigin = true;
				}else{
					that.isOrigin = false;
				}
			},
			toImg(index) {
				this.currentImg = index;
			},
			originImg(){
				let that = this;
				let imgs = that.imgs;
				imgs[this.currentImg].url = uni.wen.util.removeStyles(imgs[this.currentImg].url);
				imgs[this.currentImg].is_origin = true;
				that.setData({
					imgs: imgs
				});
				setTimeout(function(){
					that.setData({
						isOrigin: true
					});
				}, 500);
			},
			back() {
				if (this.isPop) {
					this.isPop = false
					return
				}
				try {
					this.$Router.back(1);
				} catch (e) {
					uni.wen.toUrl(-2, 0, null);
				}
			},

		},
	};
</script>

<style lang="scss" scoped>
	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	movable-area {
		height: 100%;
		width: 100%;
		position: fixed;
		overflow: hidden;
	}

	movable-view image {
		width: 100%;
	}

	uni-image>img {
		z-index: -1 !important;
	}

	.content {
		height: 60vh;
		overflow-y: scroll;
	}

	.swiper-img {
		width: 100vw;
		min-height: 100vh;
		background-color: #000000;

		.swiper-item {
			width: 100vw;
			min-height: 100vh;

			.img-page {
				min-height: 100vh;
				overflow-y: scroll;
				display: flex;
				align-items: center;
			}
		}
	}

	.item-bottom {
		width: 690rpx;
		position: fixed;
		z-index: 9999;
		bottom: 0;
		left: 0rpx;
		padding: 30rpx;
		transition: ease-in-out 0.3s;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		.origin-img-button {
		    color: #fff;
		    border: 2rpx solid #fff;
		    width: 200rpx;
		    text-align: center;
		    border-radius: 40rpx;
		    padding: 10rpx 20rpx;
		    margin: auto;
			box-shadow: 2rpx 2rpx 6rpx 0px #000000;
			background-color: rgba(0,0,0,.6);
		}
		.origin-img-button.done {
			background-color: #cccccc;
			color: #fff;
			border-color: #cccccc;
		    display: none;
		}
	}

	.small-list-page {
		min-height: 60rpx;
	}

	.small-list {
		display: flex;
		justify-content: center;
		align-items: center;

		.img-page {
			display: inline-block;
			margin-right: 20rpx;
			border: 2rpx solid #c2c2c2;
			transition: ease-in 0.1s;
			border-radius: 11rpx;
			background: #c2c2c2;

			&:last-child {
				margin-right: 0;
			}

			.img {
				width: 46rpx;
				height: 46rpx;
				min-width: 46rpx;
				min-height: 46rpx;
				display: block;
				border-radius: 11rpx;
			}
		}

		.img-page-checked {
			// transform: scale(1.2);
			border: 4rpx solid $uni-color-primary;
			
		}
	}

	.pop {
		width: 500rpx;
		@include background_color(page-box-background-color);
		border-radius: 20rpx;
		overflow: hidden;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999999;

		.item {
			line-height: 100rpx;
			height: 100rpx;
			padding: 0 50rpx;
			transition: all .2s;
			border-radius: 20rpx;

			&:active {
				background-color: #eeeeee;
			}
		}
	}
</style>
