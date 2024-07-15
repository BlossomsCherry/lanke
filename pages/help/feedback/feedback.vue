<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="feedback-body">
			<text class="text-black">反馈问题类型<text class="_text" style="color: red;">*</text></text>
				<picker @change="bindPickerChange" :value="index" :range="cats">
				    <view class="picker">
				        {{ cats[index] }}&nbsp;&nbsp;>
				    </view>
				</picker>
				<text class="text-black">问题反馈和意见建议
					<text class="_text" style="color: red;">*</text></text>
				<textarea placeholder="请描述您遇到的问题或对本产品的建议..." v-model="feedback_content" class="feedback-textare" maxlength="-1"/>
			
				<view class="image-title">
					<text class="text-black">上传问题截图<text class="text-grey"> (选填，最多可上传6张)
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
			
				<text class="text-black">联系方式<text class="text-grey">(选填)</text> </text>
				<input class="feedback-input" :value="mobile" placeholder="请输入您的联系信息" @input="mobile_input"/>
				<view class="btn">
					<button :class="'btn-submit ' + (!feedback_content ? 'disabled' : '')" @tap.stop.prevent="userFeedback">
						提交
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
		components: {
			myToast,navBar,hoverBall,
		},
		mixins: [{ methods: options }],
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 40,
				feedback_content: '',
				mobile: '',
				btnLoading: false,
				index: 0,
				cats: ['功能问题', '其他问题'],
				feedback_type: '功能问题',
				pictureMax: 6,
				image_urls: [],
			};
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);

		},
		onShow: function () {
			let that = this;
			that.updateScene(40, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			mobile_input(e){
				let that = this;
				that.mobile = e.detail.value;
			},
			/**
			 * 用户反馈
			 */
			userFeedback() {
				let that = this;
				let feedback_content = that.feedback_content;
			
				if (feedback_content == '' || feedback_content == null) {
					uni.showToast({
						title: '您还没有填写您的问题和意见哦！',
						icon: 'none'
					});
					return;
				}
				uni.loading(true);
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'feedback/add', {
						feedback_type: that.feedback_type,
						feedback_content: feedback_content,
						image_urls: that.image_urls,
						contact: that.mobile
					},
					'POST'
				).then(function(res) {
					uni.loading(false);
					if(res.status){
						uni.showToast({
							title: '反馈成功！',
							icon: 'none'
						});
						setTimeout(function () {
							uni.wen.toUrl(6, '/pages/help/feedbackList/feedbackList', null);
						}, 4000);
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
			            feedback_content: o,
			            descLength: o.length
			        });
			    }
			},
			
			bindPickerChange: function (e) {
			    this.setData({
			        index: e.detail.value,
			        feedback_type: this.cats[e.detail.value]
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
	    background-color: #F5F6F8;
		@include background_color(border-color-box-item-background-color);
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
		@include background_color(page-box-item-background-color);
		font-size: $uni-font-size-base;
		line-height: 2em;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
	}

	.feedback-input {
		font-size: $uni-font-size-base;
		@include color(color-light-dark);
		@include background_color(page-box-item-background-color);
		border-radius: $uni-border-radius-base;
		height: 100rpx;
		min-height: 100rpx;
		padding: 0 30rpx;
		margin-top: 30rpx;
		margin-bottom: 60rpx;
	}

	.btn-submit {
		border-radius: $uni-border-radius-lg-er;
		margin-top: 100rpx;
		@include background_color(follow-background-color);
		@include color(color-follow-font);
		margin-bottom: 20rpx;
	}
	
	.btn-submit.disabled{
		@include background_color(page-gray-background-color);
	}

	.image-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		@include color(color-lighter-er-dark);

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
		margin: 30rpx 30rpx 0 30rpx;
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
