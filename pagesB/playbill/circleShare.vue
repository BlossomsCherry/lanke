<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view :data-theme="global__theme__" :data-platform="global__platform__" :data-device="global__device__" class="mini-page-body">
		<navBar :back="true" :iconTheme="iconTheme" :background="'rgba(255, 255, 255, ' + navbarTrans + ')'"
			:color="'rgba(' + color + ', ' + navbarTrans + ')'" :title="ShareData.name">
		</navBar>
		<view class="content" >
		<view class="top" :style="background"></view>
		<view class="banner">
			<dl>
				<dt><image :src="ShareData.avatar" mode=""></image></dt>
				<dd>{{ ShareData.name }}</dd>
			</dl>
			<view class="img">
				<image :src="ShareData.code" mode=""></image>
			</view>
			<view class="tgtit">推广链接：<text class="tugurl">{{ ShareData.url }}</text></view>
			<view class="sharbuttn">
				<view class="btn" @click="save">保存二维码</view>
				<view class="btn" @click="sharurl">复制推广链接</view>
			</view>
			
			<!-- <button class="btn" @click="share">分享</button> -->
			<view class="shartitle"><view>分享</view></view>
			<view class="sharapk">
				<view @tap="share(0)"><i class="mini-icon mini-weixin"></i></view>
				<view @tap="share(1)"><i class="mini-icon mini-pengyouquan"></i></view>
				<view @tap="share(2)"><i class="mini-icon mini-QQ"></i></view>
			</view>
			
			
			<view class="bottom">

			</view>
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

	 //预览图片
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		data(){
			return {
				id: '',
				providerList:[],				
				type:0,
				ShareData: {},
				background: {},
				navbarTrans: 0,
				color: '0,0,0',
				iconTheme: 'white',
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.id = options.id;
			that.getCircleShare();
		},
		onShow: function () {
			let that = this;
			that.updateScene(61, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods:{
			getCircleShare(){
				let that = this;
				if(!that.id){
					uni.showToast({
						title: '初始化失败',
						icon:'error'
					});
					return false;
				}
				uni.loading(true);
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/circle/poster', {
					id: that.id
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							ShareData: res.data,
							background: {
								backgroundImage: 'url(' + res.data.bg + ')',
								backgroundRepeat: 'no-repeat',
							}
						});			
					}else{
						uni.showToast({
							title: res.message,
							icon:'error'
						});
					}
				});
				
			},
			//复制分享链接
			sharurl(){
				let that = this;
				uni.setClipboardData({
					data: that.ShareData.url,
					success: function () {
						console.log('success');
						uni.showModal({
							title: '复制成功',
							content: '内容已复制到粘贴板，可前往其他应用粘贴查看。', 
							showCancel:false,
							success: function(res) {
								if (res.confirm) {											 
									//console.log('用户点击确定');
								} else if (res.cancel) {
									//console.log('用户点击取消');
								}
							}
						});
					}
				});
			},
			//保存图片到相册
			save(){
				let that = this;
				uni.showActionSheet({
					itemList:['保存图片到相册'],
					success: () => {
						plus.gallery.save(that.ShareData.code, function() {
							uni.showToast({
								title:'保存成功',
								icon:'none'
							})
						}, function() {
							uni.showToast({
								title:'保存失败，请重试！',
								icon:'none'
							})
						});
					}
				})
			},
			share(provider) {
				// 0:微信  1：朋友圈  2：qq  3：微博  4：QQ空间
				let that = this;
				let platform = 'weixin';
				let scene = ''
				let imageUrl = that.ShareData.avatar;
				if(provider == 0){
					scene = 'WXSceneSession';
				}else if(provider == 1){
					scene = 'WXSenceTimeline';
				}
				let type = 0;
				if(provider == 2){
					type = 2;
					platform = 'qq';
				}else if(provider == 0){
					if(that.$store.state.config.app.wechat.mini.meta_appid){
						type = 5;
					}
				}else if(provider == 1){
					if(that.$store.state.config.app.wechat.mini.meta_appid){
						type = 5;
					}
				}else if(provider == 3){
					platform = 'sinaweibo';
				}

				let shareGoodObj = {
					'provider': platform,
					'type': type,
					'title': '分享了' + that.ShareData.name,
					'scene': scene,
					'imageUrl': imageUrl,
					'href': that.ShareData.url,
					'summary': '来自' + that.$store.state.config.about.name + '圈子',
					'miniProgram': {
						'id': that.$store.state.config.app.wechat.mini.meta_appid,
						'path': '/pages/circle/list?id=' + that.id,
						'type': 0,
						'webUrl': that.ShareData.url
					},
					success: function (res) {
							console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				};
				
				
				uni.share(shareGoodObj);
			},
			openLink() {
				plus.runtime.openWeb(this.sourceLink)
			}
		}
	}
	
	
