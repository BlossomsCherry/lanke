<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="选票详情" :color="voter.id > 0 ? voter.text_navigation_bar_color : (global__theme__ == 'black' ? '#ffffff' : '#000000')" :background="voter.id > 0 ? voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')">
		
		</navBar>
		
		<view class="voter-detail-page" :style="'background-color: ' + (voter.id > 0 ? voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')) + ';'">
			<block v-if="voter.id > 0">
				<view class="inner">
					<view class="voter-deital-gap"></view>
					<view class="master-view" @tap.stop.prevent="toSliderUrl(4, voter.user_id)">
						<image :src="voter.master_user_avatar" class="_image"></image>
						<view class="text-box flex-column">
							<text class="_text">{{ voter.master_user_name }}</text>
						</view>
					</view>
					<view class="voter-deital-gap"></view>
				</view>
				<view class="swiper">
					<u-swiper :list="voter.banners" :radius="0" indicatorindicatorMode="line" height="380rpx" width="750rpx" :autoplay="true" circular :bgColor="voter.background_color"></u-swiper>
				</view>
				<u-notice-bar v-if="voter.notice != '' && voter.notice != null" :text="voter.notice" direction="row" :bgColor="voter.main_color" :color="voter.text_color"></u-notice-bar>
				<view class="voter-deital-gap"></view>
				<view class="inner">
					<view class="page_item head-card" :style="'background-color: ' + box_trans_bg_rgba + ';'">
						<view class="part1">
							<view class="title">{{ voter.title }}</view>
							<view class="count-wrap">
								<view class="count-box count-box-1">
									<view class="num">
										<view class="n" :style="'color:' + voter.main_color + ';'">{{ voter.player_count }}</view>
										<view class="unit">位</view>
									</view>
									<view class="count-name">参与{{ voter.player_called }}</view>
								</view>
								<view class="count-box count-box-2">
									<view class="num">
										<view class="n" :style="'color:' + voter.main_color + ';'">{{ voter.ballot_total }}</view>
										<view class="unit">{{ voter.unit_called }}</view>
									</view>
									<view class="count-name">累计{{ voter.unit_called }}数</view>
								</view>
								<view class="count-box count-box-3">
									<view class="num">
										<view class="n" :style="'color:' + voter.main_color + ';'">{{ voter.user_count }}</view>
										<view class="unit">人</view>
									</view>
									<view class="count-name">投票人数</view>
								</view>
							</view>
						</view>
						<view class="counter-down" :style="'background-color: ' + hex2rgb(voter.main_color, 0.4) + ';'">
							<view class="counter-tip">选票结束剩余：</view>
							<view class="show_time">
								<text class="time_box" :style="'color:' + voter.main_color + ';'">{{countdown.remainderDay}}</text>
								<text class="time_unit">天</text>
								<text class="time_box" :style="'color:' + voter.main_color + ';'">{{countdown.remainderHour}}</text>
								<text class="time_unit">时</text>
								<text class="time_box" :style="'color:' + voter.main_color + ';'">{{countdown.remainderMin}}</text>
								<text class="time_unit">分</text>
								<text class="time_box" :style="'color:' + voter.main_color + ';'">{{countdown.remainderSec}}</text>
								<text class="time_unit">秒</text>
							</view>
						</view>
					</view>
					<view class="voter-deital-gap"></view>
					
					<u-sticky :offsetTop="0">
						<view class="tabs-wrap" :style="'background-color: ' + voter.background_color + ';'">
							<view class="tab_search">
								<u-search v-model="playerFormData.keyword" @search="searchClick" placeholder="搜索选手名字或编号" :bgColor="box_trans_bg_rgba" :placeholderColor="global__theme__ == 'black' ? '#6b6f77' : '#999999'" :showAction="false" :height="60"></u-search>
							</view>
							<view class="tabs">
								<u-tabs :itemStyle="{ height: '44px' }" :current="tabCurrent" @change="tabCurrentChange" @click="tabsClick" :list="voter.tabs" lineHeight="6" :lineColor="voter.main_color" :activeStyle="{color: voter.main_color, fontSize: '32rpx', transform: 'scale(1.08)'}" :inactiveStyle="{color: (global__theme__ == 'black' ? '#dadadb' : '#333333'), fontSize: '32rpx'}"></u-tabs>
							</view>
						</view>
					</u-sticky>
					<view class="voter-deital-gap"></view>
					
					<block v-if="tabAction == 'player'">
						<block v-if="playerList.length > 0">
							<view class="player-list-wrap">
								<view class="player-item" v-for="(item, index) in playerList" :key="index" @tap.stop.prevent="toSliderUrl(6, '/pagesV/voter/detail/player?id=' + item.id)">
									<view class="cover" :style="'background-image: url('+ item.pic +');'"></view>
									<view class="info">
										<view class="name u-line-1">{{ '编号: '+ item.relative_id }}</view>
										<view class="name u-line-1">{{ item.show_name }}</view>
										<view class="button-box">
											<view class="num" :style="'color: ' + voter.main_color ">{{ item.ballot_total + voter.unit_called }}</view>
											<view class="btn" :style="'background-color: ' + voter.button_bg_color + ';color: ' + voter.button_text_color + ';'" @tap.stop.prevent="shutBallotPopup(item.id)">给Ta投票</view>
										</view>
									</view>
								</view>
							</view>
							<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
								iconSize="28" fontSize="28" color="#989898" />
						</block>
						<block v-else>
							<view class="flex-row" style="justify-content: center;width: 100%;padding-top: 50rpx;">
								<u-empty text="一位选手也没有" width="300" height="300" text-size="28" />
							</view>
						</block>
					</block>
					
					<block class="rank-list-wrap" v-else-if="tabAction == 'rank'">
						<block v-if="rankPlayerList.length > 0">
							<view class="ranking" :style="'background-color: ' + box_trans_bg_rgba + ';'">
								<view class="rangking-title">
									<text>排名</text>
									<text>昵称</text>
									<text>{{ voter.unit_called }}</text>
								</view>
								<view class="ranking-list">
									<view class="ranking-list-item" v-for="(item, key) in rankPlayerList" :key="key"  @tap.stop.prevent="toSliderUrl(6, '/pagesV/voter/detail/player?id=' + item.id)">
										<view v-if="key < 3" class="ranking-list-number">
											<image :src=" appUrl + '/statics/images/voter/' + (key + 1) + '.png'"></image>
										</view>
										<view v-else class="ranking-list-number">
											<text>{{key + 1}}</text>
										</view>
										<view class="ranking-list-nickname">
											<image class="_image" :src="item.user.user_avatar"></image>
											<text class="_text">编号{{item.relative_id + ' ' + item.show_name }}</text>
										</view>
										<text class="ranking-list-score">{{ item.ballot_total }}</text>
									</view>
									<u-loadmore v-if="rankLoadmoreShow" :status="rankIsLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
										iconSize="28" fontSize="28" color="#989898" />
								</view>
							</view>
						</block>
						<block v-else>
							<view class="flex-row" style="justify-content: center;width: 100%;padding-top: 50rpx;">
								<u-empty text="一位选手也没有" width="300" height="300" text-size="28" />
							</view>
						</block>
					</block>
					
					<block  v-else-if="tabAction == 'brief'">
						<view class="brief-wrap" :style="'background-color: ' + box_trans_bg_rgba + ';'">
							<view class="title" :style="'border-color: '+ voter.main_color +';'">活动规则</view>
							<view class="line">
								1、活动时间：{{ voter.start_time + ' 至 ' + voter.end_time }}
							</view>
							<view class="line">
								2、报名时间：{{ voter.enter_start_time + ' 至 ' + voter.enter_end_time }}
							</view>
							<view class="line">
								3、投票方式：{{ user_ballot_tip }}
							</view>
							<view style="height: 30rpx;"></view>
							<view class="title" :style="'border-color: '+ voter.main_color +';'">报名方法</view>
							<view class="line">
								1、您可以联系活动管理员，由管理员进行后台添加
							</view>
							<view class="line" v-if="voter.is_open_enter == 1">
								2、您也可以通过点击底部按钮【我要参加】自助报名，管理员审核通过以后即代表正式参加活动。
							</view>
							
							<view style="height: 30rpx;"></view>
							<view class="title" :style="'border-color: '+ voter.main_color +';'">活动说明</view>
							<view class="line">
								<mp-html :content="voter.content"></mp-html>
							</view>
						</view>
					</block>
					
					<view style="height: 300rpx;"></view>
					
					<view class="bottom-btns" :style="'background-color: ' + box_trans_bg_rgba + ';'">
						<view class="inner">
							<view class="center-box">
								<block v-if="voter.is_open_enter == 1">
									<view class="normal-btn" @tap.stop.prevent="joinVoter">
										<view class="icon flex-row">
											<u-icon name="plus-people-fill" size="52" :color="isCanEnter ? voter.main_color : (global__theme__ == 'black' ? '#7c7c7f' : '#a3a3a3')"></u-icon>
										</view>
										<view class="_text">我要参加</view>
									</view>
									<view style="width: 30rpx;"></view>
								</block>
								
								<!-- #ifdef MP -->
								<button class="large-btn" open-type="share" :style="'background-color: ' + voter.button_bg_color + ';color: ' + voter.button_text_color + ';'">
									分享活动
								</button>
								<!-- #endif -->
								<!-- #ifndef MP -->
								<view class="large-btn" :style="'background-color: ' + voter.button_bg_color + ';color: ' + voter.button_text_color + ';'" @tap.stop.prevent="inviteUserTap">分享活动</view>
								<!-- #endif -->
								
							</view>
						</view>
					</view>
					
				</view>
			</block>
		</view>
		
		<u-popup :show="ballotPopup" @close="shutBallotPopup" :zIndex="99999991009" mode="bottom">
			<view class="ballot-wrap" :style="'background-color: ' + (voter.id > 0 ? voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')) + ';'">
				<view class="inner">
					<view class="title">
						给Ta投票
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutBallotPopup"></i>
					</view>
					<view class="content">
						<view style="height: 30rpx;"></view>
						<view class="flex-row input-wrap" :style="'border: 1px solid' + voter.main_color + ';'">
							<view class="flex-row">
								<view class="_text">{{voter.unit_called}}数：</view>
								<u-number-box :max="voter.user_ballot_rest" v-model="ballot_value"></u-number-box>
							</view>
							<view>
								<button @click="voterPlayerBallot" :disabled="voter.user_ballot_rest <= 0" type="default" :style="(voter.user_ballot_rest <= 0 ? '' : 'background-color: ' + voter.button_bg_color + ';color: ' + voter.button_text_color) + ';border-radius:50px;font-size: 14px; width:66px; height:60rpx; line-height:60rpx; text-align:center;'">{{voter.unit_called == '票' ? '投票' : voter.unit_called}}</button>
							</view>
						</view>
						<view class="ballot-tip">提示：{{ user_ballot_tip }}</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
