<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="false" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#141417' : '#fafafa'" :scene="86">
			<view class="search-form" slot="center">
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
					<input placeholder="输入关键词" v-model="paras.search" class="_input" @confirm="getShopGoodsSearch(1)"/>
				</view>
			</view>
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo">
				<view @tap.stop.prevent="getShopGoodsSearch(1)" class="search_button">搜索</view>
			</view>
			<!-- #endif -->
		</navBar>
		<u-sticky :offsetTop="0">
			<view class="head">
				<view class="inner">
					<view class="item" :class="{ current: filterIndex === 0 }" @tap="tab_click(0)">
						<view class="_text">
							综合
						</view>
					</view>
					<view class="item" :class="{ current: filterIndex === 1 }" @tap="tab_click(1)">
						<view class="_text">
							销量
						</view>
					</view>
					<view class="item" :class="{ current: filterIndex === 2 }" @tap="tab_click(2)">
						
						<view class="_text">
							上新
						</view>
					</view>
					<view class="item" :class="{ current: filterIndex === 3 }" @tap="tab_click(3)">
						<view class="_text">
							价格
						</view>
						<view class="box">
							<i :class="{ active: paras.order === 'asc' && filterIndex === 3 }" class="mini-icon mini-xiangshang"></i>
							<i :class="{ active: paras.order === 'desc' && filterIndex === 3 }" class="mini-icon mini-xiangshang-copy"></i>
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
		</u-sticky>
		
		
		<!-- 主体 -->
		<block v-if="goodsWaterData.data.length <= 0">
			<block v-if="paras.search && paras.search.length > 0">
				<u-empty :text="'没找到与“'+ paras.search +'”相关的商品'" width="300" height="300" text-size="28" />
			</block>
			<block v-else>
				<u-empty text="空空如也" width="300" height="300" text-size="28" />
			</block>
			
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

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lWaterFlow from '@/linui/water-flow/index';

const common = require('@/mixins/common');
const shop = require('@/mixins/shop');
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

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 86,
			filterIndex: 0,
			paras: {
				classify: {
					id: 0,
					name: ''
				},
				search: '',
				orderBy: 'sort',
				order: 'desc',
				minPrice: 0,
				maxPrice: 9999999999,
				credit_type: '0,1'
			},
			goodsWaterData: {
				e: 0,
				data: []
			},
			page: 1,
			loadmoreShow: false,
			isLastPage: false,
			filterShow: false,
			cats: []
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(86, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(options.search){
			that.paras.search = options.search;
		}
		if(options.cid){
			that.paras.classify = {
				id: options.cid,
				name: options.cname || '~'
			}
		}
		
		if(options.coin == 1){
			that.paras.credit_type = '0';
		}
		
		if(options.balance == 1){
			that.paras.credit_type = '1';
		}
		
		that.getShopGoodsSearch(1);
		that.getShopClassify();
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
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: that.$store.state.config.share.format.app_share_right,
			path: '/pagesA/shop/list/list?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.$store.state.config.share.format.app_share_right,
			query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	methods: {
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
				keyword: that.paras.search,
				page: that.page,
				orderBy: that.paras.orderBy,
				classify: that.paras.classify.id,
				order: that.paras.order,
				minPrice: that.paras.minPrice,
				maxPrice: that.paras.maxPrice,
				credit_type: that.paras.credit_type
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
.search-form{
	line-height: 68rpx;
	height: 68rpx;
	width: 100%;
	display: flex;
	border: 1px solid $uni-color-primary;
	@include background_color(page-box-background-color);
	border-radius: 500px;
	box-sizing: border-box;
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
.search_button{
		@include color(color-light-dark);
		font-size: $uni-font-size-base;
		white-space: nowrap;
	}
.head{
	@include background_color(page-body-background-color);
	.inner{
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		font-size: $uni-font-size-base;
		.item{
			display: flex;
			._text{
				height: 80rpx;
				line-height: 80rpx;
				@include color(color-lighter-er-dark);
			}
			.box{
				height: 80rpx;
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
				.mini-icon.active{
					@include color(color-primary);
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
				@include color(color-primary);
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