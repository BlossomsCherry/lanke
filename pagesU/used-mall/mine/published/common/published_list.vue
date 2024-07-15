<style lang="scss" scoped>
	.list {
		padding: 0 40rpx;

		.list_box {
			display: flex;
			flex-direction: column;

			.list_box_cont {
				display: flex;
				align-items: center;

				>.image {
					width: 150rpx;
					min-width: 150rpx;
					height: 150rpx;
					border-radius: 20rpx;
				}

				.cont {
					display: flex;
					flex-direction: column;
					min-height: 150rpx;
					height: 150rpx;
					justify-content: space-between;
					min-width: 550rpx;
					width: 550rpx;
					padding-left: 20rpx;

					.title {
						color: #333;
						font-weight: bold;
						font-size: $uni-font-size-sm-base;
						white-space: nowrap; // 强制一行显示
						overflow: hidden; // 超出隐藏
						text-overflow: ellipsis; // 省略号
					}

					.pirce {
						font-weight: bold;
						font-size: $uni-font-size-base;
						color: #ff0000;

						text {
							font-size: 22rpx;
						}
					}

					.tip {
						font-size: 22rpx;
						color: #8e8e8e;
					}
				}
			}

			.list_box_btn {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $uni-font-size-sm-base;
				padding: 20rpx 0;

				.more {
					color: #8e8e8e;
				}

				.btn {
					display: flex;

					>view {
						padding: 10rpx 20rpx;
						border-radius: 40rpx;
						border: #8e8e8e solid 2rpx;
						color: #333;
						margin-left: 20rpx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
<template>
	<view class="list">
		<block v-for="item in 10">
			<view class="list_box">
				<view class="list_box_cont">
					<image class="image" src="https://so.360tres.com/dmsmty/160_160_100/t012626e9fc25ae7a57.webp"
						mode="aspectFill"></image>
					<view class="cont">
						<view class="title">
							非常粘人的大布偶猫一只
						</view>
						<view class="pirce"><text>￥</text>100.00</view>
						<view class="tip">
							曝光1.5万 · 浏览781 · 想要28
						</view>
					</view>
				</view>
				<view class="list_box_btn">
					<view class="more" @tap.stop="showMore">更多</view>
					<view class="btn">
						<view @tap.stop="showPirce">降价</view>
						<view>编辑</view>
					</view>
				</view>
			</view>
		</block>
		<u-action-sheet :actions="list" title=" " :show="show" safeAreaInsetBottom round="20"
			cancelText="取消"></u-action-sheet>
		<popPirce ref="pirce"></popPirce>
	</view>
</template>

<script>
	import popPirce from '@/pagesU/used-mall/mine/published/common/popup_pirce.vue'
	export default {
		components: {
			popPirce
		},
		data() {
			return {
				list: [{
						name: '分享',
					},
					{
						name: '下架',
					}
				],
				show: false
			}
		},
		onLoad() {

		},
		methods: {
			showPirce() {
				this.$refs.pirce.show = true;
			},
			showMore() {
				this.show = true;
			}
		}
	}
</script>