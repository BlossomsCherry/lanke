<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="学生认证" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="attestation-page-content">
			<view style="height: 30rpx;"></view>
			<view class="inner">
				<view class="page-block">
					<view class="line">
						<view class="title">选择学校</view>
						<view class="right" @tap.stop.prevent="schoolePopup = !schoolePopup">{{ formData.school.name || '点击选择' }}</view>
					</view>
					<view class="split"></view>
					<view class="line">
						<view class="title">选择身份</view>
						<view class="right" @tap.stop.prevent="rolePopup = !rolePopup">{{ formData.role.label }}</view>
					</view>
					<view class="split"></view>
					<view class="line">
						<view class="title">入学年份</view>
						<view class="right" @tap.stop.prevent="termPopup = !termPopup">{{ formData.term }}</view>
					</view>
				</view>
				<view class="tip">提示： 一经认证，暂规定不可更改</view>
			</view>
			<view style="height: 30rpx;"></view>
			<view class="inner">
				<view class="btns">
					<view class="btn" @tap.stop.prevent="nextStep">下一步</view>
				</view>
			</view>
		</view>
		
		<list-select :show="schoolePopup" popupTitle="选择学校" placeholder="学校名称关键字" :loadmoreShow="loadmoreShow" :isLastPage="isLastPage" :dataLists="schools" @search="searchSchoolList" @submit="submitSchool" @cancel=" schoolePopup = false " @lower="onListLower"></list-select>
		<u-picker :show="termPopup" :columns="termColumns" keyName="label" :closeOnClickOverlay="true" @close="termPopup = false" @cancel="termPopup = false" @confirm="termConfirm" :confirmColor="primaryColor"></u-picker>
		<u-picker :show="rolePopup" :columns="roleColumns" keyName="label" :closeOnClickOverlay="true" @close="rolePopup = false" @cancel="rolePopup = false" @confirm="roleConfirm" :confirmColor="primaryColor"></u-picker>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import listSelect from '@/pagesA/components/list-select/list-select';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		listSelect,
		
	},
	computed:{
		
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 133,
			schoolePopup: false,
			
			formData: {
				school: {id: -1, name: ''},
				term: 2023,
				role: {
					label: '学生',
					id: 'student'
				}
			},
			
			rolePopup: false,
			roleColumns: [
				[
					{
						label: '学生',
						id: 'student'
					}
				]
			],
			
			termPopup: false,
			termColumns: [
				[{
					label: '2015年入学',
					id: 2015
				}, {
					label: '2016年入学',
					id: 2016
				},{
					label: '2017年入学',
					id: 2017
				},{
					label: '2018年入学',
					id: 2018
				},{
					label: '2019年入学',
					id: 2019
				},{
					label: '2020年入学',
					id: 2020
				},{
					label: '2021年入学',
					id: 2021
				},{
					label: '2022年入学',
					id: 2022
				},{
					label: '2023年入学',
					id: 2023
				},{
					label: '2024年入学',
					id: 2024
				}]
			],
			
			schools: [],
			keyword: '',
			page: 1,
			isLastPage: false,
			loadmoreShow: false,
			listLoading: true,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(133, 0, true);
		
		if(that.myUserInfo.id > 0){
			if(that.myUserInfo.university && that.myUserInfo.university.length > 0){
				uni.showToast({
					title: '您已完成学生认证，无需再次认证',
					icon: 'none'
				});
				setTimeout(function(){
					uni.wen.toUrl(-2, null, that);
				}, 700);
				return false;
			}
		}
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.getSchoolList();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		onListLower(){
			let that = this;
			if(that.listLoading){
				return false;
			}
			if(!that.isLastPage && that.schools.length > 0){
				that.setData({
					loadmoreShow: true,
					isLastPage: false,
					page: that.page + 1
				});
				that.getSchoolList();
			}
		},
		nextStep(){
			let that = this;
			if(!that.formData.school.sid){
				uni.showToast({
					title: '请选择学校',
					icon: 'none'
				});
				return false;
			}
			if(that.formData.term == null || that.formData.term == undefined){
				uni.showToast({
					title: '请选择入学年份',
					icon: 'none'
				});
				return false;
			}
			if(that.formData.role.id != 'student'){
				uni.showToast({
					title: '请选择身份',
					icon: 'none'
				});
				return false;
			}
			uni.wen.toUrl(6, '/pagesA/attestation/notice?sid=' + that.formData.school.sid + '&term=' + that.formData.term + '&role=' + that.formData.role.id, that);
		},
		roleConfirm(e){
			let that = this;
			that.rolePopup = false;
			that.formData.role = e.value[0];
		},
		termConfirm(e){
			let that = this;
			that.termPopup = false;
			that.formData.term = e.value[0].id;
		},
		submitSchool(school){
			this.formData.school = {
				sid: school.sid,
				name: school.name
			}
			this.schoolePopup = false;
		},
		searchSchoolList(keyword){
			let that = this;
			if(keyword && keyword.length > 0){
				if(that.keyword.length <= 0){
					that.setData({
						schools: [],
						page: 1,
						isLastPage: false,
						loadmoreShow: false,
						listLoading: true,
					});
				}
				that.keyword = keyword;
				that.getSchoolList();
			}else{
				that.setData({
					schools: [],
					page: 1,
					keyword: '',
					isLastPage: false,
					loadmoreShow: false,
					listLoading: true,
				});
				that.getSchoolList();
			}
			
		},
		getSchoolList(){
			let that = this;
			that.listLoading = true;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/university', {scene: 'certify', page: that.page, longitude: 0, latitude: 0, keyword: that.keyword }).then(res => {
			    if (res.status) {
					
					if(res.data.current_page != that.page){
						return false;
					}
					
					let data = res.data;
					let args = {};
					
					if(data.data && data.data.length > 0){
						args.schools = that.schools.concat(data.data);
						args.page = data.current_page;
						if(data.data.length >= 10){
							args.loadmoreShow = false;
							args.isLastPage = false;
						}else{
							args.loadmoreShow = true;
							args.isLastPage = true;
						}
					}else{
						args.loadmoreShow = true;
						args.isLastPage = true;
					}
					args.listLoading = false;
					that.setData(args);
					
			    } else {
			        uni.showToast({title: res.message, icon: 'none', duration: 1500})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.attestation-page-content{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.page-block{
			@include background_color(page-box-background-color);
			padding: 30rpx;
			box-sizing: border-box;
			.line{
				display: flex;
				justify-content: space-between;
				height: 90rpx;
				.title{
					height: 90rpx;
					line-height: 90rpx;
					font-size: $uni-font-size-base;
					@include color(color-lighter-er-dark);
				}
				.right{
					height: 90rpx;
					line-height: 90rpx;
					font-size: $uni-font-size-base;
					@include color(color-light-dark);
				}
			}
			.split{
				@include background_color(page-lighter-line-background-color);
				height: 1px;
				width: 100%;
			}
		}
		.tip{
			margin-top: 20rpx;
			font-size: $uni-font-size-base;
			@include color(color-error);
		}
		.btns{
			.btn{
				width: $page-content-body-width;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				border-radius: $uni-border-radius-sm;
			}
		}
	}
}
</style>