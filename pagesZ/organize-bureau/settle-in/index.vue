<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import LClipper from '@/pagesA/components/lime-clipper/components/l-clipper/l-clipper';

const common = require('@/mixins/common');
var options = {};
common(options);

export default {
  name: 'index',
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,
	LClipper
  },
  computed:{
	  config2_bureau_club_avatar:{
	  	get(){
	  		return this.formData.avatar || (this.$store.state.config2?.bureau?.club?.avatar || '');
	  	},
	  	set(v){}
	  },
	  config2_bureau_club_clause:{
	  	get(){
	  		return this.$store.state.config2?.bureau?.club?.clause ?? 0;
	  	},
	  	set(v){}
	  },
	  config2_page_bureau_settle_in_bg:{
	  	get(){
	  		return this.$store.state.config2.page?.bureau?.settle_in?.bg || "";
	  	},
	  	set(v){}
	  },
  },
  data() {
    return {
  	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 144,
	  isAgreement: false,
	  pic: '',
	  avatarClipper: false,
	  avatarTmp: '',
	  addressPpdatePop: false,
	  tempAddressDetail: '',
	  formData: {
		id: 0,
		avatar: '',
		name: '',
		latitude: 0,
		longitude: 0,
		address_name: '',
		address_detailed: '',
		type: 'club_push'
	  }
    };
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
	
	if(options.id && options.id > 0){
		that.getClubInfo(options.id);
	}else if(that.myUserInfo.id > 0){
		if(that.myUserInfo?.club_id > 0){
			// 修改模式
			that.getClubInfo(that.myUserInfo?.club_id);
		}
	}
	
  },
  onShow: function () {
    let that = this;
    that.updateScene(144, 0, true, false, 0, 2);
  },
  onPullDownRefresh: function () {
    uni.stopPullDownRefresh();
  },
  methods: {
	    validateForm() {
		  if (!this.formData.avatar) {
			uni.showToast({
			  title: '请上传俱乐部头像',
			  icon: 'none'
			});
			return false;
		  }
		  if (!this.formData.name) {
			uni.showToast({
			  title: '请填写俱乐部名称',
			  icon: 'none'
			});
			return false;
		  }
		  if (!this.formData.address_detailed) {
			uni.showToast({
			  title: '请填写俱乐部位置',
			  icon: 'none'
			});
			return false;
		  }
		  if(!this.myUserInfo.phone){
			uni.showToast({
			  title: '请填写您的手机号码',
			  icon: 'none'
			});
			return false;
		  }
		  return true;
		},
		updateClubInfo() {
			let that = this;
			if (!that.validateForm()) {
				return;
			}
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', that.formData ,'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					setTimeout(function(){
						if(that.$store.state.pre_scene == 158){
							uni.wen.toUrl(-2, null, that);
						}else{
							uni.wen.toUrl(-6, '/pagesZ/organize-bureau/club/club?id=' + res.data, that);
						}
					}, 300);
					
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
	    getClubInfo(club_id){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'club/info', {
				id: club_id
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					that.formData = res.data;
					that.formData.type = 'club_push';
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		addimage(e, _dataset) {
		  let that = this
		  /* ---处理dataset begin--- */
		  that.datasetHandle(e, _dataset);
		  /* ---处理dataset end--- */
		
		  const name = e.currentTarget.dataset.name
		  const type = e.currentTarget.dataset.type
		  that.setData({ [type]: false });
		
		  that.uploadPicturesPic(e.url, e.currentTarget.dataset.name, e.currentTarget.dataset.type, 144).then(() => {
		    if (type == 'avatarClipper') {
		      that.formData.avatar = that.avatarTmp;
		    }
		  })
		},
		address_handler(){
			let that = this;
			if(!that.formData.address_detailed && !that.formData.address_name){
				that.startChooseLocation();
			}else{
				uni.showActionSheet({
					itemList: ['编辑', '重新选取'],
					success: function (res) {
						if(res.tapIndex == 0){
							that.addressPpdatePop = true;
						}else if(res.tapIndex == 1){
							that.startChooseLocation();
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			}
		},
		startChooseLocation: function() {
			let that = this;
			uni.chooseLocation({
				success: function(a) {
					that.formData.latitude = a.latitude;
					that.formData.longitude = a.longitude;
					that.formData.address_name = a.address;
					that.formData.address_detailed = a.name;
					that.tempAddressDetail = a.name;
				},
				fail: function(err) {
					console.log(err);
				}
			});
		},
		shutAddressPpdatePop(){
			this.addressPpdatePop = !this.addressPpdatePop;
		},
		changeAddressDetail(){
			this.formData.address_detailed = this.tempAddressDetail;
			this.addressPpdatePop = false;
		},
		agreement(flag){
			this.isAgreement = flag;
		},
		to_policy(type) {
		  // #ifdef APP
		  plus.runtime.openWeb(uni.wen.api.homeUrl + '/common/clause?id=' + type);
		  // #endif
		  // #ifdef H5
		  window.open(uni.wen.api.homeUrl + '/common/clause?id=' + type);
		  // #endif
		  // #ifdef MP
		  uni.wen.toUrl(6, '/pages/web-view/index?url=' + encodeURIComponent(uni.wen.api.homeUrl + '/common/clause?id=' + type), null);
		  // #endif
		}
  }
}
</script>


<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="俱乐部入驻" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">
		
		</navBar>
		<view class="settle-in-page">
		  <view class="top-bg" :style="'background-image: url('+ config2_page_bureau_settle_in_bg +');'"></view>
		  
		  <view class="bottom">
			  <view class="settle-in-ino-wrapper">
				<view class="inner">
					<view class="title">填写入驻信息</view>
					<view class="item-wrapper avatar-wrapper" @tap.stop.prevent="imageClipper('avatarClipper')">
					  <view class="label">俱乐部头像</view>
					  <image class="avatar" :src="config2_bureau_club_avatar"/>
					  <u-icon nam="arrow-right"/>
					</view>
					<view class="item-wrapper input-wrapper">
					  <view class="label">俱乐部名称</view>
					  <input class="_input" placeholder-class="_input_place_holder" placeholder="填写俱乐部名称" v-model="formData.name" />
					  <u-icon nam="arrow-right"/>
					</view>
					<view class="item-wrapper input-wrapper" @tap.stop.prevent="address_handler">
					  <view class="label">俱乐部位置</view>
					  <view class="_input">{{ formData.address_detailed || '填写俱乐部位置' }}</view>
					  <u-icon nam="arrow-right"/>
					</view>
					<view class="item-wrapper input-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
					  <view class="label">主理人联系方式</view>
					  <view class="_input">{{ myUserInfo.phone || '去绑定' }}</view>
					  <u-icon nam="arrow-right" size="17"/>
					</view>
				</view>
			  </view>
			  		
			  <!-- 底部协议和按钮栏 -->
			  <view class="bottom-tools-wrapper">
			    <view class="inner">
					<view class="agreement-wrapper">
					  <i class="mini-icon mini-yigouxuan" v-if="isAgreement" @tap.stop.prevent="agreement(false)"></i>
					  <i class="mini-icon mini-weigouxuan" v-else @tap.stop.prevent="agreement(true)"></i>
					  <view class="agreement-text-wrapper">
					    <text>我已阅读并同意组局</text>
					    <text class="agreement" @tap.stop.prevent="to_policy(21)">《用户协议》</text>
					    <text class="agreement" @tap.stop.prevent="to_policy(22)">《隐私政策》</text>
					    <text>和</text>
					    <text class="agreement" @tap.stop.prevent="to_policy(config2_bureau_club_clause)">《组局俱乐部产品服务协议》</text>
					  </view>
					</view>
					<view class="submit-button-wrapper" @tap.stop.prevent="updateClubInfo">{{ myUserInfo.club_id > 0 ? '修改俱乐部信息' : '立即入驻'}}</view>
				</view>
			  </view>
			  
		  </view>
		  
		</view>
		
		<u-popup :show="addressPpdatePop" @close="shutAddressPpdatePop" :closeOnClickOverlay="false" :safeAreaInsetBottom="false"round="10px" mode="center">
			<view class="address-change-wrapper">
				<view class="title-wrapper">编辑地址</view>
					<view class="input-box">
						<u-input placeholder="输入您想修改的地址" maxlength="30" v-model="tempAddressDetail" :clearable="true"></u-input>
					</view>
					<view class="flex-row">
						<u-button type="primary" text="取消" shape="circle" :plain="true" @click="shutAddressPpdatePop" :customStyle="{transform: 'scale(0.8)'}"></u-button>
						<view style="width: 60rpx;"></view>
						<u-button type="primary" text="确定" :color="primaryColor" shape="circle" :customStyle="{transform: 'scale(0.8)'}" @click="changeAddressDetail"></u-button>
					</view>
			</view>
		</u-popup>
		
		<l-clipper v-if="avatarClipper" :image-url="pic" @success="addimage($event, { name: 'avatarTmp', type: 'avatarClipper' })" @cancel="avatarClipper = false"/>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
