<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="bg-wrap" :style="'height: ' + header_bg_height + ';max-height: ' + header_bg_height ">
			<view class="bg-box"></view>
			<view class="gc-1" :style="'height: ' + CustomBar + 'px;'"></view>
			<view class="gc-2" :style="'top: ' + CustomBar + 'px;'"></view>
		</view>
		<navBar :back="false" :home="false" color="#ffffff" :background="navbarBgShow == 1 ? '#646464' : 'transparent'" :scene="86">
			<view slot="left" class="lxy-nav-bar__logo">
			  <i @tap.stop.prevent="toSliderUrl(-2, null)" class="mini-icon mini-zuojiantou"></i>
			</view>
			<view class="shop-wrap" slot="center">
				<view class="logo">
					<image class="_image" :src="shop.shop_logo"></image>
				</view>
				<view class="name-box">
					<view class="name">{{ shop.shop_name }}</view>
					<view class="desc">粉丝数：{{ filters.toFix(shop.follow_count) }}</view>
				</view>
				<block>
					<view class="follow" v-if="!shop.is_follow" @tap.stop.prevent="shopFollow(1)">关注</view>
					<view class="follow followed" v-else  @tap.stop.prevent="shopFollow(0)">已关注</view>
				</block>
			</view>
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo">
			  <!-- <i @tap.stop.prevent="userMore" class="mini-icon mini-diandiandain" style="font-size: 28rpx;"></i> -->
			</view>
			<!-- #endif -->
		</navBar>
		<u-sticky :offsetTop="0">
			<view :style=" navbarBgShow == 1 ? 'background-color: #646464;' : '' ">
				<view class="search-form">
					<view class="inner">
						<view class="left_icon"><i class="mini-icon mini-sousuo1"></i></view>
						<view class="center-range" v-if="(paras.classify && paras.classify.id > 0) || (paras.minPrice !== 0 || paras.maxPrice != 9999999999)">
							<view class="search_classify">
								<view class="classify_item" @tap.stop.prevent="remove_classify" v-if="paras.classify && paras.classify.id > 0">
									<text class="_text">类目:{{ paras.classify.name }}</text>
									<i class="mini-icon mini-shanchu2"></i>
								</view>
								<view class="classify_item" @tap.stop.prevent="remove_price_range" v-if="paras.minPrice !== 0 || paras.maxPrice != 9999999999">
									<text class="_text">价格:{{ paras.minPrice + '-' + paras.maxPrice }}</text>
									<i class="mini-icon mini-shanchu2"></i>
								</view>
							</view>
						</view>
						<view class="right_input" v-else>
							<input placeholder="搜索店内商品" v-model="paras.search" class="_input" @confirm="getShopGoodsSearch(1)"/>
						</view>
					</view>
				</view>
				<view class="head">
					<view class="inner">
						<view class="item" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/shop/credent?id=' + paras.shop_id)">
							<i class="mini-icon2 mini-anquanbaozhang-mian"></i>
							<view class="_text">
								保障
							</view>
						</view>
						<view class="item" :class="{ current: filterIndex === 0 }" @tap="tab_click(0)">
							<view class="_text">
								推荐
							</view>
						</view>
						<view class="item" :class="{ current: filterIndex === 1 }" @tap="tab_click(1)">
							<view class="_text">
								销量
							</view>
						</view>
						<view class="item" :class="{ current: filterIndex === 2 }" @tap="tab_click(2)">
							
							<view class="_text">
								新品
							</view>
						</view>
						<view class="item" :class="{ current: filterIndex === 3 }" @tap="tab_click(3)">
							<view class="_text">
								<view>价格</view>
								<view class="box">
									<i :class="{ active: paras.order === 'asc' && filterIndex === 3 }" class="mini-icon mini-xiangshang"></i>
									<i :class="{ active: paras.order === 'desc' && filterIndex === 3 }" class="mini-icon mini-xiangshang-copy"></i>
								</view>
							</view>
						</view>
						<view class="item" @tap="filterShowClose()">
							<view class="_text">
								筛选
							</view>
							<i class="mini-icon mini-xiajiantou"></i>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		
		
		<!-- 主体 -->
		<block v-if="goodsWaterData.data.length <= 0">
			<block v-if="paras.search && paras.search.length > 0">
				<u-empty :text="'没找到与“'+ paras.search +'”相关的商品'" width="300" height="300" text-size="28" />
			</block>
			<block v-else>
				<u-empty text="空空如也" width="300" height="300" text-size="28" />
			</block>

			<!-- <view class="goods-container">
			  <view class="goods-title">你可能喜欢</view>
			  <l-water-flow comName="goods" :waterData="goodsWaterData" :column-gap="8"/>
			  <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
			</view> -->
			
		</block>
		<block v-else>
			<l-water-flow comName="goods" :waterData="goodsWaterData" ref="goodswater" :column-gap="8" :scene="86"/>
			<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
		</block>
		<view style="height: 5vh;background-color: transparent;"></view>
		
		<u-popup :show="filterShow" mode="right" @close="filterShowClose">
			<view class="filter_wrap">
				<scroll-view class="pop_scroll">
					<view class="top_price">
						<text class="top_priceText">价格筛选</text>
					</view>
					<view class="input_box">
						<input class="input_boxInput" v-model="paras.minPrice" placeholder="最低价"></input>
						<text class="input_boxText">-</text>
						<input class="input_boxInput" v-model="paras.maxPrice" placeholder="最高价"></input>
					</view>
					<view class="allClass">
						<block v-if="cats && cats.length > 0">
							<view class="classtext">类目</view>
							<view class="class_box">
								<!-- 选中分类条件 -->
								<view @tap.stop.prevent="selectClassify(item)" v-for="(item, index) in cats" :key="index" :class="'class_tag ' + (paras.classify.id == item.id ? 'active' : '')">{{item.name}}</view>
							</view>
						</block>
						
					</view>
				</scroll-view>
				<view class="bottom_btn">
					<view class="reset bottom_btnView" @tap="onreset">重置</view>
					<view class="enter bottom_btnView" @tap="onenter">确定</view>
				</view>
			</view>
		</u-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lWaterFlow from '@/linui/water-flow/index';

