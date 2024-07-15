<style lang="scss" scoped>
	.popup {
		padding: 40rpx;
		background: #fff;
		border-radius: 30rpx;

		.popup_btn {
			width: 400rpx;
			height: 90rpx;
			background: #fee610;
			border-radius: 40rpx;
			color: #333333;
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;
			margin-top: 50rpx;
		}

		.popup_title {
			color: #333333;
			font-weight: bold;
			font-size: 36rpx;
			text-align: center;
		}

		.popup_cont {
			padding-top: 30rpx;

			.flex {
				display: flex;
				align-items: center;
				font-size: $uni-font-size-sm-base;
				color: #9c9c9c;

				.icon {
					border: #fa5807 solid 6rpx;
					padding: 5rpx;
					border-radius: 50%;
				}

				.value {
					padding-left: 10rpx;
				}
			}
		}
	}
</style>
<template>
	<view>
		<u-popup :show="show" mode="center" @close="close" @open="open">
			<view class="popup">
				<view class="popup_title">今日曝光</view>
				<view class="popup_cont">
					<view class="flex">
						<view class="icon"></view>
						<view class="value">指今天宝贝被看到多少次</view>
					</view>
					<view class="flex">
						<view class="icon"></view>
						<view class="value">越多人看到，越容易卖出哦~</view>
					</view>
				</view>
				<view class="popup_btn">我知道啦</view>
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