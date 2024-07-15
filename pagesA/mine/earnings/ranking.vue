<!-- 薪资排行 -->
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :iconTheme="iconTheme" :background="'rgba(255, 255, 255, ' + navbarTrans + ')'"
			:color="'rgba(' + color + ', ' + navbarTrans + ')'" title="余额排行榜" :home="fph">
		</navBar>
		<view class="contaier" style="@include background_color(page-box-background-color);position: absolute; top: 0;">
			<view class="top_bg" :style="background">
				<view class="one_box">
					<!-- 第二名 -->
					<view class="top3">
						<view class="num_two" @tap="toSliderUrl(4, two.id)">
							<image class="huangguan2" src="@/pagesA/static/rank/two.png"></image>
							<image class="top3_head" :src="two.user_avatar"></image>
							<!-- <view class="top_name">{{twoName}}</view> -->
							<view class="top_name">{{ two.user_name }}</view>
							<view class="top_sy">{{ two.sum_price }}</view>
						</view>
					</view>

					<!-- 第一名 -->
					<view class="top3">
						<view class="num_one" @tap.stop.prevent="toSliderUrl(4, one.id)">
							<image class="huangguan1" src="@/pagesA/static/rank/one.png"></image>
							<image class="top3_head" :src="one.user_avatar"></image>
							<!-- <view class="top_name" style="font-size: 30rpx;">{{oneName}}</view> -->
							<view class="top_name text-bold" style="font-size: 30rpx;">{{ one.user_name }}</view>
							<view class="top_sy">{{ one.sum_price }}</view>
						</view>
					</view>

					<!-- 第三名 -->
					<view class="top3">
						<view class="num_three" @tap.stop.prevent="toSliderUrl(4, three.id)">
							<image class="huangguan2" src="@/pagesA/static/rank/three.png"></image>
							<image class="top3_head" :src="three.user_avatar"></image>
							<view class="top_name">{{ three.user_name }}</view>
							<view class="top_sy">{{ three.sum_price }}</view>
						</view>
					</view>
				</view>
				<view class="number_sy_box">
					<view class="number_sy_box_title">
						<text class="_text">统计</text>
						<text class="_text" style="position: absolute; right: 20rpx;z-index: 9999; font-size: 24rpx;color: #c3c3c3;">
							截止：{{nowTime}}
						</text>
					</view>
					<view class="number_sy_main">
						<view style="width: 50%; text-align: center; border-right: 1px solid #eee;">
							<view class="number_num1">{{ statistics.avg }}</view>
							<view class="danwei">平均余额</view>
						</view>
						<view style="width: 50%; text-align: center; z-index: 9999;">
							<view class="number_num2">{{ statistics.total }}</view>
							<view class="danwei">总人数</view>
						</view>

						<image mode="widthFix" class="xiaoding_bg" src="@/pagesA/static/rank/Intersect.png"></image>
					</view>
				</view>
			</view>

			<view class="rankList_box">
				<view class="rankItem" v-for="(user,index) in rankList" :key="index">
					<view class="rankIndex">
						<text class="_text">{{ index + 4 }}</text>
					</view>
					<view class="HeardBox">
						<image class="rankHeard" :src="user.user_avatar"></image>
					</view>

					<view class="NameBox" @tap="toSliderUrl(4, user.id)">
						<view class="userName text-bold">{{user.user_name}}</view>
						<view class="userPost text-gray"></view>
						<view class="color_ccc">总：<text class="text-blue">{{user.sum_price}}</text> ｜ 已提现：<text class="text-blue">{{user.withdrawal_price}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	 //预览图片
	
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
				navbarTrans: 0,
				color: '0,0,0',
				iconTheme: 'white',
				nowTime: '',
				one: {
						"user_avatar": "",
						"user_name": "未知",
						"id": 0,
						"sum_price": "0.00",
						"withdrawal_price": "0.00",
						"is_member": 0,
						"is_official": 0,
						"is_authentication": 0,
						"gender": 0
					},
				two: {
						"user_avatar": "",
						"user_name": "未知",
						"id": 0,
						"sum_price": "0.00",
						"withdrawal_price": "0.00",
						"is_member": 0,
						"is_official": 0,
						"is_authentication": 0,
						"gender": 0
					},
				three: {
						"user_avatar": "",
						"user_name": "未知",
						"id": 0,
						"sum_price": "0.00",
						"withdrawal_price": "0.00",
						"is_member": 0,
						"is_official": 0,
						"is_authentication": 0,
						"gender": 0
					},
				rankList: [
					{
						"user_avatar": "",
						"user_name": "未知",
						"id": 0,
						"sum_price": "0.00",
						"withdrawal_price": "0.00",
						"is_member": 0,
						"is_official": 0,
						"is_authentication": 0,
						"gender": 0
					}
				],
				statistics:{
					avg: '0.00',
					total: '0'
				},
				background: {
					backgroundImage: '',
					backgroundRepeat: 'no-repeat',
					backgroundColor: '#fffff',
				}
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.getTime();
			that.getRankData();
		},
		onPageScroll: function onPageScroll(e) {
			let that = this;
			var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;
			
			if(trans > 1 && that.navbarTrans > 1){
				return false;
			}
			
			var frontColor = '#ffffff';
			var backgroundColor = '#000000';
			var iconTheme = that.iconTheme;
			// var iconLeft = that.iconLeft;
			// var iconRight = that.iconRight;
		
			if (trans <= 0) {
				frontColor = '#ffffff';
				backgroundColor = '#000000';
				iconTheme = 'white';
				// iconLeft = '/static/image/notification.png';
				// iconRight = '/static/image/slim_share_w.png';
			} else if (trans >= 0.4) {
				frontColor = '#000000';
				backgroundColor = '#ffffff';  
				iconTheme = 'black';
			}
		
			that.setData({
				navbarTrans: trans,
				iconTheme: iconTheme,
				// iconLeft: iconLeft,
				// iconRight: iconRight
			});
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getRankData(){
				let that = this;
				uni.loading(true);
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/earnings/rank', {
					
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							rankList: res.data.others,
							one: res.data.one,
							two: res.data.two,
							three: res.data.three,
							statistics: {
								avg: res.data.avg,
								total: res.data.total
							},
							'background.backgroundImage': 'url('+ res.data.bg + ')'
						});
						
					}else{

						uni.showToast({
							title: res.message,
							icon:'error'
						});
					}
				});
			},
			getTime: function() {

				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '-' + month + '-' + day + ' ' + hour + ':00';
				this.nowTime = timer
				console.log(this.nowTime);
			},
		},
		filters: {

		}
	}