let timer = null;
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		mpHtml
	},
	computed:{
		box_trans_bg_rgba:{
			get(){
				let that = this;
				return that.global__theme__ == 'black' ? 'rgba(25,25,30,0.8)' : 'rgba(255,255,255,0.8)';
			},
			set(v){}
		},
		user_ballot_tip: {
			get(){
				let that = this;
				if(that.voter.id > 0){
					if(that.voter.user_total_limit > 0){
						return '总共拥有' + that.voter.user_total_limit + that.voter.unit_called + '，剩余' + that.voter.user_ballot_rest + that.voter.unit_called;
					}else{
						return '每日可投' + that.voter.user_day_limit + that.voter.unit_called + '，今日剩余' + that.voter.user_ballot_rest + that.voter.unit_called;
					}
				}
				return '';
			},
			set(v){}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 128,
			voter: {
				id: 0
			},
			id: 0,
			tabCurrent: 0,
			ballotPopup: false,
			countdown: {
				remainderDay: '00',
				remainderHour: '00',
				remainderMin: '00',
				remainderSec: '00',
			},
			
			playerFormData: {
				keyword: '',
				orderBy: 'created_at',
				order: 'desc',
			},
			
			playerList: [],
			page: 1,
			isLastPage: false,
			loadmoreShow: false,
			listLoading: true,
			
			rankPlayerList: [],
			rankPage: 1,
			rankIsLastPage: false,
			rankLoadmoreShow: false,
			rankListLoading: true,
			
			ballot_value : 1,
			ballot_player_id: 0,
			tabAction: 'player',
			
			appUrl: '',
			isfinished: false,
			isCanEnter: true,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(128, that.id);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		
		// 处理小程序码的分享场景
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
		    id: query.id,
		    fph: true
		  });
		} else {
		  that.id = options.id;
		}
		
		
		that.appUrl = uni.wen.api.homeUrl;
		that.getVoterDetail();
		that.getVoterPlayerList();
	},
	onPullDownRefresh: function () {
	    that.setData({
	    	playerList: [],
	    	page: 1,
	    	isLastPage: false,
	    	loadmoreShow: false,
	    	listLoading: true,
			
			rankPlayerList: [],
			rankPage: 1,
			rankIsLastPage: false,
			rankLoadmoreShow: false,
			rankListLoading: true,
			
	    });
		if(that.tabAction == 'player' || that.tabAction == 'rank'){
			that.getVoterPlayerList();
		}
		uni.stopPullDownRefresh();
	},
	onReachBottom: function() {
		let that = this;
		
		if(that.tabAction == 'player'){
			if(!that.isLastPage && that.playerList.length > 0){
				that.setData({
					loadmoreShow: true,
					isLastPage: false,
					page: that.page + 1
				});
				that.getVoterPlayerList();
			}
		}else if(that.tabAction == 'rank'){
			if(!that.rankIsLastPage && that.rankPlayerList.length > 0){
				that.setData({
					rankLoadmoreShow: true,
					rankIsLastPage: false,
					rankPage: that.rankPage + 1
				});
				that.getVoterPlayerList();
			}
		}
		
	},
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: that.voter.title + ' - 选票活动',
			path: '/pagesV/voter/detail/detail?id=' + that.voter.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.voter.banners[0],
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.voter.title + ' - 选票活动',
			query: 'id=' + that.voter.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.voter.banners[0],
		};
	},
	methods: {
		inviteUserTap() {
		  let that = this;
		  uni.wen.util.inviteUser('/pagesV/voter/detail/detail', that.voter.title + ' - 选票活动', 'id=' + that.voter.id, that.voter.banners[0]);
		},
		hex2rgb: function (hex, a) {
		    var rgb = [];
		    hex = hex.substr(1);
		
		    if (hex.length === 3) {
		        hex = hex.replace(/(.)/g, '$1$1');
		    }
		    hex.replace(/../g, function (color) {
		        rgb.push(parseInt(color, 0x10));
		        return color;
		    });
		
		    return 'rgb(' + rgb.join(',') + ',' + a + ')';
		},
		isCanEnterFun(){
			let that = this;
			let now = Date.now();
			let end = Date.parse(that.voter.enter_end_time);
			if ( end < now) {
				that.isCanEnter = false;
				return 1;
			}
			
			let start = Date.parse(that.voter.enter_start_time);
			if ( start > now) {
				that.isCanEnter = false;
				return -1;
			}
			
			return 0;
		},
		joinVoter(){
			let that = this;
			let flag = that.isCanEnterFun();
			if(flag === 0){
				uni.wen.toUrl(6, '/pages/creat/voter/player/enter/enter?voter=' + that.voter.id, that);
			}else{
				if(flag === 1){
					uni.showToast({
						title: '报名截止时间: ' + that.voter.enter_end_time,
						icon: 'none'
					})
				}else{
					uni.showToast({
						title: '报名开始时间: ' + that.voter.enter_start_time,
						icon: 'none'
					})
				}
				
			}
		},
		tabCurrentChange(e){
			let that = this;
			that.tabCurrent = e.index;
		},
		searchClick(){
			let that = this;
			that.tabAction = 'player';
			that.tabCurrent = 0;
			that.playerFormData.orderBy = 'created_at';
			that.playerFormData.order = 'desc';
			
			that.setData({
				playerList: [],
				page: 1,
				isLastPage: false,
				loadmoreShow: false,
				listLoading: true,
			});
			
			that.getVoterPlayerList();
		},
		tabsClick(e){
			let that = this;
			
			that.tabAction = e.action;
			if(that.tabAction == 'player'){
				that.playerFormData.orderBy = 'created_at';
				that.playerFormData.order = 'desc';
				
				if(that.playerFormData.keyword){
					that.playerFormData.keyword = '';
					that.setData({
						playerList: [],
						page: 1,
						isLastPage: false,
						loadmoreShow: false,
						listLoading: true,
					});
				}
				if(that.playerList.length <= 0){
					that.getVoterPlayerList();
				}
			}else if(that.tabAction == 'rank'){
				that.playerFormData.orderBy = 'num';
				that.playerFormData.order = 'desc';
				if(that.rankPlayerList.length <= 0){
					that.getVoterPlayerList();
				}
			}
		},
		shutBallotPopup(id = 0){
			let that = this;
			that.ballotPopup = !that.ballotPopup;
			if(that.ballotPopup){
				that.ballot_value = 1;
				that.ballot_player_id = id;
			}else{
				that.ballot_value = 1;
				that.ballot_player_id = 0;
			}
		},
		voterPlayerBallot(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/process', {
				type: 'player_ballot',
				voter_id: that.voter.id,
				player_id: that.ballot_player_id,
				num: that.ballot_value,
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					
					let playerList = that.playerList;
					for ( let i = 0; i < playerList.length; i ++ ) {
						if(playerList[i].id == that.ballot_player_id ){
							playerList[i].ballot_total = parseInt(playerList[i].ballot_total) + parseInt(that.ballot_value);
							break;
						}
					}
					that.playerList = playerList;
					
					
					that.setData({
						rankIsLastPage: false,
						rankLoadmoreShow: false,
						rankListLoading: true,
						rankPlayerList: [],
					});
					
					
					that.voter.ballot_total = parseInt(that.voter.ballot_total) + parseInt(that.ballot_value);
					that.voter.user_ballot_rest = parseInt(that.voter.user_ballot_rest) - parseInt(that.ballot_value);
					
					that.shutBallotPopup();
					
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
		getVoterPlayerList(){
			let that = this;
			
			let the_page = that.page;
			if(that.tabAction == 'rank'){
				the_page = that.rankPage;
			}
		
			if(the_page == 1){
				if(that.tabAction == 'player'){
					that.setData({
						isLastPage: false,
						loadmoreShow: false,
						listLoading: true,
						playerList: [],
					})
				}else if(that.tabAction == 'rank'){
					that.setData({
						rankIsLastPage: false,
						rankLoadmoreShow: false,
						rankListLoading: true,
						rankPlayerList: [],
					})
				}
			}
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/player/list', {
				page: the_page,
				keyword: that.playerFormData.keyword,
				voter_id: that.id,
				orderBy: that.playerFormData.orderBy,
				order: that.playerFormData.order,
			}).then(function(res) {
				
				if(the_page == 1){
					uni.stopPullDownRefresh();
				}
				
				if (res.status) {
					
					if(that.tabAction == 'player'){
						if(res.data.current_page != that.page){
							return false;
						}
						let data = res.data;
						let args = {};
						if(data.data && data.data.length > 0){
							args.playerList = that.playerList.concat(data.data);
							args.page = data.current_page;
							if(data.data.length >= 10){
								args.loadmoreShow = false;
								args.isLastPage = false;
							}else{
								args.loadmoreShow = true;
								args.isLastPage = true;
							}
						}else{
							args.loadmoreShow = true;
							args.isLastPage = true;
						}
						args.listLoading = false;
						that.setData(args);
					}else if(that.tabAction == 'rank'){
						if(res.data.current_page != that.rankPage){
							return false;
						}
						let data = res.data;
						let args = {};
						if(data.data && data.data.length > 0){
							args.rankPlayerList = that.rankPlayerList.concat(data.data);
							args.rankPage = data.current_page;
							if(data.data.length >= 10){
								args.rankLoadmoreShow = false;
								args.rankIsLastPage = false;
							}else{
								args.rankLoadmoreShow = true;
								args.rankIsLastPage = true;
							}
						}else{
							args.rankLoadmoreShow = true;
							args.rankIsLastPage = true;
						}
						args.rankListLoading = false;
						that.setData(args);
					}
					
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		getVoterDetail(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/detail', {
				id: that.id
			}).then(function(res) {
				uni.loading(false);
				uni.stopPullDownRefresh();
				if (res.status) {
					that.voter = res.data;
					that.computeCountdown();
					that.isCanEnterFun();
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		computeCountdown(){
			let that = this;
			if (timer) {
				clearInterval(timer);
			}
			timer = setInterval(() => {
				let now = Date.now();
				let end = Date.parse(that.voter.end_time);
				let distance = end - now;
				if (distance < 0) {
					// 如果活动已经结束，清除定时器，并将剩余时间设置为0
					clearInterval(timer);
					that.isfinished = true;
					that.countdown.remainderDay = '00';
					that.countdown.remainderHour = '00';
					that.countdown.remainderMin = '00';
					that.countdown.remainderSec = '00';
				}else{
					let day = Math.floor(distance / (1000 * 60 * 60 * 24));
					let hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					let min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					let sec = Math.floor((distance % (1000 * 60)) / 1000);
					
					that.countdown.remainderDay = that.pad(day, 2);
					that.countdown.remainderHour = that.pad(hour, 2);
					that.countdown.remainderMin = that.pad(min, 2);
					that.countdown.remainderSec = that.pad(sec, 2);
				}
			}, 1000);
		},
		pad(num, size) {
			// 用0填充到指定长度
			let s = num + "";
			while (s.length < size) s = "0" + s;
			return s;
		},
		voteHelp(title, desc) {
			uni.showModal({
				title: title,
				content: desc,
				showCancel: false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import './detail.scss';
</style>