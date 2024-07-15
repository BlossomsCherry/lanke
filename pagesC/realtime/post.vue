<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" @search="toSliderUrl(6, '/pages/common/search')" :searchBar="true" :searchText="config_page_index_searchCarousel" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="top_ten_posts">
			<view class="stitle">
				<view class="left">
					<view class="logo"><image :src="config_about_logo"></image></view>
					<view class="title">{{ config_about_name }}热帖榜</view>
					<view class="ago">{{ real_time_posts_time }}更新</view>
				</view>
				<view class="right"></view>
			</view>
			<view class="content">
				<view class="item" v-for="(real_item ,index) in real_time_posts" :key="index" @tap="toSliderUrl(1, real_item.id)">
					<view :class="'order order_' + (index + 1)">{{ index + 1 }}</view>
					<view class="post">{{ real_item.posts_content }}</view>
					<block>
						<view class="icon new" v-if="real_item.is_new">新</view>
						<view class="icon hot" v-if="real_item.is_hot">热</view>
					</block>
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
	
const common = require('@/mixins/common');

var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		config_about_name:{
			get(){
				let that = this;
				return that.$store.state.config.about.name;
			},
			set(v){}
		},
		config_about_logo:{
			get(){
				let that = this;
				return that.$store.state.config.about.logo;
			},
			set(v){}
		},
		config_page_index_searchCarousel:{
			get(){
				let that = this;
				if(that.$store.state.config.page.index){
					return that.$store.state.config.page.index.searchCarousel;
				}
				return [];
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			real_time_posts: [],
			real_time_posts_time: ''
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.realtimePosts();
		
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
	  realtimePosts(){
	  	let that = this;
	  	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'realtime/top/posts', {type: 50}).then(function(res) {
	  		if (res.status) {
	  			that.setData({
	  				real_time_posts: res.data.posts,
	  				real_time_posts_time: res.data.format_time
	  			});
	  		}else{
				uni.showToast({
					title: '无记录',
					icon: 'none'
				})
			}
	  	});
	  },
	}
}
</script>

<style lang="scss" scoped>
.top_ten_posts{
	margin:  0 20rpx 0;
	@include background_image(background-image-primary);
	padding: 20rpx;
	border-radius: $uni-border-radius-sm;
	.stitle{
		display: flex;
		justify-content: space-between;
		height: 40rpx;
		line-height: 40rpx;
		.left{
			display: flex;
			.logo{
				image{
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
				}
				margin-right: 10rpx;
			}
			.ago{
				transform: scale(0.8) translateX(-20%);
				@include color(color-lightest-est-er-dark);
				margin-left: 22rpx;
				font-size: 22rpx;
				border: 0.5rpx solid;
				@include border_color(color-lightest-est-er-dark);
				padding: 0 10rpx;
				border-radius: 6rpx;
				font-weight: normal;
			}
		}
	}
	.item{
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		.order{
			font-size: $uni-font-size-sm-base;
			margin-right: 20rpx;
			color: #d1d1d1;
			font-weight: 600;
			width: 30rpx;
			min-width: 30rpx;
			text-align: right;
		}
		.order.order_1{
			color: #fb5835;
		}
		.order.order_2{
			color: #fe6434;
		}
		.order.order_3{
			color: #ffaa02;
		}
		.post{
			font-size: $uni-font-size-sm-base;
			margin-right: 10rpx;
			max-width: 540rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			@include color(color-darkest);
		}
		.icon{
			width: 30rpx;
			height: 30rpx;
			min-width: 30rpx;
			min-height: 30rpx;
			max-width: 30rpx;
			max-height: 30rpx;
			line-height: 30rpx;
			border-radius: 6rpx;
			color: #fff;
			font-size: 21rpx;
			margin-top: 22.5rpx;
			text-align: center;
		}
		.icon.new{
			background-color: #ff9e3d;
		}
		.icon.hot{
			background-color: #fd6e46;
		}
	}
}
.stitle {
    font-size: $uni-font-size-base;
    @include color(color-darkest);
    letter-spacing: 1.2rpx;
    margin-bottom: 20rpx;
	font-weight: 600;
}

</style>