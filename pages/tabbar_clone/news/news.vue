<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<u-navbar title=" " placeholder bgColor="#ec635d">
				<view class="nav_search" slot="left" :style="{'width':`${menuInfo.left-25}px`}">
					<u-search placeholder="个人注册公司流程，燕郊爆炸已致26个死亡" v-model="keyword" bgColor="#fff" color="#282828"
						:inputStyle="{'width':'100%'}" :showAction="false"></u-search>
				</view>
			</u-navbar>
			<view class="tabs">
				<u-tabs :list="list"></u-tabs>
			</view>
			<view class="list">
				<block v-for="(item,index) in posts">
					<view class="list_box">
						<view class="list_box--title" v-html="item.posts_content_raw"></view>
						<view class="list_box_images">
							<block v-if="item.post_type=='single' || item.post_type=='words' ">
								<block v-if="item.images.length > 0">
									<view class="singleOne" v-if="item.img_count==1">
										<image :src="item.images[0].img_url" mode="aspectFill"></imagve>
									</view>
									<view class="single" v-else>
										<image :src="item.images[0].img_url" mode="aspectFill"></image>
										<image :src="item.images[0].img_url" mode="aspectFill"></image>
										<image :src="item.images[0].img_url || ''" mode="aspectFill"></image>
									</view>
								</block>
							</block>
							<block v-if="item.post_type=='video'">
								<view class="video">
									<video :src="item.video.video_url" :style="'height:'+ item.video.display_height +'rpx;width: 100%;'"
										:poster="item.video.video_thumb_url"></video>
								</view>
								<!-- <yingbing-video :src="item.video" :style="'height:400rpx;width: 100%;'"
									@launchFullscreen="fullscreen(true)" @exitFullscreen="fullscreen(false)"></yingbing-video> -->
							</block>

						</view>
						<view class="list_box--time">{{item.user.user_name}}<text>{{item.created_at}}发布</text></view>
					</view>
				</block>
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
		mixins: [{
			methods: options
		}],
		components: {
			myToast,
			navBar,
			hoverBall,
		},
		computed: {

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 113,
				
				
				keyword: "",
				menuInfo: {},
				list: [{
					name: '关注',
				}, {
					name: '推荐',
				}, {
					name: '电影'
				}, {
					name: '科技'
				}, {
					name: '音乐'
				}, {
					name: '美食'
				}, {
					name: '文化'
				}, {
					name: '财经'
				}, {
					name: '手工'
				}],
				page: 1,
				posts: []
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(113, 0);
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			that.menuInfo = uni.getMenuButtonBoundingClientRect();
			console.log(that.menuInfo);
			that.indexPosts();
		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {

		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/news/news'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		methods: {
			// 推荐笔记接口
			indexPosts() {
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'index/posts', {
					page: that.page,
					type: 1,
					plate_id: '',
					channel: 1
				}).then(function(res) {
					if (res.status) {
						if (res.data.current_page != that.page) {
							return false;
						}

						let data = res.data;
						let args = {};

						if (data.data && data.data.length > 0) {
							args.posts = that.posts.concat(data.data);
							args.page = data.current_page;
							args.loadmoreShow = false;
							args.isLastPage = false;
						} else {
							args.isLastPage = true;
						}
						args.topicload = false;
						that.setData(args);

					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
					console.log(this)
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './news.scss';
</style>