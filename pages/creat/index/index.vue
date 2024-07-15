<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<swiper  :current="moment_swiperCurrent" @change="moment_swiperChange" @transition="moment_transition" @animationfinish="moment_animationfinish" :style=" 'height: ' + moment_swiperHeight + ';min-height: ' + moment_swiperHeight + ';max-height: ' + moment_swiperHeight + ';width: 750rpx;' ">
			<swiper-item class="swiper-item swiper-item-1">
				<scroll-view scroll-y class="creat-content"  :style=" 'height: ' + moment_swiperHeight + ';min-height: ' + moment_swiperHeight + ';max-height: ' + moment_swiperHeight + ';width: 750rpx;' " @scrolltolower="moment_onreachBottom">
					<view class="creat-wrap moment">
						<navBar :back="false" :home="false" background="rgba(0, 0, 0, 0);" :placeholder="false">
							<view slot="left" class="lxy-nav-bar__logo">
								<i class="mini-icon mini-shanchu2" style="color: #1c1c1c;" @tap.stop.prevent="toSliderUrl(-2, null)"></i>
							</view>
						</navBar>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item swiper-item-2">
				<scroll-view scroll-y class="creat-content"  :style=" 'height: ' + moment_swiperHeight + ';min-height: ' + moment_swiperHeight + ';max-height: ' + moment_swiperHeight + ';width: 750rpx;' " @scrolltolower="moment_onreachBottom">
					<view class="creat-wrap album">
						<navBar :back="false" :home="false" background="rgba(0, 0, 0, 0);" :title="album_title">
							<view slot="left" class="lxy-nav-bar__logo">
								<i class="mini-icon mini-shanchu2" style="color: #d5d7dc;" @tap.stop.prevent="toSliderUrl(-2, null)"></i>
							</view>
						</navBar>
						<tabsSwiper ref="album_uTabs" :list="album_tablist" :current="album_current" @change="album_tabsChange" :is-scroll="false" swiperWidth="750" inactiveColor="#666666" active-color="#ffffff" bgColor="#141414"></tabsSwiper>
						<swiper :current="album_swiperCurrent" :disable-touch="true" @change="album_swiperChange" @transition="album_transition" @animationfinish="album_animationfinish" :style=" 'height: ' + album_swiperHeight + ';min-height: ' + album_swiperHeight + ';max-height: ' + album_swiperHeight + ';width: 750rpx;' ">
							<swiper-item class="swiper-item swiper-item-2-1">
								<scroll-view scroll-y class="album-content"  :style=" 'height: ' + album_swiperHeight + ';min-height: ' + album_swiperHeight + ';max-height: ' + album_swiperHeight + ';width: 750rpx;' " @scrolltolower="album_onreachBottom">
									<view class="album_wrap photo">
										<view class="uploads">
											<mini-upload-img style="width: 100%;" :number="20" @change="change"></mini-upload-img>
										</view>
										<view class="unused-img-wrap">
											<view class="title">待使用的图片，单击选择，长按删除</view>
											<view class="list">
												<block v-for="(item, index) in unused_img_list" :key="index">
													<view class="select-item">
														<image class="_image" :src="item.url" mode=""></image>
													</view>
												</block>
											</view>
										</view>
									</view>
								</scroll-view>
							</swiper-item>
							<swiper-item class="swiper-item swiper-item-2-2">
								<scroll-view scroll-y class="album-content"  :style=" 'height: ' + album_swiperHeight + ';min-height: ' + album_swiperHeight + ';max-height: ' + album_swiperHeight + ';width: 750rpx;' " @scrolltolower="album_onreachBottom">
									<view class="album_wrap video">
										<view class="upload-video-button">
											<i class="mini-icon mini-xiangji1"></i>
										    <view class="lable">发个视频</view>
										</view>
									</view>
								</scroll-view>
							</swiper-item>
						</swiper>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item swiper-item-3">
				<scroll-view scroll-y class="creat-content"  :style=" 'height: ' + moment_swiperHeight + ';min-height: ' + moment_swiperHeight + ';max-height: ' + moment_swiperHeight + ';width: 750rpx;' " @scrolltolower="moment_onreachBottom">
					<view class="creat-wrap">
						
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="bottom-tabs-wrap">
			<view class="tabs-inner">
				<tabsSwiper ref="moment_uTabs" :list="tablist" :current="moment_current" @change="moment_tabsChange" :is-scroll="false" swiperWidth="750" inactiveColor="#cecece" active-color="#ffffff" bgColor="#141414"></tabsSwiper>
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

