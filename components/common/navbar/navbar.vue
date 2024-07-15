<template>
	<view :class="'lxy-nav-bar scene_' + scene + ' ' + extClass" :style="'background: ' + backgroundColorTop + '; height: ' + (placeholder ? (CustomBar + navBarExtendHeight) : 0) + 'px;'">
		<view v-if="placeholder" :class="'lxy-nav-bar__placeholder ' + global__platform__" :style="'padding-top: ' + (CustomBar + navBarExtendHeight) + 'px;visibility: hidden;'"></view>
		<view :class="'lxy-nav-bar__inner ' + global__platform__" :style="navigationbarinnerStyle + displayStyle">
			<view class="lxy-nav-bar__left" :style="navBarLeft">
				
				<view @tap="backFun" :class="'lxy-nav-bar__button mini-icon mini-zuojiantou ' + iconTheme" v-if="back && !home"></view>
				<view @tap="homeFun" :class="'lxy-nav-bar__button mini-icon mini-fanhuishouye ' + iconTheme" v-if="!back && home"></view>

				<block v-else-if="back && home">
					<view :class="'lxy-nav-bar__buttons ' + global__platform__" v-if="home">
						<view @tap="backFun" :class="'lxy-nav-bar__button mini-icon mini-zuojiantou ' + iconTheme" v-if="back"></view>
						<view @tap="homeFun" :class="'lxy-nav-bar__button mini-icon mini-fanhuishouye ' + iconTheme"></view>
					</view>
				</block>
				<slot name="left" v-else></slot>
			</view>
			<view class="lxy-nav-bar__center">
				<!-- <image v-if="centerImg" ></image> -->
				<text class="_text" v-if="title && title.length > 0" :style="'text-align: center;color: ' + color + ';'">{{ title }}</text>
				<view @tap.stop.prevent="search" class="lxy-nav-bar-search" :style="'height:' + capsulePosition.height + 'px;'"
					v-else-if="searchBar">
					<view class="lxy-nav-bar-search__icon"></view>
					<swiper :autoplay="true" :circular="true" :vertical="true" interval="3000"
						class="lxy-nav-bar-search__input" :style="'height:' + capsulePosition.height + 'px;'">
						<swiper-item v-for="(item, index) in searchText" :key="index">
							<view class="lxy-nav-bar-search__input-item"
								:style="'height:' + capsulePosition.height + 'px;line-height: ' + capsulePosition.height + 'px; font-size: ' + (capsulePosition.height / 2.4) + 'px;'">
								{{ item }}
							</view>
						</swiper-item>
					</swiper>
				</view>
				<slot name="center" v-else></slot>
			</view>
			<view class="lxy-nav-bar__right" :style="'padding-right: '+ capsulePosition.sidePadding +'px;'">
				<slot name="right"></slot>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				navigationbarinnerStyle: '',
				navBarLeft: '',
				navBarExtendHeight: '',
				displayStyle: '',
			};
		},
		computed:{
			capsulePosition:{
				get(){
					let that = this;
					return that.$store.state.capsulePosition;
				},
				set(v){}
			},
			CustomBar:{
				get(){
					let that = this;
					return that.$store.state.CustomBar;
				},
				set(v){}
			},
		},
		options: {
			multipleSlots: true,
			addGlobalClass: true
		},
		props: {
			extClass: {
				type: String,
				default: ''
			},
			background: {
				type: String
			},
			backgroundColorTop: {
				type: String
			},
			color: {
				type: String,
				default: 'rgba(255, 255, 255, 1)'
			},
			title: {
				type: String,
				default: ''
			},
			searchText: {
				type: Array,
				default: () => ['搜索']
			},
			searchBar: {
				type: Boolean,
				default: false
			},
			back: {
				type: Boolean,
				default: false
			},
			home: {
				type: Boolean,
				default: false
			},
			iconTheme: {
				type: String,
				default: '' // value: "black"
				// value: "white"
			},
			animated: {
				type: Boolean,
				default: true
			},
			show: {
				type: Boolean,
				default: true
			},
			delta: {
				type: Number,
				default: 1
			},
			isShare: {
				type: Boolean,
				default: false
			},
			scene: {
				type: Number,
				default: 0
			},
			placeholder: {
				type: Boolean,
				default: true
			}
		},
		beforeMount: function attached() {
			this.setStyle(); // 设置样式
		},
		onPageShow: function show() {
			
		},
		watch: {
			scene: {
				handler: function (newVal, oldVal) {
					if(newVal != oldVal){
						this.setStyle();
					}
				},
				immediate: false,
			},
		},
		onPageHide: function hide() {},
		methods: {
			setStyle: function setStyle(life) {
				let that = this;
				let navBarExtendHeight = 0;
				var _data = this;
				var back = _data.back;
				var home = _data.home;
				var title = _data.title;
				let windowWidth = that.$store.state.screenWidth;
				
				if(windowWidth <= 200 || windowWidth == undefined || windowWidth == null){
					that.reInitSystemInfo();
				}

				var rightDistance = windowWidth - that.capsulePosition.right;
				var leftWidth = 0;
				// #ifdef MP
				if(that.capsulePosition){
					 // 胶囊按钮右侧到屏幕右侧的边距
					leftWidth = windowWidth - that.capsulePosition.left; // 胶囊按钮左侧到屏幕右侧的边距
				}
				// #endif

				// console.log("leftWidth", leftWidth)

				var navigationbarinnerStyle = [
					'color: ' + that.color,
					'background: ' + that.background,
					'height:' + (that.$store.state.CustomBar + navBarExtendHeight) + 'px',
					'padding-top:' + that.$store.state.statusBarHeight + 'px',
					'padding-right:' + leftWidth + 'px',
					'padding-bottom:' + navBarExtendHeight + 'px'
				].join(';');


				var navBarLeft = [];
				// #ifdef MP
				if ((back && home) || title) {
				// if ((back && home)) {
					navBarLeft = ['width:' + that.capsulePosition.width + 'px', 'height:' + that.capsulePosition.height + 'px',
					 'line-height: ' + that.capsulePosition.height + 'px'
					].join(';');
				} else if ((back && !home) || (!back && home)) {
					if(that.searchBar || [9,10,75,86,87,156].includes(that.scene)){
						navBarLeft = ['width: auto', 'height:' + that.capsulePosition.height + 'px', 'line-height: ' + that.capsulePosition.height + 'px']
							.join(';');
					}else{
						navBarLeft = ['width:' + that.capsulePosition.width + 'px', 'height:' + that.capsulePosition.height + 'px', 'line-height: ' + that.capsulePosition.height + 'px']
							.join(';');
					}
				} else {
					if([5,20002,131].includes(that.scene)){
						navBarLeft = ['width:' + that.capsulePosition.width + 'px'].join(';');
					}else{
						navBarLeft = ['width: auto'].join(';');
					}

				}
				// #endif

				// #ifdef APP || H5
				if ((back && home)) {
					navBarLeft = ['width:' + that.capsulePosition.width + 'px', 'height:' + that.capsulePosition.height + 'px',
					 'line-height: ' + that.capsulePosition.height + 'px'
					].join(';');
				} else if ((back && !home) || (!back && home)) {
					navBarLeft = ['width:auto', 'height:' + that.capsulePosition.height + 'px', 'line-height: ' + that.capsulePosition.height + 'px']
						.join(';');
				} else {
					navBarLeft = ['width:auto'].join(';');
				}
				// #endif

				that.navigationbarinnerStyle = navigationbarinnerStyle;
				that.navBarLeft = (navBarLeft + ';padding-left: ' + that.capsulePosition.sidePadding + 'px;');
				that.navBarExtendHeight = navBarExtendHeight;
			},
			reInitSystemInfo(){
				let that = this;
				uni.getSystemInfo({
				  success: function success(res) {
				    var rect = null
				    if (uni.getMenuButtonBoundingClientRect) {
				      rect = uni.getMenuButtonBoundingClientRect()
				      if (rect) {
				        rect.sidePadding = res.windowWidth - rect.right
				      }
				    } else {
				      rect = null
				    }
				    if (rect == false || rect === null || rect === undefined) {
				      var gap = '' // 胶囊按钮上下间距 使导航内容居中
				
				      var width = 96 // 胶囊的宽度
				
				      if (res.platform === 'android') {
				        gap = 8
				        width = 96
				      } else if (res.platform === 'devtools') {
				        if (ios) {
				          gap = 5.5 // 开发工具中ios手机
				        } else {
				          gap = 7.5 // 开发工具中android和其他手机
				        }
				      } else {
				        gap = 4
				        width = 88
				      }
				
				      rect = {
				        // 获取不到胶囊信息就自定义重置一个
				        bottom: res.statusBarHeight + gap + 32,
				        height: 32,
				        left: res.windowWidth - width - 10,
				        right: res.windowWidth - 10,
				        top: res.statusBarHeight + gap,
				        width: width,
				        sidePadding: 10
				      }
				    }
				    that.$store.commit('updateCapsulePosition', rect)
				
				    // 宿主名称以及版本号
				    that.$store.commit('updateHost', { hostName: res.hostName, hostVersion: res.hostVersion, SDKVersion: res.SDKVersion })
				    console.log('基础库版本：' + res.SDKVersion)
				
				    // 自定义导航栏高度，不包括状态栏，单位px
				    let navBarHeight = (function () {
				      var gap = rect.top - res.statusBarHeight
				      return res.statusBarHeight + 2 * gap + rect.height
				    })()
				    that.$store.commit('updateCustomBar', navBarHeight)
				
				    // 状态栏
				    that.$store.commit('updateStatusBarHeight', res.statusBarHeight)
				
				    // 屏幕宽高
				    that.$store.commit('updateScreenSize', { height: res.screenHeight, width: res.screenWidth, windowWidth: res.windowWidth })
				
				    // 更新是否是ipad
				    if (res.platform != 'devtools') {
				      // uni.setInnerAudioOption({
				      //     obeyMuteSwitch: false
				      // });
				      that.$store.commit('updatePlatform', res.platform)
				      if (res.platform === 'ios' && res.model.includes('iPad')) {
				        that.$store.commit('updateIspad')
				      }
				    }
				
				    // 暗黑模式
				    if (uni.getStorageSync('followSystemTheme') == 1) {
				      if (res.theme === 'dark') {
				        that.$store.commit('updateGlobalTheme', 'black')
				      } else {
				        that.$store.commit('updateGlobalTheme', 'default')
				      }
				    }
				  },
				  fail: function fail(error){
				
				  }
				});
			},
			showChangeFun: function _showChange() {
				this.setStyle();
			},
			// 返回事件
			backFun: function back() {
				uni.wen.toUrl(-2, 0, null);
			},
			homeFun: function home() {
				// this.triggerEvent("home", {});
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				});
			},
			search: function search() {
				this.$emit('search', {
					detail: {}
				});
			},
			checkRect: function checkRect(rect) {
				// 胶囊信息4种任一属性为0返回true
				return !rect.width || !rect.top || !rect.left || !rect.height;
			},
		},
		watch: {
			background: {
				handler: function _showChange() {
					this.setStyle();
				},

				immediate: true
			},

			show: {
				handler: function _showChange() {
					this.setStyle();
				},

				immediate: true
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import './navbar.scss';
</style>
