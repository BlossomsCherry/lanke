<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="Ta的闲置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="user-used-page-content">
			<view class="index-list-box">
				<ls-skeleton :loading="goodsLoad" :skeleton="skeleton" :animate="true" :scene="90730">
					<block v-if="goodsWaterData.data && goodsWaterData.data.length > 0">
						<l-water-flow comName="used" :waterData="goodsWaterData" ref="goodswater" :column-gap="15" :scene="100" :wrapWidth="730" />
						<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
							iconSize="28" fontSize="28" color="#989898" />
					</block>
					<block v-else>
						<view style="height: 140rpx;"></view>
						<u-empty text="一个也没有" width="300" height="300" text-size="28" />
					</block>
					<view style="height: 140rpx;"></view>
					<view class="safe_area_height"></view>
				</ls-skeleton>
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

import lWaterFlow from '@/linui/water-flow/index';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
	
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		lWaterFlow,
		lsSkeleton
	},
	computed:{
		skeleton: {
			get(){
				let that = this;
				return that.$store.state.skeleton.waterfall;
			},
			set(v){}
		},

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 120,
			id: 0,
			user_name: 'Ta',
			
			goodsWaterData: {
				e: 0,
				data: []
			},
			page: 1,
			isLastPage: false,
			loadmoreShow: false,
			goodsLoad: true,
			orderBy: 'state',
			order: 'desc',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(120, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.id = options.id;
		if(options.name){
			that.user_name = options.name;
		}
		that.getUsedGoodList();
	},
	onReachBottom() {
		let that = this;
		if(that.isLastPage){
			return false;
		}
		if(that.goodsWaterData.data.length <= 0){
			return false;
		}
		that.setData({
			page: that.page + 1,
			loadmoreShow: true
		});
		that.getUsedGoodList();
	},
	onPullDownRefresh: function() {
		let that = this;
		that.setData({
			goodsWaterData: {
				e: 1,
				data: []
			},
			page: 1,
			isLastPage: false,
			loadmoreShow: false,
			goodsLoad: true,
		});
		
		that.getUsedGoodList();
	},
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: that.user_name + '的闲置',
			path: '/pages/user/used/used?id='+that.id+'&name=' + that.user_name + '&fph=1&from_user=' + that.$store.state.userInfo.id+ '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config2.used.share.index_image
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.user_name + '的闲置',
			query: 'id='+that.id+'&name=' + that.user_name + '&fph=1&from_user=' + that.$store.state.userInfo.id+ '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config2.used.share.index_image
		};
	},
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/used/used'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
	methods: {
		
		getUsedGoodList(){
			let that = this;
			if(that.page == 1){
				that.setData({
					isLastPage: false,
					loadmoreShow: false,
					goodsLoad: true,
					goodsWaterData: {
						e: 1,
						data: []
					}
				})
			}
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/list', {
				user_id: that.id,
				page: that.page,
				orderBy: that.orderBy,
				order: that.order,
				status: '1,3,5,6,7,8,9,10'
			}).then(function (res) {
				if(that.page == 1){
					uni.stopPullDownRefresh();
				}
				if(res.status){
					
					if(res.data.current_page != that.page){
						return false;
					}
					
					let data = res.data;
					let args = {};
				
					if(data.data && data.data.length > 0){
						args.goodsWaterData = {
							e: 0,
							data: data.data
						}
						args.page = data.current_page;
						args.loadmoreShow = false;
						args.isLastPage = false;
					}else{
						args.isLastPage = true;
					}
					args.goodsLoad = false;
					that.setData(args);
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import './used.scss';
</style>