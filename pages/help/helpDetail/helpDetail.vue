<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<text class="helpTitle" :selectable=" true " :user-select=" true ">{{ resultData.title }}</text>
		<view class="question_content"> <mp-html :content="resultData.content" :selectable=" true " /></view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

	export default {
		components: {
			myToast,navBar,hoverBall,mpHtml
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 44,
				helpId: 0,
				resultData: {
					title: '',
					content: ''
				}
			};
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			if(options.id && options.id > 0){
				that.helpId = options.id;
				that.getHelpDetail();
			}else{
				let item = JSON.parse(decodeURIComponent(options.item))
				if(item && item.title && item.content){
					that.resultData.title = item.title;
					that.resultData.content = item.content;
					that.helpId = item.id;
					uni.setNavigationBarTitle({
						title: item.title
					});
				}else{
					var scene = decodeURIComponent(options.scene);
					if (scene && scene != 'undefined') {
						let query = {};
						if(scene.indexOf('&') !== -1){
							let scene_arr = scene.split('&');
							scene_arr.map((item)=> {
							    let queryData = item.split('=')
							    query[queryData[0]] = queryData[1]
							})
						}else{
							let queryData = scene.split('=')
							query[queryData[0]] = queryData[1]
						}
						if(query.from_user && query.from_user.length > 0){
							uni.setStorageSync('form_user', query.from_user);
							uni.$store.commit('updateFormUser', query.from_user);
						}
						that.helpId = query.id;
						that.fph = true;
					} else {
						that.helpId = options.id;
					}
					that.getHelpDetail();
				}
			}
		},
		onShow: function () {
			let that = this;
			if(that.helpId && that.helpId > 0){
				that.updateScene(44, that.helpId);
			}else{
				that.updateScene(44, 0);
			}
			
		},
		onShareAppMessage: function(res) {
			let that = this;
			
			let imageUrl = that.$store.state.config.img.default_share;
			if(that.resultData.content){
				var regex = /<img.*?src=["'](.*?)["']/;
				var match = that.resultData.content.match(regex);
				if (match && match[1]) {
					imageUrl = match[1];
				}
			}
			
			return {
				title: that.resultData.title,
				path: '/pages/help/helpDetail/helpDetail?id='+ that.helpId +'&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: imageUrl
			};
		},
		
		onShareTimeline: function(res) {
			let that = this;
			
			let imageUrl = that.$store.state.config.img.default_share;
			if(that.resultData.content){
				var regex = /<img.*?src=["'](.*?)["']/;
				var match = that.resultData.content.match(regex);
				if (match && match[1]) {
					imageUrl = match[1];
				}
			}
			
			return {
				title: that.resultData.title,
				query: 'id=' + that.helpId + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: imageUrl
			};
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getHelpDetail(){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'help/detail', {
					id: that.helpId
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							resultData: res.data
						});
					}else{
						uni.showToast({
							title: res.message,
							icon:'error'
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		@include background_color(page-box-background-color);
	}

	.helpTitle {
		font-size: 40rpx;
		font-weight: bold;
		padding: 50rpx 30rpx 30rpx;
		color: #303133;
	}

	.helpCon {
		font-size: $uni-font-size-medium;
		margin: 30rpx 30rpx 50rpx;
		color: #303133;
		line-height: 2em;
	}
	.question_content{
		font-size: $uni-font-size-medium;
		margin: 30rpx 30rpx 50rpx;
		color: #303133;
		line-height: 2em;
	}
</style>
