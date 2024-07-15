<template>
	<view>
		<!-- 头 -->
		<view class="top">
			<view class="topIcon" @click="gotoback">
				<u-icon name="arrow-left" color="#fff"  size="34"></u-icon>
			</view>
			<view class="topTitle">答题</view>
			<view class="topright"> </view>
		</view>
		
		<!-- 图片 -->
		<view class="topomg">
			<!-- <image src="@/pagesA/static/top.png" mode=""></image> -->
		</view>
		<!-- 表单 -->
		<view class="attestationinfo">
			<view class="attTitle">
				<view class="attName">朵朵寄语：</view>
			</view> 
			<view class="attList">
				<view class="attLi">为了维护校友圈的良好氛围，控制帖子与评论质量，你需要了解足够的与<text>南开大学</text>相关的信息与社区礼仪，并通过以下答题测试，才能解锁全部功能的权限哦~加油!</view>
			</view>
			<u-gap height="30" bgColor="#f7f7f7"></u-gap>
			<view class="attTitle">
				<view class="attName">规则与奖励:</view>
			</view>
			<view class="attList">
				<view class="attLi">1.题目共20题，涉及 <text>南开大学</text> 相关知识与社区礼仪:2.每题限时30秒钟，答对18道及以上可获取全部权限，包括图文评论、极速发帖等高级权限:</view>
			</view>
		</view>
		<!-- 下一步 -->
		<view class="nextBut" @tap="toSliderUrl(6, '/pagesA/attestation/testpaper')">
			开始答题
		</view>
		<!-- 学校列表 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
				bgColor:"#ec7a77",
			}
		},
		methods: {
			gotoback(){
				uni.navigateBack(1)
			},
		}
	}
</script>

<style scoped lang="scss">
	page{
		background: #f7f7f7;
	}
	.top{
		height: 45px;
		line-height: 45px;
		display: flex;
		justify-content: space-between;
		background: #ec7a77;
	}
	.topTitle{
		font-weight: bold;
		color: #fff;
	}
	.topIcon{
		    display: flex;
		    padding-left: 15px;
	}
	.u-icon{
		display: flex;
	}
	.flex{
		display: flex;
	}
	.topomg{
		width: 750rpx;
		height: 240rpx;
	}
	.topomg image{
		width: 100%;
		height: 100%;
	}
	.contentbox,.attestationinfo{
		padding: 30rpx;
	}
	.titletext,.attName{
		font-weight: bold;
		font-size: $uni-font-size-lg-er;
	}
	.attName{
		position: relative;
		z-index: 2;
	}
	.attName::before{
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 20rpx;
	bottom: 0;
	background: #C9D3EB;
	z-index: -1;
	}
	.titletip,.typeIllustrate{
		 color: #777;
		 font-size:26rpx;
	}
	.typeIllustrate{
		padding-top: 10rpx;
	}
	.typeBox{
		background: #fff;
		padding:38rpx 36rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}
	.typeName,.attTitle{
		display: flex;
	}
	.typeIcon,.attIcon{
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
		background: #5D81D0;
	}
	.typeTitle{
		font-weight: bold;
		line-height: 50rpx;
		padding-left: 15rpx;
	}
	.titleBox{
		margin-top: 40rpx;
	}
	.remind{
		font-size: $uni-font-size-sm;
		    text-align: right;
		    line-height: 50rpx;
		    color: #FA5051;
	}
	.remind text{
		color: #576B94;
	}
	.attName{
		line-height: 50rpx;
		padding-left: 10rpx;
	}
	.attList{
		padding-left: 10rpx;
	}
	.attLi{
		color: #777;
		font-size: $uni-font-size-sm-base;
		padding-top: 22rpx;
	}
	.attLi text{
		 color: #FA5051;
	}
	.attestationinfo{
		padding-bottom: 250rpx;
	}
	.nextBut{
		background: #657FCA;
		width: 688rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: $uni-font-size-lg;
		font-weight: bold;
		color: #fff;
		border-radius: 100rpx;
		position: fixed;
		bottom: 50rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9999;
	}
</style>