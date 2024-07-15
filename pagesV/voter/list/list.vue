<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#0e0e11' : '#f6f6f6'">
		</navBar>
		
		<view class="voter-list-page">
			<u-sticky :offsetTop="0">
				<view class="sticky_wrap">
					<view style="height: 20rpx;"></view>
					<view class="voter_head_search">
						<u-search v-model="formData.keyword" @search="searchClick" placeholder="搜索选票标题" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :placeholderColor="global__theme__ == 'black' ? '#6b6f77' : '#999999'" :showAction="false" :height="60"></u-search>
					</view>
					<view class="voter_head_tabs">
						<u-tabs :itemStyle="{ height: '37px' }" :current="tabIndex" @click="tabsClick" :list="voter_tabs" lineHeight="6" :lineColor="primaryColor" :activeStyle="{color: (global__theme__ == 'black' ? '#d8d8d9' : '#313131'), fontSize: '26rpx', transform: 'scale(1.08)'}" :inactiveStyle="{color: (global__theme__ == 'black' ? '#747476' : '#999999'), fontSize: '26rpx'}"></u-tabs>
					</view>
				</view>
			</u-sticky>
			<view class="inner">
				<view style="height: 20rpx;"></view>
				<view class="voter_head_list">
					<block v-if="!isNull">
						<block v-for="(item, index) in voterList" :key="index">
							<view class="box" @tap.stop.prevent="toSliderUrl(33, item.id)">
								<view class="bg-img" :style="'background-image: url('+ item.banners[0] +');'" v-if="item.banners"></view>
								<view class="info">
									<view class="title u-line-2">
									<i class="mini-icon mini-zhiding1" v-if="item.is_sticky == 1"></i>
									{{ item.title }}</view>
									<view class="count">
										<i class="mini-icon mini-shoucang-shixin1"></i>
										<view class="text">{{ item.player_count }}位选手</view>
										<i class="mini-icon mini-shuxian"></i>
										<i class="mini-icon2 mini-dianzan"></i>
										<view class="text">{{ item.user_count }}人投票</view>
									</view>
									<view class="time">
										<i class="mini-icon2 mini-shizhongfill"></i>
										<view class="text">{{ item.end_time }} 结束</view>
									</view>
								</view>
							</view>
						</block>
						<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" bgClass="page-box-item4-background-color" iconSize="28" fontSize="28" color="#989898" />
						<view class="safe_area_height"></view>
					</block>
					<block v-if="isNull">
						<u-empty text="一个选票也没有" width="300" height="300" text-size="28"/>
					</block>
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
		page_title: '',
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 124,
			formData: {
				keyword: '',
				template: [],
				orderBy: 'created_at',
				order: 'desc',
				master: 1,
				player: 0,
				voted: 0
			},
			voterList: [],
			page: 1,
			isNull: false,
			isLastPage: false,
			loadmoreShow: false,
			
			tabIndex: 0,
			voter_tabs: [
				{
					"name": "创建的",
					"template": [],
					"orderBy": "created_at",
					"order": "desc",
					"master": "1",
					"player": "0",
					"voted": "0"
				},
				{
					"name": "报名的",
					"template": [],
					"orderBy": "created_at",
					"order": "desc",
					"master": "0",
					"player": "1",
					"voted": "0"
				},
				{
					"name": "投过票",
					"template": [],
					"orderBy": "created_at",
					"order": "desc",
					"master": "0",
					"player": "0",
					"voted": "1"
				},
			]
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(124, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		var scene = decodeURIComponent(options.scene);
		if (scene && scene != 'undefined') {
		  let query = {};
		  if (scene.indexOf('&') !== -1) {
		    let scene_arr = scene.split('&');
		    scene_arr.map((item) => {
		      let queryData = item.split('=')
		      query[queryData[0]] = queryData[1]
		    })
		  } else {
		    let queryData = scene.split('=')
		    query[queryData[0]] = queryData[1]
		  }
		  
		  that.setData({
		    user_id: query.uid,
		    fph: true
		  });
		  if(that.user_id == that.myUserInfo.id){
		  	that.page_title = '我的选票';
		  }else{
		  	that.page_title = 'Ta的选票';
		  }
		  if(query.tab > 0){
			that.tabIndex = query.tab;
			that.formData.master = 0;
			if(query.tab == 1){
				that.formData.player = 1;
			}else{
				that.formData.voted = 1;
			}
		  }
		} else {
		  if(options.uid && options.uid > 0){
		  	that.user_id = options.uid;
		  	if(that.user_id == that.myUserInfo.id){
		  		that.page_title = '我的选票';
		  	}else{
		  		that.page_title = 'Ta的选票';
		  	}
		  }else{
		  	that.page_title = '选票';
		  }
		  
		  if(options.tab > 0){
			that.tabIndex = options.tab;
			that.formData.master = 0;
			if(options.tab == 1){
				that.formData.player = 1;
			}else{
				that.formData.voted = 1;
			}
		  }
		}

		that.getvoterList();
		
	},
	onPullDownRefresh: function() {
		let that = this;
		that.setData({
			voterList: [],
			page: 1,
			isNull: false,
			isLastPage: false,
			loadmoreShow: false,
		});
	
		that.getvoterList();
	},
	onReachBottom: function() {
		let that = this;
		if(!that.isLastPage && that.voterList.length > 0){
			that.setData({
				loadmoreShow: true,
				isLastPage: false,
				page: that.page + 1
			});
			that.getvoterList();
		}
	},
	onShareAppMessage: function (res) {
	  let that = this;
	  return {
	    title: 'Ta的选票',
	    path: 'pagesV/voter/list/list?uid='+ that.user_id +'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	onShareTimeline: function (res) {
	  let that = this;
	  return {
	    title: 'Ta的选票',
	    query: 'uid=' + that.user_id + '&back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	methods: {
		searchClick(keyword){
			let that = this;
			that.formData.keyword = keyword;
			that.page = 1;
			that.loadmoreShow = false;
			that.voterList = [];
			
			that.getvoterList();
		},
		tabsClick(e){
			let that = this;
			if(e){
				that.formData.keyword = '';
				that.formData.template = e.template;
				that.formData.order = e.order;
				that.formData.orderBy = e.orderBy;
				that.formData.master = e.master;
				that.formData.player = e.player;
				that.formData.voted = e.voted;
				
				that.page = 1;
				that.voterList = [];
				that.getvoterList();
			}
		},
		getvoterList() {
		  let that = this;
		  if(that.page == 1){
			 uni.loading(true);
			 that.setData({
				isLastPage: false,
				loadmoreShow: false,
				isNull: false
			 });
		  }
		  
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/list', {
		    keyword: that.formData.keyword,
			template: (Array.isArray(that.formData.template) && that.formData.template.length > 0) ? that.formData.template.join(',') : '',
			orderBy: that.formData.orderBy,
			order: that.formData.order,
			master: that.formData.master,
			playerd: that.formData.player,
			voted: that.formData.voted,
			isTenant: false,
		    page: that.page,
			user_id: that.user_id
		  }).then(function (res) {
			uni.stopPullDownRefresh();
			if(that.page == 1){
				uni.loading(false);
			}
			
			if(res.status){
		
				if(res.data.current_page != that.page){
					return false;
				}
				let data = res.data;
				let args = {};
				
				args.tenant_id = that.$store.state.tenant.tenant_id;
							
				if (data.data.length <= 0 && that.page == 1) {
				  args.isNull = true;
				}
							
				if (data.data.length < 10) {
				  args.isLastPage = true;
				  args.loadmoreShow = true;
				}else{
					args.isLastPage = false;
					args.loadmoreShow = false;
				}
				
				
				if(data.data && data.data.length > 0){
					if(that.page == 1){
						args.voterList = data.data;
					}else{
						args.voterList = that.voterList.concat(data.data);
					}
					args.page = data.current_page;
				}
				
				that.setData(args);
			}
		
		    
		  });
		},
	}
}
</script>

<style lang="scss" scoped>
@import './list.scss';
</style>