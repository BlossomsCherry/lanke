<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body ">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="feedback-body">
				<view style="height: 20rpx;"></view>
				<!-- #ifdef MP-WEIXIN -->
				<u-alert title="此投诉为本小程序自有投诉渠道，非微信官方投诉渠道" type = "warning" :closable="true"></u-alert>
				<view style="height: 20rpx;"></view>
				<!-- #endif -->
				<text class="text-black">举报类型<text style="color: red;">*</text></text>
				<picker @change="bindPickerChange" :value="index" :range="cats">
				    <view class="picker">
				        {{ cats[index] }}&nbsp;&nbsp;>
				    </view>
				</picker>
				<text class="text-black">举报理由
					<text class="_text" style="color: red;">*</text></text>
				<textarea placeholder="请您描述您的举报理由..." v-model="report_content" class="feedback-textare" maxlength="-1"/>
			
				<view class="image-title">
					<text class="text-black">上传截图<text class="text-grey"> (选填，最多可上传6张)
						</text>
					</text>
				</view>
				<view class="media-picture">
					<view @tap.stop.prevent="onPreviewPicture" class="picture-item" :data-src="image_urls" :data-pic="image_urls"
						v-for="(item, index) in image_urls" :key="index">
						<image class="picture-image" mode="aspectFill" :src="item.url"></image>
						<i @tap.stop.prevent="onPictureDelete" class="picture-delete mini-icon mini-chacha" :data-index="index"></i>
					</view>
					<view @tap.stop.prevent="addPictures" class="picture-item-add"
						v-if="image_urls == null || image_urls == '' || image_urls.length < pictureMax">
						<image class="picture-add-image"
							src="/static/image/new_construction_circle_cover_upload_picture.png"></image>
					</view>
				</view>
				<view class="text-grey">{{ image_urls.length }}/6</view>
				<view class="filepicker">
				</view>
			
				<text class="text-black" v-if=" config_app_mode != 'examine' ">联系方式<text class="text-grey">(选填)</text> </text>
				<input class="feedback-input" v-model="mobile" placeholder="请输入您的联系方式" v-if=" config_app_mode != 'examine' " />
				<view class="btn">
					<button :class="'btn-submit ' + (!report_content ? 'disabled' : '')" @tap.stop.prevent="userFeedback">
						提交举报
					</button>
				</view>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
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
			config_app_mode:{
				get(){
					let that = this;
					return that.$store.state.config.app.mode;
				},
				set(v){}
			}
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 18,
				page_title: '举报',
				report_content: '',
				mobile: '',
				btnLoading: false,
				index: 0,
				cats: ['欺诈', '色情政治', '诱导行为', '强制关注行为', '传播不实信息', '违法犯罪', '骚扰', '违规营销', '侵权', '广告', '图片不适', '其他'],
				report_type: '欺诈',
				pictureMax: 6,
				image_urls: [],
				type: -1,
				object_id: -1,
				canSubmit: false
			};
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			if(options.type == 'undefined' || options.object_id == 'undefined'){
				uni.showToast({
					title: '页面错误，将退出该页面',
					icon: 'none'
				});
				return false;
			}
			that.type = options.type;
			that.object_id = options.object_id;
			console.log(that.type);
			if([0,1,2,3].includes(that.type) && that.object_id > 0){
				that.canSubmit = true;
			}
			if(that.type == 0){
				that.page_title = '举报ta的内容';
			}else if(that.type == 1){
				that.page_title = '举报ta的评论';
			}else if(that.type == 2){
				that.page_title = '举报ta';
			}else if(that.type == 3){
				that.page_title = '举报该商品';
			}else if(that.type == 4){
				that.page_title = '举报该圈子';
			}
		},
		onShow: function () {
			let that = this;
			that.updateScene(18, 0, true);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			/**
			 * 用户反馈
			 */
			userFeedback() {
				let that = this;
				if(that.type == -1 || that.object_id == -1){
					uni.showToast({
						title: '页面错误，请刷新后再试',
						icon: 'none'
					});
					return;
				}
				let report_content = that.report_content;
			
				if (report_content == '' || report_content == null) {
					uni.showToast({
						title: '您还没有填写您的问题和意见哦！',
						icon: 'none'
					});
					return;
				}
				uni.loading(true);
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'user/report', {
						type: that.type,
						object_id: that.object_id,
						report_type: that.report_type,
						report_content: report_content,
						image_urls: that.image_urls,
						contact: that.mobile
					},
					'POST'
				).then(function(res) {
					uni.loading(false);
					if(res.status){
						uni.showToast({
							title: '举报成功！感谢您的监督',
							icon: 'none'
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			onInputChange: function (t) {
			    var a = t.currentTarget.dataset.type;
			    var o = t.detail.value;
			    if (2 == a) {
			        this.setData({
			            report_content: o,
			            descLength: o.length
			        });
			    }
			},
			
			bindPickerChange: function (e) {
			    this.setData({
			        index: e.detail.value,
			        report_type: this.cats[e.detail.value]
			    });
			},
			addPictures() {
				let that = this;
				let pictureMax = 6 - that.image_urls.length;
				this.uploadPictures(2, 'url' , pictureMax);
			},
			//删除图片
			onPictureDelete: function(e) {
				var index = e.currentTarget.dataset.index;
				this.image_urls.splice(index, 1);

				this.setData({
					image_urls: this.image_urls
				});
			},
		}
	};
</script>

<style lang="scss">
	.text-black {
		@include color(color-light-dark);
		font-size: $uni-font-size-lg;
	}
	.picker {
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
	    @include color(color-light-dark);
	    font-size: $uni-font-size-base;
	    line-height: 2em;
	    width: 100%;
	    box-sizing: border-box;
	    padding: 20rpx 30rpx;
	    border-radius: 20rpx;
	    @include background_color(page-box-item-background-color);
	}

	.text-grey {
		color: #BCBCBC;
		font-size: $uni-font-size-sm;
		margin-left: 15rpx;
	}

	.feedback-quick {
		padding-right: 10rpx;
		color: #606266;
		font-size: $uni-font-size-lg;
	}

	.feedback-body {
		width: $page-content-body-width;
		margin: auto;
	}

	.feedback-textare {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		height: 266rpx;
		@include color(color-light-dark);
		font-size: $uni-font-size-base;
		line-height: 2em;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		@include background_color(page-box-item-background-color);
	}

	.feedback-input {
		font-size: $uni-font-size-base;
		@include color(color-light-dark);
		@include background_color(page-box-item-background-color);
		border-radius: 20rpx;
		height: 100rpx;
		min-height: 100rpx;
		padding: 0 30rpx;
		margin-top: 30rpx;
		margin-bottom: 60rpx;
	}

	.btn-submit {
		border-radius: 0;
		@include color(color-darkest);
		@include background_color(page-box-item-background-color);
	}
	.btn-submit.disabled{
		@include background_color(page-gray-background-color);
	}

	.image-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: #606266;

	}

	.filepicker {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.btn {
		position: fixed;
		bottom: 0;
		left: 0 ;
		right: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.media-picture {
	    display: flex;
	    flex-direction: row;
	    justify-content: flex-start;
	    align-items: center;
	    flex-wrap: wrap;
	    box-sizing: border-box;
	    margin-top: 40rpx;
		padding: 20rpx 0;
	}
	
	.picture-item {
	    position: relative;
	    width: 220rpx;
	    height: 220rpx;
	    margin: 0 5rpx 5rpx;
	    box-sizing: border-box;
	    border-radius: 8rpx;
	}
	
	.picture-image {
	    width: 220rpx;
	    height: 220rpx;
	    border-radius: 8rpx;
	    @include background_color(page-box-item-background-color);
	    animation: fadeIn 1s ease;
	}
	
	.picture-delete {
	    position: absolute;
	    top: 10rpx;
	    right: 8rpx;
	    width: 40rpx;
	    height: 40rpx;
	    border-radius: 500rpx;
	    background: rgba(255, 255, 255, 0.7);
	}
	
	.picture-item-add {
	    position: relative;
	    width: 220rpx;
	    height: 220rpx;
	    margin: 5rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	    box-sizing: border-box;
	    border: 1px solid;
	    border-radius: 8rpx;
		@include border_color(border-color-box-item-background-color);
	}
	
	.picture-add-image {
	    width: 64rpx;
	    height: 64rpx;
	}
</style>
