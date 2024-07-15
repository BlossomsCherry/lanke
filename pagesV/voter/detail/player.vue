<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="false" :home="false" :title="player.voter.title" :color="player.id > 0 ? player.voter.text_navigation_bar_color : (global__theme__ == 'black' ? '#ffffff' : '#000000')" :background="player.id > 0 ? player.voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')">
			
			<view slot="left" class="back">
				<i class="mini-icon mini-zuojiantou" @tap.stop.prevent="playerBack" :style="'font-size: 23px;color: '+ ( player.id > 0 ? player.voter.text_navigation_bar_color : (global__theme__ == 'black' ? '#ffffff' : '#000000') ) +';'"></i>
			</view>
			
			<!-- #ifndef MP -->
			<view slot="right" class="lxy-nav-bar__logo">
				<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="inviteUserTap" :style="'color: '+(player.id > 0 ? player.voter.text_navigation_bar_color : (global__theme__ == 'black' ? '#ffffff' : '#000000'))+';'"></i>
			</view>
			<!-- #endif -->
			
		</navBar>
		<view class="voter-player-page" :style="'background-color: ' + (player.id > 0 ? player.voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')) + ';'">
			<view class="inner">
				<block v-if="player.id > 0">
				
					<view class="voter-deital-gap"></view>
					
					<view class="page_item player-info" :style="'background-color: ' + box_trans_bg_rgba + ';'">
						<view class="left" @tap.stop.prevent="toSliderUrl(4, player.user.id)">
							<view class="avatar">
								<image class="_iamge" :src="player.user.user_avatar"></image>
							</view>
							<view class="title-info">
								<view class="name">{{ player.show_name }}</view>
								<view class="relatvie-id">编号：{{ player.relative_id }}</view>
							</view>
						</view>
						<view class="right">
							<view class="report" @tap.stop.prevent="toSliderUrl(6, '/pages/common/report?type=2&object_id=' + player.user.id)">投诉选手</view>
						</view>
					</view>
					
					<view class="voter-deital-gap"></view>
					
					<view class="page_item work-info" :style="'background-color: ' + box_trans_bg_rgba + ';'">
						<view class="block-title" :style="'border-color: '+ player.voter.main_color +';'">
							参赛作品
						</view>
						
						<view class="work-name" v-if="player.work_name && player.work_name.length > 0">{{ player.work_name }}</view>
						
						<block>
							<view class="video-view" v-if="player.video_url && player.video_url.length > 0">
								<!-- #ifndef MP -->
								<yingbing-video :src="player.video_url" style="height:390rpx;width: 670rpx;" :poster="player.video_cover"></yingbing-video>
								<!-- #endif -->
													
								<!-- #ifdef MP -->
								<view class="video-height">
									<video style="height:390rpx;width: 670rpx;" :controls="true" :show-fullscreen-btn="true"
										:enable-play-gesture="true" :show-play-btn="true" :poster-for-crawler="player.video_cover" :poster="player.video_cover"
										:enable-progress-gesture="true" :autoplay="true" object-fit="contain" :enable-auto-rotation="true"
										:src="player.video_url"></video>
								</view>
								<!-- #endif -->
							</view>
							<view class="video-view" v-else @tap.stop.prevent="previewImgFunc(0)">
								<image :src="player.img_urls[0]" style="height:390rpx;width: 670rpx;border-radius: 6rpx;" mode="aspectFit"></image>
							</view>
						</block>
						
						<view class="imgs-view" v-if="player.img_urls && player.img_urls.length > 0">
							<view class="img-item" v-for="(item, index) in player.img_urls" :key="index" v-if="index > 0 || (player.video_url && player.video_url.length > 0)" @tap.stop.prevent="previewImgFunc(index)">
								<image class="_image" :src="item" mode="aspectFill"></image>
							</view>
						</view>
						
						<view class="desc-view">{{ player.work_desc }}</view>
						
					</view>
					
				</block>
			</view>
		</view>
		
		
		<u-popup :show="ballotPopup" @close="shutBallotPopup" :zIndex="99999991009" mode="bottom">
			<view class="ballot-wrap" :style="'background-color: ' + (player.voter.id > 0 ? player.voter.background_color : (global__theme__ == 'black' ? '#19191e' : '#ffffff')) + ';'">
				<view class="inner">
					<view class="title">
						给Ta投票
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutBallotPopup"></i>
					</view>
					<view class="content">
						<view style="height: 30rpx;"></view>
						<view class="flex-row input-wrap" :style="'border: 1px solid' + player.voter.main_color + ';'">
							<view class="flex-row">
								<view class="_text">{{player.voter.unit_called}}数：</view>
								<u-number-box :max="player.voter.user_ballot_rest" v-model="ballot_value"></u-number-box>
							</view>
							<view>
								<button @click="voterPlayerBallot" :disabled="player.voter.user_ballot_rest <= 0" type="default" :style="(player.voter.user_ballot_rest <= 0 ? '' : 'background-color: ' + player.voter.button_bg_color + ';color: ' + player.voter.button_text_color) + ';border-radius:50px;font-size: 14px; width:66px; height:60rpx; line-height:60rpx; text-align:center;'">{{player.voter.unit_called == '票' ? '投票' : player.voter.unit_called}}</button>
							</view>
						</view>
						<view class="ballot-tip">提示：{{ user_ballot_tip }}</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<view class="bottom-wrap">
			<view @tap.stop.prevent="shutBallotPopup" class="btn" :style="'background-color: ' + player.voter.button_bg_color + ';color: ' + player.voter.button_text_color + ';'">给Ta投票</view>
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
				if(that.player.id > 0){
					if(that.player.voter.user_total_limit > 0){
						return '总共拥有' + that.player.voter.user_total_limit + that.player.voter.unit_called + '，剩余' + that.player.voter.user_ballot_rest + that.player.voter.unit_called;
					}else{
						return '每日可投' + that.player.voter.user_day_limit + that.player.voter.unit_called + '，今日剩余' + that.player.voter.user_ballot_rest + that.player.voter.unit_called;
					}
				}
				return '';
			},
			set(v){}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 127,
			id: 0,
			
			ballotPopup: false,
			ballot_value : 1,
			
			player: {
				id: 0,
				img_urls: [],
				user: {
					id: 0,
				},
				voter: {
					id: 0
				}
			}
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(127, 0);
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
		
		that.getVoterPlayerDetail();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: that.player.voter.title + ' - ' + that.player.work_name,
			path: '/pagesV/voter/detail/player?id=' + that.player.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.player.voter.banners[0],
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.player.voter.title + ' - ' + that.player.work_name,
			query: 'id=' + that.player.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.player.voter.banners[0],
		};
	},
	methods: {
		voterPlayerBallot(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/process', {
				type: 'player_ballot',
				voter_id: that.player.voter.id,
				player_id: that.player.id,
				num: that.ballot_value,
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					
					that.shutBallotPopup();
					that.getVoterPlayerDetail();
					
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
		shutBallotPopup(id = 0){
			let that = this;
			that.ballotPopup = !that.ballotPopup;
			if(that.ballotPopup){
				that.ballot_value = 1;
			}else{
				that.ballot_value = 1;
			}
		},
		playerBack(){
			let that = this;
			if(that.$store.state.pre_scene == 128){
				uni.wen.toUrl(-2, null, that);
			}else{
				uni.wen.toUrl(6, '/pagesV/voter/detail/detail?id=' + that.player.voter.id + '&fph=1', that);
			}
		},
		//预览图片
		previewImgFunc(index) {
		    let that = this;
			
		    let url = that.player.img_urls[index];
		    var list = that.player.img_urls;
		
		    uni.previewImage({
		        current: url,
		        urls: list
		    });
		    return false;
		},
		getVoterPlayerDetail(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/player/detail', {
				id: that.id
			}).then(function(res) {
				uni.loading(false);
				uni.stopPullDownRefresh();
				if (res.status) {
					that.player = res.data;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		inviteUserTap() {
		  let that = this;
		  uni.wen.util.inviteUser('/pagesV/voter/detail/player', that.player.voter.title + ' - ' + that.player.work_name, 'id=' + that.player.id, that.player.voter.banners[0]);
		}
	}
}
</script>

<style lang="scss" scoped>
@import './player.scss';
</style>