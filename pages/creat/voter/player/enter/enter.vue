<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="参与选票" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="enter-voter-page">
			<view class="inner">
				<view class="page-c-block-gap"></view>
				<view class="page-item">
					<view class="page-title">
						基本设置
					</view>
					<view class="input_wrap">
						<view class="title-box flex-row">
							<text class="title">参赛人</text>
							<text class="required">*</text>
						</view>
						<view class="input-box">
							<u-input class="_input" border="none" :maxlength="30" placeholder="请输入参赛人展示姓名" inputAlign="right"
								v-model="playerForm.show_name"></u-input>
						</view>
					</view>
					<view class="input_wrap">
						<view class="title-box flex-row">
							<text class="title">作品名称</text>
						</view>
						<view class="input-box">
							<u-input class="_input" border="none" :maxlength="30" placeholder="请输入作品名称" inputAlign="right"
								v-model="playerForm.work_name"></u-input>
						</view>
					</view>
					<view class="textarea_wrap">
						<view class="title-box flex-row">
							<text class="title">作品描述</text>
						</view>
						<view class="textarea-box">
							<u-textarea class="_textarea" maxlength="300" v-model="playerForm.work_desc" height="300"
								placeholder="请输入作品描述" count border="none"></u-textarea>
						</view>
					</view>
				</view>
				<view class="page-c-block-gap"></view>
				<view class="page-item">
					<view class="page-title">
						媒体
					</view>
					
					<view class="textarea_wrap uploade">
						<view class="title-box flex-row">
							<text class="title">上传图片</text>
							<text class="required">*</text>
						</view>
						<view class="uploade-box">
							<mini-upload-img ref="miniUploader" style="width: 690rpx;" @uploading=" isUploading = true " :number="9" @change="miniUploadImgChange" :showAdd="true"></mini-upload-img>
						</view>
					</view>
					<view class="textarea_wrap uploade">
						<view class="title-box flex-row">
							<text class="title">上传视频</text>
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
											<view class="tip">上传视频</view>
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
				<view class="page-c-block-gap"></view>
				<block v-if=" config_app_mode != 'examine' ">
					<view class="page-item">
						<view class="page-title">
							其他信息
						</view>
						<view class="input_wrap">
							<view class="title-box flex-row">
								<text class="title">联系方式</text>
							</view>
							<view class="input-box">
								<u-input class="_input" border="none" :maxlength="30" placeholder="请输入手机号或微信号" inputAlign="right"
									v-model="playerForm.contact_text"></u-input>
							</view>
						</view>
					</view>
					<view class="page-c-block-gap"></view>
				</block>
				
				<view class="push-btn" @tap.stop.prevent="safeSetting">提交审核</view>
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
import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
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
		miniUploadImg
	},
	computed:{
		config_app_mode:{
			get(){
				let that = this;
				if(that.$store.state.config.app && that.$store.state.config.app.mode){
					return that.$store.state.config.app.mode;
				}
				return ' ';
			},
			set(v){}
		},
	},
	watch: {
		video_url: {
			handler: function (newVal, oldVal) {
				this.playerForm.video_url = this.video_url;
				this.playerForm.video_cover = this.video_thumb_url;
			},
			immediate: true,
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 129,
			videoProgress: 0,
			playerForm: {
				type: 'push_player',
				voter_id: 0,
				show_name: '',
				work_name: '',
				work_desc: '',
				img_urls: [],
				videoProgress: 0,
				video_url: '',
				video_cover: '',
				contact_text: ''
			},
			video_url: '',
			video_thumb_url: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(129, 0, true, false, 0, 2);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.playerForm.voter_id = options.voter;
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		checkMustValue() {
			 // 如果在线报名开始时间为空，则设置为投票活动开始时间
			let that = this;
			const conditions = [
				{
					condition: that.playerForm.voter_id <= 0,
					message: '该表单未关联选票，无法提交'
				},
				{
					condition: that.playerForm.show_name == '',
					message: '请填写参赛人姓名'
				},
				{
					condition: that.playerForm.img_urls.length <= 0,
					message: '请上传图片'
				}
			];
		
			for (let i = 0; i < conditions.length; i++) {
				if (conditions[i].condition) {
					uni.showToast({
						title: conditions[i].message,
						icon: 'none'
					})
					return false; // 一旦有条件未通过，立即返回 false
				}
			}
		
			return true; // 如果所有条件都通过，返回 true
		},
		safeSetting() {
			let that = this;
			if (that.checkMustValue()) {
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/process', that.playerForm, 'POST').then(function(res) {
					uni.loading(false);
					if(res.status){
						uni.showToast({
							title: res.message,
							icon: 'icon'
						});
						setTimeout(function(){
							if(that.$store.state.pre_scene == 128 && that.$store.state.pre_scene_id == res.data){
								uni.wen.toUrl(-2, null, that);
							}else{
								uni.wen.toUrl(6, '/pagesV/voter/detail/detail?id=' + res.data, that);
							}
						}, 400);
					}else{
						uni.showToast({
							title: res.message,
							icon: 'icon'
						})
					}
				});
			}
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
			that.playerForm.video_url = '';
			that.playerForm.video_cover = '';
			that.video_url = '';
			that.video_thumb_url = '';
		},
		create_video_play() {
		  let domVideo = this.$refs.domVideo;
		  domVideo.play();
		},
		miniUploadImgChange(data) {
		  let that = this;
		  that.playerForm.img_urls = data.urls;
		},
	}
}
</script>

<style lang="scss" scoped>
@import './enter.scss';
</style>