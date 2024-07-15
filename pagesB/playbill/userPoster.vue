<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<navBar :back="true" :home="fph" title="推广海报" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		</navBar>
		<view style="height:8vh;"></view>
		<view class="canvas">
			<canvas :style="{ width: cansWidth + 'px', height: cansHeight + 'px' }" canvas-id="firstCanvas"></canvas>
		</view>

		<swiper class="poster_swiper" previous-margin="110rpx" circular  next-margin="110rpx">
					<swiper-item v-for="(item, index) of posterData.swiperList" :key="index">
						<image @click="selseimg(item)" :src="item.url" mode="aspectFill" class="poster_swiper_img">
						</image>
					</swiper-item>
		</swiper>
<!-- 		<view class="imglist">
			<view :style="[{ width:widths+'upx'}]">
				<block v-for="(item,index) in posterData.swiperList" :key="index">
					<image @click="selseimg(item)" :src="item.url" mode="aspectFill">
					</image>
				</block>
			</view>
		</view> -->

		<view class="bottom">
			<view @click="saveCans(1)">保存海报</view>
			<view @click="saveCans(2)">一键邀请</view>
		</view>
	<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	 //预览图片
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 60,
				cansWidth: 280, //海报宽度
				cansHeight: 400, //海报高度
				widths: "", //图片列表笔记宽度
				imgsrc: "", //保存图片的路径
				userId: 0,
				posterData: {
					webUrl: ''
				},
				localAvatar: '',
			};
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			if(options.id){
				that.userId = options.id;
			}else{
				that.userId = that.$store.state.userInfo.id;
			}

			that.getUserPoster() //请求海报数据
		},
		onShow: function () {
			let that = this;
			that.updateScene(60, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getUserPoster(){
				uni.loading(true);
				let that = this;
				if(!that.userId){
					uni.showToast({
						title: '初始化失败',
						icon:'error'
					});
					return false;
				}
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/user/poster', {
					id: that.userId
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							posterData: res.data
						});
						uni.downloadFile({
							url: that.posterData.userdata.avatar,
							success: function(res) {
								that.localAvatar = res.tempFilePath;
								setTimeout(() => {
									that.selseimg(that.posterData.swiperList[0])
								}, 100)
							}
						})
						
					}else{
						uni.showToast({
							title: res.message,
							icon:'error'
						});
					}
				});
			},
			selseimg(swiperList) { //绘制海报
				let that = this;
				if (that.posterData.userdata.name.length > 3) { //昵称太长加省略号
					that.posterData.userdata.name = that.posterData.userdata.name.slice(0, 3) + "..."
				}

				uni.loading(true);

				
				// 如果线上路径 ，则这行
				uni.downloadFile({
					url: swiperList.url,
					success: function(res) {
						
						// 下载二维码
						uni.downloadFile({
							
							url: that.posterData.code,
							success: function(res2) {
								const context = uni.createCanvasContext('firstCanvas', that);
								context.drawImage(res.tempFilePath, 0, 0, 280, 400); //海报背景
								context.drawImage('/pagesB/static/playbill/userPoster/white.png', 0, 0, 280, 400)
								context.drawImage(res2.tempFilePath, 182, 304, 75, 75)
								context.setFillStyle('#333333')
								context.setFontSize(12)
								context.fillText(swiperList.text1, 190, 296)
								context.fill()
								
								context.setFillStyle('#333333')
								context.setFontSize(20)
								context.fillText(that.posterData.userdata.name, 80, 335) //昵称
								context.fill()
								
								context.setFillStyle('#666666')
								context.setFontSize(12)
								context.fillText(swiperList.text2, 80, 355)
								context.fillText(swiperList.text3, 80, 375)
								context.fill()
								
								context.save()
								context.beginPath()
								context.arc(44, 350, 25, 0, 2 * Math.PI)
								context.clip()
								context.drawImage(that.posterData.userdata.avatar, 17, 322, 55, 55) //头像
								context.restore()
								context.draw()
								
								uni.loading(false);
								
							},
							fail(err) {
								uni.loading(false);
								console.log("err", err)
							}
						})
						
					},
					fail(err) {
						uni.loading(false);
						console.log("err", err)
					}
				})
			},
			saveCans(e) { //保存海报
			let that = this;
				uni.loading(true);

				console.log('保存');
				let tempRatio = 1.5;

				// #ifdef H5 || APP-PLUS
				tempRatio = 1;
				// #endif

				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: that.cansWidth * tempRatio,
					height: that.cansHeight * tempRatio,
					destWidth: that.cansWidth * tempRatio * 2,
					destHeight: that.cansHeight * tempRatio * 2,
					canvasId: 'firstCanvas',
					success: function(res) {
						uni.hideLoading()
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(red) {
								uni.showToast({
									title: '保存相册成功'
								})
								that.imgsrc = res.tempFilePath
								if (e == 2) {
									that.ShareUser();
								}
							},
							fail(res) {
								if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
									uni.showModal({
										title: '您需要授权相册权限',
										success(res) {
											if (res.confirm) {
												uni.openSetting({
													success(res) {

													},
													fail(res) {
														console.log(res)
													}
												})
											}
										}
									})
								}
							}
						});
					},
					fail(res) {
						uni.hideLoading()
					}
				}, this)
			},
			ShareUser() {
				let that = this;
				if(that.$store.state.config.app.wechat.mini.meta_appid){
					let shareGoodObj = {
						'provider': 'weixin',
						'type': 5,
						'title': '分享了我的主页',
						'scene': 'WXSceneSession',
						'imageUrl': that.$store.state.config.img.default_share,
						'miniProgram': {
							'id': that.$store.state.config.app.wechat.mini.meta_appid,
							'path': '/pages/user/user?id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
							'type': 0,
							'webUrl': that.posterData.webUrl
						},
						success: function (res) {
								console.log("success:" + JSON.stringify(res));
						},
						fail: function (err) {
							console.log("fail:" + JSON.stringify(err));
						}
					};
					
					uni.share(shareGoodObj);
				}else{
					uni.showToast({
					    title: '未知小程序appid',
					    icon: 'none',
					    duration: 1500
					});
				}
			
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F1F1;
	}

	.pageHeader {
		height: var(--status-bar-height);
		@include background_color(page-box-background-color);
	}

	.box-header {
		position: fixed;
		top: 0upx;
		width: 100%;
		z-index: 100;
	}

	.top-box {
		height: 100upx;
		width: 100%;
	}

	.canvas {
		display: flex;
		justify-content: center;
		margin-bottom: 0%;
	}

	.bottom {
		padding: 20upx 0 calc(env(safe-area-inset-bottom) + 20upx);
		width: 100%;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		@include background_color(page-box-background-color);
	}

	.bottom view:first-child {
		padding: 20upx 60upx;
		background: #FF8A00;
		border-radius: $uni-border-radius-lg-er;
		font-size: 30upx;
		color: #FFFFFF;
	}

	.bottom view:last-child {
		padding: 20upx 60upx;
		background: #FF5256;
		border-radius: $uni-border-radius-lg-er;
		font-size: 30upx;
		color: #FFFFFF;
	}
	.poster_swiper {
		width: 100%;
	}
	.poster_swiper_img {
	    transform: scale(0.7);
	}
	
	.tishi-box {
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 260upx;
		@include background_color(page-box-background-color);
		border-radius: 20upx 20upx 0upx 0upx;
		text-align: center;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tishi-box view {
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: $uni-color-primary;
		line-height: 50upx;
	}

	.tishi-box image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
</style>
