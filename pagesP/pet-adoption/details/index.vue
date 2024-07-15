<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

	import DetailsPetInfo from "@/pagesP/pet-adoption/details/components/details-pet-info.vue";
	import DetailsUserInfo from "@/pagesP/pet-adoption/details/components/details-user-info.vue";
	import PetAdoptionListItem from "@/pagesP/pet-adoption/components/pet-adoption-list-item.vue";
	import DetailsRecommendList from "@/pagesP/pet-adoption/details/components/details-recommend-list.vue";
	import DetailsComment from "@/pagesP/pet-adoption/details/components/details-comment.vue";
	import goodsComment from '@/pagesP/pet-adoption/details/components/cu-comment/comment.vue'
	import emoji from '@/pagesP/pet-adoption/details/components/cu-emoji/cu-emoji.vue'
	import {
		commentItem
	} from '@/pagesP/pet-adoption/details/components/comment.js'
	export default {
		components: {
			goodsComment,
			emoji,
			DetailsComment,
			DetailsRecommendList,
			PetAdoptionListItem,
			myToast,
			navBar,
			hoverBall,
			DetailsUserInfo,
			DetailsPetInfo,
		},
		mixins: [commentItem],
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 50002,
				detailsInfo: {
					name: '',
					adopt_status: 0,
					collect_count: 0,
					condition: [],
					province: '',
					city: '',
					district: '',
					video_url: '',
					video_cover: '',
					pictures: []
				}, // 详情
				recommendList: [], // 同城推荐List

				swiperIdx: 0,
				videoPause: true,
			};
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

			var scene = decodeURIComponent(options.scene);
			if (scene && scene != 'undefined') {
				let query = {};
				if (scene.indexOf('&') !== -1) {
					let scene_arr = scene.split('&');
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
				that.id = query.id;
			} else {
				that.id = options.id;
			}
			that.getCommentList();
			
		},
		onShow: function() {
			let that = this;
			that.updateScene(50002, that.id);

		},
		onShareAppMessage: function(res) {
			let that = this;
			return {
				title: that.detailsInfo.name + '- 宠物领养',
				path: '/pagesP/pet-adoption/details/index?fph=1&id=' + that.detailsInfo.id + '&from_user=' + that.$store.state.userInfo.id,
				imageUrl: that.detailsInfo.image
			};
		},

		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.detailsInfo.name + '- 宠物领养',
				query: 'id=' + that.detailsInfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: uni.wen.util.removeStyles(that.detailsInfo.image) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
			};
		},
		methods: {
			queryList(pageNo, pageSize) {
				// 刷新
				let that = this;
				that.fetchDetails(pageNo, pageSize)
			},
			// 获取详情
			fetchDetails(pageNo, pageSize) {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'pets/adoption/detail', {
						id: that.id
					}
				).then(function(res) {
					// uni.loading(false);
					if (res.code == 200) {
						that.detailsInfo = res.data;
						setTimeout(function() {
							that.fetchRecommendList({
								pageNo: pageNo,
								pageSize: pageSize,
								city: that.detailsInfo.city,
								notId: that.detailsInfo.id
							})
						}, 100);
						
						// #ifdef H5
						if(uni.$store.state.h5_browser == 'wxclient'){
							setTimeout(function(){
								let share_title = that.detailsInfo.name + '- 宠物领养';
								let share_img = that.detailsInfo.image;
								uni.wen.util.setH5WeixinShare(share_img, share_title, that.detailsInfo.user.user_name || '宠物领养');
							}, 500);
						}
						// #endif
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				});
			},
			// 获取推荐列表
			fetchRecommendList(query) {
				let that = this;
				if (query && query.city) {

				} else {
					that.$refs.pagingRef.complete(false);
				}
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'pets/adoption/list', {
						page: query.pageNo,
						limit: query.pageSize,
						city: query.city,
						excludes: query.notId
					}
				).then(function(res) {
					if (res.code == 200) {
						that.$refs.pagingRef.complete(res.data.data);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						that.$refs.pagingRef.complete(false);
					}
				});
			},
			toPage() {
				// 判断用户信息是否已完善, 已完善跳查看页、未完善跳修改页
				let that = this;
				if (that.detailsInfo.adopt_status == 1) {
					if (that.detailsInfo.success_user_id == that.myUserInfo.id) {

					} else {
						return false;
					}
				}
				that.toSliderUrl(6, `/pagesP/pet-adoption/adoptive-user-info-gather/index?application=` + encodeURIComponent(JSON
					.stringify(that.detailsInfo.myApplication)));
			},
			collect() {
				let that = this;
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'pets/adoption/collect', {
						id: that.detailsInfo.id,
					},
					'POST'
				).then(function(res) {
					if (res.code == 200) {
						let detailsInfo = that.detailsInfo;
						detailsInfo.is_collect = !detailsInfo.is_collect;
						if (that.detailsInfo.is_collect) {
							detailsInfo.collect_count += 1;
						} else {
							detailsInfo.collect_count -= 1;
						}
						that.detailsInfo = detailsInfo;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				});
			},
			swiperClick(index){
				let that = this;
				let imagesArr = [];
				for (let i in that.detailsInfo.pictures) {
				    imagesArr.push(that.detailsInfo.pictures[i].url);
				}
				
				uni.previewImage({
				    current: that.detailsInfo.pictures[index].url,
				    urls: imagesArr
				});
				return false;
			},
			toVideo() {
				uni.wen.toUrl(6, '/pages/common/video?url=' + this.detailsInfo.video_url, this);
				return;
				
				if (!this.uVideo) this.uVideo = uni.createVideoContext('uVideo', this);
				if (this.uVideo.isplay) {
					this.uVideo.pause();
					this.uVideo.isplay = false;
					this.videoPause = true;
					return;
				}
				this.uVideo.isplay = true;
				this.videoPause = false;
				// this.goods.video.loaded = true;
				this.uVideo.play();
			},
			swiperChange(res) {
				if (res.detail && res.detail.current !== 0 && this.uVideo) {
					this.uVideo.pause();
					this.uVideo.isplay = false;
					this.videoPause = true;
				}
				this.swiperIdx = res.detail.current;
			},
			inviteUserTap() {
			  let that = this;
			  uni.wen.util.inviteUser('/pages/tabbar/index/index', that.detailsInfo.name + '- 宠物领养', 'id=' + that.detailsInfo.id, that.detailsInfo.image);
			},
		}
	}
