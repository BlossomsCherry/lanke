<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" :title="clubInfo.name" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-desc">
			<view class="row">基础设置</view>
		</view>
		<view class="setting-box">
			<view class="row" @tap.stop.prevent="toSliderUrl(6, '/pagesZ/organize-bureau/settle-in/index?id=' + clubInfo.id)">
				<view class="left">
					<view class="title">俱乐部基础信息</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<i class="mini-icon mini-youjiantou"></i>
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
	
	export default {

		components: {
			myToast,navBar,hoverBall,
		},
		computed:{
			config_app_basic_intro_page:{
				get(){
					let that = this;
					return that.$store.state.config.app.basic.intro_page;
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 158,
				id: 0,
				clubInfo: {
					user_id: 0,
					user: {
						user_name: '',
						user_avatar: '',
					},
					name: '',
					intro: '',
					avatar: '',
					club_background_maps: '',
					club_background_color: '14, 14, 14',
					part_count: 0,
					follow_count: 0,
					collect_count: 0,
				},
				messageMeRange: [{ label: '关注我的人', value: 1 }, { label: '我关注的人', value: 2 }, { label: '互相关注的人', value: 3 }, { label: '禁止私信', value: 4 }],
				messageTip: {1: '关注我的人', 2: '我关注的人', 3: '互相关注的人', 4: '禁止私信'},
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			// 处理小程序码的分享场景
			var scene = decodeURIComponent(options.scene);
			if (scene && scene != 'undefined') {
			  let query = {};
			  if (scene.indexOf('&') !== -1) {
			    let scene_arr = scene.split('&');
			    scene_arr.map((item) => {
			      let queryData = item.split('=')
			      query[queryData[0]] = queryData[1]
			    })
			  } else {
			    let queryData = scene.split('=')
			    query[queryData[0]] = queryData[1]
			  }
			  if (query.from_user && query.from_user.length > 0) {
			    uni.setStorageSync('form_user', query.from_user);
			    uni.$store.commit('updateFormUser', query.from_user);
			  }
			  that.setData({
			    id: query.id,
				page__scene__id__: query.id,
			    fph: true
			  });
			} else {
			  that.setData({
			    id: options.id,
				page__scene__id__: options.id,
			  });
			}
			
			
			that.getClubInfo(that.id);
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			that.updateScene(158, that.id, true, false, 0, 0);
			
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getClubInfo(){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'club/info', {
					id: that.id
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.clubInfo = res.data;
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
		}
	};
</script>
<style lang="scss">
@import './setting.scss';
</style>
