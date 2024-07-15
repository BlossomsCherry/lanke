<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="图集详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="album-page-content">
			<lsj-album
			:foldNum="0"
			:bigPicture="true"
			round="10rpx"
			:background="global__theme__ == 'black' ? '#19191e' : '#ffffff'"
			:preview="false"
			:list="list"
			@onClick="clickalbum" v-if="list && list.length > 0" />
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import LsjAlbum from '@/pagesZ/organize-bureau/components/lsj-album';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		LsjAlbum
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 152,
			id: 0,
			list: []
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(152, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		if(options.id && options.id > 0){
			that.id  = options.id;
		}
		that.getWallpaperDetail();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		clickalbum(e){
			uni.wen.toUrl(20, this.id, this);
		},
		getWallpaperDetail() {
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/detail', {
				id: that.id
			}).then(function(res) {
				uni.loading(false);
				if (res.status) {
					that.list = [{
						title: res.data.title,
						value: res.data.imgs
					}];
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error'
					});
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
@import './detail.scss';
</style>