</script>

<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<z-paging ref="pagingRef" v-model="recommendList" @query="queryList">
				<navBar :back="true" :home="fph" title="领养详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
				
				</navBar>
				<view class="pet-adoption-details-page">
					<block v-if="detailsInfo">
						<!-- 轮播图 -->
						<!-- <u-swiper @click="swiperClick" height="800" :list="detailsInfo.pictures" keyName="url" radius="0" :autoplay="false" circular bgColor="transparent" dicator indicatorMode="dot" /> -->
						<view class="swiper-content">
							<!-- 轮播区 -->
							<view class="swiper-area w-full">
								<swiper class="h-full" :indicator-dots="false" circular="true" duration="400" :current="swiperIdx" :autoplay="true" @change="swiperChange">
									<swiper-item v-if=" detailsInfo.video_url && detailsInfo.video_url.length > 0 " class="dflex-c">
										<!-- #ifdef APP -->
										<view class="wh-full pos-r" @click="toVideo">
											<image :src="detailsInfo.video_cover" class="wh-full" lazy-load mode="aspectFill"></image>
											<i class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
										</view>
										<!-- #endif -->
						
										<!-- #ifndef APP -->
										<view class="wh-full pos-r dflex-c" style="background: #000;" @click="toVideo">
											<video id="uVideo" :src="detailsInfo.video_url" :poster="detailsInfo.video_cover"
												:poster-for-crawler="detailsInfo.video_cover" :show-fullscreen-btn="false" :controls="false"
												:show-play-btn="false" :show-center-play-btn="false" :enable-progress-gesture="false"
												@ended="videoPause = true" object-fit="cover" class="h-full"
												style="width: 100%;"></video>
						
											<i v-if="videoPause" class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
										</view>
										<!-- #endif -->
									</swiper-item>
									<swiper-item v-for="(item, idx) in detailsInfo.pictures" :key="idx" v-if="detailsInfo.pictures && detailsInfo.pictures.length > 0">
										<view class="wh-full">
											<image :src="item.url" class="wh-full" lazy-load mode="aspectFill" @tap.stop.prevent="swiperClick(idx)"></image>
										</view>
									</swiper-item>
								</swiper>
								<view class="img_tips_count">{{ swiperIdx + 1 }} / {{ detailsInfo.pictures.length + ( (detailsInfo.video_url && detailsInfo.video_url.length > 0) ? 1 : 0 ) }}</view>
							</view>
						</view>


						<view class="info-wrapper">
							<!-- 宠物基本信息 -->
							<details-pet-info :info="detailsInfo" />

							<!-- 提示警告 -->
							<view class="tips">
								<text>*提醒：如对方向您索要运费、治疗费等，切勿付款！请务必联系客服</text>
								<!-- <text class="mark" @tap.stop.prevent="toSliderUrl(6, 'feedback/feedback')">反馈给我们</text> -->
								<text>核实，以免被骗！</text>
							</view>

							<!-- 分割符 -->
							<view style="height: 40rpx;"></view>

							<!-- 用户信息 -->
							<details-user-info :info="detailsInfo" />

							<!-- 关注公众号 -->
							<view class="follow-official-wrapper" v-if="detailsInfo.user_info_img"
								@tap.stop.prevent="toSliderUrl(detailsInfo.user_info_img.type, detailsInfo.user_info_img.target_id)">
								<image class="image" :src="detailsInfo.user_info_img.img" />
							</view>

							<!-- 分割符 -->
							<view style="height: 40rpx;"></view>

							<!-- 评论 -->
							<details-comment @showCommendPopup="showCommendPopup">
								<view class="commets-cont">
									<view class="inner">
										<view class="title">{{detailsInfo.comment_count}}条留言</view>
										<view class="goods-comment">
											<!-- <goods-comment :commentList="commentList" /> -->
											<block v-if="commentList.length">
												<goods-comment v-for="(item, index) in commentList" :key="index" :data="item" @reply="toReply"
													:index="index" ref="comment"></goods-comment>
												<u-loadmore v-if="commentLoadmoreShow" :status="commentIsLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
													iconSize="28" fontSize="28" color="#989898" />
												<view class="goods-comment_bottom" @tap.stop="loadMoreComment" v-if="!commentLoadmoreShow && !commentIsLastPage">
													查看更多<u-icon name="arrow-right" color="#555555" size="26rpx"></u-icon>
												</view>
											</block>
											<u-empty text="暂无留言" width="300" height="300" text-size="28" v-else />
										</view>
									</view>
								</view>
							</details-comment>

							<!-- 分割符 -->
							<view style="height: 40rpx;"></view>

							<!-- 同城推荐 -->
							<details-recommend-list :list="recommendList" />
						</view>

						<!-- 底部工具栏 -->
						<view class="bottom-tools-wrapper">
							<view class="item-wrapper" @tap.stop.prevent="collect">
								<block v-if="detailsInfo.is_collect">
									<u-icon name="star-fill" size="45" color="#f2bf66"/>
									<view class="_text">已收藏</view>
								</block>
								<block v-else>
									<u-icon name="star" size="45" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"/>
									<view class="_text">收藏</view>
								</block>
							</view>
							
							<!-- #ifdef MP -->
							<button class="u-reset-button item-wrapper" open-type="share">
								<u-icon name="share" size="45" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" />
								<view class="_text">分享</view>
							</button>
							<!-- #endif -->
							<!-- #ifndef MP -->
							<button class="u-reset-button item-wrapper" @click.stop.prevent="inviteUserTap">
								<u-icon name="share" size="45" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" />
								<view class="_text">分享</view>
							</button>
							<!-- #endif -->

							<view class="button-wrapper">
								<block v-if="detailsInfo.adopt_status == 1">
									<u-button shape="circle" :color="detailsInfo.success_user_id == myUserInfo.id ? '#5ac725' : '#999999'"
										:text=" detailsInfo.success_user_id == myUserInfo.id ? '领养成功' : '已被领养'"
										:custom-style="{ height: '80rpx' }" @click="toPage" />
								</block>
								<block v-else-if="detailsInfo.user_id == myUserInfo.id || isOfficial">
									<u-button shape="circle" :color="primaryColor" text="编辑" :custom-style="{ height: '80rpx' }"
										@click="toSliderUrl(6, '/pagesP/pet-adoption/push-adoption/index?id='+detailsInfo.id )" />
								</block>
								<block v-else>
									<u-button shape="circle"
										:color=" detailsInfo.myApplication && detailsInfo.myApplication.id > 0 ? '#999999' : primaryColor"
										:text=" detailsInfo.myApplication && detailsInfo.myApplication.id > 0 ? '我的申请信息' : '我要领养'"
										:custom-style="{ height: '80rpx' }" @click="toPage" />
								</block>
							</view>
						</view>

					</block>
					<block v-else>
						<view class="loading">
							<view class="spinner">
								<view class="rect rect1"></view>
								<view class="rect rect2"></view>
								<view class="rect rect3"></view>
								<view class="rect rect4"></view>
								<view class="rect rect5"></view>
							</view>
						</view>
					</block>
				</view>
				<view slot="empty">
					<u-empty text="空～" width="300" height="300" textSize="28" />
				</view>

			</z-paging>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
		<u-overlay :show="showOverlay" @click="overlayClick" :z-index="999"></u-overlay>
		<view class="detail-popup" :style="detailPopupStyle" v-if="showOverlay">
			<view class="inner">
				<view class="detail-popup-header">
					<text class="cancel" @tap="showOverlay = false">取消</text>
					<text class="title">留言</text>
					<text class="confirm" @tap="addCommentOrReply">确定</text>
				</view>
				<!-- <u-line style="transform: scaleY(0.5);"></u-line> -->
				<textarea v-model="message" :adjust-position="false" :focus="focus" class="detail-popup-textarea" ref="detail-popup-textarea" :placeholder="replyc" @blur="blur"
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
	</view>
