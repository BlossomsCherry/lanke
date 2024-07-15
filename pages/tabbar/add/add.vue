<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body tabbar">
		<view class="container" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
			<!-- Swiper Box -->
			<view class="swiper-box" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght + ';background-image: url('+ config2_page_publish2.bg +');'">
				<view class="swiper-tips flex-column">
					<view class="wave"></view>
					<view class="bubble" v-if="config2_page_publish2.post && config2_page_publish2.post.user" @tap.stop.prevent="toSliderUrl(1, config2_page_publish2.post.id)">
						<view class="user flex-row">
							<image :src="config2_page_publish2.post.user.user_avatar" class="_image"></image>
							<view class="ohto">
								<view class="u-line-1">{{ config2_page_publish2.post.user.user_name }}</view>
							</view>
							
						</view>
						<view class="content ohto2 u-line-1">{{ config2_page_publish2.post.title }}</view>
					</view>
				</view>
			</view>
			<!-- Add Box -->
			<view class="add-box" :style="'bottom: ' + bottom + ';'">
				<view class="items" v-if="config2_page_publish2.items">
					<view class="add-item" v-for="(item, index) in config2_page_publish2.items" :key="index"  @tap.stop.prevent="toSliderUrl(item.type, item.target_id)">
						<view class="img">
							<image :src="item.img" class="_image" />
						</view>
						<view class="tit1">{{ item.name }}</view>
						<view class="tit2" v-if="item.desc">{{ item.desc }}</view>
					</view>
					<view class="add-line" v-if="index === 0"></view>
				</view>
				<view class="angle-mark"></view>
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
		bottom: {
			get() {
			  let that = this;
				// #ifdef MP
				return ' calc( 120rpx + env(safe-area-inset-bottom) )';
				// #endif
				// #ifdef APP
				return ' 10px ';
				// #endif
				// #ifdef H5
				return ' calc( 60px + env(safe-area-inset-bottom) )';
				// #endif
			},
			set(v) {}
		},
		contentHieght: {
		  get() {
		    let that = this;
			// #ifdef MP
			return ' calc( 100vh - 90rpx - env(safe-area-inset-bottom) )';
			// #endif
			// #ifdef APP
			return ' 100vh ';
			// #endif
			// #ifdef H5
			return ' calc( 100vh - 45px )';
			// #endif
		  },
		  set(v) {}
		},
		config2_page_publish2:{
			get(){
				let that = this;
				if(that.$store.state.config2.page.publish2){
					return that.$store.state.config2.page.publish2;
				}
				return {
					'bg': '',
					'items': [],
					'post': {
						'user': {}
					}
				};
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 97,
		}
	},
	onShow: function () {
		let that = this;
		// #ifdef MP-WEIXIN
		getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
		// #endif

		//  #ifdef MP
		that.tabBarSetData({selected: 2});;
		// #endif
		//  #ifndef MP
		that.$store.commit('updateTabbarIndex', 2);
		// #endif
		that.updateScene(97, 0, false, false, 0, 2);
		
		
		that.getSysMessageCount().then(function (res) {
		  //  #ifdef MP
		  that.tabBarSetData({
		    sysMessageCount: res
		  });
		  // #endif
		
		  if(res > 0){
		  	that.$store.commit('updateSysMessageCount', res);
		  }else{
		  	that.$store.commit('updateSysMessageCount', 0);
		  }
		});
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/add/add'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
	methods: {
	  
	}
}
</script>


<style lang="scss" scoped>
@import './add.scss';
</style>