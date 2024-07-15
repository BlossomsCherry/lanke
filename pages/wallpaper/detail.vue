<template>
	<view :class="'mini-page-wrap global-theme-black global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" data-theme="black">
		<view class="mini-page-body">
			<navBar :back="true" :home="fph" :title="page_title" color="#ffffff" background="transparent">
				<!-- #ifdef APP -->
				<view @tap.stop.prevent="toShareTag" slot="right" class="lxy-nav-bar__logo default">
					<image class="_image" :src="iconRight" />
				</view>
				<!-- #endif -->
			</navBar>
			
			
			<view class="index">
				<swiper @change="swpierChange" class="_swpier" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
					<swiper-item v-for="(img,index) in imgList" :key="index" @click="preImg(index)" class="_swiper_item">
						<image class="_image" :src="img" mode="widthFix"></image>
					</swiper-item>
				</swiper>
				<view class="detail-btn-view">
					<!-- #ifndef H5 -->
					<view class="btn download" @click="download">
						<i class="mini-icon mini-xiazai2"></i>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view v-if="showBtn" class="btn setting" @click="setting">设为壁纸</view>
					<!-- #endif -->
					<view class="btn collect" @click="collect">
						<view v-if="!icCollect" class="mini-icon mini-shoucang-kongxin1"></view>
						<view v-else class="mini-icon mini-shoucang-shixin1" style="color: yellow;"></view>
					</view>
					<view class="btn collect" @click="open">
						<view class="mini-icon mini-sixin"></view>
					</view>
				</view>
				<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
			</view>
		</view>
		<u-popup :show="commentShow" @close="close" @open="open" mode="bottom">
			<details-comment @showCommendPopup="showCommendPopup">
				<view class="commets-cont">
					<view class="inner">
						<view class="title">{{commentTotal}}条留言</view>
						<view class="goods-comment">
							<!-- <goods-comment :commentList="commentList" /> -->
							<block v-if="commentList.length">
								<goods-comment v-for="(item, index) in commentList" :key="index" :data="item" @reply="toReply"
									:index="index" ref="comment"></goods-comment>
								<u-loadmore v-if="commentLoadmoreShow" :status="commentIsLastPage ? 'nomore' : 'loading'"
									nomoreText="── THE END ──" :bgClass="''" iconSize="28" fontSize="28" color="#989898" />
								<view class="goods-comment_bottom" @tap.stop="loadMoreComment"
									v-if="!commentLoadmoreShow && !commentIsLastPage">
									查看更多<u-icon name="arrow-right" color="#555555" size="26rpx"></u-icon>
								</view>
							</block>
							<u-empty text="暂无留言" width="300" height="300" text-size="28" v-else />
						</view>
					</view>

				</view>
			</details-comment>

		</u-popup>
		<!-- <u-overlay :show="showOverlay" @click.stop="overlayClick" :z-index="20000"></u-overlay> -->
		<u-popup :show="showOverlay" @close="showOverlay=false" @open="open" mode="bottom" zIndex="20001" :overlayStyle="{'z-index':20000}">
			<view class="detail-popup" :style="detailPopupStyle" v-if="showOverlay">
				<view class="inner">
					<view class="detail-popup-header">
						<text class="cancel" @tap="showOverlay = false">取消</text>
						<text class="title">留言</text>
						<text class="confirm" @tap="addCommentOrReply">确定</text>
					</view>
					<!-- <u-line style="transform: scaleY(0.5);"></u-line> -->
					<textarea v-model="message" :adjust-position="false" :focus="focus" 
						class="detail-popup-textarea" ref="detail-popup-textarea" :placeholder="replyc" @blur="blur"
						@focus="focusChange" max-length="240" confirm-type="done" @confirm="addCommentOrReply"></textarea>
					<view class="detail-popup-footer">
						<view class="detail-popup-footer-icon" @tap="iconClick('smile')">
							<i class="mini-icon mini-xiaolian" :style="iconType === 'smile'? 'color: #F7E253;':'color: #323233;'"></i>
						</view>
						<text class="detail-popup-footer-text">{{240-message.length}}</text>
					</view>
					<view class="detail-popup-panel" :style="detailPopupPanelStyle" v-if="panelHeight && iconType === 'smile'">
						<emoji @chooseEmoji="chooseEmoji" :height="keyboardHeight-20">
						</emoji>
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	import goodsComment from '@/pages/wallpaper/components/cu-comment/comment.vue'
	import emoji from '@/pages/wallpaper/components/cu-emoji/cu-emoji.vue'
	import detailsComment from "@/pages/wallpaper/components/details-comment.vue";
	import {
		commentItem
	} from '@/pages/wallpaper/components/comment.js'

	//预览图片
	export default {
		components: {
			myToast,
			navBar,
			hoverBall,
			goodsComment,
			emoji,
			detailsComment
		},
		mixins: [commentItem],
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 58,
				id: 0,
				page_title: '',
				imgShow: false,
				index: 0,
				showBtn: false,
				imgLength: 0,
				imgList: [],
				detailDec: "",
				icCollect: 0,
				title: '',
				commentShow: false,
				commentTotal: 0
			}
		},
		onReady(){
			let that = this;
			that.page_title = "1/" + that.imgLength;
		},
		computed: {
			contentHieght: {
				get() {
					return ' calc( 100vh - ' + this.$store.state.CustomBar + 'px )';
				},
				set(v) {}
			},
		},
		onShow: function() {
			let that = this;
			that.updateScene(58, 0, false, false, 0, 2);
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);

			// #ifdef APP-PLUS
			if (that.$store.state.platform === 'android') {
				that.showBtn = true;
			}
			// #endif
			
			// 分享
			var wx_scene = decodeURIComponent(options.scene);
			if (wx_scene && wx_scene != 'undefined') {
				let query = {};
				if (wx_scene.indexOf('&') !== -1) {
					let scene_arr = wx_scene.split('&');
					scene_arr.map((item) => {
						let queryData = item.split('=')
						query[queryData[0]] = queryData[1]
					})
				} else {
					let queryData = scene.split('=')
					query[queryData[0]] = queryData[1]
				}
				if (query.from_user && query.from_user.length > 0) {
					uni.setStorageSync('form_user', query.from_user);
					uni.$store.commit('updateFormUser', query.from_user);
				}
				that.fph = true;
				that.getWallpaperDetail();
			} else if (options.id) {
				that.id = options.id;
				that.getWallpaperDetail();
			} else {
				that.detailDec = options.data;
				let data = JSON.parse(decodeURIComponent(options.data));
				that.imgList = data.imgs;
				that.imgLength = data.imgNum;
				that.icCollect = data.iscollect;
				that.id = data.id;
				that.title = data.title;
				that.commentTotal = data.comment_count;
			}
			this.getCommentList()
		},
		onShareAppMessage() {
			let that = this;
			return {
				title: that.title,
				path: '/pages/wallpaper/detail?id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id +
					'&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.imgList[that.index] || that.$store.state.config.img.default_share
			}
		},
		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.title,
				query: 'id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: uni.wen.util.removeStyles(that.imgList[that.index] || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
			};
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			toShareTag(){
				let that = this;
				uni.wen.util.inviteUser('/pages/wallpaper/detail',  that.title, 'id=' + that.id, that.imgList[that.index] );
			},
			open() {
				// console.log('open');
				this.commentShow = true;
			},
			close() {
				this.commentShow = false
				// console.log('close');
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
						that.page_title = "1/" + that.imgLength;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'error'
						});
					}
				});
			},
			download() {
				uni.downloadFile({
					url: this.imgList[this.index],
					success: (e) => {
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: () => {
								uni.showToast({
									icon: 'none',
									title: '已保存到手机相册'
								})
							},
							fail: () => {
								uni.showToast({
									icon: 'none',
									title: '保存到手机相册失败'
								})
							}
						});
					},
					fail: (e) => {
						uni.showModal({
							content: '下载失败，' + e.errMsg,
							showCancel: false
						})
					}
				})
			},
			collect() {
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/wallpaper_process', {
					id: that.id,
					type: 'collect'
				}).then(function(res) {
					if (res.status) {
						that.setData({
							icCollect: res.data.isCollect
						});
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'error'
						});
					}

				});

			},
			//#ifdef APP-PLUS
			setting() {
				uni.showToast({
					icon: 'none',
					title: '正在设为壁纸'
				})
				setTimeout(() => {
					var WallpaperManager = plus.android.importClass('android.app.WallpaperManager');
					var Main = plus.android.runtimeMainActivity();
					var wallpaperManager = WallpaperManager.getInstance(Main);
					plus.android.importClass(wallpaperManager);
					var BitmapFactory = plus.android.importClass('android.graphics.BitmapFactory');
					uni.downloadFile({
						url: this.imgList[this.index],
						success: (e) => {
							var filePath = plus.io.convertLocalFileSystemURL(e.tempFilePath);
							var bitmap = BitmapFactory.decodeFile(filePath);
							try {
								wallpaperManager.setBitmap(bitmap);
								uni.showToast({
									icon: 'none',
									title: '壁纸设置成功'
								})
							} catch (e) {
								uni.showToast({
									icon: 'none',
									title: '壁纸设置失败'
								})
							}
						},
						fail: () => {
							uni.showToast({
								icon: 'none',
								title: '壁纸设置失败'
							})
						}
					})
				}, 100)
			},
			//#endif
			swpierChange(e) {
				this.index = e.detail.current;
				this.page_title = e.detail.current + 1 + '/' + this.imgLength;
			},
			preImg(index) {
				if (this.imgShow) { //防止点击过快导致重复调用 
					return;
				}
				this.imgShow = true;
				setTimeout(() => {
					this.imgShow = false;
				}, 1000)
				setTimeout(() => {
					uni.previewImage({
						current: this.imgList[index],
						urls: this.imgList
					})
				}, 150)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-popup {
		z-index: 99999;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		display: flex;
		flex-direction: column;
		position: fixed;
		width: 750rpx;
		bottom: 0;
		transform: translateY(100%);
		align-items: stretch;
		transition-property: transform;
		transition-duration: 250ms;
		transition-timing-function: ease;
		@include background_color(page-box-background-color);
		@include color(color-light-dark);

		.inner {
			width: $page-content-body-width;
			margin: auto;

			.detail-popup-header {
				height: 90rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				.cancel {
					padding: 16rpx 0;
					font-size: $uni-font-size-base;
					@include color(color-lightest-est-er-dark);
					font-weight: 600;
				}

				.title {
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: center;
					padding: 16rpx 9;
					font-weight: 600;
					@include color(color-light-dark);
					font-size: $uni-font-size-base;
					text-align: center;
				}

				.confirm {
					padding: 16rpx 9;
					font-size: $uni-font-size-base;
					color: #FB6E67;
					font-weight: 600;
				}
			}

			.detail-popup-textarea {
				height: 500rpx;
				width: $page-content-body-width;
				font-size: $uni-font-size-base;
				@include background_color(page-gray-background-color);
				border-radius: 20rpx;
				padding: 20rpx;
				box-sizing: border-box;
				@include color(color-light-dark);
			}

			.detail-popup-footer {
				height: 80rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				.detail-popup-footer-icon {
					padding: 0 0;

					.mini-icon {
						display: inline-flex;
						font-size: 50rpx;
					}
				}

				.detail-popup-footer-text {
					flex: 1;
					text-align: right;
					font-size: $uni-font-size-sm;
					@include color(color-lightest-est-er-dark);
					padding-right: 24rpx;
				}
			}
		}
	}

	.commets-cont {
		position: relative;
		z-index: 99;
		overflow: hidden;
		@include background_color(page-box-background-color);
		width: 750rpx;
		padding-top: 30rpx;
		max-height: 60vh;
		overflow-y: scroll;
		border-radius: $uni-border-radius-base $uni-border-radius-base 0 0;
		.inner {
			width: $page-content-body-width;
			margin: auto;
			.title{
				@include color(color-dark);
			}
			.goods-comment {
				padding-top: 24rpx;
			}

			.goods-comment_bottom {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: $uni-font-size-base;
				@include color(color-lighterr-dark);
				padding: 24rpx 0;
			}
		}
	}
</style>
<style lang="scss">
	.index {
		flex: 1;
		width: 750upx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.detail-btn-view {
		width: 750upx;
		position: fixed;
		bottom: 75upx;
		font-size: 28upx;
		display: flex;
		justify-content: space-between;
	}

	.detail-btn-view .btn {
		height: 80upx;
		border-radius: 80upx;
		width: 80upx;
		justify-content: center;
		align-items: center;
		line-height: 80upx;
		margin: 0 30upx;
		font-family: texticons;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.3);
		color: #fff;
	}

	.detail-btn-view image {
		width: 60upx;
		height: 60upx;
	}

	.detail-btn-view .setting {
		width: 300upx;
		text-align: center;
	}

	.detail-btn-view view text {
		margin-left: 10upx;
	}

	._swpier {
		flex: 1;
		width: 750upx;
		display: flex;
		flex-direction: column;
	}

	._swiper_item {
		display: flex;
		align-items: center;
	}

	._image {
		width: 750upx;
		height: 1125upx;
	}

	.detail-btn-view .btn .mini-icon {
		font-size: 56upx;
	}
</style>