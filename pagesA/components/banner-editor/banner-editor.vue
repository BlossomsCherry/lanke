<template>
	<u-popup :show="popup" @close="shutPopup" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false">
		<you-touchbox ref="touchBox" :auto="false" customStyle="border-radius: 15px 15px 0 0;" maxTop="1" initTop="0.7">
		<view class="banner-edit-warap">
			<view class="inner">
				<view class="title">
					<view class="btn" v-if="imglist.length < max" @tap.stop.prevent="imageClipper('imgClip')">
						<i class="upload-icon mini-icon mini-jiahao-"></i>
						<view class="_text">添加</view>
					</view>
					编辑封面
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutPopup"></i>
				</view>
				<view class="content">
					<view class="tip flex-column">
						<text class="line1">请上传至少一张图片，最多{{ max }}张</text>
						<text class="line2">建议尺寸：{{ width }}×{{ height }}px</text>
					</view>
					<view class="banner-editor-wrap">
						<scroll-view :scroll-y="true" class="_scroll_view" enhanced :show-scrollbar="false" lower-threshold="0" style="max-height: 80vh;height: 80vh;;">
							<view class="img-list">
								<view class="img-item" v-for="(item, index) in imglist" :key="index" :style="'width:710rpx; height:' + displayHeight + 'rpx;'">
									<image  class="_image" :src="item" :style="'width:710rpx; height:' + displayHeight + 'rpx;'"></image>
									<view class="cover">

										<view class="action upCover" v-if="index != 0" @click="upCover(index)">
											<view>上移</view>
										</view>
										<view v-if="index != 0 && index != imglist.length-1" style="width: 30rpx;"></view>
										<view class="action downCover" v-if="index != imglist.length-1" @click="downCover(index)">
											<view>下移</view>
										</view>
										
										<view v-if="imglist.length > 1" style="width: 30rpx;"></view>
										<view class="action delete" v-if="imglist.length > 1" @click="deleteCover(index)">
											<view>删除</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<l-clipper v-if="imgClip" :image-url="pic" @success="addimage($event, { name: 'imgTmp', type: 'imgClip' })" @cancel="imgClip = false" :width="width" :height="height"/>
					</view>
				</view>
			</view>
		</view>
		</you-touchbox>
	</u-popup>
	
</template>

<script>
	import LClipper from '@/pagesA/components/lime-clipper/components/l-clipper/l-clipper';
	export default {
		name:"banner-editor",
		components: {
			LClipper
		},
		computed:{

		},
		data() {
			return {
				popup: false,
				imglist: [],
				displayHeight: 0,
				imgTmp: '',
				imgClip: false,
				pic: '',
			};
		},
		mounted() {
			
		},
		watch: {
			list: {
				handler: function (newVal, oldVal) {
					this.initData();
				},
				immediate: true,
			},
			pop: {
				handler: function (newVal, oldVal) {
					if(newVal > 0){
						this.popup = true;
					}else{
						this.popup = false;
					}
				},
				immediate: false,
			},
		},
		props: {
			pop: {
				type: Number,
				default: 0,
			},
			list: {
				type: Array,
				required: true
			},
			width: {
				type: Number,
				default: 750
			},
			height: {
				type: Number,
				default: 380
			},
			max: {
				type: Number,
				default: 10
			}
		},
		methods: {
			deleteCover(index) {
				// #ifdef H5
				this.imglist.splice(index, 1);
				// #endif
				// #ifndef H5
				let that = this;
				uni.showModal({
					title: '确认删除',
					content: '确定要删除该图片吗？',
					success: (res) => {
						if (res.confirm) {
							that.imglist.splice(index, 1);
						}
					}
				});
				// #endif
				
			},
			upCover(index) {
				// 上移当前项
				if (index > 0) {
					const temp = this.imglist[index];
					this.imglist.splice(index, 1);
					this.imglist.splice(index - 1, 0, temp);
				}
			},
			downCover(index) {
				// 下移当前项
				if (index < this.imglist.length - 1) {
					const temp = this.imglist[index];
					this.imglist.splice(index, 1);
					this.imglist.splice(index + 1, 0, temp);
				}
			},
			shutPopup(){
				this.popup = false;
				this.$emit('success', {list: this.imglist});
			},
			addimage(e, _dataset) {
			  let that = this
			  /* ---处理dataset begin--- */
			  that.datasetHandle(e, _dataset);
			  /* ---处理dataset end--- */
			
			  const name = e.currentTarget.dataset.name
			  const type = e.currentTarget.dataset.type
			  that.setData({ [type]: false });
			  
			  uni.loading(true);
			  uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', e.url, 0).then(function (res) {
			      uni.loading(false);
			      if (res.status) {
					  that.imglist.push(res.data);
			      } else {
			          uni.showToast({
			              title: res.message,
			              icon: 'none',
			              duration: 1500
			          });
			      }
			  });
			},
			imageClipper(type) {
			    let that = this;
				that.imgTmp = '';
				
				let _imageClipper = function(type, sourceType){
					uni.chooseImage({
					    count: 1,
					    sourceType: [sourceType],
					    sizeType: ['original'],
					
					    success(res) {
					        const tempFilePaths = res.tempFilePaths;
					        that[type] = true;
					        that.pic = tempFilePaths[0];
					    }
					});
				}
				
				uni.showActionSheet({
					itemList: ['拍摄', '从相册选择'],
					success: function (res) {
						
						// #ifdef MP
						_imageClipper(type, res.tapIndex === 1 ? 'album' : 'camera')
						// #endif
						
						// #ifdef APP
						uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于您的资料完善，申请圈子等场景' : '[摄像头权限]获取您此刻所拍的照片，用于您的资料完善，申请圈子等场景', () => {
							_imageClipper(type,  res.tapIndex === 1 ? 'album' : 'camera')
						}, that);
						// #endif
						
						// #ifdef H5
						_imageClipper(type,  res.tapIndex === 1 ? 'album' : 'camera')
						// #endif
			
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
				
			},
			initData(){
				let that = this;
				that.imglist = that.list;

				that.displayHeight = (710 / that.width) * that.height;
			}
		}
	}
