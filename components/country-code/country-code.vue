<template>
	<view class="country-code">
		<view class="search-input-wrap">
			<view class="search-input-view">
				<!-- <image class="search-text-icon" src="../../static/search.png"></image> -->
				<input class="search-input" v-model="countryZone" placeholder="请输入区号或者国家"/>
				<!-- <image v-if="filterName.length > 0" class="close-text-icon" src="../../static/close-circle.png" @tap="clearInput()"></image> -->
			</view>
		</view>
		<scroll-view :scroll-y="true" style="height: 600rpx;" class="_scroll_view">
			<view class="contract-list">
				<view class="table-tr" v-for="(item, index) in countryItem" :key="index" v-if="countryItem.length > 0">
					<text class="list-showName" style="white-space:nowrap;" @tap="gobackToRegister(item.zone)">{{item.en}}</text>
					<text class="list-showName" style="word-wrap:break-word;word-break:normal;" @tap="gobackToRegister(item.zone)">{{item.cn}}</text>
					<text class="flex-view" @tap="gobackToRegister(item.zone)">+{{item.zone}}</text>
				</view>
				<view class="table-tr" v-if="countryItem.length <= 0">
					<text class="list-showName">空空如也</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	let countryItemList = [];
	export default {
		name:"country-code",
		computed:{

		},
		data() {
			return {
				//搜索内容
				filterName: '',
				//国际区号
				countryItem: [],
				//区号
				countryZone: '',
				pageType: '',
			};
		},
		mounted() {
			let that = this;
			that.iddselect();
		},
		methods: {
			iddselect(){
				let that = this;
				if(countryItemList && countryItemList.length > 0){
					if(that.countryItem && that.countryItem.length > 0){
						return false;
					}else{
						that.countryItem = countryItemList;
						return false;
					}
				}
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/idd', ).then(function(res) {
					uni.loading(false);
					if (res.status) {
						countryItemList = res.data;
						that.countryItem = res.data;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			clearInput() {
				this.countryZone = '';
			},
			gobackToRegister(zone) {
				var that = this;
				that.$emit('change', zone);
			},
			renderCountryData() {
				let that = this;
				var newData = [];
				var array = countryItemList;
				if (this.filterName && this.filterName.length > 0) {
					for(var i = 0; i < array.length; i++) {
						var zone = array[i].zone;
						var chinese = array[i].cn;
						var english = array[i].en;
						if ((english && (english.toUpperCase().startsWith(this.filterName.toUpperCase()) || english.toUpperCase().indexOf(this.filterName.toUpperCase()) > 0))
							|| (zone && (zone.startsWith(this.filterName) || zone.indexOf(this.filterName) > 0)) 
							|| (chinese && (chinese.startsWith(this.filterName) || chinese.indexOf(this.filterName) > 0))) {
							var index = newData.length;
							newData[index] = {};
							newData[index].zone = array[i].zone;
							newData[index].cn = array[i].cn;
							newData[index].en = array[i].en;
						}
					}
				} else {
					newData = array;
				}
				this.countryItem = newData;
			},
		},
		watch: {
			countryZone(newValue, oldValue) {
				this.filterName = newValue.toUpperCase();
				this.renderCountryData();
			}
		}
	}
</script>

<style lang="scss">
	.country-code{
		.search-input-wrap {
			position: fixed;
			height: 60rpx;
			width: 700rpx;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid;
			padding-top: 10rpx;
			@include border_color(border-color-light-line-background-color);
			z-index: 99;
			@include background_color(page-box-item-background-color);
		}
		.search-input-view {
			padding: 5rpx 10rpx;
			display: flex;
			@include color(color-light-dark);
			@include background_color(page-light-line-background-color);
			border-radius: 40rpx;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			box-sizing: border-box;
		}
		
		.contract-list {
			margin: 96rpx 0 0;
			display: inline-block;
			height: 600rpx;
			width: 100%;
		}
		
		.table-tr {
			border-bottom: 1rpx solid;
			@include border_color(border-color-light-line-background-color);
			display: flex;
			font-size: $uni-font-size-sm;
			padding: 20rpx;
		}
		
		.list-showName {
			@include color(color-light-dark);
			margin-right: 20rpx;
		}
		
		.search-input {
			flex: 1;
			font-size: $uni-font-size-base;
			margin-top: 4rpx;
			text-indent: 20rpx;
		}
		
		.search-text-icon {
			width: 30rpx;
			height: 30rpx;
			@include color(color-light-dark);
			padding-left: 30rpx;
			padding-top: 8rpx;
		}
		.close-text-icon {
			width: 30rpx;
			height: 30rpx;
			@include color(color-light-dark);
			padding-top: 8rpx;
			padding-right: 30rpx;
		}
		
		.star-text-icon {
			font-family: iconfont;
			width: 40rpx;
			@include color(color-light-dark);
			font-size: 38rpx;
		}
		
		.star-text-icon.fill {
			@include color(color-light-dark);
		}
		
		.flex-view {
			flex: 1;
			text-align: right;
		}
	}
</style>
