<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="pageTitle" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="page-1" v-if="step === 1">
			<block v-if="shopConfig.questions && shopConfig.questions.length > 0">
				<view class="questions">
					<view class="title">
						<view class="left">常见问题</view>
						<view class="right"></view>
					</view>
					<view class="item" v-for="(item, index) in shopConfig.questions" :key="index" @tap.stop.prevent="toSliderUrl(8, item.id)">?? {{ item.title }}️</view>
				</view>
			</block>
			<view class="tip">
				<view class="line-1">请选择你想入驻的店铺类型</view>
				<view class="line-2">
					<i class="mini-icon mini-warning"></i>
					请谨慎选择，入驻成功后难以更改
				</view>
			</view>
			<view class="selects">
				<radio-group @change="radioChange">
					<view class="item">
						<view class="icon">
							<i class="mini-icon2 mini-gerendian"></i>
						</view>
						<view class="content">
							<view class="name">个人店</view>
							<view class="condition">开店条件：运营人身份证件（无需营业执照）</view>
							<view class="range">经营范围：仅支持售卖部分类目</view>
							<view class="ltip">
								<i class="mini-icon mini-jubao"></i>
								不开放【家用电器】，【家具建材】，【珠宝玉石】等类目
							</view>
						</view>
						<view class="radio_">
							<radio :checked="formData.shopType == 1" :color="primaryColor"/>
						</view>
					</view>
				</radio-group>
			</view>
			<view class="bottom">
				<view class="inner">
					<view class="tip">入驻前请阅读<view class="agreement" @tap.stop.prevent="to_policy(shopConfig.clause)">《商家服务协议》</view></view>
					<view class="btn" @tap.stop.prevent="nextStep(2)">
						下一步
					</view>
				</view>
			</view>
		</view>
		<view class="page-2" v-if="step === 2">
			<view class="steps">
				<u-steps current="1" :activeColor="primaryColor" :dot="true">
					<u-steps-item title="店铺类型"></u-steps-item>
					<u-steps-item title="经营类目"></u-steps-item>
					<u-steps-item title="店铺信息/身份信息"></u-steps-item>
				</u-steps>
			</view>
			<view class="tip">
				<view class="line-1">请选择售卖的商品类目</view>
				<view class="line-2">
					如果您主要售卖本地餐饮团购，酒旅服务或预订类线下核销的商品，请选择【本地生活商品】，其他商品请选择【电商商品】
				</view>
			</view>
			
			<view class="item">
				<view class="inner">
					<view class="line-1">
						<view class="title">经营类目</view>
						<view class="right fake-select" @tap.stop.prevent="closeCategorySelectPopup">
							<view class="fake-select-inner">
								<view class="tip">可选择多个类目</view>
								<i class="mini-icon mini-youjiantou"></i>
							</view>
						</view>
					</view>
					<view class="select-list" v-if="selects.length > 0">
						<view v-for="(item, index) in selects" :key="index" class="select-item">
							<view class="select-item-inner">
								<view class="_text" v-if="item.third">{{ item.first.name + ' > ' + item.second.name + ' > ' + item.third.name }}</view>
								<i class="mini-icon mini-shanchu2" @tap.stop.prevent="selectsRemove(index)"></i>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="tip">
				<view class="line-1">店铺相关费用</view>
				<view class="line-2">
					相关费用会根据所选类目的不同而变化
				</view>
			</view>
			
			
			
			<view class="item">
				<view class="inner">
					<view class="line-1">
						<view class="title">店铺保证金</view>
						<view class="right guarantee">
							<view :class=" 'guarantee-inner ' + (formData.shopClassifys.length > 0 ? '' : 'gray') ">
								￥{{ guarantee_total }}
							</view>
						</view>
					</view>
					<view class="line-2">
						按照所选类目中最高标准收取
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="inner">
					<view :class="'btn ' + (formData.shopClassifys.length > 0 ? 'yes' : '') " @tap.stop.prevent="nextStep(3)">
						下一步
					</view>
				</view>
			</view>
		</view>
		
		<view class="page-3" v-if="step === 3">
			<view class="steps">
				<u-steps current="2" :activeColor="primaryColor" :dot="true">
					<u-steps-item title="店铺类型"></u-steps-item>
					<u-steps-item title="经营类目"></u-steps-item>
					<u-steps-item title="身份信息/店铺信息"></u-steps-item>
				</u-steps>
			</view>
			<block v-if="formData.shopType == 1">
				<view class="tip">
					<view class="line-1">请填写个人信息</view>
					<view class="line-2">
						目前仅支持中国大陆居民开个人店，请完成实名认证
					</view>
				</view>
				
				<!-- <view class="item">
					<view class="inner">
						<view class="line-1">
							<view class="title">上传身份证</view>
						</view>
						<view class="id-card-box flex-row">
							<view class="l flex-column">
								<image class="_image" src="https://mini.minisns.cn/statics/images/cart_a.svg"></image>
								<view class="upload-tip">身份证头像面</view>
							</view>
							<view class="r flex-column">
								<image class="_image" src="https://mini.minisns.cn/statics/images/cart_b.svg"></image>
								<view class="upload-tip">身份证国徽面</view>
							</view>
						</view>
					</view>
				</view> -->
				<!-- <view class="line"></view> -->
				
				<view class="item" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/realname/realname')">
					<view class="inner">
						<view class="line-1">
							<view class="title">姓名</view>
							<view class="right input">
								<input class="_input" placeholder="请填写运营者的真实姓名" v-model="realName" :disabled="true"/>
							</view>
						</view>
					</view>
				</view>
				<view class="line"></view>
				
				<view class="item" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/realname/realname')">
					<view class="inner">
						<view class="line-1">
							<view class="title">身份证号码</view>
							<view class="right input">
								<input class="_input" placeholder="请填写运营者的身份证号码"  v-model="realIdCard" :maxlength="36" :disabled="true"/>
							</view>
						</view>
					</view>
				</view>
				
				<!-- <view class="line"></view> -->
				
				<!-- <view class="item">
					<view class="inner">
						<view class="line-1">
							<view class="title">证件地址</view>
							<view class="right region-picker-wrap">
								<region-picker @change="bindHeadRegionChange" :value="formData.head_addr" class="region-picker">
									<view class="pickered" v-if="formData.head_addr.length > 0">{{ formData.head_addr[0] }} {{ formData.head_addr[1] }}
										{{ formData.head_addr[2] }}</view>
									<view class="picker-null" v-else>
										点击选择
										<view class="arrow-d"></view>
									</view>
								</region-picker>
							</view>
						</view>
					</view>
				</view> -->
				
				<view class="line"></view>
				
				<view class="item">
					<view class="inner">
						<view class="line-1">
							<view class="title">手机号码</view>
							<view class="right input" @tap.stop.prevent="headPhoneTap">
								<view class="_input">{{ myUserInfo.phone || '未绑定手机号' }}</view>
							</view>
						</view>
					</view>
				</view>
				

			</block>
			<view class="bottom">
				<view class="inner">
					<view class="tip">我同意<view class="agreement" @tap.stop.prevent="to_policy(21)">《用户协议》</view></view>
					<view class="btn" @tap.stop.prevent="shopAdd">
						确认提交
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="page-4" v-if="step === 4">
			<view class="inner">
				<view class="item-list">
					<block v-if="formData.shopType == 1">
						<view class="item">
							<view class="left">
								<view class="title">{{ myUserInfo.user_name }}的店</view>
								<view class="desc">{{ '欢迎入驻' + config_about_name + '商城，先进行开店的初始化操作~， 然后管理员再进行审核哦' }}</view>
							</view>
							<view class="right">
								
							</view>
						</view>
					</block>
				</view>
				
				
				<view class="item-list">
					<view class="item flex-row">
						<view class="left">
							<view class="title">店铺信息认证（必做）</view>
							<view class="desc">选择自己的经营类型并设置经营信息</view>
						</view>
						<view class="right flex-column">
							<view class="btn done">
								已完成
							</view>
						</view>
					</view>
					<view class="item flex-row">
						<view class="left">
							<view class="title">缴纳保证金（{{ myUserInfo.shop ? myUserInfo.shop.margin_rest : 0 }} / {{ shop.margin_least }}）</view>
							<view class="desc">店铺进入审核前，需完成保证金缴纳</view>
						</view>
						<view class="right flex-column">
							<block v-if="shop.margin_rest < shop.margin_least">
								<view class="btn" @tap.stop.prevent="toSliderUrl(6, '/pagesS/sellers/guarantee/guarantee')">
									去缴纳
								</view>
							</block>
							<block v-else>
								<view class="btn done" @tap.stop.prevent="toSliderUrl(6, '/pagesS/sellers/guarantee/guarantee')">
									已完成
								</view>
							</block>
						</view>
					</view>
					<view class="item flex-row">
						<view class="left">
							<view class="title">经营地址（非必须）</view>
							<view class="desc">若发布核销商品，则必须有实际经营地址，便于客户上门核销</view>
						</view>
						<view class="right flex-column">
							<block v-if="shop.contacts.length > 0">
								<view class="btn default" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/contact/contact')">
									{{ shop.contacts.length }}个地址
								</view>
							</block>
							<block v-else>
								<view class="btn" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/contact/contact')">
									去添加
								</view>
							</block>
						</view>
					</view>
				</view>
				
				<view class="item-list" v-if="shop.admin_user">
					<view class="item flex-row">
						<view class="left">
							<view class="title">我的店铺</view>
							<view class="desc"></view>
						</view>
						<view class="right flex-column">
							<view class="status">
								<view class="btn" @tap.stop.prevent="toSliderUrl(32, shop.id)">
									进入
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="item-list" v-if="shop.margin_rest >= shop.margin_least">
					<view class="item flex-row">
						<view class="left">
							<view class="title">当前状态</view>
							<view class="desc"></view>
						</view>
						<view class="right flex-column">
							<view class="status">
								{{ shop.status_tip }}
							</view>
						</view>
					</view>
					<block v-if="shop.admin_user">
						<view class="item flex-row" @tap.stop.prevent="toSliderUrl(17, shop.admin_user.url_address)">
							<view class="left">
								<view class="title">后台地址</view>
								<view class="desc"></view>
							</view>
							<view class="right flex-column">
								<view class="status">
									{{ shop.admin_user.url_address }}
								</view>
							</view>
						</view>
						<view class="item flex-row" @tap.stop.prevent="toSliderUrl(17, shop.admin_user.username)">
							<view class="left">
								<view class="title">登录用户名</view>
								<view class="desc"></view>
							</view>
							<view class="right flex-column">
								<view class="status">
									{{ shop.admin_user.username }}
								</view>
							</view>
						</view>
						<view class="item flex-row" @tap.stop.prevent="toSliderUrl(17, '123456')">
							<view class="left">
								<view class="title">默认密码</view>
								<view class="desc"></view>
							</view>
							<view class="right flex-column">
								<view class="status">
									123456
								</view>
							</view>
						</view>
					</block>
				</view>
				
			</view>
		</view>
			
		<u-popup :show="categorySelectPopup" @close="closeCategorySelectPopup" mode="bottom">
			<view class="category-select">
				<view class="inner">
					<view class="title">
						选择类目
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="closeCategorySelectPopup"></i>
					</view>
					<category-select :selects="formData.shopClassifys" @select="seletctCategory" :shopType="formData.shopType"></category-select>
					<view class="btn-wrap"><view class="btn" @tap.stop.prevent="closeCategorySelectPopup">确定</view></view>
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


