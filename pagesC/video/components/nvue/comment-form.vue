<template>
	<view :class="'comment-form scene_' + scene">
		<block v-if="show_fake">
			<view @tap.stop.prevent="tapFakeForm('', '', '')" class="fake_form">
				<view class="inner">
					<!-- #ifdef APP-NVUE -->
					<text class="mini-icon mini-xie">&#xe6fd;</text>
					<!-- #endif -->
					<!-- #ifndef APP-NVUE -->
					<text class="mini-icon mini-xie"></text>
					<!-- #endif -->
					<text class="place_holder u-line-1">{{ placeholder }}</text>
					<!-- <view class="flex-row">
					<text class="mini-icon mini-a- _i" v-if="scene != 9">&#xe6df;</text>
					<text class="mini-icon mini-xiaolian _i" v-if="scene != 9">&#xe6de;</text>
					<text class="mini-icon mini-tupian21 _i" v-if="scene != 9">&#xe6e2;</text>
				</view> -->
				</view>
				<slot name="action-slot"></slot>
			</view>
		</block>

		<u-popup :show="isShowCommentForm" @close="maskClick" :safe-area-inset-bottom="false" :zIndex="999999"
			mode="bottom">
			<view class="pupop-content" :style="'padding-bottom: ' + textareaBottom + 'px;'">
				<view :class="'true_form ' + (textareaBottom > 0 ? 'focused' : '') ">
					<view class="inner">
						<!-- #ifdef MP -->
						<textarea class="_textarea" :placeholder="placeholder"
							:style="'height:8vh;min-height:'+ minTextHeight + 'vh;width: 640rpx;'" :auto-height="true"
							:focus=" isFocus " v-model="comment_content" maxlength="1000" :cursor-spacing="60"
							:fixed="true" :show-confirm-bar="false" :adjust-position="false" :auto-blur="true"
							@focus="focusTextarea" @blur="blurTextarea" @input="commentInput"
							@keyboardheightchange="keyboardheightchange"></textarea>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<textarea class="_textarea" :placeholder="placeholder"
							:style="'height:8vh;min-height:'+ minTextHeight + 'vh;width: 640rpx;'" :auto-height="true"
							:focus=" isFocus " v-model="comment_content" maxlength="1000" :cursor-spacing="60"
							:fixed="true" :show-confirm-bar="global__platform__ == 'ios'" :adjust-position="false"
							:auto-blur="true" @focus="focusTextarea" @blur="blurTextarea" @input="commentInput"
							@keyboardheightchange="keyboardheightchange"></textarea>
						<!-- #endif -->
						<!-- <text class="scale-icon mini-icon mini-suoxiao" v-if="isScaleMax" @tap.stop.prevent="setMinTextHeight(8)">&#xe7af;</text>
            <text class="scale-icon mini-icon mini-fangda_enlarge" v-else @tap.stop.prevent="setMinTextHeight(23)">&#xe6da;</text> -->
					</view>
					<view v-if="comment_img" class="comment_img_wrap">
						<view style="flex-row" class="comment_img_wrap-inner">
							<view class="img_item">
								<image class="upload_img" :src="comment_img" mode="aspectFill"></image>
								<!-- #ifdef APP-PLUS -->
								<text class="delete_icon mini-icon mini-shanchu1"
									@tap.stop.prevent="deleteimageURL">&#xe653;</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS -->
								<text class="delete_icon mini-icon mini-shanchu1"
									@tap.stop.prevent="deleteimageURL"></text>
								<!-- #endif -->
							</view>
						</view>
					</view>
					<view class="tools flex-row">
						<view class="left flex-row">
							<!-- #ifdef APP-PLUS -->
							<text class="tupian-icon mini-icon mini-tupian21"@tap.stop.prevent="uploadCommentImg">&#xe6e2;</text>
							<!-- #endif -->
							<!-- #ifndef APP-PLUS -->
							<text class="tupian-icon mini-icon mini-tupian21"@tap.stop.prevent="uploadCommentImg"></text>
							<!-- #endif -->
							<!-- <text class="aite-icon mini-icon mini-a-" @tap.stop.prevent="openAiteUser(-1)" v-if="scene != 75 && config_pays && config_pays.paycode_0">&#xe6df;</text> -->
							<!-- <text class="toubi-icon mini-icon mini-toubi" @tap.stop.prevent="openGiveCoin()" v-if="scene != 75 && config_app_coins_give_coin_open && config_pays && config_pays.paycode_0">&#xe64f;</text> -->
							<!-- #ifdef APP-PLUS -->
							<text class="biaoqing-icon mini-icon mini-biaoqing1"
								@tap.stop.prevent="toemoji">&#xe6de;</text>
							<!-- #endif -->
							<!-- #ifndef APP-PLUS -->
							<text class="biaoqing-icon mini-icon mini-biaoqing1" @tap.stop.prevent="toemoji"></text>
							<!-- #endif -->
						</view>
						<view class="right flex-row">
							<!-- #ifndef APP-PLUS -->
							<view @tap.stop.prevent="sendComment" class="send_btm">
								<view :class="'btn ' + (check_status ? 'yes' : '')">
									发送
								</view>
							</view>
							<!-- #endif -->

							<!-- #ifdef APP-NVUE -->
							<view @tap.stop.prevent="sendComment" class="send_btm">
								<view :class="'btn ' + (check_status ? 'yes' : '')">
									<text class="send-btn-text">发送</text>
								</view>
							</view>
							<!-- #endif -->
						</view>
					</view>
					<!-- <swiper style="height: 200rpx;width:750rpx;">
						<swiper-item>
							<view class="_view" v-for="(em,index) in config2_emoji.page_1" :key="index"
								@tap.stop.prevent="addEmoji(em.alt)">
								<image class="_image" :style="{width:em.width + 'px',height:em.height + 'px'}" mode="widthFix" :src="em.emoji "></image>
							</view>
						</swiper-item>
						<swiper-item>
							<view class="_view" v-for="(em,index) in config2_emoji.page_1" :key="index"
								@tap.stop.prevent="addEmoji(em.alt)">
								<image class="_image" :style="{width:em.width + 'px',height:em.height + 'px'}" mode="widthFix" :src="em.emoji "></image>
							</view>
						</swiper-item>
					</swiper> -->
					<view class="emoji_wrap" v-if="isEmoji">
						<swiper class="emoji-swiper" indicator-dots>
							<!-- <block v-if="config2_emoji.page_1 && config2_emoji.page_1.length > 0"> -->
							<!-- <block> -->
								<swiper-item class="_swiper-item" v-if="config2_emoji.page_1 && config2_emoji.page_1.length > 0">
									<scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true"
										:show-scrollbar="false">
										<view class="emoji-srcoll-content">
											<view class="_view" v-for="(em,index) in config2_emoji.page_1" :key="index"
												@tap.stop.prevent="addEmoji(em.alt)">
												<image class="_image" mode="widthFix" :src="em.emoji "></image>
											</view>
										</view>
									</scroll-view>
								</swiper-item>
							<!-- </block> -->
							<!-- <block v-if="config2_emoji.page_2 && config2_emoji.page_2.length > 0"> -->
								<swiper-item class="_swiper-item" v-if="config2_emoji.page_2 && config2_emoji.page_2.length > 0">
									<scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true"
										:show-scrollbar="false">
										<view class="emoji-srcoll-content">
											<view class="_view" v-for="(em2,index2) in config2_emoji.page_2"
												:key="index2" @tap.stop.prevent="addEmoji(em2.alt)">
												<image class="_image" mode="widthFix" :src=" em2.emoji "></image>
											</view>
										</view>
									</scroll-view>
								</swiper-item>
							<!-- </block> -->
							<!-- <block v-if="config2_emoji.page_3 && config2_emoji.page_3.length > 0"> -->
								<swiper-item class="_swiper-item" v-if="config2_emoji.page_3 && config2_emoji.page_3.length > 0">
									<scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true"
										:show-scrollbar="false">
										<view class="emoji-srcoll-content">
											<view class="_view" v-for="(em3,index3) in config2_emoji.page_3"
												:key="index3" @tap.stop.prevent="addEmoji(em3.alt)">
												<image class="_image" mode="widthFix" :src=" em3.emoji "></image>
											</view>
										</view>
									</scroll-view>
								</swiper-item>
							<!-- </block> -->
						</swiper>
					</view>
				</view>
			</view>
		</u-popup>
		<view class="safe_area_height"></view>
	</view>
