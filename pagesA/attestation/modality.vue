<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="完成认证方式" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="modality-page-content">
			<!-- 表单 -->
			<view class="contentbox">
				<view class="titleBox">
					<view class="titletext">1.校园认证</view>
					<view class="titletip">选择以下方式中的其中一种进行认证即可</view>
				</view>
				<!-- <view class="typeBox" @click="toSliderUrl(6, '/pagesA/attestation/answer?sid=' + sid + '&term=' + term + '&role=' + role)">
					<view class="typeName">
						<view class="typeIcon"><view class="dot"></view></view>
						<view class="typeTitle">通过答题认证</view>
					</view>
					<view class="typeIllustrate">回答正确所有题目可获得该学校认证</view>
				</view> -->
				<view class="typeBox" @click="toSliderUrl(6, '/pagesA/attestation/byemail?sid=' + sid + '&term=' + term + '&role=' + role)" v-if="school && school.email_suffix && school.email_suffix.length > 0">
					<view class="typeName">
						<view class="typeIcon"><view class="dot"></view></view>
						<view class="typeTitle">通过学校邮箱认证</view>
					</view>
					<view class="typeIllustrate">通过所在学校个人邮箱收取验证码</view>
				</view>
				<view class="typeBox" @click="toSliderUrl(6, '/pagesA/attestation/byschoolcard?sid=' + sid + '&term=' + term + '&role=' + role)">
					<view class="typeName">
						<view class="typeIcon"><view class="dot"></view></view>
						<view class="typeTitle">通过校园身份证明认证</view>
					</view>
					<view class="typeIllustrate">上传录取通知书/学生证/校园卡/学位证/毕业证照片，仅用于校园认证，将严格保密</view>
				</view>
				
			</view>
			
			<view class="attestationinfo">
				<view class="attTitle">
					<view class="attIcon"></view>
					<view class="attName">为什么需要校园身份认证?</view>
				</view>
				<view class="attList">
					<view class="attLi">{{ config_about_name }}是定位于高校学生群体的<text>半私密性社区</text>，社区内部需要统一的身份认同。</view>
					<view class="attLi">{{ config_about_name }}可能涉及交友、闲置交易、招聘等业务，对于<text>安全性要求较高</text></view>
					<view class="attLi">必须进行手机号授权，是上级监管的要求，<text>用户信息受相关法律保护，将严格保密</text></view>
				</view>
				<u-gap height="40" bgColor="#f7f7f7"></u-gap>
				<view class="attTitle">
					<view class="attIcon"></view>
					<view class="attName">校园实名认证后有什么权益?</view>
				</view>
				<view class="attList">
					<view class="attLi">可以有在认证高校的社区内进行包括评论、发帖、攒局、私聊等在内的<text>一切互动权限</text>。</view>
					<view class="attLi">可以有特殊的高校<text>认证标识</text>，提高社区的可信度。</view>
					<!-- <view class="attLi">可以领取 <text>1000 RP</text> 校园新人大礼包</view> -->
				</view>
			</view>
			<!-- 下一步 -->
<!-- 			<view class="nextBut">
				完成认证
			</view> -->
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
		config_about_name:{
			get(){
				let that = this;
				return that.$store.state.config.about.name;
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			sid: '',
			role: 'student',
			term: 2023,
			school: {
				sid: null,
				email_suffix: '',
			}
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0, true);
		
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
		
		that.sid = options.sid;
		that.role = options.role;
		that.term = options.term;
		
		if(!that.sid){
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
			setTimeout(function(){
				uni.wen.toUrl(-2, null, that);
			}, 300);
			return false;
		}
		that.getschool();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		getschool(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/university', {scene: 'certify', page: 1, longitude: 0, latitude: 0, sid: that.sid }).then(res => {
			    if (res.status) {
					if(res.data.data && res.data.data.length > 0){
						that.school = res.data.data[0];
					}else{
						uni.showToast({
							title: '未查询到选择的学校',
							icon: 'none'
						})
					}
			    } else {
			        uni.showToast({title: res.message, icon: 'none', duration: 1500})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.modality-page-content{
	width: 750rpx;
	.contentbox,.attestationinfo{
		width: $page-content-body-width;
		margin: auto;
	}
	.titletext,.attName{
		font-weight: bold;
		font-size: $uni-font-size-lg-er;
	}
	.attName{
		position: relative;
		z-index: 2;
	}
	.attName::before{
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 20rpx;
	bottom: 0;
	background: $uni-color-primary-lightest;
	z-index: -1;
	}
	.titletip,.typeIllustrate{
		 @include color(color-lighter-er-dark);
		 font-size:26rpx;
	}
	.typeIllustrate{
		padding-top: 10rpx;
	}
	.typeBox{
		background: #fff;
		padding:38rpx 36rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}
	.typeName,.attTitle{
		display: flex;
	}
	.typeIcon{
		display: flex;
		flex-direction: column;
		justify-content: center;
		.dot{
			width: 20rpx;
			height: 20rpx;
			border-radius: 100%;
			background: $uni-color-primary;
		}
	}
	.typeTitle{
		line-height: 50rpx;
		padding-left: 15rpx;
		font-size: $uni-font-size-lg;
	}
	.titleBox{
		margin-top: 40rpx;
	}
	.remind{
		font-size: $uni-font-size-sm;
		text-align: center;
		line-height: 50rpx;
		@include color(color-light-dark);
	}
	.remind text{
		@include color(color-light-dark);
	}
	.attName{
		line-height: 50rpx;
		padding-left: 10rpx;
	}
	.attList{
		padding-left: 36rpx;
	}
	.attLi{
		display: list-item;
		@include color(color-light-dark);
		font-size: $uni-font-size-sm-base;
		padding-top: 22rpx;
	}
	.attLi text{
		 @include color(color-navigater);
	}
	.attestationinfo{
		margin-top: 30rpx;
		padding-bottom: 250rpx;
	}
	.nextBut{
		background: #999;
		width: 688rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: $uni-font-size-lg;
		font-weight: bold;
		color: #fff;
		border-radius: 80rpx;
		position: fixed;
		bottom: 50rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9999;
	}
}
</style>

