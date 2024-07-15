<template>
	<view class="comment" :class="'comment-scroll ' + 'scene_' + scene">
		<ls-skeleton :loading="commentSkeletonLoad" :skeleton="commentListSkeleton">
			<scroll-view :show-scrollbar="false" :scroll-y="true" class="dialog_comments" enhanced @scrolltolower="loadRefreshComments(false)">

				<view>
					<block v-for="(item, cindex) in comments" :key="item.id">
						<view class="comment-item">
							<view class="comment-main-left">
								<view class="avatar" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
									<image class="comment-avatar" :src="item.user.user_avatar"></image>
									<!-- <image class="comment-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image> -->
								</view>
							</view>
							<view class="comment-main-right">
								<view class="comment-main">
									<view class="info">
										<view class="nickname-box">
											<text class="nickname">{{ item.user.user_name }}</text>
											<text class="is-zuozhe" v-if="item.posts_user_id == item.user.id">作者</text>
										</view>
										<!-- #ifdef APP-PLUS -->
										<rich-text :nodes="getNodes(item)" class="content" @tap.stop.prevent="
					    tapComment(item.id, item.user_id, item.user_name)
					  ">{{ item.comment_content_raw }}</rich-text>
										<!-- #endif -->
										<!-- #ifndef APP-PLUS -->
										<!-- <text class="content" @tap.stop.prevent="
					    tapComment(item.id, item.user_id, item.user_name)
					  ">{{ item.comment_content_raw }}</text> -->
										<rich-text :nodes="getNodes(item)" class="content" @tap.stop.prevent="
					    tapComment(item.id, item.user_id, item.user_name)
					  ">{{ item.comment_content_raw }}</rich-text>
										<!-- #endif -->
									</view>
					
									<view class="comment-image">
										<image @click="previewImage(item.comment_img_url)" class="image"
											v-if="item.comment_img_url != null && item.comment_img_url != ''"
											:src="item.comment_img_url" mode="widthFix"></image>
									</view>
								</view>
					
								<view class="footer">
									<view class="left">
										<text class="time_adr">{{ item.format_time + '&nbsp;&nbsp;' + item.ip_address }}</text>
										<text class="replay-btn" @tap.stop.prevent="tapComment(item.id, item.user_id, item.user_name)">回复</text>
									</view>
									<!-- #ifndef APP-PLUS -->
									<view class="right">
										<text class="like mini-icon mini-xihuan-shixin text-icon"
											@tap.stop.prevent="tapCommentlike(cindex, item.id)" v-if="item.is_like"></text>
										<text class="like mini-icon mini-xihuan-kongxin text-icon"
											@tap.stop.prevent="tapCommentlike(cindex, item.id)" v-else></text>
										<text class="count">{{ item.like_count }}</text>
									</view>
									<!-- #endif -->
									<!-- #ifdef APP-PLUS -->
									<view class="right">
										<text class="like mini-icon mini-xihuan-shixin text-icon text-icon-hongxin"
											@tap.stop.prevent="tapCommentlike(cindex, item.id)"
											v-if="item.is_like">&#xe610;</text>
										<text class="like mini-icon mini-xihuan-kongxin text-icon"
											@tap.stop.prevent="tapCommentlike(cindex, item.id)" v-else>&#xe60f;</text>
										<text class="count">{{ item.like_count }}</text>
									</view>
									<!-- #endif -->
								</view>
					
								<view class="author-liked" v-if="item.is_author_liked">
									<text class="author-liked-text">作者赞过</text>
								</view>
					
								<view class="show-more" v-if="!item.child_is_last_page"
									@tap.stop.prevent="getCommentByCommentId(item.id, cindex)">
									<view class="line"></view>
									<text class="zhankai">展开更多回复</text>
									<u-icon name="arrow-down" size="20" color="#696969"></u-icon>
								</view>
							</view>
						</view>
						<!-- 回复 -->
					
						<block v-for="(items, cindexs) in item.child" :key="items.id">
							<view class="comment-item sub">
								<view class="comment-main-left">
									<view class="avatar" @tap.stop.prevent="toSliderUrl(4, items.user.id)">
										<image class="comment-avatar" :src="items.user.user_avatar"></image>
										<!-- <image class="comment-avatar-frame" v-if="items.user.avatar_frame_url" :src="items.user.avatar_frame_url" mode="aspectFill"></image> -->
									</view>
								</view>
								<view class="comment-main-right">
									<view class="comment-main">
										<view class="info">
											<view class="nickname-box">
												<text class="nickname">{{ items.user.user_name }}</text>
												<text v-if="items.comment_agent_id != item.user_id"
													class="nickname">{{ "&nbsp;&nbsp;回复&nbsp;&nbsp;" + items.comment_agent_name }}</text>
												<text class="is-zuozhe"
													v-if="items.posts_user_id == items.user.id">作者</text>
											</view>
											<!-- #ifdef APP-PLUS -->
											<rich-text :nodes="getNodes(items)" class="content" @tap.stop.prevent="
					    tapComment(item.id, items.user_id, items.user_name)
					  "></rich-text>
											<!-- #endif -->
											<!-- #ifndef APP-PLUS -->
											<!-- <text class="content" @tap.stop.prevent="
					    tapComment(item.id, items.user_id, items.user_name)
					  ">{{ items.comment_content_raw }}</text> -->
											<rich-text :nodes="getNodes(items)" class="content" @tap.stop.prevent="
					    tapComment(item.id, items.user_id, items.user_name)
					  "></rich-text>
											<!-- #endif -->
										</view>
					
										<view class="comment-image">
											<image @click="previewImage(items.comment_img_url)" class="image"
												v-if="items.comment_img_url != null && items.comment_img_url != ''"
												:src="items.comment_img_url" mode="widthFix"></image>
										</view>
									</view>
					
									<view class="footer">
										<view class="left">
											<text
												class="time_adr">{{ items.format_time + '&nbsp;&nbsp;' + items.ip_address }}</text>
											<text class="replay-btn" @tap.stop.prevent="
					    tapComment(item.id, items.user_id, items.user_name)
					  ">回复</text>
										</view>
										<!-- #ifndef APP-PLUS -->
										<view class="right">
											<text class="like mini-icon mini-xihuan-shixin text-icon text-icon-hongxin"
												@tap.stop.prevent="tapCommentslike(cindex, cindexs,items.id)"
												v-if="items.is_like"></text>
											<text class="like mini-icon mini-xihuan-kongxin text-icon"
												@tap.stop.prevent="tapCommentslike(cindex, cindexs,items.id)" v-else></text>
											<text class="count">{{ items.like_count }}</text>
										</view>
										<!-- #endif -->
										<!-- #ifdef APP-PLUS -->
										<view class="right">
											<text class="like mini-icon mini-xihuan-shixin text-icon text-icon-hongxin"
												@tap.stop.prevent="tapCommentslike(cindex, cindexs,items.id)"
												v-if="items.is_like">&#xe610;</text>
											<text class="like mini-icon mini-xihuan-kongxin text-icon"
												@tap.stop.prevent="tapCommentslike(cindex, cindexs,items.id)"
												v-else>&#xe60f;</text>
											<text class="count">{{ items.like_count }}</text>
										</view>
										<!-- #endif -->
									</view>
					
									<!-- <view class="show-more" v-if="!items.child_is_last_page" @tap.stop.prevent="getCommentByCommentId(items.id, cindexs)">
					  <view class="line"></view>
					  <text class="zhankai">展开更多回复</text>
					  <u-icon name="arrow-down" size="20" color="#696969"></u-icon>
					</view> -->
					
									<!-- 回复 -->
								</view>
							</view>
						</block>
					</block>
					
					<block v-if="commentIsNull && comments.length <= 0">
						<u-empty :icon="config_img__NVUE.empty" width="300" height="300" text="快来抢占沙发吧" textSize="28" />
					</block>
					
					<u-loadmore v-if="isCommentLoadingShow" :status="isCommentEndPage ? 'nomore' : 'loading'"
						nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"
						bgClass="page-box-background-color" />
				</view>

			</scroll-view>
		</ls-skeleton>
	</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
	// #ifdef APP-NVUE
	const domModule = weex.requireModule("dom");
	domModule.addRule("fontFace", {
		fontFamily: "mini-icon",
		src: "url('../../../static/icon/A/iconfont.ttf')",
	});
	// #endif

	import lsSkeleton from "@/components/common/ls-skeleton/ls-skeleton";
	import contextualPopup from "@/components/common/contextual-popup/contextual-popup";
	import mpHtml from "@/contrib/components/common/mp-html/components/mp-html/mp-html";

	export default {
		name: "comment-scroll",
		components: {
			lsSkeleton,
			contextualPopup,
			mpHtml,
		},
		computed: {
			commentListSkeleton: {
				get() {
					let that = this;
					return that.$store.state.skeleton.commentList;
				},
				set(v) {},
			},
			config_app_ip_comment: {
				get() {
					let that = this;
					if (that.$store.state.config.app.ip) {
						return that.$store.state.config.app.ip.comment;
					}
					return 0;
				},
				set(v) {},
			},
			config_img__NVUE: {
				get() {
					let that = this;
					if (that.$store.state.config && that.$store.state.config.img) {
						return that.$store.state.config.img || {};
					}
					return {
						empty: "",
						default: "",
						default_avatar: "",
					};
				},
				set(v) {},
			},
		},
		data() {
			return {
				emList: [],
				comments: [],
				cPage: 1,
				isCommentLoadingShow: false,
				isCommentEndPage: false,
				commentSkeletonLoad: true,
				commentIsNull: false,
				nodes: [{
					name: '',
					attrs: {},
					children: [{
						type: 'text',
						text: '不尬啊势均力敌哈萨克来的哈接电话啦看就是多i气温一般，叫啊舍不得；阿克苏河多久啊说；可怜的话那就看啦小编和促癌很大；看老师拿东西啊快没了；还打死；hdakl.sdn；阿贾克斯和供电服务片；诶话费；看来这是多久呢'
					}]
				}],
			};
		},
		props: {
			scene: {
				type: Number,
				default: 0,
			},
			postsId: {
				type: [Number, String],
				default: 0,
			},
			refresh: {
				type: Number,
				default: 0,
			},
		},
		watch: {
			postsId: {
				handler: function(newVal, oldVal) {
					let that = this;
					if (typeof newVal === "string") {
						newVal = parseInt(newVal);
					}
					if (typeof oldVal === "string") {
						oldVal = parseInt(oldVal);
					}
					if (oldVal === newVal) {
						return false;
					}
					if (oldVal === undefined && newVal < 0) {
						that.loadRefreshComments(true);
						return false;
					}
					if (newVal != 0 && newVal != "0") {
						if (newVal == oldVal * -1) {
							setTimeout(function() {
								that.loadRefreshComments(true);
							}, 300);
						} else {
							that.loadRefreshComments(true);
						}
					} else {
						that.datainit();
					}
				},
				immediate: true,
			},
			refresh: {
				handler: function(newVal, oldVal) {
					if (newVal > 0) {
						this.loadRefreshComments(false);
					}
				},
			},
		},
		mounted() {
			this.getEmList();
		},
		methods: {
			getEmList() {
				let emAll = this.$store.state.config2.emoji;
				let emList = [];
				for (let i in emAll) {
					emList = emList.concat(emAll[i])
				}

				this.emList = emList;
			},
			getNodes(item) {
				const str = item.comment_content_raw;
				const regex = /\[[^\[\]]*?\]|[^[\]]+/g;
				const matches = str.match(regex);
				let result = [];
				// console.log(matches,'matches')
				if (matches && str.trim()) {

					result = matches.map(match => {
						if (match.startsWith("[")) {
							return {
								type: "img",
								alt: match
							};
						} else {
							return {
								type: "text",
								text: match
							};
						}
					});
				}


				// console.log(result,'result')
				// this.emList = this.getEmList();
				let nodes = [{
					name: 'div',
					attrs: {
						style: 'display:flex;flex-direction: row;align-items: center;',
					},
					children: []
				}];
				result.forEach(item => {
					// console.log(this.emList, 'this.emList')
					if (item.type === "img") {
						const foundEmoji = this.emList.find(emoji => emoji.alt === item.alt);
						if (foundEmoji) {
							item.emoji = foundEmoji.emoji;
							item.width = foundEmoji.width;
							item.height = foundEmoji.height;

							nodes[0].children.push({
								name: 'img',
								attrs: {
									style: "width:" + foundEmoji.width + "px;" + "height:" + foundEmoji
										.height + "px;",
									src: foundEmoji.emoji,
									class: "comment-img"
								}
							})
						}
					} else {
						console.log(item)
						nodes[0].children.push({
							type: 'text',
							text: item.text,
						})
					}
				});

				return nodes;

				// return [{
				// 	name: '',
				// 	attrs: {},
				// 	children: [{
				// 		type: 'text',
				// 		text: item.comment_content_raw
				// 	}]
				// }]
			},
			toSliderUrl(type, id) {
				let that = this;
				uni.wen.toUrl(type, id, that);
			},
			datainit() {
				let that = this;
				that.comments = [];
				that.cPage = 1;
				that.isCommentLoadingShow = false;
				that.isCommentEndPage = false;
				that.commentSkeletonLoad = true;
				that.commentIsNull = false;
			},
			previewImage(url) {
				uni.previewImage({
					current: 0,
					urls: [url],
				});
				// urls:[url]
			},
			previewImgFunc(e) {
				let that = this;
				let url = e.currentTarget.dataset.src;
				var list = e.currentTarget.dataset.list;
				let styleNames = that.$store.state.config.img.styleNames || new Array();
				var imagesArr = [];

				if (url && styleNames) {
					for (var i = 0; i < styleNames.length; i++) {
						if (styleNames[i].charAt(0) == "/") {
							url = url.replace(styleNames[i], "");
						}
					}
				}

				if (list) {
					for (var j = 0; j < list.length; j++) {
						let img_ = list[j].img_url;
						for (var i = 0; i < styleNames.length; i++) {
							if (styleNames[i].charAt(0) == "/") {
								img_ = img_.replace(styleNames[i], "");
							}
						}
						imagesArr.push(img_);
					}
				} else {
					imagesArr = [url];
				}

				uni.previewImage({
					current: url,
					urls: imagesArr,
				});
				return false;
			},
			tapComment(commentId, replyUserId, replyName) {
				let that = this;
				that.$emit("tapComment", {
					commentId,
					replyUserId,
					replyName,
				});
			},
			getCommentByCommentId(comment_id, index) {
				console.log(1231231231)
				let that = this;
				let comments = that.comments;

				if (comments[index].id != comment_id) {
					uni.showToast({
						title: "错误",
						icon: "none",
					});
					return false;
				}

				if (comments[index].child_is_last_page) {
					uni.showToast({
						title: "没有更多回复了",
						icon: "none",
					});
					return false;
				}

				comments[index].child_loading = true;
				that.comments = comments;

				uni.wen.util
					.request(uni.wen.api.ApiRootUrl + "comment/byCommentId", {
						comment_id: comments[index].id,
						page: comments[index].child_page,
						begin_id: comments[index].child_current_max_id,
					})
					.then(function(res) {
						if (res.status) {
							if (res.data.current_page != comments[index].child_page) {
								return false;
							}

							let data = res.data;

							if (data.data && data.data.length > 0) {
								comments[index].child = comments[index].child.concat(data.data);
								comments[index].child_page = data.current_page + 1;
								if (data.data.length < 10) {
									comments[index].child_is_last_page = true;
								} else {
									comments[index].child_is_last_page = false;
								}
							} else {
								comments[index].child_is_last_page = true;
							}
							comments[index].child_loading = false;
							that.comments = comments;
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}
					});
			},
			loadRefreshComments(refresh) {
				let that = this;
				if (refresh === true) {
					that.comments = [];
					that.cPage = 1;
					that.isCommentLoadingShow = false;
					that.isCommentEndPage = false;
					that.commentSkeletonLoad = true;
					that.commentIsNull = false;
				} else {
					if (that.isCommentEndPage) {
						return false;
					}
					if (that.isCommentEndPage == false) {
						that.cPage = that.cPage + 1;
						that.isCommentLoadingShow = true;
						that.isCommentEndPage = false;
					}
				}

				uni.wen.util
					.request(uni.wen.api.ApiRootUrl + "comment/byPostsId", {
						posts_id: Math.abs(that.postsId),
						page: that.cPage,
					})
					.then(function(res) {
						if (res.status) {
							let data = res.data;

							if (data.data && data.data.length > 0) {
								that.comments = that.comments.concat(data.data);
								that.cPage = data.current_page;
								if (data.data.length < 10) {
									that.isCommentLoadingShow = true;
									that.isCommentEndPage = true;
									that.$emit("commentRefreshStatus", 0);
								} else {
									that.isCommentLoadingShow = false;
									that.isCommentEndPage = false;
									that.$emit("commentRefreshStatus", 1);
								}
							} else {
								if (refresh) {
									that.commentIsNull = true;
								}
								that.isCommentEndPage = true;
								that.$emit("commentRefreshStatus", 0);
							}
							that.commentSkeletonLoad = false;
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}
					});
			},
			tapCommentlike(index, id) {
				let that = this;
				uni.wen.util.doVibrateShort();
				uni.wen.util
					.request(
						uni.wen.api.ApiRootUrl + "comment/like/add", {
							comment_id: id,
						},
						"POST"
					)
					.then(function(res) {
						uni.loading(false);
						if (res.status) {
							let comments = that.comments;

							if (comments[index].is_like) {
								comments[index].like_count -= 1;
							} else {
								comments[index].like_count += 1;
							}

							comments[index].is_like = !comments[index].is_like;
							that.comments = comments;
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
								duration: 1500,
							});
						}
					});
			},
			//喜欢评论的评论
			tapCommentslike(pindex, index, id) {
				let that = this;

				uni.wen.util.doVibrateShort();

				uni.wen.util
					.request(
						uni.wen.api.ApiRootUrl + "comment/like/add", {
							comment_id: id,
						},
						"POST"
					)
					.then(function(res) {
						uni.loading(false);
						if (res.status) {
							let comments = that.comments;

							if (comments[pindex].child[index].is_like) {
								comments[pindex].child[index].like_count -= 1;
							} else {
								comments[pindex].child[index].like_count += 1;
							}

							comments[pindex].child[index].is_like = !comments[pindex].child[index].is_like;
							that.comments = comments;
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
								duration: 1500,
							});
						}
					});
			},
			//删除评论
			tapDeleteComment(index, id) {
				let that = this;
				uni.showModal({
					title: "提示",
					content: "确定要删除您的这条评论吗？",

					success(res) {
						if (res.confirm) {
							uni.wen.util
								.request(
									uni.wen.api.ApiRootUrl + "comment/delete", {
										id: id,
									},
									"POST"
								)
								.then(function(sec) {
									if (sec.status) {
										let comments = that.comments;
										comments.splice([index], 1);
										that.comments = comments;

										uni.showToast({
											title: "删除成功",
											icon: "success",
										});
									} else {
										uni.showToast({
											title: sec.message,
											icon: "none",
										});
									}
								});
						} else if (res.cancel) {}
					},
				});
			},

			//删除评论的评论
			tapDeleteComments(pindex, index, id) {
				let that = this;
				uni.showModal({
					title: "提示",
					content: "确定要删除您的这条评论吗？",

					success(res) {
						if (res.confirm) {
							uni.wen.util
								.request(
									uni.wen.api.ApiRootUrl + "comment/delete", {
										id: id,
									},
									"POST"
								)
								.then(function(sec) {
									if (sec.status) {
										let comments = that.comments;
										comments[pindex].child.splice([index], 1);
										that.comments = comments;
									}
								});
						} else if (res.cancel) {}
					},
				});
			},
			tapStickyComment(index, id) {
				let that = this;
				uni.wen.util
					.request(
						uni.wen.api.ApiRootUrl + "comment/sticky", {
							id: id,
						},
						"POST"
					)
					.then(function(sec) {
						if (sec.status) {
							let comments = that.comments;
							comments[index].is_sticky = !comments[index].is_sticky;
							that.comments = comments;

							uni.showToast({
								title: "操作成功",
								icon: "none",
							});
							setTimeout(function() {
								that.loadRefreshComments(true);
							}, 500);
						} else {
							uni.showToast({
								title: sec.message,
								icon: "none",
							});
						}
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	$comment-author-bg-color: #fc3a72; // 作者标识背景色（默认值：#f6eded ）
	$comment-author-color: #ffffff; // 作者标识颜色（默认值：#fc3a72 ）
	$comment-list-sex-display: inline-block; // 文章列表是否显示性别，如果不想显示改为：none （默认值：inline-block ）


	.comment-scroll {
		width: 750rpx;
		height: 1000rpx;
	}

	.comment-scroll.scene_9 {
		/* #ifndef APP-NVUE */
		height: auto;
		.dialog_comments {
			height: auto;
		}

		/* #endif */
	}

	.dialog_comments {
		width: 750rpx;
		height: 1000rpx;
	}

	.comment {
		.comment-item {
			display: flex;
			flex-direction: row;
			padding: 20rpx 8rpx 20rpx 40rpx;

			.comment-main-left {
				.avatar {
					width: 60rpx;
					height: 60rpx;

					.comment-avatar,
					.comment-avatar-frame {
						width: 60rpx;
						height: 60rpx;
						border-radius: 30rpx;
					}
				}
			}

			.comment-main-right {
				flex: 1;

				.info {
					margin-left: 16rpx;

					.nickname-box {
						display: flex;
						flex-direction: row;
						align-items: center;

						.is-zuozhe {
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							width: 50rpx;
							color: #ffffff;
							font-size: 18rpx;
							background: #e94359;
							border-radius: 4rpx;
							margin-left: 10rpx;
							text-align: center;
						}

						.nickname {
							font-size: $uni-font-size-sm;
							color: #696969;
						}
					}

					.content {
						font-size: $uni-font-size-base;
						font-weight: 600;
						min-height: auto;
						padding-right: 20rpx;


					}
				}

				.comment-image {
					margin-top: 8rpx;

					.image {
						width: 220rpx;
						padding-left: 16rpx;
						border-radius: 8rpx;
					}
				}

				.footer {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					margin-top: 8rpx;

					.left {
						display: flex;
						flex-direction: row;

						.time_adr {
							font-size: 22rpx;
							color: #696969;
							padding-left: 16rpx;
						}

						.replay-btn {
							font-weight: 600;
							font-size: 22rpx;
							color: #696969;
							color: #1f1e1e;
							margin-left: 60rpx;
						}
					}

					.right {
						display: flex;
						flex-direction: row;
						align-items: center;

						.text-icon {
							font-size: $uni-font-size-lg-er;
							font-weight: 600;
						}

						.text-icon-hongxin {
							color: #ff0000;
						}

						.count {
							font-size: $uni-font-size-lg-er;
							color: #696969;
							width: 60rpx;
							margin-left: 6rpx;
							font-weight: 600;
						}
					}
				}

				.author-liked {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					width: 80rpx;
					height: 26rpx;
					background: #F6F5F7;
					border-radius: 4rpx;

					.author-liked-text {
						color: #73737B;
						font-size: 18rpx;
					}
				}

				.show-more {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top: 16rpx;
					padding-left: 16rpx;

					.line {
						width: 40rpx;
						height: 2rpx;
						border-radius: 1rpx;
						background: #cecece;
						margin-right: 20rpx;
					}

					.zhankai {
						font-size: $uni-font-size-sm;
						font-weight: 700;
						color: #696969;
					}
				}
			}
		}

		.sub {
			padding: 20rpx 8rpx 20rpx 114rpx;

			.comment-main-left {
				.avatar-warp {
					width: 40rpx;
					height: 40rpx;

					.avatar {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
</style>