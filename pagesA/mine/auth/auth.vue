<template>
	<view class="container">
		<view class="box" :class="'box_'+item.theme" v-for="(item, index) in authList" :key="index">
			<view class="box_top">
				<view class="box_top_text">
					<view class="box_top_text_title">{{item.title}}</view>
					<view class="box_top_text_content">{{item.content}}</view>
				</view>
				<view class="box_top_img">
					<image :src="item.img"></image>
				</view>
			</view>
			<view class="box_body">
				<view class="box_body_item" v-for="(citem, cindex) in item.data" :key="cindex">
					<view class="box_body_item_icon"><i class="mini-icon2 mini-wodedingdan"></i></view>
					<view class="box_body_item_text">
						<view class="box_body_item_text_title">
							{{citem.title}}
						</view>
						<view class="box_body_item_text_content">
							{{citem.content}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
			authList: [
				{
					theme: 'orange',
					img: '/static/image/auth_icon1.png',
					title: '个人认证',
					content: '适合优质创作者、从业者、公众人物',
					data: [
						{
							icon: '',
							title: '个人认证',
							content: '适合个人创作者、行业专家、自媒体领域',
						}
					]
					
				},
				{
					theme: 'blue',
					img: '/static/image/auth_icon2.png',
					title: '组织认证',
					content: '适合企业、个体工商户申请',
					data: [
						{
							icon: '',
							title: '企业认证',
							content: '适合个人创作者、行业专家、自媒体领域',
						},
						{
							icon: '',
							title: '机构认证',
							content: '适合国家机构、媒体、高校等机构申请',
						}
					]
					
				},
				{
					theme: 'pink',
					img: '/static/image/auth_icon3.png',
					title: '抖音影响力认证',
					content: '在带货、探店等场景表现优秀的个人或机构',
					data: [
						{
							icon: '',
							title: '电商优质作者认证',
							content: '适合电商场景下表现优秀的带货达人申请',
						}
					]
					
				}
			]
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {

	}
}
</script>

<style lang="scss">
page{
	width: 100%;
	height: 100%;
}
.container{
	padding: 30rpx;
	background-color: #fff;
	.box{
		margin-bottom: 30rpx;
		padding: 15rpx;
		border-radius: 15rpx;
		.box_top{
			margin-bottom: 25rpx;
			padding: 15rpx;
			display: flex;
			align-items: center;
			.box_top_text{
				flex: 1;
				overflow: hidden;
				.box_top_text_title{
					margin-bottom: 18rpx;
					font-size: 36rpx;
					color: #ff8f06;
					font-weight: bold;
					line-height: 1;
				}
				.box_top_text_content{
					font-size: 20rpx;
					color: #c2b5ac;
					line-height: 1;
				}
			}
			.box_top_img{
				image{
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
		.box_body{
			.box_body_item{
				margin-bottom: 10rpx;
				padding: 25rpx;
				display: flex;
				align-items: center;
				overflow: hidden;
				background-color: #fff;
				border-radius: 10rpx;
				&:last-child{
					margin-bottom: 0;
				}
				.box_body_item_icon{
					color: #1d1d1f;
					margin-right: 25rpx;
				}
				.box_body_item_text{
					flex: 1;
					overflow: hidden;
					.box_body_item_text_title{
						font-size: $uni-font-size-medium;
						color: #181818;
						margin-bottom: 5rpx;
					}
					.box_body_item_text_content{
						font-size: $uni-font-size-sm;
						color: #787878;
					}
				}
			}
		}
		
		&.box_orange{
			background-color: #fff3dd;
		}
		&.box_blue{
			background-color: #e7f3ff;
			.box_top{
				.box_top_text{
					.box_top_text_title{
						color: #007de9;
					}
				}
			}
		}
		&.box_pink{
			background-color: #fff3f7;
			.box_top{
				.box_top_text{
					.box_top_text_title{
						color: #ff3c72;
					}
				}
			}
			.box_top_img{
				image{
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
		
	}
}
</style>