import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';
import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		tabsSwiper,
		miniUploadImg
	},
	computed:{
		moment_swiperHeight:{
			get(){
				let that = this;
				return ' calc( 100vh - 80rpx )';
			},
			set(v){}
		},
		album_swiperHeight:{
			get(){
				let that = this;
				return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px -  160rpx )';
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 3,
			moment_current: 1,
			moment_swiperCurrent: 1,
			tablist: [
				{
					name: '此刻'
				},
				{
					name: '相册',
				},
				{
					name: '模板'
				}
			],
			
			
			album_current: 0,
			album_swiperCurrent: 0,
			album_tablist: [
				{
					name: '图片'
				},
				{
					name: '视频',
				},
			],
			album_title: '发笔记',
			
			unused_img_page: 1,
			unused_img_list: [],
			unused_is_last_page: false,
			unused_loading_more: false,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(3, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.getUserUploadedUnusedAttachments(1, 'img');
	},
	methods: {
		getUserUploadedUnusedAttachments(flag, type){
			let that = this;
			
			if(flag == 0){
				that.setData({
					unused_img_page: 1,
					unused_img_list: [],
					unused_is_last_page: false,
					unused_loading_more: false,
				});
			}else if(flag == 1){
				that.setData({
					unused_img_page: that.unused_img_page + 1,
					unused_is_last_page: false,
					unused_loading_more: true,
				});
			}
			
			// uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/uploaded/unused-attachments', {
				page: that.unused_img_page,
				type: type
			}).then(function(res) {
				// uni.loading(false);
				if(res.status){
					if(res.data.current_page != that.unused_img_page){
						return false;
					}
					
					let data = res.data;
					let args = {};
					
					if(data.data && data.data.length > 0){
						args.unused_img_list = that.unused_img_list.concat(data.data);
						args.page = data.current_page;
						args.unused_loading_more = false;
						args.unused_is_last_page = false;
					}else{
						args.unused_is_last_page = true;
					}

					that.setData(args);
					
				}else{
					that.setData({
						unused_is_last_page: true,
					});
				}
			});
			
		},
		album_onreachBottom() {
			let that = this;
			
		},
		album_swiperChange(e){
			let that = this;
		},
		album_animationfinish(e) {
			let that = this;
			let album_current = e.detail.current;
			that.$refs.album_uTabs.setFinishCurrent(album_current);
			that.album_swiperCurrent = album_current;
			that.album_current = album_current;
		},
		album_tabsChange(index) {
			let that = this;
			that.album_swiperCurrent = index;
		},
		album_transition(e) {
			let that = this;
			let dx = e.detail.dx;
			that.$refs.album_uTabs.setDx(dx);
		},
		moment_onreachBottom() {
			let that = this;
			
		},
		moment_swiperChange(e){
			let that = this;
		},
		moment_animationfinish(e) {
			let that = this;
			let moment_current = e.detail.current;
			that.$refs.moment_uTabs.setFinishCurrent(moment_current);
			that.moment_swiperCurrent = moment_current;
			that.moment_current = moment_current;
		},
		moment_tabsChange(index) {
			let that = this;
			that.moment_swiperCurrent = index;
		},
		moment_transition(e) {
			let that = this;
			let dx = e.detail.dx;
			that.$refs.moment_uTabs.setDx(dx);
		},
	}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>