</template>


<style lang="scss" scoped>
	.swiper-content{
		position: relative;
		.img_tips_count{
		  top: 15rpx;
		  position: absolute;
		  bottom: 50rpx;
		  right: 20rpx;
		  font-size: 20rpx;
		  color: #fff;
		  background: rgba(0, 0, 0, .3);
		  width: 80rpx;
		  height: 45rpx;
		  border-radius: 45rpx;
		  display: flex;
		  align-items: center;
		  justify-content: center
		}
		/* 轮播区 */
		.swiper-area {
			height: 58vh;
			z-index: 0;
		}
		
		.dflex-c {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.bofang {
			width: 50px;
			height: 50px;
			color: rgba(255,255,255, 0.6);
			font-size: 80rpx;
		}
		
		.pos-r {
			position: relative;
		}
		
		.pos-a {
			position: absolute;
		}
		
		.pos-tl-c {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		
		/* 宽高 */
		/* #ifdef APP-NVUE */
		.w-full {
			flex: 1;
		}
		
		/* #endif */
		
		/* #ifndef APP-NVUE */
		.wh-full {
			width: 100%;
			height: 100%;
		}
		
		.w-full {
			width: 100%;
		}
		
		/* #endif */
		
		.h-full {
			height: 100%;
		}
	}
	.detail-popup {
		z-index: 9999999;
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
		color: #333 !important;

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
					color: #a9a9a9;
					font-weight: 600;
				}

				.title {
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: center;
					padding: 16rpx 9;
					font-weight: 600;
					color: #323233;
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
				color: #333 !important;
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
					color: #a9a9a9;
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

		.inner {
			width: $page-content-body-width;
			margin: auto;
			
			.title{
				@include color(color-darkest);
			}

			.goods-comment {
				padding-top: 24rpx;
			}

			.goods-comment_bottom {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: $uni-font-size-base;
				@include color(color-lighter-er-dark);
				padding: 24rpx 0;
			}
		}
	}

	.pet-adoption-details-page {
		position: relative;
		padding-bottom: calc(env(safe-area-inset-bottom) + 170rpx);

		// 轮播图指示器位置上移
		/deep/ .u-swiper__indicator {
			bottom: 36px;
		}

		.info-wrapper {
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			transform: translateY(-20px);
			@include background_color(page-box-background-color);


			.tips {
				margin: 0 $page-row-spacing;
				font-size: $uni-font-size-sm;
				color: $uni-color-primary;

				.mark {
					color: $uni-text-color;
					text-decoration: underline;
				}
			}

			.follow-official-wrapper {
				margin: $uni-spacing-col-lg $page-row-spacing;
				box-sizing: border-box;
				height: 220rpx;
				border-radius: $uni-border-radius-lg-er;

				.image {
					width: 100%;
					height: 100%;
					border-radius: $uni-border-radius-lg-er;
				}
			}
		}
	}

	.bottom-tools-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999999;
		padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 24rpx) 24rpx;
		display: flex;
		align-items: center;
		gap: $uni-spacing-row-lg;
		@include background-color(page-box-background-color);
		box-shadow: 0rpx -8rpx 52rpx 0rpx rgba(0, 0, 0, 0.11);
		
		.item-wrapper {
			display: flex;
			align-items: center;
			gap: $uni-spacing-row-sm;
			font-size: $uni-font-size-medium;
			._text{
				@include color(color-darkest);
			}
		}

		.button-wrapper {
			margin-left: auto;
			flex: 1;
		}
	}
</style>