</script>

<style lang="scss" scoped>
	.top_bg {
		width: 750rpx;
		height: 650rpx;
		background-size: 750rpx;
		position: relative;
	}

	.one_box {
		width: 750rpx;
		height: 260rpx;
		position: absolute;
		left: 0;
		bottom: 110rpx;
		display: flex;
		justify-content: space-around;
	}

	.one_box .top3 {
		width: 210rpx;
		height: 280rpx;
	}

	.top_name {
		width: 100%;
		height: 55rpx;
		line-height: 60rpx;
		color: #f2f2f2;
		font-size: $uni-font-size-sm-base;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.top_sy {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: $uni-font-size-sm;
		color: rgba(255, 255, 255, .7);
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.top_sy span {
		font-size: 20rpx !important;
	}

	.num_one {
		position: relative;
	}

	.huangguan1 {
		width: 60px;
		height: 60px;
		position: absolute;
		right: -10rpx;
		top: -18*2rpx;
	}

	.num_one .top3_head {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
		margin: 15rpx 0 0 30rpx;
		border: 4rpx solid #ffdd3c;
	}

	.num_two {
		position: relative;
	}

	.huangguan2 {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 15rpx;
	}

	.num_two .top3_head {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
		margin: 45rpx 0 0 45rpx;
		border: 4rpx solid #bcdcdf;
	}

	.num_three {
		position: relative;
	}

	.huangguan2 {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 15rpx;
	}

	.num_three .top3_head {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
		margin: 45rpx 0 0 45rpx;
		border: 4rpx solid #e29d85;
	}

	// 第二块
	.number_sy_box {
		height: 210rpx;
		@include background_color(page-box-background-color);
		position: absolute;
		left: 25rpx;
		right: 25rpx;
		border-radius: 20rpx;
		bottom: -115rpx;
		z-index: 999;
		padding: 22rpx;
		box-shadow: 3px 3px 15px 3px #cccccc
	}

	.number_sy_box_title {
		color: #888888;
		// font-weight: 500;
		font-size: $uni-font-size-base;
		display: flex;
		z-index: 9999;
		justify-content: space-between;
	}

	.number_sy_main {
		width: 100%;
		height: 124rpx;
		padding-top: 20rpx;
		line-height: 52rpx;
		// background: red;
		display: flex;
		justify-content: space-around;
		position: relative;
	}

	.xiaoding_bg {
		position: absolute;
		right: -22rpx;
		bottom: -30rpx;
		width: 180rpx;
	}

	.number_num1 {
		font-size: 40rpx;
		font-weight: 500;
		color: #2fc04f;
	}

	.number_num2 {
		font-size: 40rpx;
		font-weight: 500;
		color: #4bac7f;
	}

	.danwei {
		height: 60rpx;
		line-height: 60rpx;
		font-size: $uni-font-size-sm-base;
		color: #c9c9c9;
	}

	// 列表
	.rankList_box {
		width: 750rpx;
		min-height: 200rpx;
		margin-top: 130rpx;
	}

	.rankItem:last-child {
		border: none;
	}

	.rankItem {
		width: 700rpx;
		height: 140rpx;
		margin: 0px auto;
		border-bottom: 1px solid;
		@include border_color(border-color-box-item-background-color);
	}

	.rankIndex {
		width: 60rpx;
		height: 140rpx;
		line-height: 140rpx;
		text-align: center;
		color: #CCCCCC;
		font-size: 40rpx;
		float: left;
	}

	.HeardBox {
		width: 100rpx;
		height: 100rpx;
		margin: 20rpx;
		border-radius: 100%;
		overflow: hidden;
		float: left;
		margin-right: 25rpx;
		margin-left: 10rpx !important;
	}

	.HeardBox image {
		width: 100%;
		height: 100%;
	}

	.NameBox {
		width: 400rpx;
		height: 140rpx;
		float: left;
		padding-top: 10rpx;
		box-sizing: border-box;
	}

	.NameBox view {
		height: 50rpx;
		line-height: 70rpx;
		@include color(color-darkest);
	}

	.userName {
		min-width: 90rpx;
		font-size: $uni-font-size-medium;
		float: left;
		margin-right: 20rpx;
	}

	.download_box {
		width: 80rpx;
		height: 140rpx;
		// background-color: red;
		float: right;

	}

	.color_ccc {
	    @include color(color-lighter-dark);
	    font-size: 14px;
	}
	.text-blue {
	    color: #777777;
	}
	
</style>
