<template>
	<view class="post-share">
		<u-popup :show="sharePopop" @close="openSharePopop(false)" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false">
			<view class="share-warap">
				<view class="inner">
					<view class="title">
						分享至
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="openSharePopop(false)"></i>
					</view>
					<block v-if="users && users.length > 0">
						<scroll-view class="_scroll-view" :scroll-x="true" :enable-flex="true" @scrolltolower="getPostsShare('more')">
							<view class="line line1">
								<view class="item" v-for="(item, index) in users" :key="index" @tap.stop.prevent="chatRefer(item)">
									<view class="img-wrap">
										<image class="_image" :src="item.user_avatar" mode=""></image>
									</view>
									<view class="_text">
										{{ item.user_name }}
									</view>
								</view>
							</view>
						</scroll-view>
						<view class="split"></view>
					</block>

					<scroll-view class="_scroll-view" :scroll-x="true" :enable-flex="true">
						<view class="line line2">
							<block v-for="(item, index) in social" :key="index">
								<!-- #ifdef MP-WEIXIN -->
								<block v-if="item.action == 'wechat'">
									<button class="item" open-type="share">
										<view class="img-wrap">
											<i :class="item.icon" :style="'color: ' + item.color"></i>
										</view>
										<view class="_text">
											{{ item.text }}
										</view>
									</button>
								</block>
								<block v-else>
									<view class="item" @tap.stop.prevent="socialTap(item)">
										<view class="img-wrap">
											<i :class="item.icon" :style="'color: ' + item.color"></i>
										</view>
										<view class="_text">
											{{ item.text }}
										</view>
									</view>
								</block>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<view class="item" @tap.stop.prevent="socialTap(item)">
									<view class="img-wrap">
										<i :class="item.icon" :style="'color: ' + item.color"></i>
									</view>
									<view class="_text">
										{{ item.text }}
									</view>
								</view>
								<!-- #endif -->
							</block>
						</view>
					</scroll-view>
					<view class="split"></view>
					<scroll-view class="_scroll-view" :scroll-x="true" :enable-flex="true">
						<view class="line line3">
							<view class="item" v-for="(item, index) in other" :key="index" @tap.stop.prevent="otherTap(item)">
								<view class="img-wrap">
									<i :class="item.icon"></i>
								</view>
								<view class="_text">
									{{ item.text }}
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>

		<u-popup :show="referPopup" @close="openReferPopup(false)" :zIndex="99999991009" mode="bottom">
			<view class="refer-wrap">
				<view :class="'inner ' + (keyboardHeight > 0 ? 'keyboard-up' : '') ">
					<view class="title flex-row">
						<view class="left">转发该笔记</view>
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="openReferPopup(false)"></i>
					</view>
					<view class="center flex-row">
						<view class="left">
							<textarea class="_textarea" style="width: 500rpx;height:20vh;min-height:20vh;"
							 @focus="focusTextarea" @blur="blurTextarea" :fixed="true" @input="textInput"
							  placeholder="说点什么..." :show-confirm-bar="false" :focus=" isFocus "
							   maxlength="1000" placeholder-class="_input_place_holder" :adjust-position="false" :auto-blur="true"
								v-model="textinput">

							</textarea>
						</view>
						<view class="right flex-column">
							<block v-if="image_urls && image_urls.length > 0">
								<view class="img_item">
									<image class="upload_img" :src="image_urls[0].url" mode="aspectFill"></image>
									<i class="delete_icon mini-icon mini-shanchu1" @tap.stop.prevent="deleteReferImg"></i>
								</view>
							</block>
							<block v-else>
								<view class="img_item upload" @tap.stop.prevent="uploadReferImg">
									<i class="mini-icon mini-jia upload-icon"></i>
								</view>
							</block>

						</view>
					</view>
					<view class="bottom">
						<view class="btn" @tap.stop.prevent="creatForums">立即转发</view>
					</view>
					<view class="keyboard" :style="'height: ' + keyboardHeight + 'px;'"></view>
				</view>
			</view>
		</u-popup>
		
		<!-- 生成海报组件 -->
		<post-poster ref="poster"></post-poster>
	</view>
