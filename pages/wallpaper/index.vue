<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body wallpaper-wrap">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<!-- #ifndef MP -->
			<view @tap.stop.prevent="toSliderUrl(6, '/pages/wallpaper/collected')" slot="right" class="lxy-nav-bar__logo default">
				<view class="_text">我的</view>
			</view>
			<!-- #endif -->
		</navBar>
		<view class="grid">
			<block v-if="lists.length > 0">
				<view class="item" v-for="(item, index) in lists" :key="index">
					<view class="panel" @click="goDetail(item)">
						<image class="card-img" :src="item.firstImg" mode="aspectFit"></image>
						<text class="card-num-view">{{item.imgNum}}P</text>
						<view class="card-bottm row">
							<view class="car-title-view row">
								<text class="card-title">{{item.title}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>

			<block v-if="lists.length <= 0">
				<u-empty :title="`还没有${config2_page_wallpapers_name}`" width="300" height="300" text-size="28" />
			</block>
		</view>
		<view class="add-wrap" @tap.stop.prevent="toSliderUrl(6, '/pages/wallpaper/creat')">
			<i class="mini-icon mini-jia"></i>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
	
	 //预览图片
	export default {
		components: {
			myToast,navBar,hoverBall,lsSkeleton
		},
		computed:{
			config2_page_wallpapers_name:{
				get(){
					let that = this;
					if(that.$store.state.config2.page.wallpapers && that.$store.state.config2.page.wallpapers.name){
						return that.$store.state.config2.page.wallpapers.name;
					}else{
						return '图集';
					}
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 57,
				page_title: '',
				page: 1,
				lists: [],
				loadmore: false,
				isLastPage: false,
				waterfallSkeleton: []
			}
		},
		onReady(){
			let that = this;
			that.page_title = that.$store.state.config2?.page?.wallpapers?.name || '图集';
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);

			that.getData();
			that.waterfallSkeleton = that.$store.state.skeleton.waterfall;
		},
		onPullDownRefresh: function () {
		    let that = this;
		    that.setData({
		      lists: [],
		      page: 1,
		      isLastPage: false,
		      loadmore: false,
		    });
		    that.getData();
			
			setTimeout(function(){
				uni.stopPullDownRefresh();
			}, 400);
		},
		onReachBottom: function () {
		  let that = this;
		  if(!that.isLastPage && that.lists.length > 0){
			that.setData({
			  page: that.page + 1,
			  loadmore: true
			});
			that.getData();
		  }
		},
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				uni.wen.toUrl(6, '/pages/wallpaper/collected', null);
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(57,0, false, false, 0, 2);
		},
		methods: {
			getData() {
				let that = this;
				if(that.page == 1){
					uni.loading(true);
				}
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/list', {page: that.page}).then(function(res) {
					if(that.page == 1){
						uni.loading(false);
					}
					
					
					if(res.status){
						if(res.data.current_page != that.page){
							return false;
						}
						let data = res.data;
						let args = {};
						
						if (data.data && data.data.length > 0) {
						  args.loadmore = false;
						  args.page = data.current_page;
						  args.lists = that.lists.concat(data.data);
						  args.isLastPage = false;
						} else {
						  args.isLastPage = true;
						}
						that.setData(args);
					}

				});
			},
			goDetail(item) {
				uni.wen.toUrl(6, '/pages/wallpaper/detail?data=' + encodeURIComponent(JSON.stringify(item)), null);
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/pages/wallpaper/wallpaper.scss';
.add-wrap{
	background-color: $uni-color-primary;
	position: fixed;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	right: 20rpx;
	bottom: 60rpx;
	.mini-icon{
		color: #ffffff;
		font-size: 36rpx;
	}
}
</style>