</template>
<script>
	// #ifdef APP-NVUE
	const domModule = weex.requireModule('dom');
	domModule.addRule('fontFace', {
		fontFamily: 'mini-icon',
		src: "url('../../../static/icon/A/iconfont.ttf')"
	});
	// #endif
	let debounce = null;
	export default {
		name: "comment-form",
		components: {

		},
		computed: {
			config_pays:{
				get(){
					let that = this;
					if(that.$store.state.config && that.$store.state.config.pays){
						return that.$store.state.config.pays || {};
					}
					return {};
				},
				set(v){}
			},
			config2_emoji: {
				get() {
					let that = this;
					return that.$store.state.config2.emoji;
				},
				set(v) {}
			},
			check_status: {
				get() {
					let that = this;
					if (this.comment_img) {
						return true
					}
					if (that.comment_content && that.comment_content.length > 0) {
						return true;
					} else {
						return false;
					}
				},
				set(v) {}
			},
			config_app_coins_give_coin_open: {
				get() {
					let that = this;
					if (that.$store.state.config.app.coins && that.$store.state.config.app.coins.give_coin_open) {
						return true;
					} else {
						return false;
					}
				},
				set(v) {}
			},
		},
		data() {
			return {
				cursor: 0,
				comment_content: '',
				comment_img: '',
				isShowImage: false,
				isEmoji: false,
				isScaleMax: false,
				minTextHeight: 8,
				textareaBottom: 0,
				isFocus: false,
				isShowCommentForm: false,
			};
		},
		props: {
			commentFormShow: {
				type: [Number, String],
				default: 0
			},
			scene: {
				type: Number,
				default: 0
			},
			placeholder: {
				type: String,
				default: '此时此刻想说~'
			},
			show_fake: {
				type: Boolean,
				default: true
			},
			postsId: {
				type: [Number, String],
				default: 0
			},
		},
		watch: {
			postsId: {
				handler: function(newVal, oldVal) {
					if (newVal != oldVal) {

						let that = this;
						that.comment_content = '';
						that.comment_img = '';
						that.isShowImage = false;
						that.isEmoji = false;
						that.isScaleMax = false;
						that.minTextHeight = 8;
					}
				},
				immediate: true
			},
			commentFormShow: {
				handler: function(newVal, oldVal) {
					let that = this;
					if (newVal > 0 || newVal > '0') {
						that.toComment();
						if (oldVal == 0 || oldVal == '0') {
							setTimeout(function() {
								that.isFocus = true;

							}, 200);
						}

					} else {
						if (oldVal != 0 && oldVal != '0') {
							that.isFocus = false;
							that.closeComment();
						}
					}
				},
			},
		},
		created() {
			let that = this;
			if (that.$store.state.config2.OK == false) {
				that.$store.dispatch('initConfig2');
			}
		},
		methods: {
			keyboardheightchange(e) {
				console.log(e.detail.height,'eeeedddssss')
				if (e.detail.height == 0) {
					this.textareaBottom = 0;
				}else {
					this.textareaBottom = e.detail.height;
				}
				// console.log(e,'eeeee')
			},
			toSliderUrl(type, id) {
				let that = this;
				uni.wen.toUrl(type, id, that);
			},
			openGiveCoin() {
				let that = this;
				if (debounce !== null) {
					clearTimeout(debounce);
				}
				if (!that.$store.state.config.pays.paycode_0) {
					return false;
				}
				debounce = setTimeout(() => {
					that.isFocus = false;
					let child = this.$unicom("#mytotast_" + that.$store.state.scene + '_' + that.$store.state
						.scene_id);
					if (child) {
						child.open({
							type: 'givecoin',
							content: '投币',
							timeout: 2000,
							isClick: true,
							mask: 3,

						});
						return false;
					}
				}, 200);
			},
			commentInput(e) {
				let that = this;
				that.cursor = e.detail.cursor;
				if (e.detail.value) {
					let char = e.detail.value.charAt(e.detail.cursor - 1);
					if (char != '@') {
						return false;
					}
					that.openAiteUser(e.detail.cursor);
				}
				return false;
			},
			openAiteUser(cursor) {
				let that = this;
				if (debounce !== null) {
					clearTimeout(debounce);
				}
				if (!that.$store.state.config.pays.paycode_0) {
					return false;
				}
				let isPrefix = false;
				if (cursor == -1) {
					cursor = that.comment_content.length;
					that.comment_content = that.comment_content;
					isPrefix = true;
				}
				debounce = setTimeout(() => {
					that.isFocus = false;
					let child = that.$unicom("#mytotast_" + that.$store.state.scene + '_' + that.$store.state
						.scene_id);
					if (child) {
						child.open({
							type: 'aite',
							content: '@用户',
							timeout: 2000,
							isClick: true,
							mask: 3,
							emit: 'commentForm',
							cursor: cursor,
							isPrefix: isPrefix
						});
						return false;
					}
				}, 250);
			},
			acceptAiteUser(cursor, user_name) {
				let that = this;
				that.comment_content = that.comment_content.slice(0, cursor) + user_name + ' ' + that.comment_content
					.slice(cursor);
				that.isFocus = true;
			},
			deleteimageURL() {
				let that = this;
				that.comment_img = '';
			},
			maskClick(e) {
				let that = this;
				that.isShowCommentForm = false;
				that.$emit('maskClick', {});
			},
			tapFakeForm(commentId, replyUserId, replyName) {
				let that = this;
				that.$emit('tapComment', {
					commentId,
					replyUserId,
					replyName
				});
			},
			focusTextarea(e) {
				let that = this;
				that.textareaBottom = e.detail.height;
			},
			blurTextarea(e) {
				let that = this;
				console.log('blurTextarea')
				that.textareaBottom = 0;
				that.cursor = e.detail.cursor;
			},
			setMinTextHeight(height) {
				let that = this;
				that.minTextHeight = height,
					that.isScaleMax = height == 23 ? true : false;
			},
			toComment() {
				let that = this;
				if (uni.$store.state.token) {

				} else {
					if (that.$store.state.scene == 14) {
						return;
					}
					uni.wen.toUrl(-4, null, null);
					return;
				}
				that.isShowCommentForm = true;
			},
			closeComment() {
				this.isShowCommentForm = false;
			},
			toemoji() {
				this.isEmoji = !this.isEmoji;
			},
			addEmoji(alt) {
				let that = this;
				setTimeout(function() {
					if (that.cursor > 0) {
						that.comment_content = that.comment_content.slice(0, that.cursor) + alt + ' ' + that
							.comment_content.slice(that.cursor);
						that.cursor = that.cursor + alt.lenght
					} else {
						that.comment_content = that.comment_content + alt;
						that.cursor = that.cursor + alt.lenght
					}
				}, 100);
			},
			sendComment() {
				let that = this;
				// if (that.comment_content && that.comment_content.length > 0) {
				if (that.comment_content.trim() || this.comment_img) {
					if (that.$store.state.scene == 9) {
						that.closeComment();
						that.$emit('sendComment', {
							content: that.comment_content,
							img: that.comment_img,
						})
					} else {
						that.$emit('sendComment', {
							content: that.comment_content,
							img: that.comment_img,
						})
					}

				} else {
					uni.showToast({
						title: '评论内容为空',
						icon: 'none'
					})
				}
			},
			uploadCommentImg() {
				let that = this;
				this.isEmoji = false;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						console.log(res, 'resaasdasdasdasdasd')
						uni.loading(true);
						const tempFilePaths = res.tempFilePaths;
						uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0],
							3).then(function(res) {
							uni.loading(false);
							if (res.status) {
								that.comment_img = res.data
							} else {
								uni.showToast({
									title: res.message,
									icon: 'none',
									duration: 1500
								});
							}
						});
					},
				})
				return;
				// let that = this;

				let uploadCommentImg_ = function(sourceType) {
					console.log(123123123)
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],

						success(res) {
							console.log(res, 'resaasdasdasdasdasd')
							uni.loading(true);
							const tempFilePaths = res.tempFilePaths;
							uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0],
								3).then(function(res) {
								uni.loading(false);
								if (res.status) {
									that.comment_img = res.data
								} else {
									uni.showToast({
										title: res.message,
										icon: 'none',
										duration: 1500
									});
								}
							});
						},

						fail(err) {

						}
					});
				}

				uni.showActionSheet({
					itemList: ['拍摄', '从相册选择'],
					success: function(res) {

						// #ifdef MP
						uploadCommentImg_(res.tapIndex === 1 ? 'album' : 'camera')
						// #endif

						// #ifdef APP
						uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera',
							res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于带图片的评论' :
							'[摄像头权限]获取您此刻所拍的照片，用于带图片的评论', () => {
								uploadCommentImg_(res.tapIndex === 1 ? 'album' : 'camera')
							});
						// #endif

						// #ifdef H5
						uploadCommentImg_(res.tapIndex === 1 ? 'album' : 'camera')
						// #endif

					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});

			},
			delCommentPic() {
				this.imageValue = '';
			}
		}
	}
