<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="选择学校" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			
		</navBar>
		<u-sticky :offsetTop="0">
			<view class="page-item white">
				<view class="inner" style="padding: 20rpx 0;">
					<u-search placeholder="搜索我的学校" v-model="keyword" :showAction="false" @change="search"></u-search>
				</view>
			</view>
		</u-sticky>
		<view class="page-item" v-if="isShowLocationBtn">
			<view class="inner">
				<view class="location flex-row">
					<view class="tip flex-row">
						<i class="mini-icon2 mini-shouhuodizhi"></i>
						<view class="_text">未获取到当前定位</view>
					</view>
					<view class="right btn flex-column" @tap.stop.prevent="refreshLocation_">获取定位</view>
				</view>
			</view>
		</view>
		
		<block v-if="keyword && keyword.length > 0">
			<view class="page-item">
				<view class="inner">
					<view class="split-title">搜索结果</view>
				</view>
			</view>
			<view class="page-item white">
				<view class="inner">
					<view class="tenant_list">
						<block v-for="(item, index) in app_tenants_search" :key="index">
							<view class="tenent_item" @tap.stop.prevent="changeTenant(item)">
								<view class="item_inner">
									<view class="left">
										<image class="_image" :src="item.logo || ''" mode=""></image>
									</view>
									<view class="right">
										<view class="left_">
											<view class="name">{{ item.name }}</view>
											<block>
												<block v-if="global__tenant__ && global__tenant__.tenant_id !== null && global__tenant__.tenant_id == item.tenant_id">
													<view class="desc">当前选择</view>
												</block>
												<block v-else>
													<view class="desc auth" v-if="item.auth">已开通</view>
													<view class="desc not-authed" v-else>筹划中</view>
												</block>
												
											</block>
											
										</view>
										<view class="right_" v-if="item.distance">
											<view class="distance">{{ item.distance }}</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="page-item">
				<view class="inner">
					<view class="split-title">热门学校</view>
				</view>
			</view>
			<view class="page-item white">
				<view class="inner">
					<view class="hot-list flex-row">
						<block v-for="(item, index) in app_tenants" :key="index" v-if="item.is_hot == 1">
							<view class="hot-item flex-column" @tap.stop.prevent="changeTenant(item)">
								<view class="image">
									<image class="_image" :src="item.logo" mode="aspectFit"></image>
								</view>
								<view class="name">{{ item.name }}</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="page-item"  v-if="global__tenant__ && global__tenant__.tenant_id !== null">
				<view class="inner">
					<view class="split-title">当前选择</view>
				</view>
			</view>
			<block v-if="global__tenant__ && global__tenant__.tenant_id !== null && global__tenant__.tenant_id >= 0">
				<view class="page-item white">
					<view class="inner">
						<view class="tenant_list">
							<view class="tenent_item cur">
								<view class="item_inner">
									<view class="left">
										<image class="_image" :src="global__tenant__.logo || ''" mode=""></image>
									</view>
									<view class="right">
										<view class="left_">
											<view class="name">{{ global__tenant__.name || '未选择' }}</view>
											<view class="desc">{{ global__tenant__.desc || '' }}</view>
										</view>
										<view class="right_">
											<i class="seletd-icon mini-icon mini-icon_669 color-primary"></i>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="page-item white">
					<view class="inner">
						
					</view>
				</view>
			</block>
			<view class="page-item">
				<view class="inner">
					<view class="split-title">已开通学校</view>
				</view>
			</view>
			<view class="page-item white">
				<view class="inner">
					<view class="tenant_list">
						<block v-for="(item, index) in app_tenants" :key="index">
							<view class="tenent_item" @tap.stop.prevent="changeTenant(item)" v-if=" item.tenant_id != global__tenant__.tenant_id && item.auth ">
								<view class="item_inner">
									<view class="left">
										<image class="_image" :src="item.logo || ''" mode=""></image>
									</view>
									<view class="right">
										<view class="left_">
											<view class="name">{{ item.name }}</view>
											<view class="desc auth">已开通</view>
										</view>
										<view class="right_" v-if="item.distance">
											<view class="distance">{{ item.distance }}</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="page-item">
				<view class="inner">
					<view class="split-title">筹划中的学校</view>
				</view>
			</view>
			<view class="page-item white">
				<view class="inner">
					<view class="tenant_list">
						<block v-for="(item, index) in app_tenants" :key="index">
							<view class="tenent_item" @tap.stop.prevent="changeTenant(item)" v-if=" item.tenant_id != global__tenant__.tenant_id && !item.auth ">
								<view class="item_inner">
									<view class="left">
										<image class="_image" :src="item.logo || ''" mode=""></image>
									</view>
									<view class="right">
										<view class="left_">
											<view class="name">{{ item.name }}</view>
											<view class="desc not-authed">筹划中</view>
										</view>
										<view class="right_" v-if="item.distance">
											<view class="distance">{{ item.distance }}</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
		</block>
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
		config_app_multi:{
			get(){
				let that = this;
				return that.$store.state.config.app.multi;
			},
			set(v){}
		},
		lastLocation: {
			get(){
				return this.$store.state.lastLocation
			},
			set(v){}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 83,
			keyword: '',
			app_tenants: {},
			isShowLocationBtn: false,
			app_tenants_search: {},
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(83, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(that.$store.state.config.app && that.$store.state.config.app.tenants){
			that.app_tenants = that.$store.state.config.app.tenants;
		}
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: 0, latitude: 0 }, 'POST').then(res => {
		    if (res.status) {
				that.setData({
					app_tenants: res.data
				});
		    } else {
		        uni.showToast({title: res.message, icon: 'none', duration: 1500})
		    }
		});
		
		that.refreshLocation();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		refreshLocation_(){
			let that = this;
			let resData = null;
			uni.wen.util.getLocation(that).then(res => {
				uni.$store.commit('updateLastLocation', {longitude: res.longitude, latitude: res.latitude});
				that.isShowLocationBtn = false;
			    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: res.longitude, latitude: res.latitude }, 'POST').then(res => {
			        if (res.status) {
						that.setData({
							app_tenants: res.data
						});
			        } else {
			            uni.showToast({title: res.message, icon: 'none', duration: 1500})
			        }
			    });
			}).catch((err)=>{
				that.isShowLocationBtn = true;
				uni.showToast({
					title: err.errMsg,
					icon: 'none'
				});
			}).finally(() => {
				if(that.app_tenants.length <= 0){
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: 0, latitude: 0 }, 'POST').then(res => {
					    if (res.status) {
							that.setData({
								app_tenants: res.data
							});
					    } else {
					        uni.showToast({title: res.message, icon: 'none', duration: 1500})
					    }
					});
				}
			});
		},
		// 刷新定位
		refreshLocation() {
			let that = this;

			
			let old = uni.getStorageSync('mp:tenants:location');
			if(old == undefined || old == null || old === 2 || !old){
				old = 2;
			}
			if(old == 1){
				let lastLocation = that.$store.state.lastLocation;
				if(lastLocation && lastLocation.longitude){
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: lastLocation.longitude, latitude: lastLocation.latitude }, 'POST').then(res => {
					    if (res.status) {
							that.setData({
								app_tenants: res.data
							});
					    } else {
					        uni.showToast({title: res.message, icon: 'none', duration: 1500})
					    }
					});
				}else{
					that.refreshLocation_();
				}
			}else if(old === 2){
				that.isShowLocationBtn = true;
			}else if(old == -1){
				that.isShowLocationBtn = true;
			}
			
		},
		search(keyword){
			let that = this;
			if(keyword && keyword.length > 0){
				let search_result = {};
				
				for (let key in this.app_tenants) {
					if (this.app_tenants.hasOwnProperty(key)) {
						if( (this.app_tenants[key].name && this.app_tenants[key].name.indexOf(keyword) >= 0) || ( this.app_tenants[key].short && this.app_tenants[key].short.indexOf(keyword) >= 0 ) ){
							search_result.key = this.app_tenants[key];
						}
					}
				}
				that.app_tenants_search = search_result;
			}else{
				that.app_tenants_search = [];
				that.keyword = '';
			}
		},
		changeTenant(item){
			let that = this;
			if(!item.auth){
				uni.showToast({
					title: '暂未开通，联系客服',
					icon: 'none'
				});
				return false;
			}
			if(that.$store.state.tenant.tenant_id == item.tenant_id){
				
				if(that.config_app_multi  != 3 ){
					uni.removeStorageSync('tenant');
					uni.$store.commit('updateTenant', {tenant_id: null, name: '', short: ''});
					
					uni.$store.dispatch('initSystem');
					
					uni.$store.dispatch('updateConfig');
					uni.$store.dispatch('updateConfig2');
					uni.$store.dispatch('updateConfig3');
					uni.$store.dispatch('updateConfig4');
					
					that.$store.commit('Ipushlished', true);
					
					uni.showToast({
						title: '您已进入主站',
						icon: 'none'
					});
					
					that.userPlate();
					
					setTimeout(function(){
						uni.wen.toUrl(-2, null);
					}, 500);
					
				}
				
				
			}else{
				
				uni.setStorageSync('tenant', item);
				uni.$store.commit('updateTenant', item);
				
				uni.$store.dispatch('initSystem');
				
				uni.$store.dispatch('updateConfig');
				uni.$store.dispatch('updateConfig2');
				uni.$store.dispatch('updateConfig3');
				uni.$store.dispatch('updateConfig4');
				
				that.$store.commit('Ipushlished', true);
				
				that.userPlate();
				
				uni.showToast({
					title: '进入了'+item.name,
					icon: 'none'
				});
				
				setTimeout(function(){
					uni.wen.toUrl(-2, null);
				}, 500);
			}
			
			
		}
	}
}
</script>

