<style lang="scss" scoped>
	.app_bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}

	.popup {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;

		.head {
			display: flex;
			padding: 30rpx;
			justify-content: space-between;
			align-items: center;

			.flex {
				display: flex;
				align-items: center;

				.image {
					width: 100rpx;
					min-width: 100rpx;
					height: 100rpx;
					border-radius: 10rpx;
				}

				.cont {
					padding-left: 30rpx;
					color: #333333;
					font-size: $uni-font-size-base;

					.title {
						white-space: nowrap;
						/*规定段落中的文本不进行换行*/
						overflow: hidden;
						/*内容会被修剪，并且其余内容是不可见的。*/
						text-overflow: ellipsis;
						/*显示省略号来代表被修剪的文本*/
						width: 300rpx;
					}

					.tip {
						padding-top: 20rpx;
						font-size: $uni-font-size-sm-base;
						color: #c4c4c4;
					}
				}

				.close {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					background: #ababab;
				}
			}
		}

		.nr {
			font-weight: bold;
			color: #333333;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 100rpx 0 20rpx 0;

			.title {
				font-size: 22rpx;
			}

			.pirce {
				font-size: 38rpx;

				text {
					font-size: 22rpx;
				}
			}
		}

		.btn {
			width: 600rpx;
			height: 90rpx;
			background: #fee610;
			border-radius: 40rpx;
			color: #333333;
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;
			margin-top: 150rpx;
		}
	}
</style>
<template>
	<view>
		<u-popup :show="show" mode="bottom" @close="close" @open="open">
			<view class="popup">
				<view class="head">
					<view class="flex">
						<image class="image" src="https://so.360tres.com/dmsmty/160_160_100/t012626e9fc25ae7a57.webp"
							mode="aspectFill"></image>
						<view class="cont">
							<view class="title">非常粘人的大布偶猫非常粘人的大布偶猫.非常粘人的大布偶猫.</view>
							<view class="tip">现价￥500.00 | 已发布211天</view>
						</view>
					</view>
					<view class="close" @tap.stop="close">
						<u-icon name="close" size="26" bold></u-icon>
					</view>
				</view>
				<view class="nr">
					<view class="title">降价至</view>
					<view class="pirce"><text>￥</text>{{pirce}}</view>
				</view>
				<rule ref="ruler" :min="1" :max="500" :disable="false" :multiple="1" :point="0" :defaultValue="defaultValue"
					@change="handleChange">
				</rule>
				<view class="btn">确认降价</view>
				<view class="app_bottom"></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import rule from '@/pagesU/used-mall/mine/published/common/rule.vue'
	export default {
		components: {
			rule
		},
		data() {
			return {
				show: false,
				pirce: 300,
				defaultValue: 300
			}
		},
		onLoad() {

		},
		methods: {
			handleChange(val) {
				console.log(val);
				this.pirce = val;
			},
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