</script>

<style lang="scss">
	.pupop-content {}

	.comment-form {
		position: fixed;
		bottom: 0;
		@include background_color(page-box-background-color);
		z-index: 9;

		.fake_form {
			width: 750rpx;
			padding: 12rpx 0 36rpx;

			.inner {
				width: $page-content-body-width;
				/* #ifndef APP-NVUE */
				margin: 10rpx auto;
				box-sizing: border-box;
				/* #endif */
				/* #ifdef APP-NVUE */
				//   margin-top: 10rpx;
				//   margin-right: 20rpx;
				//   margin-bottom: 10rpx;
				//   margin-left: 10rpx;
				/* #endif */
				height: 70rpx;
				display: flex;
				flex-direction: row;
				//   justify-content: space-between;
				@include background_color(page-box-item2-background-color);
				border-radius: 100rpx;
				padding: 0 20rpx;

				.place_holder {
					width: 100%;
					height: 65rpx;
					line-height: 65rpx;
					margin-left: 10rpx;
					border-radius: 100rpx;
					display: flex;
					justify-content: space-between;
					font-size: $uni-font-size-sm-base;
					color: #777777;
				}

				.mini-icon {
					text-indent: 15rpx;
					height: 70rpx;
					line-height: 70rpx;
					@include color(color-lightest-dark);
					font-size: $uni-font-size-medium;
				}
			}
		}

		.true_form {
			display: flex;
			flex-direction: column;
			padding: 20rpx 0;
			@include background_color(page-box-background-color);
			/* #ifndef APP-NVUE */
			padding-bottom: env(safe-area-inset-bottom);
			/* #endif */
			padding-bottom: 30rpx;
			.inner {
				width: $page-content-body-width;
				/* #ifndef APP-NVUE */
				margin: 0 auto;
				min-height: 70rpx;
				/* #endif */
				/* #ifdef APP-NVUE */
				margin-top: 0;
				margin-bottom: 0;
				margin-left: 20rpx;
				margin-right: 20rpx;
				height: 70rpx;
				/* #endif */

				display: flex;
				flex-direction: column;
				justify-content: space-between;
				@include background_color(page-gray-background-color);
				border-radius: 20rpx;
				padding: 20rpx;
				/* #ifndef APP-NVUE */
				box-sizing: border-box;
				/* #endif */
				position: relative;
				@include color(color-light-dark);

				._textarea {
					@include color(color-light-dark);
				}

				.scale-icon {
					position: absolute;
					right: 10rpx;
					top: 10rpx;
					@include color(color-lighter-dark);
					font-size: 40rpx;
				}
			}

			.tools {
				width: $page-content-body-width;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				// justify-content: flex-end;
				/* #ifndef APP-NVUE */
				margin: 20rpx auto;
				/* #endif */
				/* #ifdef APP-NVUE */
				// margin-left: 20rpx;
				// margin-top: 20rpx;
				// margin-right: 20rpx;
				// margin-bottom: 20rpx;
				padding: 20rpx 0;

				/* #endif */
				.mini-icon {
					height: 50rpx;
					line-height: 50rpx;
					font-size: 50rpx;
					@include color(color-lighter-dark);
				}

				.left {
					display: flex;
					flex-direction: row;
					// #ifdef APP-NVUE
					padding-left: 40rpx;

					// #endif
					.mini-icon {
						margin-right: 34rpx;
					}
				}

				.right {
					.mini-icon {
						margin-left: 30rpx;
					}
				}

				.send_btm {
					height: 55rpx;
					line-height: 55rpx;
					text-align: center;
					margin-left: 30rpx;

					.btn {
						//width: 90rpx;
						background-color: $uni-color-follow;
						color: $uni-color-follow-font;
						padding: 6rpx 26rpx;
						border-radius: $uni-border-radius-lg;
						opacity: 0.6;

						.send-btn-text {
							color: #ffffff;
							font-size: $uni-font-size-lg;
						}
					}

					.btn.yes {
						opacity: 1;
					}
				}
			}
		}

		.true_form.focused {
			padding-bottom: 0;
		}

		.comment_img_wrap {
			width: 750rpx;
			height: 140rpx;
			@include background_color(page-box-background-color);

			.comment_img_wrap-inner {

				width: $page-content-body-width;
				/* #ifndef APP-NVUE */
				margin: 0 auto;
				margin-top: 20rpx;
				/* #endif */
				/* #ifdef APP-NVUE */
				margin-left: 20rpx;
				margin-top: 20rpx;
				margin-right: 20rpx;
				margin-bottom: 0;
				/* #endif */

				.img_item {
					width: 120rpx;
					height: 120rpx;
					position: relative;

					.upload_img {
						width: 120rpx;
						height: 120rpx;
						border-radius: 12rpx;
					}

					.mini-icon.delete_icon {
						color: red;
						position: absolute;
						top: 0rpx;
						right: 0rpx;
						@include background_color(page-box-background-color);
						border-radius: 50%;
					}
				}
			}
		}

		.emoji_wrap {
			z-index: 9999;

			.emoji-swiper {
				// #ifdef APP-PLUS
				width: 750rpx;
				height: 320rpx;
				// #endif
				// #ifndef APP-PLUS
				height: 20vh;
				// #endif
				@include background_color(page-box-item-background-color);

				.emoji-srcoll {
					// #ifndef APP-PLUS
					height: 35vw;
					// #endif
					// #ifdef APP-PLUS
					height: 320rpx;
					// #endif
					overflow: hidden;
				}

				.emoji-srcoll-content {
					display: flex;
					flex-direction: row;
					/* #ifndef APP-NVUE */
					align-content: flex-start;
					/* #endif */
					flex-wrap: wrap;

					._view {
						// #ifndef APP-PLUS
						width: 12.4vw;
						height: 12vw;
						// #endif
						// #ifdef APP-PLUS
						width: 92rpx;
						height: 90rpx;
						// #endif
						display: flex;
						justify-content: center;
						align-items: center;

						._image {
							// #ifndef APP-PLUS
							width: 8.4vw;
							height: 8.4vw;
							// #endif
							// #ifdef APP-PLUS
							width: 64rpx;
							height: 64rpx;
							// #endif
						}
					}
				}
			}
		}
	}

	.comment-form.scene_9 {
		.fake_form {
			display: flex;

			justify-content: space-between;

			.inner {
				width: 330rpx;
				margin: 0 0 0 20rpx;
				left: 0;
				height: 80rpx;
				display: flex;
				/* #ifdef APP-NVUE */

				/* #endif */
				/* #ifndef APP-NVUE */
				justify-content: left;

				/* #endif */
				.place_holder {
					height: 86rpx;
					line-height: 86rpx;
					font-size: $uni-font-size-base;
				}

				.mini-icon {
					/* #ifdef APP-NVUE */
					display: flex;
					/* #endif */
					/* #ifndef APP-NVUE */
					display: inline;
					/* #endif */
					margin-right: 10rpx;
					font-size: $uni-font-size-base;
					line-height: 86rpx;
				}
			}
		}
	}

	/* #ifdef APP-NVUE */
	.comment-form.app-texearea {
		width: 640rpx;
		min-height: 130rpx;
	}

	/* #endif */
</style>