import categorySelect from '@/pagesA/components/category-select/category-select';
import regionPicker from '@/pagesA/components/region-picker/region-picker.vue';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		categorySelect,
		regionPicker
	},
	computed:{
		config_about_name:{
			get(){
				let that = this;
				return that.$store.state.config.about.name;
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 96,
			pageTitle: '店铺申请',
			step: 1,
			shopTypeSelect: [
				{
					shopType: 1,
					name: '个人店',
					condition: '运营人身份证',
					condition_sample: 'xxx',
					range: '仅支持售卖部分类目',
					range_sample: '',
					warn: '不开放【家用电器】，【家具建材】，【珠宝玉石】等类目'
				}
			],
			categorySelectPopup: false,
			selects: [],
			guarantee_total: 0,
			formData: {
				shopType: 1,
				shopClassifys: []
			},
			realName: '',
			realIdCard: '',
			
			shop: {
				shopType: 1,
				shopClassifys: [],
				margin_least: 0,
				status: 0,
				status_tip: ''
			},
			shopConfig: {
				clause: 21,
				questions: []
			}
		}
	},
	watch:{
		selects: {
			handler: function(newVal, oldVal) {
				let that = this;
				let arr = [];
				if(newVal){
					newVal.forEach((v,k)=>{
						arr.push(v.third.id)
					});
				}
				that.formData.shopClassifys = arr;
				
				let guarantee_total = 0;
				newVal.forEach((v,k)=>{
					guarantee_total += v.third.guarantee;
				});
				that.guarantee_total = guarantee_total;
			},
		},
	},
	onShow: function () {
		let that = this;
		// todo:
		that.updateScene(96, 0, true);
		
		if(that.myUserInfo.id > 0){
			if(!that.myUserInfo.real_name){
				uni.showModal({
				    title: '未实名认证',
				    content: '您还没有实名认证，无法进行店铺申请',
				    showCancel: true,
				    confirmText: '前往实名',
				    confirmColor: that.primaryColor,
				
				    success(res) {
				        if (res.confirm){
							uni.wen.toUrl(6, '/pagesA/mine/realname/realname', that);
						}else{
							uni.wen.toUrl(-2, '', that);
						}
				    }
				});
			}else{
				if(that.realName != that.myUserInfo.real_name){
					that.getUserRealName();
				}
			}
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		if (uni.$store.state.token) {
			that.getUserRealName();
			that.shopInfo();
		}
	},
	onPullDownRefresh: function () {
		let that = this;
	    if (uni.$store.state.token) {
	    	that.getUserRealName();
	    	that.shopInfo();
	    }
	},
	methods: {
		selectsRemove(index){
			let that = this;
			that.selects.splice(index, 1);
		},
		shopInfo(){
			let that = this;
			if(that.myUserInfo.id > 0){
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/info', {user_id:  that.myUserInfo.id, shop_config: 1}).then(function(res) {
					uni.stopPullDownRefresh();
					if(res.status){
						console.log(res.data.config.questions);
						if(res.data.shop){
							that.shop = res.data.shop;
							that.step = 4;
							that.pageTitle = '我的店铺';
						}
						
						if(res.data.config){
							that.shopConfig = res.data.config;
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
		shopAdd(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/add', that.formData, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
					that.shopInfo();
					uni.wen.util.updateUserInfo();
					setTimeout(function(){
						uni.startPullDownRefresh({});
					}, 300);
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		nextStep(step){
			let that = this;
			if(step == 2){
				if(!([1].includes(that.formData.shopType))){
					uni.showToast({
						title: '请先选择店铺类型',
						icon: 'none'
					});
					return false;
				}
			}else if(step == 3){
				if(that.formData.shopClassifys.length <= 0){
					uni.showToast({
						title: '请先选择您想要经营的类别',
						icon: 'none'
					});
					return false;
				}
			}
			that.step = step;
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
					uni.showModal({
					    title: '未实名认证',
					    content: '您还没有实名认证，无法进行店铺申请',
					    showCancel: true,
					    confirmText: '前往实名',
					    confirmColor: that.primaryColor,
					
					    success(res) {
					        if (res.confirm){
								uni.wen.toUrl(6, '/pagesA/mine/realname/realname', that);
							}else{
								uni.wen.toUrl(-2, '', that);
							}
					    }
					});
				}
			});
		},
		headPhoneTap(){
			let that = this;
			
			uni.showModal({
				title: '运营人手机号码与当前账号绑定的手机号保持一致',
				content: '是否前往更改',
				confirmText: '前往',
				success: function (res) {
					if (res.confirm) {
						uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		bindHeadRegionChange: function(e) {
			this.formData.head_addr = e.detail.value;
		},
		seletctCategory(obj){
			let that = this;
			if(obj && obj.third &&  obj.third.id > 0){
				let isExits = false;
				let exitKey = 0;
				that.selects.forEach((v,k)=>{
					if(v.third.id == obj.third.id){
						isExits = true;
						exitKey = k;
					}
				});
				if(isExits){
					that.selects.splice(exitKey, 1);
				}else{
					let selects = that.selects;
					selects.push(obj);
					that.setData({
						selects: selects
					})
				}
			}
		},
		closeCategorySelectPopup(){
			let that = this;
			that.categorySelectPopup = !that.categorySelectPopup;
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
		},
	}
}
</script>

<style lang="scss" scoped>
@import './apply.scss';
</style>