const shop = require('@/mixins/shop');
const common = require('@/mixins/common');
var options = {};
common(options);
shop(options);

export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		lWaterFlow
	},
	computed:{
		config_about_logo:{
			get(){
				let that = this;
				return that.$store.state.config.about.logo;
			},
			set(v){}
		},
		header_bg_height: {
			get(){
				let that = this;
				return ' calc( ' + that.$store.state.CustomBar + 'px + 148rpx )';
			},
			set(v){}
		},
		CustomBar:{
			get(){
				let that = this;
				return that.$store.state.CustomBar;
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 88,
			filterIndex: 0,
			paras: {
				shop_id: 0,
				classify: {
					id: 0,
					name: ''
				},
				search: '',
				orderBy: 'created_at',
				order: 'desc',
				minPrice: 0,
				maxPrice: 9999999999,
			},
			goodsWaterData: {
				e: 0,
				data: []
			},
			page: 1,
			loadmoreShow: false,
			isLastPage: false,
			filterShow: false,
			cats: [],
			
			shop: {
				shopType: 1,
				shopClassifys: [],
				margin_least: 0,
				status: 0,
				status_tip: '',
				is_follow: false
			},
			navbarBgShow: 0
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(88, that.paras.shop_id);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(options.id && options.id > 0){
			that.paras.shop_id = options.id;
		}else{
			that.paras.shop_id = -1;
		}
		
		if(options.search){
			that.paras.search = options.search;
		}
		if(options.cid && options.cname){
			that.paras.classify = {
				id: options.cid,
				name: options.cname
			}
		}
		
		that.shopInfo();
		that.getShopGoodsSearch(1);
		that.getShopClassify(that.paras.shop_id);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onReachBottom: function() {
		let that = this;
		if(!that.isLastPage){
			that.setData({
				loadmoreShow: true,
				isLastPage: false,
				page: that.page + 1
			});
			that.getShopGoodsSearch(0);
		}
	},
	onPageScroll: function onPageScroll(e) {
		let that = this;
		if(e.scrollTop > 10){
			if(that.navbarBgShow == 1){
				
			}else{
				that.navbarBgShow = 1;
			}
		}else{
			that.navbarBgShow = 0;
		}
	},
	onShareAppMessage: function (res) {
	  let that = this;
	  let share_title = that.$store.state.config.share.format.app_share_shop;
	  if(!share_title){
		  share_title = '[shop_name] - 店铺';
	  }
	  share_title = share_title.replace('[shop_name]', that.shop.shop_name);
	  return {
	    title: share_title,
	    path: '/pagesA/shop/shop/shop?id=' + that.shop.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.shop.shop_logo
	  };
	},
	onShareTimeline: function (res) {
	  let that = this;
	  let share_title = that.$store.state.config.share.format.app_share_shop;
	  if(!share_title){
	  		  share_title = '[shop_name] - 店铺';
	  }
	  share_title = share_title.replace('[shop_name]', that.shop.shop_name);
	  return {
	    title: share_title,
	    query: 'id=' + that.shop.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.shop.shop_logo
	  };
	},
	methods: {
		shopFollow(status){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/follow', {
				shop_id: that.paras.shop_id,
				status: status,
			}, 'POST').then(function(res) {
				uni.loading(false);
				if (res.status) {
					if(that.shop.is_follow){
						that.shop.is_follow = false;
						that.shop.follow_count -= 1;
					}else{
						that.shop.is_follow = true;
						that.shop.follow_count += 1;
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		shopInfo(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/info', {shop_id: that.paras.shop_id }).then(function(res) {
				uni.stopPullDownRefresh();
				if(res.status){
					that.shop = res.data.shop;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		onreset(){
			let that = this;
			that.paras.classify = {id: 0,  name: ''};
			that.paras.minPrice = 0;
			that.paras.maxPrice = 9999999999;
		},
		onenter(){
			let that = this;
			that.filterShowClose();
			that.getShopGoodsSearch(1);
		},
		selectClassify(item){
			let that = this;
			if(that.paras.classify.id == item.id){
				that.paras.classify = {id: 0,  name: ''};
			}else{
				that.paras.classify = item;
			}
			
		},
		filterShowClose(){
			let that = this;
			that.filterShow = !that.filterShow;
		},
		tab_click(index){
			let that = this;
			if(that.filterIndex == index){
				if(index == 1){
					that.paras.orderBy = 'sort';
					that.filterIndex = 0;
				}else if(index == 2){
					that.paras.orderBy = 'sort';
					that.filterIndex = 0;
				}else if(index == 3){
					if(that.paras.order == 'desc'){
						that.paras.order = 'asc';
					}else{
						that.paras.order = 'desc';
					}
				}else{
					that.paras.orderBy = 'sort';
					that.filterIndex = 0;
				}
				that.getShopGoodsSearch(1);
			}else{
				that.filterIndex = index;
				if(index == 1){
					that.paras.orderBy = 'buys';
				}else if(index == 2){
					that.paras.orderBy = 'created_at';
				}else if(index == 3){
					that.paras.orderBy = 'price';
				}else{
					that.paras.orderBy = 'sort';
				}
				that.getShopGoodsSearch(1);
			}
		},
		remove_price_range(){
			let that = this;
			that.paras.minPrice = 0;
			that.paras.maxPrice = 9999999999;
			that.getShopGoodsSearch(1);
		},
		remove_classify(){
			let that = this;
			that.paras.classify = {id: 0, name: ''};
			that.getShopGoodsSearch(1);
		},
		getShopGoodsSearch(type) {
			let that = this;
			if(type == 1){
				uni.loading(true);
				that.setData({
					isLastPage: false,
					page: 1,
					loadmoreShow: false
				});
			}else{
				if(that.isLastPage){
					return false;
				}
				that.setData({
					loadmoreShow: true
				})
			}
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsSearch', {
				shop_id: that.paras.shop_id,
				keyword: that.paras.search,
				page: that.page,
				orderBy: that.paras.orderBy,
				classify: that.paras.classify.id,
				order: that.paras.order,
				minPrice: that.paras.minPrice,
				maxPrice: that.paras.maxPrice
			}).then(function(res) {
				
				if(res.data.current_page != that.page){
					return false;
				}
				
				let data = res.data;
				let args = {};

				if (data.data.length > 0) {
					args.goodsWaterData = {
						e: type,
						data: data.data
					}
					args.loadmoreShow = false;
				} else{
					if(type == 1){
						args.goodsWaterData = {
							e: type,
							data: []
						}
					}
					args.isLastPage = true;
					args.loadmoreShow = true;
				}
		
				args.page = data.current_page;
				that.setData(args);
				if(type == 1){
					uni.loading(false);
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>

$head-tab-height: 80rpx;

.bg-wrap{
	position: fixed;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-content: flex-start;
	flex-shrink: 0;
	width: 750rpx;
	top: 0px;
	left: 0px;
	overflow: hidden;
	.bg-box {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		height: 100%;
		width: 750rpx;
		margin-top: -4px;
		filter: blur(4px);
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}
	.gc-1 {
		position: absolute;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		top: 0px;
		left: 0px;
		width: 750rpx;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.gc-2 {
		position: absolute;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		left: 0px;
		width: 750rpx;
		height: 148rpx;
		background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
	}
}
.shop-wrap{
	width: 100%;
	display: flex;
	justify-content: left;
	.logo{
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-right: 20rpx;
		._image{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}
	}
	.name-box{
		display: flex;
		flex-direction: column;
		.name{
			font-size: $uni-font-size-medium;
			color: #ffffff;
		}
		.desc{
			font-size: 12px;
			@include color(color-lightest-dark);
		}
	}
	.follow{
		@include background_color(follow-background-color);
		@include color(color-follow-font);
		display: inline-flex;
		height: 44rpx;
		border-radius: 600rpx;
		line-height: 44rpx;
		font-size: $uni-font-size-sm;
		padding: 0 20rpx;
		margin-left: 20rpx;
	}
	.follow.followed{
		@include background_color(page-gray-background-color);
		color: #333333;
	}
}
.search-form{
	width: 100%;
	display: flex;
	justify-content: center;
	height: 68rpx;
	.inner{
		width: $page-content-body-width;
		line-height: 68rpx;
		height: 68rpx;
		display: flex;
		// border: 1px solid $uni-color-primary;
		border-radius: 500px;
		box-sizing: border-box;
		background-color: rgba(255, 255, 255, .8);
		.left_icon{
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-right: 20rpx;
			margin-left: 20rpx;
		}
		.center-range{
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: 85%;
			overflow: hidden;
			.search_classify{
				display: flex;
				.classify_item{
					font-size: $uni-font-size-sm;
					vertical-align: middle;
					position: relative;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					padding: 0px 16rpx;
					height: 50rpx;
					font-family: Helvetica Neue, Helvetica, sans-serif;
					white-space: nowrap;
					@include background_color(page-gray-background-color);
					border-radius: 999px;
					margin-right: 10rpx;
					._text{
						font-size: $uni-font-size-sm;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						max-width: 220rpx;
					}
					.mini-icon{
						font-size: 22rpx;
						margin-left: 10rpx;
					}
					._input{
						font-size: $uni-font-size-sm;
					}
				}
			}
		}
		
		.right_input{
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			._input{
				width: 95%;
				font-size: $uni-font-size-base;
			}
		}
	}
}
.head{
	.inner{
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: $head-tab-height;
		font-size: $uni-font-size-base;
		.item{
			display: flex;
			._text{
				height: 70rpx;
				line-height: 70rpx;
				color: #ffffff;
				display: flex;
			}
			.mini-anquanbaozhang-mian{
				margin-right: 4rpx;
				color: #58b238;
				font-size: $uni-font-size-base;
			}
			.box{
				display: flex;
				flex-direction: column;
				margin-left: 4rpx;
				transform: scale(0.6);
				justify-content: center;
				.mini-icon{
					font-size: $uni-font-size-sm;
					line-height: 24rpx;
					@include color(color-lightest-dark);
				}
			}
			.mini-xiajiantou{
				margin-left: 4rpx;
				font-size: $uni-font-size-sm;
				display: inline-flex;
				@include color(color-lightest-dark);
			}
		}
		.item.current{
			._text{
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				border-radius: 100rpx;
				height: 26px;
				padding: 0 20rpx;
				line-height: 26px;
			}
			.box{
				.mini-icon{
					font-size: $uni-font-size-sm;
					line-height: 24rpx;
					@include color(color-lightest-est-er-dark);
				}
				.mini-icon.active{
					@include color(color-always-white);
				}
			}
		}
	}
}
.filter_wrap{
	@include background_color(page-box-background-color);
	height: 100vh;
	width: 500rpx;
	.pop_scroll {
		/* #ifndef MP */
		height: calc(90% - 88rpx - env(safe-area-inset-bottom));
		margin-top: 88rpx;
		/* #endif */
		/* #ifdef MP */
		height: calc(90% - 150rpx - env(safe-area-inset-bottom));
		margin-top: 150rpx;
		/* #endif */
		.top_price {
			height: 60rpx;
			line-height: 60rpx;
			display: flex;
			padding: 0 30rpx;
			.top_priceText {
				flex: 1;
				text-align: left !important;
				font-size: $uni-font-size-base;
				font-weight: bold;
				@include color(color-light-dark);
			}
		}
			
		.input_box {
			padding: 0 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30rpx;
			.input_boxText {
				@include color(color-lightest-dark);
			}
				
			.input_boxInput {
				flex: 1;
				max-width: 45%;
				height: 100%;
				@include background_color(page-gray-background-color);
				border-radius: 40rpx;
				box-sizing: border-box;
				text-align: center;
				font-size: $uni-font-size-sm;
			}
		}

		.allClass{
			margin-top: 50rpx;
			padding: 0 30rpx;
			.classtext {
				font-size: $uni-font-size-base;
				font-weight: bold;
				@include color(color-light-dark);
			}
			.class_box {
				margin-top: 30rpx;
				overflow: hidden;
				.class_tag {
					margin-top: 10px;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 20rpx;
					font-size: $uni-font-size-sm-base;
					@include color(color-light-dark);
					border: 1rpx solid;
					@include border_color(border-color-lightest-dark);
					text-align: center;
					border-radius: 10rpx;
					float: left;
					margin-right: 20rpx;
				}
				.class_tag.active{
					@include border_color(border-color-primary);
					@include background_color(follow-background-color);
					@include color(color-follow-font);
				}
			}
		}
	}
	.bottom_btn {
			height: 10%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0px 30rpx env(safe-area-inset-bottom);
			margin: 20rpx 0;
			.bottom_btnView {
				max-width: 45%;
				min-width: 45%;
				height: 72rpx;
				line-height: 72rpx;
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				text-align: center;
				border-radius: 36rpx;
			}
				
			.reset {
				background-color: #fff;
				color: $uni-color-primary;
				border: 1rpx solid $uni-color-primary;
			}
		}
}
</style>