<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="发布选票" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="voter-creat-page">
			<view class="inner">
				<view class="page-c-block-gap"></view>
				<view class="page-item vote_header">
					<view class="left">
						<view class="avatar-box">
							<image class="avatar" :src="voter.master_user_avatar"></image>
							<view class="update-tip" @tap.stop.prevent="imageClipper('avatarClip')">
								<view class="_text">编辑标志</view>
							</view>
						</view>
						<view class="name-info">
							<view class="name-box" @tap.stop.prevent="showChangeNickName(true)">
								<text class="master-name u-line-1">{{ voter.master_user_name }}</text>
								<i class="mini-icon mini-xie"></i>
							</view>
						</view>
					</view>

				</view>
				<view class="page-c-block-gap"></view>
				<view class="page-item vote_cover">
					<view class="page-title">
						封面图
					</view>
					<block v-if="template && template.id > 0">
						<view class="current-template">
							模板：{{ template.name }}
							<i class="mini-icon mini-gou"></i>
						</view>
						<view class="banners">
							<u-swiper @click="showBannerEditPopup" :height="360" :list="voter.banners" keyName="image" indicator :indicatorActiveColor="template.main_color" indicatorMode="line"  :autoplay="true" circular :bgColor="template.backgroundColor"></u-swiper>
						</view>
					</block>
				</view>
				<view class="page-c-block-gap"></view>
				<view class="page-item">
					<view class="page-title">
						基本设置
					</view>
					<view class="input_wrap">
						<view class="title-box flex-row">
							<text class="title">投票标题</text>
							<text class="required">*</text>
						</view>
						<view class="input-box">
							<u-input class="_input" border="none"  fontSize="28rpx" :maxlength="30" placeholder="请输入投票活动标题" inputAlign="right" placeholderClass="_input_place_holder" v-model="voter.title"></u-input>
						</view>
					</view>
					
					<view class="input_wrap">
						<view class="title-box flex-row">
							<text class="title">投票公告</text>
						</view>
						<view class="input-box">
							<u-input class="_input" fontSize="28rpx" border="none" :maxlength="50" placeholder="请输入投票公告" placeholderClass="_input_place_holder" inputAlign="right"
								v-model="voter.notice"></u-input>
						</view>
					</view>
					
					<view class="textarea_wrap">
						<view class="title-box flex-row">
							<text class="title">投票活动说明</text>
							<text class="required">*</text>
						</view>
						<view class="textarea-box">
							<u-textarea class="_textarea" fontSize="28rpx" maxlength="1000" v-model="voter.vcontent" height="300" placeholderClass="_input_place_holder" 
								placeholder="请输入内容" count border="none"></u-textarea>
						</view>
					</view>
				</view>
				<view class="page-c-block-gap"></view>
				<view class="page-item vote_cover">
					<view class="page-title">
						投票规则
					</view>
					
					<view class="datepicker_wrap">
						<view class="title-box flex-row">
							<text class="title">投票开始时间</text>
							<text class="required">*</text>
						</view>
						<view class="datepicker-box" @click="showVoteStartTimeClick">
							<view :class="'_text ' + ((voter.start_time == 0 || voter.start_time == '') ? 'placeholder' : '')">{{ (voter.start_time == 0 || voter.start_time == '') ? '点击设置' :  formatDate(voter.start_time) }}</view>
							<i class="mini-icon mini-youjiantou"></i>
						</view>
					</view>
					
					<view class="datepicker_wrap">
						<view class="title-box flex-row">
							<text class="title">投票结束时间</text>
							<text class="required">*</text>
						</view>
						<view class="datepicker-box" @click="showVoteEndTimeClick">
							<view :class="'_text ' + ((voter.end_time == 0 || voter.end_time == '') ? 'placeholder' : '')">{{ (voter.end_time == 0 || voter.end_time == '') ? '点击设置' :  formatDate(voter.end_time) }}</view>
							<i class="mini-icon mini-youjiantou"></i>
						</view>
					</view>
					<view class="input_wrap times">
						<view class="title-box flex-row">
							<text class="title">投票次数</text>
							<u-icon name="question-circle" color="#666" customStyle="margin-left:2px;" size="28"  @click="voteHelp('投票次数','可以设置每人每天可以投多少次，或者总共可以投多少次')"></u-icon>
						</view>
						<voterTimesSelect @onTimesSelected="handleTimesSelected" :localdata="voter.voteTimes"></voterTimesSelect>
					</view>
					<view class="switch-wrap">
						<view class="title-box flex-row">
							<text class="title">平台曝光</text>
							<u-icon name="question-circle" color="#666" customStyle="margin-left:2px;" size="28"
								@click="voteHelp('免费曝光', '允许投票活动在包括且不限于平台小程序/公众号/第三方平台等渠道展示，获得更多参与用户。')"></u-icon>
						</view>
						<view class="switch-box">
							<u-switch size="30" v-model="voter.is_exposure" inactiveColor="#e4f1fe" :activeColor="primaryColor" @change="localShowChange"></u-switch>
						</view>
					</view>
				</view>
				<view class="page-c-block-gap"></view>
				<view class="push-btn" @tap.stop.prevent="safeSetting">创建选票</view>
				<view style="height: 60rpx;"></view>
			</view>
		</view>
		
		<!-- 开始投票时间选择器 -->
		<view>
			<u-datetime-picker ref="datetimePicker" :show="showVoteStartTime" :closeOnClickOverlay="false"
				:minDate="Number(Date.now())" @close="closeVoteStartTime" @cancel="closeVoteStartTime"
				@confirm="confirmVoteStartTime" v-model="voter.start_time" mode="datetime"
				:formatter="formatter"></u-datetime-picker>
		</view>
		
		<!-- 结束投票时间选择器 -->
		<!-- Date.now() + 87600000 当前时间最少持续1天 -->
		<view>
			<u-datetime-picker ref="datetimePicker" :show="showVoteEndTime"
				:minDate="Number(voter.start_time + 87600000)" :closeOnClickOverlay="false" @close="closeVoteEndTime"
				@cancel="closeVoteEndTime" @confirm="confirmVoteEndTime" v-model="voter.end_time"
				mode="datetime" :formatter="formatter"></u-datetime-picker>
		</view>
		
		<u-popup :show="showNickName" @close="showChangeNickName(false)" :closeOnClickOverlay="false" :safeAreaInsetBottom="false"round="10px" mode="center">
			<view class="nickname-dialog-wrapper">
				<view class="title-wrapper">修改显示名称</view>
					<view class="input-box">
						<u-input placeholder="输入您想修改的名称" maxlength="30" v-model="tempNickName" :clearable="true"></u-input>
					</view>
					<view class="flex-row">
						<u-button type="primary" text="取消" shape="circle" :plain="true" @click="showChangeNickName(false)" :customStyle="{transform: 'scale(0.8)'}"></u-button>
						<view style="width: 60rpx;"></view>
						<u-button type="primary" text="确定" :color="primaryColor" shape="circle" :customStyle="{transform: 'scale(0.8)'}" @click="changeNickName"></u-button>
					</view>
			</view>
		</u-popup>
		
		<l-clipper v-if="avatarClip" :image-url="pic" @success="addimage($event, { name: 'avatarTmp', type: 'avatarClip' })" @cancel="avatarClip = false"/>
		
		<banner-editor :pop="bannerEditPopup" :list="voter.banners" @success="bannerEditSuccess"></banner-editor>

		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import LClipper from '@/pagesA/components/lime-clipper/components/l-clipper/l-clipper';

