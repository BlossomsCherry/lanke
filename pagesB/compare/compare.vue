<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body content">
		<view class="compare-top">
		  <view class="inner" style="background: linear-gradient(-120deg, #3E445A, #31374A, #2B3042, #262B3C);">
		    <view class="left">
		      <view class="title" style="color: #F1C68E;margin-top: -20rpx;">
		        <text class="title-text">授权用户</text>
		      </view>
		      <view class='desc'>尊享《运营功能套餐包》所有功能</view>
		    </view>
		    <view class="right">
		      <view class="price">
		        <text class="text">900￥/终身</text>
		      </view>
		    </view>
		    
		  </view>
		</view>
		
		<view class="tip">* 你的团队中达到lv3等级的有8人，也可以免费解锁
			<navigator url="/pagesA/mine/invite/invite" style="display: inline-block; color: blue;">点击查看</navigator>
		</view>

		<view class="compare-mid" style="border-radius: 10rpx;overflow: hidden;margin: 50rpx 30rpx 30rpx 30rpx;">
		    <view class="row" style="background-color: #E9DCD5;">
				<view class="ceil left">
					<view class="text">
					  功能列表
					</view>
					<view class="desc">
					  
					</view>
				</view>
				<view class="ceil mid">
					<view class="text">
					  普通用户
					</view>
					<view class="desc">
					  免费开源
					</view>
				</view>
				<view class="ceil right">
					<view class="text">
					  授权用户
					</view>
					<view class="desc">
					  《运营功能包》
					</view>
				</view>
			</view>
			
			
			<view class="row" v-for="(item, index) in list" :key="index">
				<view class="ceil left">
					<view class="name">
						{{ item.name }}
					</view>
				</view>
				<view class="ceil mid">
					<i class="mini-icon mini-anonymous-iconfont-green" v-if="item.normal"></i>
					<i class="mini-icon mini-shanchu2" v-else></i>
				</view>
				<view class="ceil right">
					<i class="mini-icon mini-anonymous-iconfont-green" v-if="item.vip"></i>
					<i class="mini-icon mini-shanchu2" v-else></i>
				</view>
			</view>
			
		</view>
		
		<view style="height: 6vh;"></view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	
	const common = require('@/mixins/common');
    var options = {};
  
   //预览图片
  common(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 30001,
				list: [
					{
						name: '图片安全检测',
						normal: false,
						vip: true
					},
					{
						name: '话题图片自动搜索',
						normal: false,
						vip: true
					},
					{
						name: '@用户',
						normal: false,
						vip: true
					},
					{
						name: '金币打赏',
						normal: false,
						vip: true
					},
					{
						name: '商品订单导出',
						normal: false,
						vip: true
					},
					{
						name: '马甲功能',
						normal: false,
						vip: true
					},
					{
						name: '圈子置顶',
						normal: false,
						vip: true
					},
					{
						name: '用户主页置顶',
						normal: false,
						vip: true
					},
					{
						name: '前端转移圈子',
						normal: false,
						vip: true
					},
					{
						name: '图片不适',
						normal: false,
						vip: true
					},
					{
						name: '余额支付密码',
						normal: false,
						vip: true
					},
					{
						name: '用户名片',
						normal: false,
						vip: true
					},
					{
						name: '用户注销账号',
						normal: false,
						vip: true
					},
					{
						name: '首页基础推流',
						normal: false,
						vip: true
					},
					{
						name: '管理悬浮球',
						normal: false,
						vip: true
					},
					{
						name: 'App引导图',
						normal: false,
						vip: true
					},
					{
						name: '图片人工检测页面',
						normal: false,
						vip: true
					},
					{
						name: 'H5浏览跳转',
						normal: false,
						vip: true
					},
					{
						name: '投票贴',
						normal: false,
						vip: true
					},
					{
						name: '签到与任务',
						normal: false,
						vip: true
					}
				]
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
		},
		onShow: function () {
			let that = this;
			that.updateScene(30001, 0);
		},
		onShareAppMessage: function(res) {
			return {
				title: that.$store.state.config.share.format.app_share_right,
				path: '/pages/tabbar/index/index?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config.img.default_share
			};
		},
		
		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.$store.state.config.share.format.app_share_right,
				query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config.img.default_share
			};
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.content{
	.tip{
		margin: 16px;
		font-weight: 100; font-size: 14px;
		@include color(color-lighter-dark);
	}
	.compare-top{
		margin: 16px;
		.inner{
			display: flex;
			width: 100%;
			height: 82px;
			border-radius: 8px;
			position: relative;
			z-index: 1;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			.left{
				margin-left: 16px;
				box-sizing: border-box;
				.title{
					display: flex;
					align-items: center;
					.title-text{
						font-size: 19px;
					}
				}
				.desc{
					color: #FFFFFF !important;
					font-size: 13px;
					box-sizing: border-box;
				}
			}
			.right{
				box-sizing: border-box;
				.price{
					position: relative;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					line-height: 1;
					text-align: center;
					text-decoration: none;
					overflow: visible;
					border-radius: 6px;
					margin: 0;
					padding: 5px 0px;
					font-size: 15px;
					height: 35px;
					width: 143px;
					color: rgb(241, 198, 142);
					background-color: rgba(241, 198, 142, 0);
					.text{
						font-weight: bold;
						font-size: 19px;
					}
				}
			}
		}
	}
	.compare-mid{
		@include background_color(page-box-background-color);
		box-shadow: 0px 0px 27px 0px rgba(0, 0, 0, 0.07);
		.row{
			box-sizing: border-box;
			display: flex;
			text-align: center;
			padding: 13px 10px;
			justify-content: space-between;
			.ceil{
				box-sizing: border-box;
				flex: 1;
			}
			.name{
				font-size: 15px;
			}
			.text{
				font-weight: bold;
				font-size: 17px;
				box-sizing: border-box;
			}
			.mini-anonymous-iconfont-green{
				font-size: 14px;
				font-weight: 100;
			}
			.desc{
				color: #838383;
				font-size: 13px;
				box-sizing: border-box;
			}
		}
	}
}
</style>