</template>

<script>
	import PostPoster from "@/pagesC/video/components/vue/post-poster";
	const forum = require('@/mixins/forum');
	let debounce = null;
	var options = {};
	forum(options);
	export default {
		mixins: [{ methods: options }],
		name:"post-share",
		components: {
			PostPoster
		},
		computed:{

		},
		data() {
			return {
				cursor: 0,
				editer: 'refer',
				textinput: '',
				image_urls: [],
				referPopup: false,
				refer_id: 0,
				isFocus: false,

				sharePopop: false,
				posturl: '',
				social: [],
				other: [],

				users: [],
				user_page: 1,
				user_is_last_page: false,
				keyboardHeight: 0,
				
			};
		},
		props: {
			scene: {
				type: Number,
				default: 0
			},
			postsId: {
				type: [Number, String],
				default: 0
			},
			postsIndex: {
				type: Number,
				default: 0
			},
			show: {
				type: Number,
				default: false
			}
		},
		watch:{
			show: {
				handler: function(newVal, oldVal) {
					let that = this;
					if(newVal > 0 || newVal > '0'){
						that.openSharePopop(true);
						that.getPostsShare('init');
					}
				},
			},
		},
		created(){
			let that = this;
		},
		methods: {
			chatRefer(item){
				let that = this;
				uni.wen.util.request(
				    uni.wen.api.ApiRootUrl + 'massages/addChat',
				    {
				        oid: item.id,
						refer_id: that.postsId
				    },
				    'POST'
				).then(function (res) {
				    if (res.status) {
						that.openSharePopop(false);

						uni.showToast({
						    title: res.message,
						    icon: 'none',
						    duration: 1500
						});

						setTimeout(function(){
							uni.wen.toUrl(18, item.id);
						}, 300);



				    } else {
				        uni.showToast({
				            title: res.message,
				            icon: 'none',
				            duration: 1500
				        });
				    }
				});
			},
			openAiteUser(cursor){
				let that = this;
				if( debounce !== null ) {
				    clearTimeout(debounce);
				}
				if(!that.$store.state.config.pays.paycode_0){
					return false;
				}
				let isPrefix = false;
				if(cursor == -1){
					cursor = that.textinput.length;
					that.textinput = that.textinput;
					isPrefix = true;
				}
				debounce = setTimeout(() => {
					that.isFocus = false;
				    let child = that.$unicom("#mytotast_" + that.$store.state.scene + '_' + that.$store.state.scene_id);
				    if(child){
				    	child.open({
				    		type:'aite',
				    		content: '@用户',
				    		timeout: 2000,
				    		isClick:true,
				    		mask: 3,
							emit: 'postShare',
							cursor: cursor,
							isPrefix: isPrefix
				    	});
				    	return false;
				    }
				},250);
			},
			acceptAiteUser(cursor, user_name){
				let that = this;
				that.textinput = that.textinput.slice(0, cursor) + user_name + ' ' + that.textinput.slice(cursor);
				that.isFocus = true;
			},
			textInput(e){
				let that = this;
				that.cursor = e.detail.cursor;
				if(e.detail.value){
					let char = e.detail.value.charAt( e.detail.cursor - 1 );
					if(char != '@'){
						return false;
					}
					that.openAiteUser(e.detail.cursor);
				}
				return false;
			},
			focusTextarea(e){
				let that = this;
				that.keyboardHeight = e.detail.height;
			},
			blurTextarea(e){
				let that = this;
				that.keyboardHeight = 0;
				that.cursor = e.detail.cursor;
			},
			deleteReferImg(){
				let that = this;
				that.image_urls = []
			},
			uploadReferImg(){
				let that = this;
				uni.chooseImage({
					count: 1,
					sourceType: ['album', 'camera'],
					sizeType: ['original'],

					success(res) {
						uni.loading(true);
						const tempFilePaths = res.tempFilePaths;
						uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function(res) {
							uni.loading(false);
							if(res.status){
								that.image_urls.push({ url: res.data });
							}else{
								uni.showToast({
									title: res.message,
									icon: 'none',
									duration: 1500
								});
							}
						});
					},

					fail(err) {

					}
				});
			},
			openReferPopup(flag){
				let that = this;

				that.referPopup = flag;
				that.refer_id = that.postsId;

				uni.$store.commit('popopChange', flag);
				setTimeout(function(){
					that.isFocus = flag;
				}, 200);
			},
			socialTap(item){
				let that = this;
				if(item.action == 'refer'){
					that.openSharePopop(false);
					setTimeout(function(){
						that.openReferPopup(true);
					}, 400);
				}else{
					uni.getProvider({
						service: 'share',
						success: function (res) {
							console.log(res.provider)
						}
					});

					let share_obj = JSON.parse(item.share);
					share_obj.fail = function(err){
						uni.wen.util.log(JSON.stringify(err));
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					}
					uni.share(share_obj);
				}
			},
			otherTap(item){
				let that = this;
				if(item.action == 'showCode'){
					that.openSharePopop(false);
					setTimeout(function(){
						that.$refs.poster.show(that.postsId);
					}, 300)
				}else if(item.action == 'poster2'){
					that.openSharePopop(false);
					setTimeout(function(){
						uni.wen.toUrl(6, '/pagesB/playbill/postPoster2?id='+that.postsId)
					}, 300)
				}else if(item.action == 'copyUrl'){
					uni.wen.util.setClipboardData(that.posturl, '笔记链接已复制');
				}else if(item.action == 'video-url'){
					uni.wen.toUrl(0, item.video_url);
				}else if(item.action == 'feedback-notlike-1'){
					that.openSharePopop(false);
					that.$emit('postfeedback', item);
				}else if(item.action == 'report'){
					uni.wen.toUrl(6, '/pages/common/report?type=0&object_id=' + Math.abs(that.postsId), null);
				}else if(item.action == 'promotion'){
					that.openSharePopop(false);
					uni.wen.toUrl(6, '/pagesC/promotion/post?id='+that.postsId, null);
				}
			},
			getPostsShare(action){
				let that = this;
				if(action == 'init'){
					// todo:
					that.posturl = '';
					that.textinput = '';
					that.image_urls = [];
					that.referPopup = false;
					that.refer_id = 0;
					that.user_page = 1;

				}else if(action == 'more'){
					if(that.user_is_last_page){
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						})
						return false;
					}
					that.user_page = that.user_page + 1;
				}
				if(that.users.length == 0){
					uni.loading(true);
				}
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/share', {
					posts_id: Math.abs(that.postsId),
					page: that.user_page
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						
						if(res.data.current_page != that.user_page){
							return false;
						}
						
						let data = res.data;

						that.posturl = data.url;
						that.social = data.social;
						that.other = data.other;

						if(data.user.data && data.user.data.length > 0){
							if(action == 'init'){
								that.users = data.user.data;
							}else{
								that.users = that.users.concat(data.user.data);
							}
							that.user_page = data.user.current_page;
							if(data.user.data.length < 10){
								that.user_is_last_page = true;
							}else{
								that.user_is_last_page = false;
							}
						}else{
							that.user_is_last_page = true;
						}

					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				});
			},
			openSharePopop(flag){
				let that = this;
				that.sharePopop = flag;
				uni.$store.commit('popopChange', flag);
			},
		}
	}
