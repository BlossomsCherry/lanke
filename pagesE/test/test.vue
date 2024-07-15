<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body mini-statics-dashbord">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view class="" slot="center">
				<tabsSwiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :active-color="primaryColor" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'"></tabsSwiper>
			</view>
		</navBar>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' ">
			<swiper-item class="swiper-item swiper-item-1">
				<scroll-view scroll-y  :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' " @scrolltolower="onreachBottom">
					<view class="page-block-gap"></view>
					<view class="chart-item chat-1001">
						<view class="title">
							<view class="name">用户分布图</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="pie"
							      :chartData="chat1data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
					<view class="chart-item chat-1002">
						<view class="title">
							<view class="name">男女分布</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="pie"
							      :chartData="chat2data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
					<view class="chart-item chat-1003">
						<view class="title">
							<view class="name">地区分布</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="bar"
							      :chartData="chat3data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
					<view class="chart-item chat-1004">
						<view class="title">
							<view class="name">年龄分布</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="mount"
							      :chartData="chat5data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
					<view class="chart-item chat-1004">
						<view class="title">
							<view class="name">等级分布</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="rose"
							      :chartData="chat6data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item swiper-item-2">
				<scroll-view scroll-y  :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' " @scrolltolower="onreachBottom">
					<view class="page-block-gap"></view>
					<view class="chart-item chat-2001">
						<view class="title">
							<view class="name">话题分布</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="word"
							      :chartData="chat4data"
							    />
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item swiper-item-3">
				<scroll-view scroll-y  :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' " @scrolltolower="onreachBottom">
					<view class="page-block-gap"></view>
					<view class="chart-item chat-3001">
						<view class="title">
							<view class="name">货币流通</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="radar"
							      :chartData="chat7data"
							    />
						</view>
					</view>
					<view class="page-block-gap"></view>
					<view class="chart-item chat-3001">
						<view class="title">
							<view class="name">用户增长在线</view>
							<view class="desc"></view>
						</view>
						<view class="content">
							<qiunDataCharts 
							      type="area"
							      :chartData="chat8data"
							    />
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';
import qiunDataCharts from '@/pagesE/components/qiun-data-charts/qiun-data-charts';
export default {
  data() {
    return {
		pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
		chat1data: {
            series: [
              {
                data: [{"name":"总用户","centerText":"100","value":50},{"name":"小程序用户","centerText":"30","value":30},{"name":"app用户","centerText":"20","value":20},{"name":"H5用户","centerText":"18","value":18}]
              }
            ]
          },
		chat2data: {
            series: [
              {
                data: [{"name":"男","value":70},{"name":"女","value":30}]
              }
            ]
        },
		chat3data: {
            categories: ["省1","省2","省3","省4","省5","省6"],
            series: [
              {
                name: "用户数",
                data: [35,36,31,33,13,34]
              },
            ]
        },
		chat4data: { 
			series: [ { name: "跨全端图表", textSize: 25, data: undefined }, 
			{ name: "微信小程序", textSize: 20, data: undefined }, 
			{ name: "支付宝小程序", textSize: 20, data: undefined }, 
			{ name: "百度小程序", textSize: 20, data: undefined }, 
			{ name: "QQ小程序", textSize: 20, data: undefined }, 
			{ name: "头条小程序", textSize: 20, data: undefined }, 
			{ name: "抖音小程序", textSize: 20, data: undefined }, 
			{ name: "360小程序", textSize: 20, data: undefined }, 
			{ name: "跨全端", textSize: 10, data: undefined }, { name: "跨全端", textSize: 12, data: undefined }, 
			{ name: "跨全端", textSize: 10, data: undefined }, { name: "跨全端", textSize: 12, data: undefined }, 
			{ name: "跨全端", textSize: 10, data: undefined }, { name: "跨全端", textSize: 12, data: undefined }, 
			{ name: "跨全端", textSize: 10, data: undefined }, { name: "跨全端", textSize: 12, data: undefined } ] ,
		},
		chat5data: {
            series: [
              {
                data: [{"name":"0-18","value":82},{"name":"19-25","value":63},{"name":"26-35","value":86},{"name":"36以上","value":5}]
              }
            ]
        },
		chat6data: {
            series: [
              {
                data: [{"name":"lv1","value":50},{"name":"lv2","value":30},{"name":"lv3","value":20},{"name":"lv4","value":18},{"name":"lv5","value":8}]
              }
            ]
        },
		chat7data: {
			categories: ["付费笔记","商品购买","充电投币","开通会员","饰品消费"],
			series: [
			  {
				name: "余额",
				data: [90,110,165,195,187]
			  },
			  {
				name: "金币",
				data: [190,210,105,35,27]
			  }
			]
		},
		chat8data: {
			categories: ["6.15","6.16","6.17","6.18","昨天","今天"],
			series: [
			  {
				name: "注册用户数",
				data: [35,8,25,37,4,20]
			  },
			  {
				name: "在线用户数",
				data: [70,40,65,100,44,68]
			  },
			]
		},
		list: [{
			name: '用户'
		}, {
			name: '笔记'
		}, {
			name: '趋势'
		}],
		current: 0,
		swiperCurrent: 0,
      }
  },
  components: {
	myToast,navBar,hoverBall,
	tabsSwiper,
  	qiunDataCharts,
  },
  computed:{
	  swiperHeight:{
	  	get(){
	  		let that = this;
	  		return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
	  	},
	  	set(v){}
	  },
  },
  onReady() {

  },
  onShareAppMessage: function(res) {
  	return {
  		title: that.$store.state.config.share.format.app_share_right,
  		path: '/pages/tabbar/index/index?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: that.$store.state.config.img.default_share
  	};
  },
  
  onShareTimeline: function(res) {
  	let that = this;
  	return {
  		title: that.$store.state.config.share.format.app_share_right,
  		query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: that.$store.state.config.img.default_share
  	};
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
	tabsChange(index) {
		this.swiperCurrent = index;
	},
	transition(e) {
		let dx = e.detail.dx;
		this.$refs.uTabs.setDx(dx);
	},
	animationfinish(e) {
		let current = e.detail.current;
		this.$refs.uTabs.setFinishCurrent(current);
		this.swiperCurrent = current;
		this.current = current;
	},
	onreachBottom() {
		
	},
  }
};
</script>

<style lang="scss" scoped>
.mini-statics-dashbord{
	width: 750rpx;
	@include background_color(page-body-background-color);
	.chart-item{
		@include background_color(page-box-background-color);
		.title{
			@include color(color-darkest);
			width: $page-content-body-width;
			margin: auto;
			padding: 20rpx 0;
			.name{
				
			}
			.desc{
				
			}
		}
		.content{
			width: 750rpx;
			height: 400rpx;
		}
	}
}
</style>