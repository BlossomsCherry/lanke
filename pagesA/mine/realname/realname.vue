<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="实名" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="real-name-content">
			
			<view class="inner" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
				<view class="item-list">
					<view class="item">
						<view class="left">
							<text class="_text">手机号</text>
						</view>
						<view class="right" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
							<input placeholder="手机号" class="_input" :disabled="true" :value="myUserInfo.phone"/>
						</view>
					</view>
					<view class="line"></view>
					<view class="item">
						<view class="left">
							<text class="_text">姓名</text>
						</view>
						<view class="right">
							<input placeholder="填写您的真实姓名" class="_input" v-model="realName"/>
						</view>
					</view>
					<view class="line"></view>
					<view class="item">
						<view class="left">
							<text class="_text">身份证</text>
						</view>
						<view class="right">
							<input placeholder="填写您的真实身份证号码" class="_input" type="idcard" :maxlength="18" v-model="realIdCard"/>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="_button" @tap.stop.prevent="userRealName">{{ is_alread_real ? '修改实名' : '立即实名'}}</view>
					<view class="privacy">
						<view class="icon">
							<i @tap.stop.prevent="argeen_policy" class="mini-icon mini-duigouxiao argeened" v-if="is_argeen_policy"></i>
							<i @tap.stop.prevent="argeen_policy" class="mini-icon mini-quan" v-else></i>
						</view>
						<text decode="true" class="_text">我已阅读并同意</text>
						<text decode="true" class="_text _a" @tap.stop.prevent="to_policy(22)">《隐私政策》</text>
					</view>
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


const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		contentHieght: {
		  get() {
		    let that = this;
			return ' calc(100vh - ' + that.$store.state.CustomBar + 'px) ';
		  },
		  set(v) {}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 107,
			is_argeen_policy: false,
			is_alread_real: false,
			realName: '',
			realIdCard: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(107, 0, true);
		
		if(!that.myUserInfo.phone){
			uni.showModal({
			    title: '未绑定手机号',
			    content: '您还没有绑定手机号，无法进行实名认证',
			    showCancel: true,
			    confirmText: '前往绑定',
			    confirmColor: that.primaryColor,
			
			    success(res) {
			        if (res.confirm){
						uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', that);
					}else{
						uni.wen.toUrl(-2, '', that);
					}
			    }
			});
		}
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		if (uni.$store.state.token) {
			that.getUserRealName();
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: '实名认证',
			path: '/pagesA/mine/realname/realname?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: '实名认证',
			query: 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	methods: {
		userRealName(){
			let that = this;
			if(!that.is_argeen_policy){
				uni.showToast({
					title: '请先阅读并同意《隐私协议》',
					icon: 'none'
				});
				return false;
			}
			
			if(!that.realName){
				uni.showToast({
					title: '请输入真实姓名',
					icon: 'none'
				});
				return false;
			}
			
			if(!that.realIdCard){
				uni.showToast({
					title: '请输入身份证号',
					icon: 'none'
				});
				return false;
			}
			
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/real_name', {
				realName: that.realName,
				realIdCard: that.realIdCard,
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					that.is_alread_real = true;
					uni.wen.util.updateUserInfo();
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		getUserRealName(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/real_name', {}, 'GET').then(function(res) {
				uni.loading(false);
				if(res.status){
					that.realName = res.data.real_name;
					that.realIdCard = res.data.real_id_card;
					if(that.realName && that.realName.length > 0){
						that.is_alread_real = true;
					}
				}else{
					
				}
			});
		},
		argeen_policy(){
			let that = this;
			that.is_argeen_policy = !that.is_argeen_policy;
		},
		to_policy(type) {
		  if (type == 21) {
		    // #ifdef APP
		    plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=21');
		    // #endif
		    // #ifdef H5
		    window.open(uni.wen.api.homeUrl + '/common/clause?id=21');
		    // #endif
		    // #ifdef MP
		    uni.wen.toUrl(6, '/pages/web-view/index?url=' + encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=21'), null);
		    // #endif
		  } else if (type == 22) {
		    // #ifdef APP
		    plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=22');
		    // #endif
		    // #ifdef H5
		    window.open(uni.wen.api.homeUrl + '/common/clause?id=22');
		    // #endif
		    // #ifdef MP
		    uni.wen.toUrl(6, '/pages/web-view/index?url=' + encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=22'), null);
		    // #endif
		  }
		},
	}
}
</script>

<style lang="scss" scoped>
@import './realname.scss';
</style>