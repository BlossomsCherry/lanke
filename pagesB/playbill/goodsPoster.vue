<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body poster_page">
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
		<swiper class="poster_swiper" previous-margin="110rpx" circular :current="swiperIndex" next-margin="110rpx" @change="onSwiperChange">
			<swiper-item v-for="(item, index) of dataInfo.headImgs" :key="index">
				<view class="goods_info_box" :class="{ active: swiperIndex == index }">
					<image class="goods_image" :src="item" mode="aspectFit"></image>
					<view class="goods_info">
						<view class="goods_name">{{dataInfo.goodsName}}</view>
						<view class="price_box">
							<view class="price">{{dataInfo.goodsPrice}}</view>
							<view class="store_price">{{dataInfo.priceShop}}</view>
						</view>
						<view class="poster_info">
							<view class="info">
								<view>长按识别二维码访问</view>
								<text>{{platformName}}</text>
							</view>
							<image class="poster_code_image" :src="dataInfo.recommendCodeGoods" mode="aspectFit"></image>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="share_save_box">
			<!-- #ifdef MP -->
			<button open-type="share">
				<image src="@/pagesB/static/playbill/goodsPoster/wecaht.png" mode="aspectFit"></image>
				<text>发给好友</text>
			</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button @click="onAppShare">
				<image src="@/pagesB/static/playbill/goodsPoster/wecaht.png" mode="aspectFit"></image>
				<text>发给好友</text>
			</button>
			<!-- #endif -->
			<button class="onSave" @click="onSaveImg">
				<image src="@/pagesB/static/playbill/goodsPoster/picture.png" mode="aspectFit"></image>
				<text>保存图片</text>
			</button>
		</view>
		<!-- #ifdef H5 -->
		<view class="h5_press_save" v-if="h5SaveImg" @click="h5SaveImg = ''">
			<image :src="h5SaveImg" mode="widthFix"></image>
			<button class="download">长按图片保存图片</button>
		</view>
		<!-- #endif -->
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


 //预览图片
