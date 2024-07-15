<script>
import PetAdoptionListItem from "@/pagesP/pet-adoption/components/pet-adoption-list-item.vue";
const user = require('@/mixins/user');
var options = {};
user(options);
export default {
  mixins: [{ methods: options }],
  components: { PetAdoptionListItem },
  data() {
    return {
      type: null,
	  userId: 0,
      dataList: [],
	  pageTitle: '领养列表',
	  tabList: [],
	  
	  userInfo: {
	    user_name: '',
	    user_background_maps: '',
	    user_avatar: '',
		pets: {
			adoption: {
				count: {
					status0: 0,
					status1: 0,
				}
			}
		}
	  },
    }
  },
  onLoad(options) {
  	let that = this;
	that.globalOnloadProcess(options);
	var scene = decodeURIComponent(options.scene);
	if (scene && scene != 'undefined') {
		let query = {};
		if(scene.indexOf('&') !== -1){
			let scene_arr = scene.split('&');
			scene_arr.map((item)=> {
			    let queryData = item.split('=')
			    query[queryData[0]] = queryData[1]
			})
		}else{
			let queryData = scene.split('=')
			query[queryData[0]] = queryData[1]
		}
		if(query.from_user && query.from_user.length > 0){
			uni.setStorageSync('form_user', query.from_user);
			uni.$store.commit('updateFormUser', query.from_user);
		}
		that.userId = query.user_id;
		that.type = query.type;
		
	} else {
		that.type = options.type;
		that.userId = options.user_id;
	}
	
	if (that.type === '5' || that.type === '4') {
		that.tabList = [
			{type: 5, name: '待送养'},
			{type: 4, name: '已送养'},
		];
	}else{
		that.tabList = [
			{type: 1, name: '领养'},
			{type: 2, name: '送养'},
			{type: 3, name: '收藏'}
		];
	}
	
	that.init_();
	
  },
  onShow: function() {
  	let that = this;
	if(that.type == 1){
		// 我的领养
		that.updateScene(50004, 0, true);
	}else if(that.type == 2 || that.type == 4 || that.type == 5){
		// 我的送养
		// 4:已送养 5：送养中
		if(that.userId > 0){
			that.updateScene(50005, 0);
		}else{
			that.updateScene(50005, 0, true);
		}
	}else if(that.type == 3){
		// 我的收藏
		that.updateScene(50006, 0, true);
	}
	
	
	
	if(that.userInfo && that.userInfo.id > 0){
		
	}else{
		that.getUserinfoById(that.userId);
	}
  	
  },
  onShareAppMessage: function(res) {
  	let that = this;
  	return {
  		title: that.pageTitle,
  		path: '/pagesP/pet-adoption/pet-common-list/index?fph=1&user_id='+ that.userInfo.id +'&type='+ that.type +'&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: ''
  	};
  },
  
  onShareTimeline: function(res) {
  	let that = this;
  	return {
  		title: that.pageTitle,
  		query: 'user_id='+ that.userInfo.id +'&type='+ that.type +'&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: ''
  	};
  },
  methods: {
	init_(){
		let that = this;
		if (that.type === '1') {
			that.pageTitle = '我的领养';
			that.userId = that.myUserInfo.id;
		} else if (that.type === '2') {
			that.pageTitle = '我的送养';
			that.userId = that.myUserInfo.id;
		} else if (that.type === '3') {
			that.pageTitle = '我的收藏';
			that.userId = that.myUserInfo.id;
		} else if (that.type === '4') {
			that.pageTitle = 'TA的已送养';
		} else if (that.type === '5') {
			that.pageTitle = 'TA的待送养';
		}
		uni.setNavigationBarTitle({ title: that.pageTitle });
	},
	tabChange(e){
		let that = this;
		that.type = e.type;
		that.init_();
		that.$refs.paging.refresh();
	},
    queryList(pageNo, pageSize) {
      //将请求的结果数组传递给z-paging
      // 根据不同类型查询不同列表
	  
	  let that = this;
	  uni.loading(true);
	  uni.wen.util.request(
	      uni.wen.api.ApiRootUrl + 'pets/adoption/list', {
	  		action: that.type,
			page: pageNo,
	  		limit: pageSize,
			user_id: that.userId
	  	}
	  ).then(function (res) {
	      uni.loading(false);
	      if (res.code == 200) {
			that.$refs.paging.complete(res.data.data)
	  	}else {
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
	  		that.$refs.paging.complete(false)
	  	}
	  });
    }
  },
}
</script>

<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
<view class="mini-page-body">
<z-paging ref="paging" v-model="dataList" @query="queryList">
		
		<view :class=" 'common-list type-' + type ">
			
			<view class="bg-wrap">
				<view class="bg-height"></view>
				<image class="bg" :src="userInfo.user_background_maps" mode="aspectFill"></image>
			</view>
			<view class="info flex-column">
				<view class="flex-row" style="justify-content: center;">
					<view class="avatar-wrap flex-column">
						<image class="avatar" :src="userInfo.user_avatar"></image>
						<text class="user_name">{{ userInfo.user_name }}</text>
					</view>
				</view>
				<view class="count-info flex-row">
					<view class="part part-1">正在送养 <view class="num inline">{{ userInfo.pets ? userInfo.pets.adoption.count.status0 : 0 }}</view></view>
					<view class="part">已送养 <view class="num inline">{{ userInfo.pets ? userInfo.pets.adoption.count.status1 : 0 }}</view></view>
				</view>
			</view>
			
			<u-tabs :list="tabList" :lineColor="primaryColor" lineHeight="6" @change="tabChange"></u-tabs>
			
			<view class="list">
				<view v-for="item in dataList" :key="item.id">
				  <pet-adoption-list-item :pet="item"/>
				</view>
			</view>
		</view>
		<!-- 空数据显示 -->
		<view slot="empty">
		  <u-empty text="还没有待领养的宠物哦～" width="300" height="300" textSize="28" />
		</view>
</z-paging>
</view>
</view>
</template>

<style lang="scss" scoped>
.common-list{
	
}
.bg-wrap{
		width: 750rpx;
		height: 250rpx;
		.bg-height{
			width: 750rpx;
			height: 250rpx;
		}
		.bg{
			top: 0;
			position: absolute;
			width: 750rpx;
			height: 300rpx;
		}
	}
	.info{
		width: 750rpx;
		border-radius: 50rpx 50rpx 0 0;
		position: relative;
		z-index: 9999;
		@include background_color(page-box-background-color);
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
		.avatar-wrap{
			transform: translateY(-50rpx);
			.avatar{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin: auto;
			}
			.user_name{
				margin-top: 20rpx;
				font-weight: bold;
				margin: auto;
			}
		}
		.count-info{
			justify-content: space-between;
			justify-content: center;
			.part{
				color: #757575;
				.num{
					margin-left: 5rpx;
					color: $uni-color-primary;
				}
			}
			.part.part-1{
				margin-right: 20rpx;
			}
		}
	}
	.list{
		
	}
</style>