</script>

<style lang="scss">
.banner-edit-warap{
		width: 750rpx;
		@include background_color(page-box-background-color);
		border-top-right-radius: $uni-border-radius-lg-er;
		border-top-left-radius: $uni-border-radius-lg-er;
		/* #ifndef APP-NVUE */
			box-sizing: border-box;
		/* #endif */
		padding: 20rpx 0 40rpx;
		.inner{
			width: $page-content-body-width;
			/* #ifndef APP-NVUE */
			padding-bottom: env(safe-area-inset-bottom);
			margin: auto;
			/* #endif */
			/* #ifdef APP-NVUE */
			margin-left: 20rpx;
			margin-right: 20rpx;
			/* #endif */

			.title{
				width: 100%;
				@include color(color-lighter-er-dark);
				position: relative;
				text-align: center;
				margin-bottom: 20rpx;
				.mini-shanchu2{
					position: absolute;
					right: 0;
					top: 0;
				}
				.btn{
					left: 0;
					top: 0;
					position: absolute;
					display: flex;
					width: 70px;
					.upload-icon{
						font-size: 20px;
						margin-right: 10rpx;
					}
					._text{
						font-size: 13px;
					}
				}
			}
			.content{
				.tip{
					margin: 30rpx 0;
					.line1{
						font-size: $uni-font-size-base;
						line-height: $uni-font-size-base;
						margin-bottom: 16rpx;
					}
					.line2{
						font-size: $uni-font-size-sm-base;
						line-height: $uni-font-size-sm-base;
					}
				}
				.banner-editor-wrap{
					width: 100%;
					.img-list{
						width: 100%;
						.img-item{
							margin-bottom: 20rpx;
							border-radius: 20rpx;
							position: relative;
							.cover{
								position: absolute;
								bottom: 20rpx;
								right: 20rpx;
								display: flex;
								.action{
									background-color: rgba(0, 0, 0, 0.6);
									color: #ffffff;
									font-size: $uni-font-size-base;
									height: 52rpx;
									line-height: 52rpx;
									width: 100rpx;
									border-radius: 12rpx;
									text-align: center;
								}
							}
							._image{
								border-radius: 20rpx;
								@include background_color(page-gray-background-color);
								position: relative;
							}
							
						}
					}
				}
			}
		}
}

</style>