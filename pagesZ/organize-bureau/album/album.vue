<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="活动图集" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="bureau-album-page">
			<view style="height: 30rpx;"></view>
			<view class="inner">
				<view class="item-list">
					<view class="album-item add" @tap.stop.prevent="toSliderUrl(6, '/pages/wallpaper/creat?bureau=' + bureau_id)">
						<view class="_image">
							<i class="mini-icon mini-tupian2"></i>
							<view class="_text">发布图集</view>
						</view>
					</view>
					<block v-if="ablumList && ablumList.length > 0" v-for="(item, index) in ablumList" :key="index">
						<view class="album-item" @tap.stop.prevent="toSliderUrl(6, '/pagesZ/organize-bureau/album/detail?id=' + item.id )">
							<view class="_image" :style="'background-image: url('+ item.firstImg +');'">
							</view>
							<text class="title u-line-1">{{ item.title }}</text>
							<text class="desc">{{ item.imgNum + '张' }}</text>
						</view>
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

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 151,
			ablumList: [],
			page: 1,
			loadmore: false,
			isLastPage: false,
			
			bureau_id: 0,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(151, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
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
			that.bureau_id = query.bureau;
			that.fph = true;
		} else {
			that.bureau_id = options.bureau;
		}
		
		that.getablumList();
	},
	onPullDownRefresh: function () {
	    let that = this;
	    that.setData({
	      ablumList: [],
	      page: 1,
	      isLastPage: false,
	      loadmore: false,
	    });
	    that.getablumList();
	    uni.stopPullDownRefresh();
	},
	onReachBottom: function () {
	  let that = this;
	  if(!that.isLastPage && that.ablumList.length > 0){
		that.setData({
		  page: that.page + 1,
		  loadmore: true
		});
		that.getablumList();
	  }
	},
	methods: {
		getablumList() {
			let that = this;
			if(that.page == 1){
				uni.loading(true);
			}

			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/list', {
				type: 'bureau',
				bureau_id: that.bureau_id,
				page: that.page
			}).then(function (res) {
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
					  args.ablumList = that.ablumList.concat(data.data);
					  args.isLastPage = false;
					} else {
					  args.isLastPage = true;
					}
					that.setData(args);
				}
				
				
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import './album.scss';
</style>