<style lang="scss" scoped>
.page-item{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		padding: 0 10rpx;
		box-sizing: border-box;
		.location {
		    padding-top: 10px;
		    background-color: transparent;
			justify-content: space-between;
			.tip{
				.mini-icon, .mini-icon2{
					margin-right: 10rpx;
					@include color(color-lighter-er-dark);
					font-size: $uni-font-size-sm-base;
					line-height: $uni-font-size-sm-base;
					height: $uni-font-size-sm-base;
				}
				._text{
					@include color(color-lighter-er-dark);
					font-size: $uni-font-size-sm-base;
					line-height: $uni-font-size-sm-base;
					height: $uni-font-size-sm-base;
				}
			}
			.btn{
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				font-size: $uni-font-size-sm;
				border-radius: 100rpx;
				padding: 6rpx 16rpx;
			}
		}
		.hot-list{
			flex-wrap: wrap;
			padding: 35rpx 0 0;
			.hot-item{
				width: 24%;
				text-align: center;
				padding-bottom: 35rpx;
				.image{
					._image{
						width: 90rpx;
						height: 90rpx;
						border-radius: 50%;
					}
				}
				.name{
					margin-top: 5rpx;
					text-align: center;
					font-size: $uni-font-size-sm-base;
				}
			}
		}
		.split-title{
			padding: 20rpx 0;
			@include color(color-lighter-er-dark);
			font-size: $uni-font-size-sm;
		}
		.tenant_list{
			display: flex;
			flex-direction: column;
			justify-content: center;
			.tenent_item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				@include background_color(page-box-background-color);
				height: 150rpx;
				width: 100%;
				border-bottom: 1rpx solid;
				@include border_color(border-color-light-line-background-color);
				.item_inner{
					display: flex;
					width: 600rpx;
					.left{
						width: 70rpx;
						height: 70rpx;
						margin-right: 30rpx;
						._image{
							width: 70rpx;
							height: 70rpx;
							border-radius: 50%;
						}
					}
					.right{
						display: flex;
						justify-content: space-between;
						width: 500rpx;
						overflow: hidden;
						.left_{
							display: flex;
							flex-direction: column;
							justify-content: center;
							.name{
								font-size: $uni-font-size-medium;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								margin-bottom: 10rpx;
								@include color(color-light-dark);
							}
							.desc{
								font-size: $uni-font-size-sm-base;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								@include color(color-lightest-dark);
							}
							.desc.auth{
								@include color(color-success);
							}
							.desc.not-authed{
								@include color(color-error);
							}
						}
						.right_{
							display: flex;
							flex-direction: column;
							justify-content: center;
							.mini-icon{
								font-size: 40rpx;
								display: none;
								font-weight: bold;
							}
							.distance{
								font-size: $uni-font-size-sm;
								@include color(color-lightest-est-dark);
							}
						}
						
					}
				}
			}
			.tenent_item.cur{
				.seletd-icon{
					display: inline !important;
				}
			}
		}
	}
}
.page-item.white{
	@include background_color(page-box-background-color);
}


</style>