</script>

<style lang="scss">
	.tugurl{
		@include color(color-lighter-dark);
	}
	.sharbuttn{
		display: flex;
		justify-content: center;
	}
	.shartitle{
		    width: 80%;
			text-align: center;
			margin-left: 10%;
			border-bottom: 1px solid;
			@include border_color(border-color-box-item-background-color);
			position: relative;
			height: 60upx;
	}
	.tgtit{
		text-align: center;
	}
	.shartitle view{
		    height: 50upx;
			line-height: 50upx;
			font-size: 28upx;
			@include color(color-lighter-dark);
			width: 120upx;
			margin: 32upx auto;
			position: absolute;
			@include background_color(page-box-background-color);
			left: 50%;
			margin-left: -60upx;
	}
	
	.sharapk{
	 display: flex;
	 justify-content: center;
	 margin: 20upx auto
	}
	.sharapk .mini-icon {
	    font-size: 29px;
	}
	.sharapk .mini-icon.mini-weixin{
		color: #28c445;
	}
	.sharapk .mini-icon.mini-pengyouquan{
		color: #5b9def;
	}
	.sharapk .mini-icon.mini-QQ{
		color: #7bd4ef;
	}
	.sharapk{
		
	}
	.sharapk view{
		margin: 40upx;
	}
	.sharapk view image{
		height: 80upx;
		width: 80upx;
	}
	.content{
		width: 100%;
		@include background_color(page-box-background-color);
		position: absolute;
		top: 0;
	}
	.top{
		width: 100%;
		height:400upx;
		background-size:100% ;
		background-position:center center;
	}
	.banner{
		width: 100% ;
		@include background_color(page-box-background-color);
		border-radius: 60upx 60upx 0 0;
		margin-top: -60upx;
	}
	.banner dl{
		transform: translateY(-41px);
	}
	.banner dl dt{
		text-align: center;
	}
	.banner dl dt image{
		width: 160upx;
		height: 160upx;
		border-radius:50% ;
	}
	.banner dl dd{
		text-align: center;
	}
	.img{
		width: 300upx;
		height: 300upx;
		background-color: lightgray;
		margin: 0px auto 30px;
	}
	.img image{
		width: 100%;
		height: 100%;
	}
	.btn{
		width: 260upx;
		height: 60upx;
		line-height: 60upx;
		margin: 0 auto;
		margin-top: 60upx;
		border-radius: 40upx;
		border: 0;
		padding: 10rpx;
		font-size: 26upx;
		outline: 0;
		background-color: $uni-color-follow;
		color: $uni-color-follow-font;
		text-align: center;
	}
	.bottom{
		width: 100%;
		height: 400upx;
	/* 	background: url(../../static/img/beij.png) no-repeat; */
		background-position:left bottom;/* 设置背景图片位置 */
		background-size: 20%;
	}
	.bottom ul{
		padding-left: 40upx;
		box-sizing: border-box;
	}
	.bottom ul li{
		width: 100%;
		height: 60upx;
	}
</style>
