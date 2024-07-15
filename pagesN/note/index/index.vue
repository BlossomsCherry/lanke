<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="''" iconTheme="white" color="#ffffff" background="transparent" :placeholder="false">
		
		</navBar>
		
		<!-- 方格背景-->
		<view class="animation-wrapper"></view>
		
		<!-- 小星星 -->
		<view class="particle particle-1"></view>
		<view class="particle particle-2"></view>
		<view class="particle particle-3"></view>
		<view class="particle particle-4"></view>
		
		<view class="note-page-content">
			<view style="height: 120rpx;"></view>
			<view class="ball">
				<xingqiu-tag :list="userList"></xingqiu-tag>
			</view>
			
			<view style="height: 140rpx;"></view>
			
			
			<view class="tip">
				<text class="desc-person">已有<text class="num">120</text>人放入纸条</text>
			</view>
			<view class="middle-wrap">
				<view class="inner">
					<block v-for="(item, index) in middleBox" :key="index">
						<view :class="'box box-' + index " @tap.stop.prevent="toSliderUrl(item.type, item.target)">
							<image class="_image" :src="item.img"></image>
							<text class="_text">{{ item.text }}</text>
						</view>
					</block>
				</view>
			</view>
			
			<view class="bottom-wrap">
				<view class="inner">
					<block v-for="(item, index) in bottomBox" :key="index" v-if="bottomBox && bottomBox.length > 0">
						<view :class="'box box-' + index" @tap.stop.prevent="toSliderUrl(item.type, item.target)">
							<image class="_image" :src="item.img" mode="heightFix"></image>
							<text class="title u-line-1">{{ item.title }}</text>
							<text class="desc u-line-1">{{ item.desc }}</text>
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

import xingqiuTag from '@/pagesN/components/xingqiu-tag/xingqiu-tag';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		xingqiuTag
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			userList: [],
			bottomBox: [],
			middleBox: []
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.getUserList();
		that.get_note_config();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		getUserList() {
		  let that = this;
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/users', {
		    type: 10,
			limit: 50,
		    page: 1
		  }).then(function (res) {
			
			if(res.status){
				let data = res.data;
				let args = {};
				if (data.data && data.data.length > 0) {
				  that.userList = data.data;
				}
			}
			
		  });
		},
		get_note_config(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'aggregate/config', {
				type: 'note-config',
			}).then(function(res) {
				if (res.status) {
					that.bottomBox = res.data?.bottom?.box;
					that.middleBox = res.data?.middle?.box;
				} else {
		
				}
			});
		}
	}
	
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>