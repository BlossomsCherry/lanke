<script>
import PetAdoptionHome from '@/pagesP/pet-adoption/index/home/index.vue'
import PetAdoptionHomeNavbar from '@/pagesP/pet-adoption/index/home/components/pet-adoption-home-navbar.vue'

const common = require('@/mixins/common')
var options = {}
common(options)

export default {
  name: 'index',
  components: { PetAdoptionHomeNavbar, PetAdoptionHome },
  mixins: [{ methods: options }],
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 50001,
      tabbarIdx: 0,
      currentCity: '定位中',
	  isRefreshed: false,
    }
  },
  onLoad: function (options) {
	  let that = this;
	  that.globalOnloadProcess(options);
	  
	  try {
	  	that.refreshLocation();
	  } catch (error) {
	  	that.onRefresh();
	  }
	  
  },
  onReady() {
	let that = this;

	
	
    // 监听其他地方传递的事件，搜索刷新列表
    uni.$on('searchPetAdoptionHomeList', res => {
      if (res.type === 'selectCity') {
        // 将选择的城市赋值 并重新查询
        that.currentCity = res.cityName
        that.onRefresh({ city: res.cityName })
      } else if (res.type === 'filterForm') {
        that.onRefresh(res.params)
      }
    })
  },
  onShareAppMessage: function (res) {
	let that = this;
    return {
      title: that.$store.state.config.share.format.app_share_right,
      path: '/pagesP/pet-adoption/index/index' + '?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    }
  },
  onShareTimeline: function(res) {
  	let that = this;
  	return {
  		title: '宠物领养',
  		query: 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: that.$store.state.config.img.default_share
  	};
  },
  onShow: function() {
  	let that = this;
	// #ifdef MP-WEIXIN
	getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
	// #endif
	//  #ifdef MP
	that.tabBarSetData({selected: 1});
	// #endif
	
	//  #ifndef MP
	that.$store.commit('updateTabbarIndex', 1)
	// #endif
	that.updateScene(50001, 0);
	
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
  onTabItemTap : function(e) {
  	// #ifndef MP-WEIXIN
  	if(e.pagePath == 'pages/tabbar/adopt/adopt'){
  		uni.wen.util.doVibrateShort();
  	}
  	// #endif
  },
  methods: {
    // 底部tabbar切换事件
    tabbarChangeHandle(name) {
      // 结束原有页面下拉刷新
      this.endRefresh()
      if (name === 1) {
        this.toSliderUrl(6, '/pagesP/pet-adoption/push-adoption/index')
      } else {
        this.tabbarIdx = name
      }
    },
	
    // 下拉刷新
    onRefresh(params) {
		let that = this;
		if (that.tabbarIdx === 0) {
			if(!params){
				params = {};
			}
			if(that.currentCity){
				params.city = that.currentCity;
			}
			that.isRefreshed = true;
			try{
				that.$refs.petAdoptionHomeRef.refresh(params)
			}catch(e){
				//TODO handle the exception
				setTimeout(function(){
					that.$refs.petAdoptionHomeRef.refresh(params)
				}, 300);
			}
			
		}
    },

    // 上拉加载
    scrollToLower() {
      if (this.tabbarIdx === 0) {
        this.$refs.petAdoptionHomeRef.loadMore()
      }
    },

    // 结束刷新
    endRefresh() {
		console.log('=========');
      this.$refs.pagePaging.endRefresh()
    },

    // 刷新定位
    refreshLocation() {
		let that = this;
		uni.wen.util.getGeocoder().then(res => {
			const component = res.regeocode.addressComponent
			that.currentCity = component.city && component.city.length > 0 ? component.city : '';
		}).finally(() => {
		// 不管定位成功与否，都执行后续的接口查询逻辑
		// 定位失败了就查询全国的
			that.onRefresh()
		})
    }
  },
}
</script>

<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
<view class="mini-page-body tabbar">
<z-paging ref="pagePaging" :auto-clean-list-when-reload="false" refresher-only @onRefresh="onRefresh" @scrolltolower="scrollToLower" :refresher-enabled="tabbarIdx === 0">

		<view slot="top">
		  <pet-adoption-home-navbar :city="currentCity" v-show="tabbarIdx === 0" :back="false"/>
		</view>

		<view v-show="tabbarIdx === 0">
		  <!-- 首页 -->
		  <pet-adoption-home ref="petAdoptionHomeRef" @endRefresh="endRefresh"/>
		</view>
		
		<view class="to-publish" @tap.stop.prevent="toSliderUrl(6, '/pagesP/pet-adoption/push-adoption/index')">
			<view class="_text">发布领养</view>
			<view class="icon flex-column">
				<i class="mini-icon mini-zhanneizhuanfa"></i>
			</view>
		</view>

		<!-- <view v-show="tabbarIdx === 2">
		  <pet-adoption-mine/>
		</view>

		<view slot="bottom">
		  <u-tabbar :value="tabbarIdx" @change="tabbarChangeHandle" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true" active-color="#fc3a72">
			<u-tabbar-item text="首页" icon="home"/>
			<u-tabbar-item text="发布" icon="plus-circle"/>
			<u-tabbar-item text="我的" icon="account"/>
		  </u-tabbar>
		</view> -->
		<view style="height: 100rpx;background-color: transparent;"></view>
</z-paging>
</view>
</view>	
</template>

<style scoped lang="scss">
.to-publish{
	background-color: $uni-color-follow;
	color: $uni-color-follow-font;
	position: fixed;
	bottom: calc( 160rpx + env(safe-area-inset-bottom) );
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	border-radius: 200rpx;
	padding: 20rpx 32rpx;
	._text{
		margin-right: 10rpx;
	}
	.icon{
		justify-content: center;
	}
}

</style>
