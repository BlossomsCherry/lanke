<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="经营地址" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="shop-contact-page">
			<view class="inner">
				<view style="height: 30rpx;"></view>
				<block v-if="shop.id > 0 && shop.contacts && shop.contacts.length > 0">
					<view class="contact-item" v-for="(item, index) in shop.contacts" :key="index">
						<view class="left">
							<view class="icon">
								<i class="mini-icon2 mini-shouhuodizhi"></i>
							</view>
							<view class="info">
								<view class="name">{{ item.name + ' ' + item.phone }}</view>
								<view class="address_detail">{{ item.address_detail }}</view>
								<view class="address_name">{{ '('+item.address_name+')' }}</view>
							</view>
						</view>
						<view class="right">
							<!-- <view class="">删除</view> -->
						</view>
					</view>
				</block>
				<block v-else>
					<u-empty text="一位地址也没有" width="300" height="300" text-size="28" />
				</block>
				
				<view class="add-btn" @tap.stop.prevent="startChooseLocation(true)">添加经营地址</view>
				
			</view>
		</view>
		
		<u-popup :show="popupShow" @close="shutPopupShow" :zIndex="99999991009" mode="center">
			<view class="popup-wrap">
				<view class="inner">
					<view class="title">
						添加经营地址
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutPopupShow"></i>
					</view>
					<view class="content">
						<view class="input-wrap">
							<view class="tip">联系人名字：</view>
							<input class="_input" v-model="formData.name" placeholder="请输入" />
						</view>
						<view class="input-wrap">
							<view class="tip">联系人电话：</view>
							<input class="_input" v-model="formData.phone" placeholder="请输入"/>
						</view>
						<view class="input-wrap" @tap.stop.prevent="startChooseLocation(false)">
							<view class="tip">经营地址：</view>
							<view class="_input" placeholder="请输入">{{ formData.address_detailed }}</view>
						</view>
						<view class="btn-wrap">
							<view class="btn" @tap.stop.prevent="shopContactProcess('add', 0)">添加</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
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

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 132,
			shop: {
				id: 0
			},
			
			popupShow: false,
			
			formData: {
				action: 'add',
				longitude: 0,
				latitude: 0,
				address_name: '',
				address_detailed: '',
				name: '',
				phone: '',
			}
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(132, 0, true);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.shopInfo();
	},
	onPullDownRefresh: function () {
		that.shopInfo();
	    uni.stopPullDownRefresh();
	},
	methods: {
		shopContactProcess(action, delete_id){
			let that = this;
			if(action == 'add'){
				if(that.formData.name.length <= 0){
					uni.showToast({
						title: '请输入联系人姓名',
						icon: 'none'
					})
					return false;
				}
				if(that.formData.phone.length <= 0){
					uni.showToast({
						title: '请输入联系人电话',
						icon: 'none'
					})
					return false;
				}
				if(that.formData.address_name.length <= 0){
					uni.showToast({
						title: '请输入联系地址',
						icon: 'none'
					})
					return false;
				}
				
				if(that.formData.longitude === 0 && that.formData.latitude === 0){
					uni.showToast({
						title: '请输入联系地址',
						icon: 'none'
					})
					return false;
				}

				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/contact/process', that.formData, 'POST').then(function(res) {
					uni.loading(false);
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					if(res.status){
						setTimeout(function(){
							that.shutPopupShow();
							that.shopInfo();
						}, 300);
					}
				});
			}else if(action == 'delete'){
				if(delete_id <= 0){
					uni.showToast({
						title: '未选择删除哪个地址',
						icon: 'none'
					});
					return false;
				}
				uni.showModal({
				  title: '确认删除',
				  content: '一旦删除，无法找回',
				  success: res => {
				    if (res.confirm) {
						uni.loading(true);
						uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/contact/process', {
							action: 'delete',
							id: delete_id,
						}, 'POST').then(function(res) {
							uni.loading(false);
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							if(res.status){
								setTimeout(function(){
									that.shopInfo();
								}, 300);
							}
						});
				    }
				  }
				});
			}
		},
		// 选择位置
		startChooseLocation: function(flag) {
			var that = this;
			uni.chooseLocation({
				success: function(a) {
					that.formData.latitude = a.latitude;
					that.formData.longitude = a.longitude;
					that.formData.address_name = a.address;
					that.formData.address_detailed = a.name;
					if(flag){
						that.shutPopupShow();
					}
				},
				fail: function(err) {
					console.log(err);
				}
			});
		},
		shopInfo(){
			let that = this;
			uni.loading(true);
			if(that.myUserInfo.id > 0){
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/info', {user_id:  that.myUserInfo.id}).then(function(res) {
					uni.loading(false);
					uni.stopPullDownRefresh();
					if(res.status){
						if(res.data.shop){
							that.shop = res.data.shop;
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
				});
			}
		},
		shutPopupShow(){
			let that = this;
			that.popupShow = !that.popupShow;
		}
	}
}
</script>

<style lang="scss" scoped>
@import './contact.scss';
</style>