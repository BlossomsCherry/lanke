<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<view class="white">
			<view class="text-black">{{feedback.content}}</view>
			<view class="img-row" >
				<view v-for="(item,index) in feedback.imgs" :key="index" @click="catImage(index)">
					<image :src="item.url" class="image" mode="aspectFill"> </image>
				</view>
			</view>
			<view class="text-time">{{feedback.created_at}}提交</view>

		</view>
		<view class="box">
			<view class="text-black">系统回复：</view>
			<view class="text-grey">{{feedback.replay_default}}</view>
			<view class="text-time">{{feedback.created_at}}</view>

		</view>

		<view class="box" v-if="feedback.reply">
			<view class="text-black">客服回复：</view>
			<view class="text-grey">{{feedback.reply}}</view>

			<view class="text-grey" style="margin-top: 20rpx;">是否解决了您的问题</view>
			<view class="flex-row">
				<view @click="resolve(true)" :class="(isResolve == 1 && isShow) ?'btn-resolve':'btn-normal'" class="btn-normal">
					<image src="@/pages/help/static/help/icon_solved_sel.png" class="icon-normal"
						v-if="isResolve == 1 &&isShow"></image>
					<image src="@/pages/help/static/help/icon_solved_nor.png" class="icon-normal" v-else></image>

					已解决
				</view>
				<view @click="resolve(false)" :class=" (isResolve == 2 && isShow) ? 'btn-unResolve' : 'btn-normal' "
					class="btn-normal">
					<image src="@/pages/help/static/help/icon_notsolved_sel.png" class="icon-normal"
						v-if="isResolve == 2 &&isShow"></image>
					<image src="@/pages/help/static/help/icon_notsolved_nor.png" class="icon-normal" v-else></image>
					未解决
				</view>
			</view>
			<view class="text-time">{{feedback.updated_at}}</view>
		</view>

		<view class="box" v-if="feedback.reply && isResolve == 1 && isShow">
			<view class="text-black">客服回复：</view>
			<view class="text-grey">尊敬的用户您好，很高兴我们的答案能帮助到您。感谢您的支持!</view>
		</view>

		<view class="box" v-if="feedback.reply && isResolve == 2 && isShow">
			<view class="text-black">客服回复：</view>
			<view class="text-grey">尊敬的用户您好，对于我们的答案没有帮助到您，我们感到十分抱歉。建议您详细描述您遇到的问题并重新提交意见反馈或者拨打客服电话继续咨询，感谢您的支持!</view>
		</view>
		<view></view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 41,
				feedback: {},
				isResolve: 0,
				isShow: false

			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			let item = JSON.parse(decodeURIComponent(options.item))
			that.isResolve = item.is_solve;
			if(item.is_solve !== 0){
				that.isShow = true;
			}
			that.feedback = item;
		},
		onShow: function () {
			let that = this;
			that.updateScene(41, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			resolve(isResolved) {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'feedback/resolve', {id: that.feedback.id, resolve: isResolved}, 'POST').then(function(res) {
					uni.loading(false);
					if(res.status){
						if (!that.isShow) {
							if(isResolved){
								that.isResolve = 1;
							}else{
								that.isResolve = 2;
							}
							
							that.isShow = true;
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					
				});
			},
			catImage(index) {
				let that =  this;
				let url = that.feedback.imgs[index];
				let styleNames = that.$store.state.config.img.styleNames || new Array();
				if(url && styleNames){
					for (var i = 0; i < styleNames.length; i++) {
						if(styleNames[i].charAt(0) == '/'){
							url = url.replace(styleNames[i], '');
						}
					}
				}
				uni.previewImage({
					current: url,
					urls: [url]
				});
				return false;
				
				uni.navigateTo({
					url: '/pages/common/img?imgs=' + JSON.stringify(this.feedback.imgs) + '&current=' + index,
					animationType: "fade-in",
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
		padding-bottom: 30rpx;
	}

	.white {
		@include background_color(page-box-background-color);
		padding: 45rpx 40rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.text-grey {
		color: #606266;
		font-size: $uni-font-size-lg;
		line-height: 1.5em;
	}

	.text-time {
		color: #909193;
		font-size: $uni-font-size-sm;
		text-align: end;
		margin-top: 30rpx;
	}

	.text-black {
		@include color(color-light-dark);
		font-size: $uni-font-size-lg;
		margin-bottom: 30rpx;
		font-weight: bold;
	}

	.box {
		@include background_color(page-box-item-background-color);
		border-radius: 30rpx;
		margin: 50rpx 30rpx;
		padding: 30rpx 30rpx;
	}

	.icon-normal {
		width: 25rpx;
		height: 25rpx;
		margin-right: 20rpx;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-top: 30rpx;
	}

	.btn-normal {
		border-radius: 40rpx;
		border: solid 1rpx #D2D2D2;
		@include color(color-lightest-dark);
		padding: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		width: 32%;
	}

	.btn-resolve {
		background-color: #E1FFFB;
		border: solid 1rpx #19CFB7;
		color: #19CFB7;

	}

	.btn-unResolve {
		border: solid 1rpx #FF5F5F;
		background-color: #FFF2F2;
		color: #FF5F5F;

	}

	.image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 20rpx;
		margin: 10rpx;
	}

	.img-row {
		display: flex;
		flex-direction: row;

		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;

	}
</style>
