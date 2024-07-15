export default {
	updateWebsocket(state, s) {
		state.websocket = s;
	},
	updateContrib(state) {
		state.contrib = true;
	},
	updateTabbarIndex(state, index) {
		state.tabbar_index = index;
	},
	updateFullgreen(state, flag) {
		state.fullgreen = flag;
		// #ifdef APP
		if(flag){
			uni.hideTabBar();
		}else{
			setTimeout(function () {
				uni.showTabBar();
			}, 250);
		}
		// #endif
	},
	updateUserInfo(state, userInfo) {
		state.userInfo = userInfo;
		
		let app = getApp();
		if(app){
			if(userInfo && userInfo.id > 0){
				app.globalData.user_created_at = userInfo.created_at;
			}else{
				app.globalData.user_created_at = '';
			}
		}else{
			setTimeout(function(){
				let app = getApp();
				if(app){
					if(userInfo && userInfo.id > 0){
						app.globalData.user_created_at = userInfo.created_at;
					}else{
						app.globalData.user_created_at = '';
					}
				}
			}, 500);
		}
		
	},
	updateLastLocation(state, location) {
		state.lastLocation = {
			longitude: location.longitude,
			latitude: location.latitude
		};
	},
	toast(state, data) {
		state.toast = data;
	},
	updatePostingUrl(state, url) {
		state.posting_url = url;
	},
	updateSysMessageCount(state, data) {
		state.sysMessageCount = data;

		let notice_index = 3;
		if(notice_index <= 5){
			if(data > 0){
				uni.setTabBarBadge({
					index: notice_index,
					text: data + ''
				});
			}else{
				uni.removeTabBarBadge({index: notice_index});
			}
		}
	},
	hasRefresh(state, need_fresh) {
		if (need_fresh) {
			state.hasRefreshData = true;
		} else {
			state.hasRefreshData = false;
		}
	},
	Ipushlished(state, flag) {
		if (flag) {
			state.Ipushlished = true;
		} else {
			state.Ipushlished = false;
		}
	},
	updateToken(state, token) {
		if (!token) {
			token = '';
		}
		state.token = token;
	},
	updatePlayed(state, played) {
		if (!played) {
			played = 0;
		}
		state.played = played;
	},
	updateLastCity(state, city) {
		state.lastCity = city;
	},
	updateFormUser(state, user) {
		if (!user) {
			user = 0;
		}
		state.form_user = user;
	},
	updateTenant(state, tenant) {
		if (!tenant) {
			tenant = { tenant_id: null, name: '', short: '' };
		}
		state.tenant = tenant;
	},
	updateScene(state, scene_obj) {
		let scene = scene_obj.scene;
		let scene_id = scene_obj.scene_id;
		if (scene > 0) {
			if (state.scene_history.length > 0) {
				const [lastScene] = state.scene_history.slice(-1);
				if (lastScene == scene && scene_id == state.scene_id) {
					return;
				}
			}
			
			// 缓存上一次的场景
			state.pre_scene = state.scene;
			state.pre_scene_id = state.scene_id;
			
			state.scene = scene;
			state.scene_id = scene_id;
			state.scene_total += 1;
			state.scene_history.push(scene);
			state.popup_total = 0;
		}
	},
	vm(state, vm) {
		state.$vm = vm;
	},
	popopChange(state, flag) {
		if (flag) {
			state.popup_total = state.popup_total + 1;
		} else {
			if (state.popup_total > 0) {
				state.popup_total = state.popup_total - 1;
			} else {
				state.popup_total = 0;
			}
		}
		// #ifdef APP || H5
		if (state.popup_total == 0) {
			setTimeout(function () {
				uni.showTabBar();
			}, 250)
		} else {
			uni.hideTabBar();
		}
		// #endif
	},
	updateSceneTotal(state, scene_total) {
		state.scene_total = scene_total;
	},
	userUpdateTimes(state, num) {
		state.userUpdateTimes += num;
	},
	userAddPlate(state, plates) {
		if (plates && plates.length > 0) {
			if (state.config.tab && state.config.tab.length > 0) {
				for (let i = 0; i < plates.length; i++) {
					let flag = true;
					for (let j = 0; j < state.config.tab.length; j++) {
						if (state.config.tab[j]['plate_name'] == plates[i]['plate_name']) {
							flag = false;
							break;
						}
					}
					if (flag) {
						state.config.tab.push(plates[i]);
					}
				}
			}
		}
	},
	userDeletePlate(state, index) {
		if (state.config.tab && state.config.tab[index]) {
			state.config.tab.splice(index, 1);
		}
	},
	updateH5BrowserType(state, type) {
		state.h5_browser = type;
	},
	forceUpdatePage(state, type) {
		if (type) {
			state.isRefresh = true;
		} else {
			state.isRefresh = false;
		}
	},
	updatePlatform(state, platform) {
		state.platform = platform;
	},
	updateIspad(state) {
		state.ipad = true;
	},
	updateScreenSize(state, size) {
		state.screenLiHeight = size.height;
		state.screenWidth = size.width;
		state.windowWidth = size.windowWidth;
	},
	updateStatusBarHeight(state, height) {
		state.statusBarHeight = height;
	},
	updateCapsulePosition(state, position) {
		state.capsulePosition = position;
	},
	updateHost(state, host) {
		state.hostName = host.hostName;
		state.hostVersion = host.hostVersion;
		state.SDKVersion = host.SDKVersion;
	},
	updateCustomBar(state, data) {
		state.CustomBar = data;
	},
	updateInnerAudioContext(state, data) {
		state.innerAudioContext = data;
	},
	updateQueryStateNo(state, data) {
		state.query_state_no = data;
	},
	updateGlobalTheme(state, theme) {
		if (state.theme == theme) {

		} else {
			state.theme = theme;
			uni.setStorageSync('global__theme__', theme);
		}

	},
	updateCID(state, cid){
		state.cid = cid;
	},
}
