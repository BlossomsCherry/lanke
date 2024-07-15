<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import OrganizeBureauListItem from '@/pagesZ/organize-bureau/components/organize-bureau-list-item.vue';

const common = require('@/mixins/common');
var options = {};
common(options);

export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,
    OrganizeBureauListItem
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 150,
      tabCurrent: 0, // 当前tab索引
      swiperCurrent: 0, // 当前swiper索引
      tabList: [
        { id: 1, name: '已报名' },
        { id: 2, name: '我发布' },
		{ id: 3, name: '已收藏' },
      ],
      // 活动列表
      activityList: [],
	  lineBg: require('../../static/tabs-bg.png'),
	  itemStyle: 'padding-left: 20rpx; padding-right: 20rpx; height: 34px;'
    }
  },
  onShow: function () {
  	let that = this;
  	that.updateScene(150, 0);
  },
  onLoad: function (options) {
  	let that = this;
  	that.globalOnloadProcess(options);
  	that.fetchActivityList(1, 10);
  },
  onPullDownRefresh: function () {
    uni.stopPullDownRefresh();
  },
  computed: {
  	activeStyle:{
  		get(){
  			return 'color: '+ (this.global__theme__ == 'black' ? '#dadadb' : '#333333') +'; font-size: 30rpx';
  		},
  		set(v){}
  	},
  	inactiveStyle:{
  		get(){
  			return 'color: '+ (this.global__theme__ == 'black' ? '#7c7c7f' : '#a3a3a3') +'; font-size: 30rpx';
  		},
  		set(v){}
  	}
  },
  methods: {
    // swiper切换时事件
    swiperChangeHandle(e) {
      this.tabCurrent = e.detail.current;
	  this.$refs.paging[this.tabCurrent].reload();
    },
    // tab标签切换时事件
    tabChangeHandle(e) {
      this.swiperCurrent = e.index
      this.$refs.paging[this.tabCurrent].reload()
    },
    async fetchActivityList(pageNo, pageSize) {
		let that = this;
		let formdata = {
		    page: pageNo
		};
		
		if(that.tabCurrent == 1){
			formdata.master = 1;
			formdata.status = '0,1';
		}else if(that.tabCurrent === 2){
			formdata.collected = 1;
		}else if(that.tabCurrent === 0){
			formdata.is_member = 1;
		}
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/list', formdata, 'GET', 150).then(function(res) {
			if(res.status){
				if(res.data.current_page != pageNo){
					return false;
				}
				try{
					that.$refs.paging[that.tabCurrent].complete(res.data.data);
				}catch(e){
					//TODO handle the exception
					setTimeout(function(){
						that.$refs.paging[that.tabCurrent].complete(res.data.data)
					}, 300);
				}
				
			}
		}).finally(function(){
				
		});
    }
  }
}
</script>
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<z-paging-swiper>
		  <view slot="top">
			<navBar :back="true" :home="fph" title="我的组局" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			
			</navBar>
		    <u-tabs :list="tabList" :current="tabCurrent" @change="tabChangeHandle" lineWidth="20" lineHeight="7" :lineColor="`url(${lineBg})`" :activeStyle="activeStyle" :inactiveStyle="inactiveStyle" :itemStyle="itemStyle"/>
		  </view>
		
		  <swiper class="swiper" :current="swiperCurrent" @change="swiperChangeHandle">
		    <swiper-item class="swiper-item" v-for="item in tabList" :key="item.id">
		      <z-paging ref="paging" v-model="activityList" @query="fetchActivityList" :auto="false">
		        <view class="list-wrapper">
		          <block v-for="item in activityList" :key="item.id">
		            <organize-bureau-list-item :item="item"/>
		          </block>
		        </view>
		      </z-paging>
		    </swiper-item>
		  </swiper>
		</z-paging-swiper>
		<view class="add-box flex-column" @tap.stop.prevent="toSliderUrl(6, '/pagesZ/organize-bureau/push/creat')">
			<i class="mini-icon mini--jia"></i>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<style scoped lang="scss">
.swiper {
  height: 100%;
  @include background_color(page-body2-background-color);
  .list-wrapper {
    margin: 20rpx;
  }
}
.add-box{
	width: 70rpx;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 50%;
	background-color: $uni-color-follow;
	justify-content: center;
	position: fixed;
	right: 20rpx;
	bottom: calc( 60rpx + env(safe-area-inset-bottom) );
	.mini-icon{
		color: $uni-color-follow-font;
		font-size: $uni-font-size-base;
	}
}
</style>
