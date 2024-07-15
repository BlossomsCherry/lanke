<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="添加视频" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="add-video-page">
			<view class="inner">
				<view class="page-c-block-gap"></view>
				<view class="page-item">
					<view class="page-title">
						添加视频
					</view>
					<view class="textarea_wrap uploade">
						<view class="title-box flex-row">
							<!-- <text class="title"></text> -->
						</view>
						<view class="uploade-video-box">
							<view class="media-video">
								<view class="placeholder-video" v-if="video_url.length <= 0" @tap.stop.prevent="uploadVideo">
									<view class="box">
										<block v-if="videoProgress > 0 && videoProgress < 100">
											<view class="tip">视频上传中</view>
											<progress :percent="videoProgress" show-info stroke-width="12" border-radius ="40" :activeColor="primaryColor" :backgroundColor="global__theme__ == 'black' ? '#2d2d36' : '#e4e4e4'"/>
										</block>
										<block v-else>
											<view class="tip">点击上传</view>
										</block>
									</view>
								</view>
								<block v-else>
									<!-- #ifdef APP || H5 -->
									<view @tap="create_video_play">
									  <dom-video style="width: 400rpx;height: 300rpx;" ref="domVideo" :src="video_url"/>
									</view>
									<!-- #endif -->
									<!-- #ifdef MP -->
									<video class="video-source" :controls="true" :src="video_url"></video>
									<!-- #endif -->
									<i @tap.stop.prevent="onVideoDelete" class="picture-delete mini-icon mini-chacha"></i>
								</block>
							</view>
						</view>
					</view>
				</view>
				
				<view class="push-btn" @tap.stop.prevent="save">确定</view>
				<view style="height: 60rpx;"></view>
				
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

import mycos from '@/pages/creat/lib/mycos.js';
import domVideo from '@/contrib/components/common/ls-dom-video/ls-dom-video';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		domVideo,
	},
	computed:{

	},
	watch: {
		video_url: {
			handler: function (newVal, oldVal) {
				this.formData.video_url = this.video_url;
				this.formData.video_cover = this.video_thumb_url;
			},
			immediate: true,
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 140,
			formData: {
				video_url: '',
				video_cover: '',
			},
			video_url: '',
			video_thumb_url: '',
			videoProgress: 0,
			uuid: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(140, 0, true, false, 0, 2);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.uuid = options.uuid;
		mycos.cosUploadPictures(that, 3, 'video_url');
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		save(){
			let that = this;
			uni.setStorageSync(that.uuid, that.formData);
			uni.wen.toUrl(-2, 0, null);
		},
		uploadVideo(){
			let that = this;
			if(that.videoProgress !== 0){
				return false;
			}
			mycos.cosUploadPictures(that, 3, 'video_url');
			return false;
		},
		onVideoDelete(){
			let that = this;
			that.setData({
				formData: {
					video_url: '',
					video_cover: '',
				},
				video_url: '',
				video_thumb_url: '',
				videoProgress: 0
			});
		},
		create_video_play() {
		  let domVideo = this.$refs.domVideo;
		  domVideo.play();
		},
	}
}
</script>

<style lang="scss" scoped>
@import './video.scss';
</style>