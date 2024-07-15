<style lang="scss" scoped>
	.app_bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

	.popup {
		color: #333;


		.popup_title {
			font-size: 36rpx;
			padding: 30rpx;
			text-align: center;
		}

		.popup_list {
			overflow: scroll;
			max-height: 800rpx;
			padding-top: 30rpx;

			.box {
				display: flex;
				align-items: flex-start;
				padding: 0 30rpx;

				.left {
					width: 40rpx;
					min-width: 40rpx;
					height: 170rpx;
					border-right: #c5c5c5 solid 2rpx;

					.icon {
						border: #bdbdbd solid 6rpx;
						padding: 5rpx;
						border-radius: 50%;
						position: relative;
						right: -25rpx;
						background: #fff;
						width: 10rpx;
						height: 10rpx;
					}
				}

				.right {
					padding-left: 20rpx;
					width: 700rpx;

					.head {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: $uni-font-size-lg;

						.title {
							color: #333;
							font-weight: bold;
						}

						.num {
							color: #c5c5c5;
						}
					}

					.value {
						color: #333;
						font-size: $uni-font-size-base;
						padding-top: 30rpx;
					}
				}
			}
		}
	}
</style>
<template>
	<view>
		<u-popup :show="show" mode="bottom" @close="close" @open="open">
			<view class="popup">
				<view class="popup_title">近期优化记录</view>
				<view class="popup_list">
					<block v-for="item in 10">
						<view class="box">
							<view class="left">
								<view class="icon"></view>
							</view>
							<view class="right">
								<view class="head">
									<view class="title">今天</view>
									<view class="num">共0曝光</view>
								</view>
								<view class="value">已擦亮，近7天擦亮1次</view>
							</view>
						</view>
					</block>
				</view>
				<view class="app_bottom"></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
			}
		},
		onLoad() {

		},
		methods: {
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			}
		}
	}
</script>