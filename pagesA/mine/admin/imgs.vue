<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="imgs_wrap">
			<block v-for="(item, index) in imgs" :key="index">
				<contextualPopup subject="img" :popList="item.allowable"  :para="{ index: index, direction: (index + 1)%4 == 0 ? 'flex-column' : 'flex-row' }">
					<block v-if="item.file_type == 'image'">
						<image slot="content" :src="item.url" mode="aspectFit" class="img"  @tap.stop.prevent="previewImg(item.url)"></image>
					</block>
					<block v-else-if="item.file_type == 'video'">
						<view slot="content" @tap.stop.prevent="toSliderUrl(6, '/pages/common/video?url=' + item.url)" class="video-box flex-column">
							<i class="mini-icon mini-shipin1"></i>
						</view>
					</block>
				</contextualPopup>
			</block>
		</view>
		<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" />
		<view style="height: 10vh;"></view>
		<hover-ball v-if="isOfficial > 1" /><my-toast unicom-id="mytotast_38_0" ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import JVideo from '@/components/j-video/j-video';

import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		contextualPopup,JVideo
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			page: 1,
			imgs: [],
			imgsload: true,
			loadmoreShow: false,
			isLastPage: false,
		}
	},
	onPullDownRefresh: function() {
		let that = this;
		that.setData({
			page: 1,
			imgs: [],
			imgsload: true,
			loadmoreShow: false,
			isLastPage: false,
		});
		that.getAdminUserImgs();
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0, true, true);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.getAdminUserImgs();
	},
	onReachBottom: function () {
	    let that = this;
	    that.setData({
	        page: that.page + 1,
	        loadmoreShow: true
	    });
	    that.getAdminUserImgs();
	},
	methods: {
	  previewImg(url){
		let clean_url = uni.wen.util.removeStyles(url);
		uni.previewImage({
			current: clean_url,
			urls: [clean_url]
		});
	  },
	  getAdminUserImgs(){
		let that = this;
	  	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'admin/imgs', {
	  		page: that.page
	  	}).then(function(res) {
	  		uni.loading(false);
			uni.stopPullDownRefresh();
	  		if(res.status){
				
				if(res.data.current_page != that.page){
					return false;
				}
				
	  			let args = {};
	  			
				if (res.data.data && res.data.data.length > 0) {
					args.imgs = that.imgs.concat(res.data.data);
					args.page = res.data.current_page;
					args.loadmoreShow = false;
					args.isLastPage = false;
				}else{
					args.isLastPage = true;
				}
	  			args.imgsload = false;
	  			that.setData(args);	
				
	  		}else{
	  			uni.showToast({
	  				title: res.message,
	  				icon:'none'
	  			});
	  		}
	  	});
	  },
	}
}
</script>

<style lang="scss" scoped>
.imgs_wrap {
    display: flex;
    flex-wrap: wrap;
	width: 750rpx;
	min-height: 100vh;
	padding-bottom: 5vh;
	.img{
		width: 187rpx;
		height: 187rpx;
	}
	.video-box{
		justify-content: center;width: 187rpx;height: 187rpx;
		background-color: rgba(0,0,0,0.5);
		.mini-icon{
			color: #ffffff;
		}
	}
}
</style>