<template>
	<view class="comment-item">
		<view class="comment-item-avatar">
			<image class="avatar" :src="data.user.user_avatar"></image>
		</view>
		<view class="comment-item-content" @tap.stop.prevent="toReply">
			<view class="comment-item-content-header">
				<text class="nickname">{{ data.user.user_name }}</text>
				<u-icon name="play-right-fill" size="16" color="#a9a9a9" v-if="data.comment_agent_id"
					style="margin: 0 10rpx;"></u-icon>
				<text class="nickname" v-if="data.comment_agent_id">{{ data.comment_agent_name }}</text>
			</view>
			<text class="comment-item-content-des">{{ data.comment_content }}</text>
			<view class="comment-item-content-footer">
				<!-- <text class="comment-item-content-footer-text">{{ timec }}</text> -->
				<text class="comment-item-content-footer-text">{{ data.format_time }}</text>
				<text class="comment-item-content-footer-replay">回复</text>
				<!--        <view style="flex: 1;"></view>-->
				<!--        <l-icon name="good" color="#666666"></l-icon>-->
				<!--        <text class="comment-item-content-footer-number">23</text>-->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		},
		computed: {
			// timec() {
			// 	return formatTimeText(this.data.date || 0)
			// },
		},
		methods: {
			toReply(e) {
				this.$emit('reply', this.data, this.index)
				e && e.stopPropagation && e.stopPropagation()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-item {
		display: flex;
		flex-direction: row;
		padding: 24rpx 0 24rpx 0;

		&:active {
			background-color: #f1f1f1;
		}

		.comment-item-avatar {
			.avatar {
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;

			}
		}

		.comment-item-content {
			padding-left: 16rpx;
			flex: 1;

			&-header {
				display: flex;
				flex-direction: row;
				align-items: center;

				.nickname {
					font-size: $uni-font-size-sm-base;
					color: #999999;
				}
			}

			&-des {
				width: 570rpx;
				margin-top: 8rpx;
				font-size: $uni-font-size-base;
				color: #323233;
			}

			&-footer {
				margin-top: 12rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				&-text {
					font-size: $uni-font-size-sm-base;
					color: #999999;
				}

				&-replay {
					margin-left: 36rpx;
					font-size: $uni-font-size-sm-base;
					color: #666666;
				}

				&-number {

					margin-left: 12rpx;
					font-size: $uni-font-size-sm-base;
					color: #666666;
				}
			}
		}
	}
</style>