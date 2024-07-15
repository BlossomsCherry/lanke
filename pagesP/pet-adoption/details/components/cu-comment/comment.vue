<template>
	<view class="comment" v-if="data">
		<view class="comment-avatar" @tap.stop.prevent="toSliderUrl(4, data.user.id)">
			<image class="avatar" :src="data.user.user_avatar"></image>
		</view>
		<view class="comment-content" @tap.stop.prevent="reply(data, '')">
			<view class="comment-content-header">
				<text class="nickname" @tap.stop.prevent="toSliderUrl(4, data.user.id)">{{ data.user.user_name }}</text>
			</view>
			<text class="comment-content-des">{{ data.comment_content }}</text>
			<view class="comment-content-footer">
				<!-- <text class="comment-content-footer-text">{{ timec }}</text> -->
				<text class="comment-content-footer-text">{{ data.format_time }}</text>
				<text class="comment-content-footer-replay">回复</text>
				<!--        <view style="flex: 1;"></view>-->
				<!--        <u-icon name="good" color="#666666"></u-icon>-->
				<!--        <text class="comment-content-footer-number">23</text>-->
			</view>
			<view class="comment-content-reply" :style="[{'height': replyHeight+'px'}]">
				<view class="comment-content-reply-list" v-if="data.child.length">
					<comment-item @reply="reply" v-for="(item, index) in replyList || []" :key="index" :data="item"
						:index="index"></comment-item>
				</view>
			</view>
			<view class="comment-content-more" v-if="data.child.length">
				<view class="line"></view>
				<text class="text" @tap.stop="openReplyList"
					v-if="data.child.length- replyList.length>0">展开{{ data.child.length - replyList.length }}条回复</text>
				<u-icon name="arrow-down" bold color="#a9a9a9" v-if="data.child.length - replyList.length > 0" :stop="false"
					@click="openReplyList"></u-icon>
				<text class="text" @tap.stop="closeReplyList" v-if="data.child.length - replyList.length <= 0">收起</text>
				<u-icon name="arrow-up" bold color="#a9a9a9" v-if="data.child.length - replyList.length <= 0" :stop="false"
					@click="closeReplyList"></u-icon>
			</view>

		</view>
	</view>
</template>

<script>
	import commentItem from "./comment-item.vue"
	export default {
		props: {
			data: {
				type: Object,
				default: () => null
			},
			index: {
				type: Number,
				default: 0
			}
		},
		components: {
			commentItem
		},
		data() {
			return {
				replyList: [],
				replyHeight: 0,
				pageIndex: 3,
				idx: 0
			}
		},
		computed: {
			// timec() {
			// 	return formatTimeText(this.data.created_at || 0)
			// },
		},
		created() {

		},
		mounted() {
			this.$nextTick(() => {
				this.replyList = this.data.child.slice(0, 3);
				setTimeout(() => {
					this.getReplyHeight()
				}, 20)
				console.log(11111111111111, this.replyList, this.data)
			});
		},
		methods: {
			// addReply(params, index) {
			// 	if (index >= 0) {
			// 		console.log(params)
			// 		this.replyList.push(params)
			// 		let list1 = this.replyList.filter(it => it.replyType === 'comment')
			// 		list1.sort(function(a, b) {
			// 			return b.created_at - a.created_at;
			// 		});
			// 		let list2 = this.replyList.filter(it => it.replyType === 'reply')
			// 		list2.sort(function(a, b) {
			// 			return b.created_at - a.created_at;
			// 		});
			// 		this.replyList = [].concat(list1, list2)
			// 		this.$nextTick(() => {
			// 			setTimeout(() => {
			// 				this.getReplyHeight()
			// 			}, 0)
			// 		})
			// 	}
			// },
			// 展开评论
			openReplyList() {
				let list = [];
				console.log(this.data.child, this.pageIndex)
				if (this.pageIndex + 5 > this.data.child.length) {
					if (this.replyList.length < this.pageIndex) {
						list = this.data.child;
					} else {
						list = (this.data.child || []).slice(this.pageIndex, this.data.child.length);
					}
				} else {
					list = (this.data.child || []).slice(this.pageIndex, this.pageIndex + 5);
				}
				// let list1 = list.filter(it => it.replyType === 'comment')
				// list1.sort(function(a, b) {
				// 	return b.date - a.date;
				// });
				// let list2 = list.filter(it => it.replyType === 'reply')
				// list2.sort(function(a, b) {
				// 	return b.date - a.date;
				// });
				// console.log(list1, list2)
				// this.replyList = this.replyList.concat(list1);
				// this.replyList = this.replyList.concat(list2);
				this.replyList = this.replyList.concat(list);
				console.log(this.replyList)
				this.replyList = this.deWeightFour(this.replyList)

				// 排序，降序

				this.$nextTick(() => {
					setTimeout(() => {
						this.getReplyHeight()
					}, 20)
				})
				if (this.pageIndex + 5 > this.data.child.length) {
					console.log(true)
					this.pageIndex = this.data.child.length;
				} else {
					console.log(false);
					this.pageIndex = this.pageIndex + 5
				}
			},

			// 收起评论
			closeReplyList() {
				this.replyHeight = 0
				setTimeout(() => {
					this.pageIndex = 3
					this.replyList = []
				}, 300)
			},

			// 去重
			deWeightFour(list) {
				let map = new Map();
				for (let item of list) {
					if (!map.has(item.id)) {
						map.set(item.id, item);
					}
				}
				return [...map.values()];
			},
			reply(item, index) {
				this.idx = index
				this.$emit('reply', item, this.index)
			},
			getReplyHeight() {
				uni.createSelectorQuery().in(this).select('.comment-content-reply-list').boundingClientRect((rect) => {
					if(rect && rect.height){
						this.replyHeight = rect.height
					}
				}).exec();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment {
		display: flex;
		flex-direction: row;
		padding: 24rpx 0;

		.comment-avatar {
			.avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 60rpx;
			}
		}

		.comment-content {
			padding-left: 16rpx;
			flex: 1;

			&-reply {
				overflow: hidden;
				transition-timing-function: ease-in-out;
				transition-duration: 300ms;
				transition-property: height;
				will-change: height;
			}

			&-header {
				display: flex;
				flex-direction: row;
				align-items: center;

				.nickname {
					font-size: $uni-font-size-sm-base;
					@include color(color-lightest-dark);
				}
			}

			&-more {
				margin-top: 24rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				.line {
					height: 1px;
					@include background_color(page-lighter-er-line-background-color);
					width: 30rpx;
				}

				.text {
					margin-left: 16rpx;
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);

					&:active {
						opacity: 0.6;
					}
				}
			}

			&-des {
				width: 626rpx;
				margin-top: 8rpx;
				font-size: $uni-font-size-base;
				@include color(color-light-dark);
			}

			&-footer {
				margin-top: 12rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				&-text {
					font-size: $uni-font-size-sm-base;
					@include color(color-lightest-dark);
				}

				&-replay {
					margin-left: 36rpx;
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);
				}

				&-number {
					margin-left: 12rpx;
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);
				}
			}
		}
	}
</style>