import {typeData,timesData} from '@/pagesV/components/voterTimesSelect/times.js';
import voterTimesSelect from '@/pagesV/components/voterTimesSelect/voteTimesSelect';
import bannerEditor from '@/pagesA/components/banner-editor/banner-editor';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		LClipper,
		voterTimesSelect,
		bannerEditor
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 126,
			voter: {
				type: 'push',
				id: 0,
				master_user_avatar: "",
				master_user_name: "",
				template_id: 1,
				title: "",
				notice: "",
				vcontent: "", // 由于传输参数不能是 content，加了个v
				banners: [],
				is_open_enter: 1,
				is_exposure: 1,
				is_open_vote_comment: 1,
				is_open_player_comment: 1,
				is_can_be_anonymous: 0,
				is_hide_rank: 0,
				is_hide_vote_record: 0,
				is_hide_player_count: 0,
				music_url: null,
				music_name: null,
				is_music_auto: 0,
				start_time: 0,
				end_time: 0,
				enter_start_time: 0,
				enter_end_time: 0,
				user_day_limit: 0,
				user_total_limit: 0,
				player_called: "选手",
				unit_called: "票",
				main_background_image: null,
				user_background_image: null,
				background_color: "",
				text_color: "",
				main_color: "",
				button_bg_color: "",
				button_text_color: "",
				text_navigation_bar_color: "",
				voteTimes: [0,0],
			},
			innerAudioContext: null,
			
			template_id: 0,
			template: null,
			
			showVoteStartTime: false,
			showVoteEndTime: false,
			showNickName: false,
			bannerEditPopup: 0,
			
			
			avatarClip: false,
			pic: '', // 过度保存
			avatarTmp: '',
			tempNickName: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(126, 0, true, false, 0, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.template_id = options.template;
		if(that.template_id > 0){
			that.voter.template_id = that.template_id;
		}
		that.getTemplateInfo();
		
		if(that.myUserInfo.id > 0 && that.voter.master_user_name.length == 0){
			that.voter.master_user_name = that.myUserInfo.user_name + '的选票';
			that.voter.master_user_avatar = that.myUserInfo.user_avatar;
		}
	},
	onUnload() {
		if (this.innerAudioContext) { // 如果存在音频实例
			this.innerAudioContext.pause(); // 暂停播放
			this.innerAudioContext.destroy(); // 销毁实例
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onReady() {
		let that = this;
		// 微信小程序需要用此写法
		// #ifdef MP-WEIXIN
		try{
			that.$refs.datetimePicker.setFormatter(this.formatter)
		}catch(e){
			//TODO handle the exception
			that.$refs.datetimePicker.setFormatter(this.formatter)
		}
		// #endif
	},
	methods: {
		safeSetting() {
			let that = this;
			if (that.checkMustValue()) {
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/process', that.voter, 'POST').then(function(res) {
					uni.loading(false);
					if(res.status){
						uni.showToast({
							title: res.message,
							icon: 'icon'
						});
						setTimeout(function(){
							uni.wen.toUrl(-6, '/pagesV/voter/detail/detail?id=' + res.data, that);
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
		checkMustValue() {
			 // 如果在线报名开始时间为空，则设置为投票活动开始时间
			let that = this;
			if(that.voter.enter_start_time === 0) {
				that.voter.enter_start_time = that.voter.start_time;
			}
			if(that.voter.enter_end_time === 0) {
				that.voter.enter_end_time = that.voter.end_time;
			}
			const conditions = [
				{
					condition: that.voter.title === '',
					message: '请填写投票活动标题'
				},
				{
					condition: that.voter.vcontent === '',
					message: '请填写投票活动内容'
				},
				{
					condition: that.voter.start_time == 0 || that.voter.start_time == '',
					message: '请设置投票活动开始时间'
				},
				{
					condition: that.voter.end_time == 0 || that.voter.end_time == '',
					message: '请设置投票活动结束时间'
				},
				{
					condition: that.voter.end_time <= that.voter.start_time,
					message: '投票结束时间不能早于或等于开始时间'
				},
				{
					condition: that.voter.enter_end_time <= that.voter.enter_start_time,
					message: '报名结束时间不能早于或报名开始时间'
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
		bannerEditSuccess(res){
			this.voter.banners = res.list;
		},
		addimage(e, _dataset) {
		  let that = this
		  /* ---处理dataset begin--- */
		  that.datasetHandle(e, _dataset);
		  /* ---处理dataset end--- */
		
		  const name = e.currentTarget.dataset.name
		  const type = e.currentTarget.dataset.type
		  that.setData({ [type]: false });
		
		  that.uploadPicturesPic(e.url, e.currentTarget.dataset.name, e.currentTarget.dataset.type, 126).then(() => {
		    if (type == 'avatarClip') {
				that.voter.master_user_avatar = that.avatarTmp;
		    } else if(type == 'bannerClipper'){
		      
		    }
		  })
		},
		changeNickName() {
			this.voter.master_user_name = this.tempNickName
			this.showNickName = false
		},
		showChangeNickName(flag) {
			this.showNickName = flag
		},
		handleTimesSelected(value) {
			this.voter.voteTimes = value;
		},
		localShowChange(e) {
			// console.log(e)
			this.voter.is_exposure = e
		},
		voteHelp(title, desc) {
			uni.showModal({
				title: title,
				content: desc,
				showCancel: false
			})
		},
		// 设置开始结束时间
		showVoteStartTimeClick() {
			this.showVoteStartTime = true
		},
		closeVoteStartTime() {
			this.showVoteStartTime = false
		},
		confirmVoteStartTime(e) {
			// console.log(e)
			this.voter.start_time = e
			this.showVoteStartTime = false
		},
		showVoteEndTimeClick() {
			if (this.voter.start_time == 0 || this.voter.start_time == '') {
				uni.showModal({
					title: '提示',
					content: '请先设置投票开始时间',
					showCancel: false
				})
			} else {
				this.showVoteEndTime = true
			}
		},
		closeVoteEndTime() {
			this.showVoteEndTime = false
		},
		confirmVoteEndTime(e) {
			// console.log(e)
			this.voter.end_time = e
			this.showVoteEndTime = false
		},
		//显示时间戳的时候格式化
		formatDate(timestamp) {
			// 创建新的 Date 对象
			var date = new Date(timestamp);
		
			// 获取年、月、日和小时、分钟
			var year = date.getFullYear();
			var month = (date.getMonth() + 1).toString().padStart(2, '0');
			var day = date.getDate().toString().padStart(2, '0');
			var hours = date.getHours().toString().padStart(2, '0');
			var minutes = date.getMinutes().toString().padStart(2, '0');
		
			// 返回格式化的日期字符串
			return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes;
		},
		// 弹出时间选择器的时候格式化
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`
			}
			if (type === 'month') {
				return `${value}月`
			}
			if (type === 'day') {
				return `${value}日`
			}
			if (type === 'hour') {
				return `${value}时`
			}
			if (type === 'minute') {
				return `${value}分`
			}
			return value
		},
		getTemplateInfo(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/template/info', {
				id: that.template_id,
			}).then(function(res) {
				if(res.status){
					that.template = res.data;
					if(that.voter.banners.length <= 0){
						that.voter.banners = that.template.banner;
					}
				}else{
					uni.showToast({
						title: res.message,
						icon: 'icon'
					})
				}
			});
		},
		showBannerEditPopup(){
			this.bannerEditPopup += 1;
		}
	}
}
</script>

<style lang="scss" scoped>
@import './creat.scss';
</style>