</script>

<style lang="scss">
.refer-wrap {
    width: 750rpx;
    @include background_color(page-box-background-color);
    border-top-right-radius: $uni-border-radius-lg-er;
    border-top-left-radius: $uni-border-radius-lg-er;
    /* #ifndef APP-NVUE */
	box-sizing: border-box;
    /* #endif */
    padding-left: 0;
    padding-right: 0;
    padding-top: 20rpx;
    padding-bottom: 40rpx;
	.inner.keyboard-up{
		padding-bottom: 0;
	}
	.inner{
		width: $page-content-body-width;

		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
		/* #ifdef APP-NVUE */
		margin-left: 20rpx;
		margin-right: 20rpx;
		/* #endif */

		/* #ifndef APP-PLUS */
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		.title{
			width: 100%;
			@include color(color-lightest-dark);
			position: relative;
			text-align: center;
			margin-bottom: 20rpx;
			.mini-icon{
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.center{
			margin: 30rpx 0;
			justify-content: space-between;
			._textarea{
				@include color(color-light-dark);
			}
			.right{
				justify-content: center;
				.img_item {
				    width: 200rpx;
				    height: 200rpx;
				    text-align: center;
					border-radius: 12rpx;
					position: relative;
					.upload_img{
						width: 200rpx;
						height: 200rpx;
						border-radius: 12rpx;
					}
					.delete_icon{
						position: absolute;
						right: -10rpx;
						top: -10rpx;
						color: red;
						@include background_color(page-box-background-color);
						border-radius: 50%;
						font-size: $uni-font-size-lg-er;
					}
				}
				.img_item.upload{
					background-color: #efefef;
					.upload-icon{
						font-size: 44rpx;
						line-height: 200rpx;
						@include color(color-lightest-dark);
					}
				}
			}

		}
		.bottom{
			.btn{
				padding: 20rpx 0;
				text-align: center;
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				border-radius: 50rpx;
			}
		}
	}
}
.post-share{
	.share-warap{
		width: 750rpx;
		@include background_color(page-box-item-background-color);
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
				.mini-icon{
					position: absolute;
					right: 0;
					top: 0;
				}
			}
			.split {
			    height: 1rpx;
			    background-color: #e6e6e6;
				@include background_color(page-light-line-background-color);
				margin: 30rpx 0;
			}
			._scroll-view{
				/* #ifndef APP-NVUE */
				white-space: nowrap;
				/* #endif */
				width: $page-content-body-width;
				height: 140rpx;
				.line{
					width: $page-content-body-width;
					height: 140rpx;
					display: flex;
					flex-direction: row;
					.item{
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						width: 130rpx;
						/* #ifndef APP-NVUE */
						max-width: 130rpx;
						min-width: 130rpx;
						/* #endif */
						height: 140rpx;
						text-align: center;
						padding: 0;
						margin: 0;
						background-color: transparent;
						.img-wrap{
							width: 80rpx;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
							/* #ifndef APP-NVUE */
							margin: auto;
							/* #endif */
							/* #ifdef APP-NVUE */
							margin-left: 0;
							margin-right: 0;
							/* #endif */
							border-radius: 50%;
							._image{
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
							}
						}
						._text {
							@include color(color-lighter-er-dark);
							font-size: $uni-font-size-base;
							overflow: hidden;
							text-overflow: ellipsis;
							/* #ifndef APP-NVUE */
							white-space: nowrap;
							/* #endif */
							height: 28rpx;
							/* #ifndef APP-NVUE */
							min-height: 28rpx;
							max-height: 28rpx;
							/* #endif */
							line-height: 28rpx;
						}
					}

				}
				.line2{
					.item{
						.img-wrap{
							height: 100rpx;
							line-height: 100rpx;
							/* #ifndef APP-NVUE */
							min-height: 100rpx;
							max-height: 100rpx;
							/* #endif */
							.mini-icon{
								font-size: 80rpx;
							}
						}
					}

				}
				.line3{
					.item{
						.img-wrap{
							@include background_color(page-box-background-color);
							.mini-icon{
								font-size: 50rpx;
								@include color(color-lighter-dark);
							}
						}
					}

				}
			}
		}
	}
}

</style>