// 文字换行
function drawtext(text, maxWidth) {
	let textArr = text.split("");
	let len = textArr.length;
	// 上个节点
	let previousNode = 0;
	// 记录节点宽度
	let nodeWidth = 0;
	// 文本换行数组
	let rowText = [];
	// 如果是字母，侧保存长度
	let letterWidth = 0;
	// 汉字宽度
	let chineseWidth = 21;
	// otherFont宽度
	let otherWidth = 10.5;
	for (let i = 0; i < len; i++) {
		if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
			if(letterWidth > 0){
				if(nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
					letterWidth = 0;
				} else {
					nodeWidth += chineseWidth + letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else {
				if(nodeWidth + chineseWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
				}else{
					nodeWidth += chineseWidth;
				}
			}
		} else {
			if(/\n/g.test(textArr[i])){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 1;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(textArr[i] == "\\" && textArr[i + 1] == "n"){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 2;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(/[a-zA-Z0-9]/g.test(textArr[i])){
				letterWidth += 1;
				if(nodeWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i + 1 - letterWidth)
					});
					previousNode = i + 1 - letterWidth;
					nodeWidth = letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else{
				if(nodeWidth + otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = otherWidth;
				}else{
					nodeWidth += otherWidth;
				}
			}
		}
	}
	if (previousNode < len) {
		rowText.push({
			type: "text",
			content: text.substring(previousNode, len)
		});
	}
	return rowText;
}
let settingWritePhotosAlbum = false;
export default {
	components: {
		myToast,navBar,hoverBall,
	},
	data() {
		return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 62,
			swiperIndex: 0,
			posterImgs: [],
			dataInfo: {

			},
			platformName: "",
			h5SaveImg: "",
			goodid: 0
		};
	},
	//第一次加载
	onLoad(options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(that.$store.state.config.app.wechat.mini.meta_appid){
			that.platformName = that.$store.state.config.about.name + '小程序';
		}else{
			that.platformName = that.$store.state.config.about.name + 'App';
		}
		
		if (options.id) {
			that.goodid = options.id;
		}
		
		// 获取海报数据
		that.getGoodsPoster();
	},
	onShow: function () {
		let that = this;
		that.updateScene(62, 0);
	},
	//方法
	methods: {
		getGoodsPoster(){
			let that = this;
			uni.loading(true);
			if(!that.goodid){
				uni.showToast({
					title: '初始化失败',
					icon:'error'
				});
				return false;
			}
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/shop/goods/poster', {
				id: that.goodid
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					that.setData({
						dataInfo: res.data
					});
				}else{
					uni.showToast({
						title: res.message,
						icon:'error'
					});
				}
				
			});
		},
		// 轮播图变化
		onSwiperChange(e) {
			this.swiperIndex = e.detail.current;
		},
		// 创建海报
		createPoster() {
			let that = this;
			return new Promise((resolve, reject) => {
				uni.loading(true);
				const ctx = uni.createCanvasContext('poster');
				ctx.fillRect(0, 0, 375, 673);
				ctx.setFillStyle("#FFF");
				ctx.fillRect(0, 0, 375, 673);
				uni.downloadFile({
					url: this.dataInfo.headImgs[this.swiperIndex],
					success: (res) => {
						if (res.statusCode === 200) {
							ctx.drawImage(res.tempFilePath, 0, 0, 375, 375);
							uni.downloadFile({
								url: this.dataInfo.recommendCodeGoods,
								success: (res2) => {
									if (res.statusCode === 200) {
										// 商品标题
										ctx.setFontSize(21);
										ctx.setFillStyle('#333');
										let drawtextList = drawtext(this.dataInfo.goodsName, 341);
										let textTop = 0;
										drawtextList.forEach((item,index) => {
											if(index < 2){
												textTop = 380 + (index + 1) * 28;
												ctx.fillText(item.content, 17, textTop);
											}
										});
										// 商品价格
										ctx.setFontSize(26);
										ctx.setFillStyle('#f00');
										ctx.fillText(this.dataInfo.goodsPrice, 17, textTop + 47);
										// 商品门市价
										ctx.setFontSize(18);
										ctx.setFillStyle('#999');
										let textLeft = 38 + (this.dataInfo.goodsPrice.length * 13)
										ctx.fillText(this.dataInfo.priceShop, textLeft, textTop + 45);
										// 商品门市价横线
										ctx.beginPath();
										ctx.setLineWidth(1);
										ctx.moveTo(textLeft - 1, textTop + 38);
										ctx.lineTo((textLeft + 5 + this.dataInfo.priceShop.length * 9), textTop + 38);
										ctx.setStrokeStyle('#999');
										ctx.stroke();
										// 商品分割线
										ctx.beginPath();
										ctx.setLineWidth(1);
										ctx.moveTo(17, textTop + 70);
										ctx.lineTo(358, textTop + 70);
										ctx.setStrokeStyle('#eee');
										ctx.stroke();
										// 长按识别二维码访问
										ctx.setFontSize(19);
										ctx.setFillStyle('#333');
										ctx.fillText("长按识别二维码访问", 17, textTop + 136);
										// 平台名称
										ctx.setFontSize(16);
										ctx.setFillStyle('#999');
										ctx.fillText(this.platformName, 17, textTop + 170);
										// 二维码
										ctx.drawImage(res2.tempFilePath, 238, textTop + 88, 120, 120);
										ctx.draw(true, () => {
											// canvas画布转成图片并返回图片地址
											uni.canvasToTempFilePath({
												canvasId: 'poster',
												width: 375,
												height: 673,
												success: (res) => {
													if(this.posterImgs[this.swiperIndex]){
														this.posterImgs[this.swiperIndex].temporary = res.tempFilePath;
													}else{
														this.posterImgs[this.swiperIndex] = {
															temporary: res.tempFilePath
														};
													}
													console.log("海报制作成功！");
													resolve(res.tempFilePath);
												},
												fail: () => {
													uni.loading(false);
													reject();
												}
											})
										});
									} else {
										uni.loading(false);
										uni.showToast({
											title: '海报制作失败，图片下载失败',
											icon: 'none'
										});
									}
								},
								fail: err => {
									uni.loading(false);
									uni.showToast({
										title: '海报制作失败，图片下载失败',
										icon: 'none'
									});
								}
							});
						} else {
							uni.loading(false);
							uni.showToast({
								title: '海报制作失败，图片下载失败',
								icon: 'none'
							});
						}
					},
					fail: err => {
						uni.loading(false);
						uni.showToast({
							title: '海报制作失败，图片下载失败',
							icon: 'none'
						});
					}
				});
			});
		},
		// 保存图片
		async onSaveImg() {
			let that = this;
			
			
			// #ifdef MP
			uni.wen.util.checkMpPermission('scope.writePhotosAlbum', '请先在设置页面打开“保存相册”使用权限', () => {
				that.createPoster().then((imgUrl)=>{
					uni.loading(true);
					uni.saveImageToPhotosAlbum({
						filePath: imgUrl,
						success: () => {
							uni.loading(false);
							uni.showToast({
								title: '保存成功'
							});
						}
					});
				});
			});
			// #endif
			
			// #ifdef APP
			uni.wen.util.checkAppPermission('photoLibrary-write', '[相册写入权限]用于保存图片', () => {
				that.createPoster().then((imgUrl)=>{
					uni.loading(true);
					uni.saveImageToPhotosAlbum({
						filePath: imgUrl,
						success: () => {
							uni.loading(false);
							uni.showToast({
								title: '保存成功'
							});
						}
					});
				});
			}, that);
			// #endif
			
			// #ifdef H5
			that.h5SaveImg = that.dataInfo.headImgs[that.swiperIndex];
			uni.loading(false);
			// #endif
			
		},
		
		async onAppShare() {
			let that = this;
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				title: that.dataInfo.share.shareTitle,
				href: that.dataInfo.share.shareUrl,
				summary: that.dataInfo.share.shareContent,
				imageUrl: that.dataInfo.headImgs[that.swiperIndex],
				miniProgram: {
				  'id': that.$store.state.config.app.wechat.mini.meta_appid,
				  'path': '/' + that.dataInfo.share.shareUrl.split('/#/')[1],
				  'type': 0,
				  'webUrl': that.dataInfo.share.shareUrl,
				},
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		let that = this;
		let dataInfo = that.dataInfo;
		let shareInfo = {
			path: "/pages/home/shop/goodsDetail?objId="+dataInfo.objId + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			title: dataInfo.share.shareTitle,
			imageUrl: that.dataInfo.headImgs[that.swiperIndex]
		};
		return shareInfo;
	},
	onShareTimeline: function (res) {
	  let that = this;
	  let dataInfo = that.dataInfo;
	  return {
	    title: dataInfo.share.shareTitle,
	    query: 'objId='+dataInfo.objId + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.dataInfo.headImgs[that.swiperIndex]
	  };
	},
};
</script>
<style lang="scss" scoped>
.poster_page {
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
}
.poster_canvas {
	width: 750rpx;
	height: 1334rpx;
	position: fixed;
	top: -10000rpx;
	left: 0rpx;
}
.poster_swiper {
	height: 950rpx;
	width: 100%;
	swiper-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.goods_info_box {
			width: 100%;
			height: 100%;
			transform: scale(0.88);
			transition: all 0.4s;
			position: relative;
			overflow: hidden;
			@include background_color(page-box-background-color);
			&.active {
				transform: scale(1);
			}
			.goods_image {
				width: 100%;
				height: calc(100vw - 220rpx);
			}
			.goods_info {
				padding: 24rpx;
				.goods_name {
					@include color(color-light-dark);
					font-size: $uni-font-size-medium;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					// @include bov(2);
				}
				.price_box {
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					.price {
						font-size: 38rpx;
						color: red;
					}
					.store_price {
						margin-left: 30rpx;
						font-size: $uni-font-size-sm-base;
						@include color(color-lighter-dark);
						text-decoration: line-through;
					}
				}
				.poster_info {
					border-top: 2rpx solid #f1f1f1;
					padding-top: 24rpx;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.info {
						display: flex;
						flex-direction: column;
						view {
							@include color(color-light-dark);
							font-size: $uni-font-size-base;
						}
						text {
							@include color(color-lighter-dark);
							font-size: $uni-font-size-sm;
							margin-top: 20rpx;
						}
					}
					.poster_code_image {
						width: 170rpx;
						height: 170rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}
}
.share_save_box {
	position: fixed;
	bottom: calc((100vh - 950rpx - 240rpx) / 4);
	left: 0;
	z-index: 6;
	width: 100%;
	display: flex;
	justify-content: space-around;
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
		image {
			width: 60rpx;
			height: 60rpx;
		}
		text {
			font-size: $uni-font-size-sm;
			@include color(color-light-dark);
		}
	}
}
.h5_press_save {
	background-color: #000;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	z-index: 100;
	image {
		width: 100%;
	}
	.download {
		font-size: $uni-font-size-sm;
		color: #ffffff;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		padding: 5rpx 30rpx;
		border-radius: 40rpx;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		&:before {
			content: '';
			background-image: url('@/pagesB/static/playbill/goodsPoster/icon_download.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 24rpx;
			height: 24rpx;
			margin-right: 15rpx;
		}
	}
}
</style>
