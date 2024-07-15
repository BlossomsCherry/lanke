<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="paycode-page">
			<uni-password ref="secrity" @confirm="onConfirm">
				<view slot="head">
					{{tip}}
				</view>
				<view slot="body">
					<block v-if="status == 1 && !isoldChecked">
						<view  class="forget-paycode" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/paycode/forget')">
								{{ '忘记支付密码?' }}
						</view>
					</block>
				</view>
			</uni-password>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import uniPassword from '@/pagesA/components/uni-password/uni-password.vue'
const common = require('@/mixins/common');
const user = require('@/mixins/user');
var options = {};
common(options);
user(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		uniPassword
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 49,
			status: 0, // 0: 新配置 1：已配置
			isConfirmed: false,
			password: '',
			isoldChecked: false,
			tip: '请为您的账号设置6位支付密码',
			direct: 1
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(49, 0, true);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		if(options.direct == 0){
			that.direct = 0;
		}
		that.paycodeSet(0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		paycodeSet( type ){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/paycode', {
				type: type,
				password: that.password
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					if(type === 0){
						that.status = res.data.status;
						if(res.data.status == 1){
							uni.setNavigationBarTitle({
							    title: '修改支付密码'
							});
							that.tip = '请输入您的旧支付密码进行修改';
						}
					}else if(type == 1){
						uni.setNavigationBarTitle({
						    title: '修改支付密码'
						});
						that.tip = '请输入您的旧支付密码进行修改';
						uni.showToast({
							title: '密码配置成功',
							icon:'none'
						});
						uni.wen.util.updateUserInfo();
						if(that.direct){
							uni.wen.toUrl(-2, 0, that);
						}
					}else if(type == 2){
						if(that.isoldChecked){
							uni.showToast({
								title: '修改成功！',
								icon:'none'
							});
							that.tip = '请输入您的旧支付密码进行修改';
							that.$refs.secrity.clear();
							uni.wen.util.updateUserInfo();
							if(that.direct){
								uni.wen.toUrl(-2, 0, that);
							}
						}else{
							that.isoldChecked = true;
							uni.showToast({
								title: '输入正确，请输入新的支付密码',
								icon:'none'
							});
							that.setData({
								  password: '',
								  isConfirmed: false,
								  old_code: '',
								  isoldChecked: true,
								  tip: '请为您的账号设置新的6位支付密码'
							});
							that.$refs.secrity.clear();
						}
					}
				}else{
					if(type == 0){
						uni.showToast({
							title: res.message,
							icon:'none'
						});
					}else if(type == 1){
						uni.showToast({
							title: res.message,
							icon:'none'
						});
					}else if(type == 2){
						if(that.isoldChecked){
							that.setData({
								isoldChecked: false,
								tip: '请输入您的旧支付密码进行修改'
							});
							uni.showToast({
								title: res.message,
								icon:'none'
							});
							that.$refs.secrity.clear();
							
						}else{
							uni.showToast({
								title: res.message,
								icon:'none'
							});
							that.$refs.secrity.clear();
						}
					}
				}
			});
		},
	    onConfirm(e) {
		  let that = this;
		  
		  if(!that.isConfirmed){
			  if(that.status == 0){
				  that.setData({
					  password: e.value,
					  isConfirmed: true,
					  tip: '请再次输入进行确认'
				  });
				  that.$refs.secrity.clear();
			  }else if(that.status == 1){
				  that.setData({
					  password: e.value,
				  });
				  if(that.isoldChecked){
					  that.setData({
						  password: e.value,
						  isConfirmed: true,
						  tip: '请再次输入进行确认'
					  });
					  that.$refs.secrity.clear();
				  }else{
					  that.paycodeSet(2);
				  }
			}
		  }else{
			if(that.status == 0){
				  if(that.password.toString() !== e.value.toString()){
					  uni.showToast({
						 title: '两次输入的密码不一致',
						 icon: 'none'
					  })
					  
					  that.setData({
						  password: '',
						  isConfirmed: false,
						  old_code: '',
						  tip: '请为您的账号设置6位支付密码'
					  });
					  that.$refs.secrity.clear();
					  return false;
				  }
				  that.paycodeSet(1);
				}else if(that.status == 1){
					if(that.isoldChecked){
						if(that.password.toString() !== e.value.toString()){
						  uni.showToast({
							 title: '两次输入的密码不一致',
							 icon: 'none'
						  })
						  
						  that.setData({
							  password: '',
							  isConfirmed: false,
							  old_code: '',
							  tip: '请为您的账号设置6位支付密码'
						  });
						  that.$refs.secrity.clear();
						  return false;
						}
						that.paycodeSet(2);
					}
				}
			}
			  
		}
	}
}
</script>

<style lang="scss" scoped>
.paycode-page{
	min-height: 100vh;
	@include background_color(page-box-background-color);
	.forget-paycode{
		color: cornflowerblue;
		font-size: $uni-font-size-sm;
		text-align: center;
		margin: auto;
	}
}
</style>