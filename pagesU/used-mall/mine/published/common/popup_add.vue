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
			font-size: 36rpx;
			text-align: center;
		}

		.popup_cont {
			padding-top: 30rpx;
			max-height: 800rpx;
			overflow-y: scroll;

			.list_box {
				display: flex;
				flex-direction: column;
				margin-bottom: 20rpx;

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
						min-width: 490rpx;
						width: 490rpx;
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
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
					}
				}
			}
		}
	}

	.popup_tabs {
		display: flex;
		padding-bottom: 20rpx;
		justify-content: space-between;
		align-items: center;

		.search {
			background: #f6f6f6;
			border-radius: 30rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 22rpx;
			padding: 0 10rpx;
			color: #9c9c9c;

			>i {
				color: #9c9c9c;
			}
		}
	}

	.popup_head {
		background: #fcf9f0;
		border-radius: 30rpx;

		.popup_num {
			background: #ff8c2d;
			border-radius: 30rpx;
			padding: 30rpx;
			color: #fff;

			.value {
				font-size: 50rpx;
				font-weight: bold;
			}

			.popup_num--tip {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 22rpx;
				padding-top: 20rpx;
			}
		}

		.popup_task {
			padding: 30rpx;

			.popup_task_head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.title {
					font-size: $uni-font-size-medium;
					font-weight: bold;
					color: #ff8c2d;
				}

				.dayAdd {
					color: #9c9c9c;
					font-size: $uni-font-size-sm-base;
					display: flex;
					align-items: center;
				}
			}

			.popup_task_list {
				padding-top: 20rpx;

				.box {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: $uni-font-size-sm-base;
					margin-bottom: 10rpx;

					.title {
						color: #333;
						display: flex;
						align-items: center;

						.num {
							background: #fff;
							border-radius: 20rpx;
							padding: 5rpx 10rpx;
							color: #ff8c2d;
							font-size: 20rpx;
							font-weight: bold;
						}
					}
				}
			}
		}
	}

	.btn {
		color: #fff;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		background: #ff8c2d;
	}
</style>
<template>
	<view>
		<u-popup :show="show" mode="bottom" @close="close" @open="open">
			<view class="popup">
				<view class="popup_title">闲鱼币加曝光</view>
				<view class="popup_cont">
					<view class="popup_head">
						<view class="popup_num">
							<view class="value">1272</view>
							<view class="popup_num--tip">
								<view>我的闲鱼币</view>
								<view class="popup_num--tip">查看明细<u-icon name="arrow-right" size="20" color="#fff"></u-icon></view>
							</view>
						</view>
						<view class="popup_task">
							<view class="popup_task_head">
								<view class="title">我的闲鱼币</view>
								<view class="dayAdd">每日可赚100+闲鱼币<u-icon name="arrow-right" size="20" color="#9c9c9c"></u-icon></view>
							</view>
							<view class="popup_task_list">
								<block v-for="item in 3">
									<view class="box">
										<view class="title">
											去闲鱼币频道签到
											<view class="num">+50</view>
										</view>
										<view class="btn">去完成</view>
									</view>
								</block>
							</view>
						</view>
					</view>
					<view class="popup_tabs">
						<u-tabs :list="list1" @click="click" lineColor="#f1ed18"
							:activeStyle="{'color':'#333333','font-weight':'bold'}" lineWidth="40" :scrollable="false"></u-tabs>
						<view class="search">
							<i class="mini-icon mini-sousuo1"></i>
							宝贝不能加曝光？
						</view>
					</view>
					<block v-for="item in 10">
						<view class="list_box">
							<view class="list_box_cont">
								<image class="image" src="https://so.360tres.com/dmsmty/160_160_100/t012626e9fc25ae7a57.webp"
									mode="aspectFill"></image>
								<view class="cont">
									<view class="title">
										非常粘人的大布偶猫一只，公，坐标都昌坐标都昌坐标都昌
									</view>
									<view class="pirce"><text>￥</text>100.00</view>
									<view class="tip">
										曝光1.5万 · 浏览781 · 想要28
										<view class="btn">加曝光</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				list1: [{
					name: '可加曝光',
				}, {
					name: '已加曝光',
				}]
			}
		},
		onLoad() {

		},
		methods: {
			click(val) {

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