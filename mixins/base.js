export default{
	data() {
		return {
			
		}
	},
	computed:{
		global__theme__: {
			get(){
				let that = this;
				return that.$store.state.theme;
			},
			set(v){}
		},
		global__tenant__: {
			get(){
				let that = this;
				if(that.$store.state.tenant){
					return that.$store.state.tenant;
				}
				
				return {tenant_id: null, name: '', short: ''};
			},
			set(v){}
		},
		isOfficial:{
			get(){
				let that = this;
				if(that.$store.state.userInfo.id > 0){
					if(that.$store.state.config){
						if(that.$store.state.played == that.$store.state.userInfo.id && that.$store.state.config.admin && that.$store.state.config.admin.playlist){
							if(that.$store.state.config.admin.playlist.includes(that.$store.state.userInfo.id)){
								return 2;
							}
						}
						if(that.$store.state.userInfo.is_official > 0){
							return that.$store.state.userInfo.is_official;
						}
					}
				}
				return 0;
			},
			set(v){}
		},
		myUserInfo:{
			get(){
				let that = this;
				return that.$store.state.userInfo;
			},
			set(v){}
		},
		primaryColor: {
			get(){
				let that = this;
				if(that.$store.state.config){
					if(that.$store.state.config.color && that.$store.state.config.color.length > 0){
						return that.$store.state.config.color['--color-primary'];
					}
				}
				return '#ff2442';
			},
			set(v){}
		},
		global__platform__: {
			get(){
				let that = this;
				if(that.$store.state.platform){
					return that.$store.state.platform;
				}
				return 'android';
			},
			set(v){}
		},
		global__device__: {
			get(){
				let that = this;
				if(that.$store.state.device){
					return that.$store.state.device;
				}
				return 'mp';
			},
			set(v){}
		}
	},
	methods: {
		stopPrevent(){return false;},
		miniMoveHandle(){},
		toSliderUrl(type, id){
			let that = this;
			uni.wen.toUrl(type, id, that);
		},
		tabBarSetData(obj) {
			// #ifdef MP-WEIXIN
			if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
				this.$mp.page.getTabBar().setData(obj)
			}
			// #endif
		},
		myToast(data){
			if(data){
				data.random = Math.random();
				this.setData({
					mytoast_data: data
				})
			}
		},
		updateScene(scene, scene_id, login = false, admin = false, paycode = 0, config = 0){
			let that = this;
			that.$store.commit('updateScene', {scene: scene, scene_id: scene_id});
			if(that.$store.state.$vm && that.$store.state.$vm.page__scene__ == scene){
				
			}else{
				that.$store.commit('vm', that);
			}
			if(that.pageTheme != that.$store.state.theme){
				if(that.$store.state.theme == 'black'){
					if([1,157,97,4,5].includes(scene)){
						// #ifdef MP-WEIXIN
						that.tabBarSetData({
							color: "rgb(107,111,119)",
							selectColor: "rgb(255,255,255)",
							background: "#19191e;",
							popupStyle: {
								bgcolor: "#19191e",
								itemBgcolor: "#26262b",
								fontColor: "#ffffff"
							}
						});
						// #endif
						// #ifndef MP-WEIXIN
						uni.setTabBarStyle({
							color: "#6b6f77",
							selectedColor: "#ffffff",
							backgroundColor: "#19191e",
							borderStyle: "black",
						});
						if(uni.$store.state.tabbar_style == 1){
							uni.setTabBarItem({
								index: uni.$store.state.tabbar_index,
								iconfont: {
									color: "#6b6f77",
									selectedColor: "#ffffff"
								},
								fail() {
									setTimeout(function(){
										uni.setTabBarItem({
											index: uni.$store.state.tabbar_index,
											iconfont: {
												color: "#6b6f77",
												selectedColor: "#ffffff"
											},
										})
									}, 100);
								}
							})
						}
						// #endif
					}
					if(scene != 5 && scene != 8){
						uni.setNavigationBarColor({
							frontColor: "#ffffff",
							backgroundColor: "#19191e",
							fail(err) {
								console.log(err)
							}
						});
					}
					that.pageTheme = 'black';
				}else{
					if([1,157,97,4,5].includes(scene)){
						// #ifdef MP-WEIXIN
						that.tabBarSetData({
							color: "rgb(140,140,140)",
							selectColor: "rgb(50,50,50)",
							background: "#ffffff;",
							popupStyle: {
								bgcolor: "#ffffff",
								itemBgcolor: "#f5f5f5",
								fontColor: "#000000"
							}
						});
						// #endif
						// #ifndef MP-WEIXIN
						uni.setTabBarStyle({
							color: "#8C8C8C",
							selectedColor: "#323232",
							backgroundColor: "#ffffff",
							borderStyle: "white",
						});
		
						if(uni.$store.state.tabbar_style == 1){
							uni.setTabBarItem({
								index: uni.$store.state.tabbar_index,
								iconfont: {
									color: "#8C8C8C",
									selectedColor: "#323232"
								},
								fail() {
									setTimeout(function(){
										uni.setTabBarItem({
											index: uni.$store.state.tabbar_index,
											iconfont: {
												color: "#8C8C8C",
												selectedColor: "#323232"
											},
										})
									}, 100);
								}
							})
						}
						// #endif
					}
					if(scene != 5 && scene != 8){
						uni.setNavigationBarColor({
							frontColor: "#000000",
							backgroundColor: "#EBEBEB",
							fail(err) {
								console.log(err)
							}
						});
					}
					that.pageTheme = 'default';
				}
			}
			
			if(typeof config === 'number'){
				if(config > 0){
					if(config == 2 && that.$store.state.config2.OK == false){
						that.$store.dispatch('initConfig2');
					}
					if(config == 3 && that.$store.state.config3.OK == false){
						that.$store.dispatch('initConfig3');
					}
					if(config == 4 && that.$store.state.config4.OK == false){
						that.$store.dispatch('initConfig4');
					}
				}
			}else if(Array.isArray(config) ){
				config.forEach(function(item){
					if(item == 2 && that.$store.state.config2.OK == false){
						that.$store.dispatch('initConfig2');
					}
					if(item == 3 && that.$store.state.config3.OK == false){
						that.$store.dispatch('initConfig3');
					}
					if(item == 4 && that.$store.state.config4.OK == false){
						that.$store.dispatch('initConfig4');
					}
				})
			}
			
			if(scene != 14 && scene != 52 && scene != 37){
				if(login || (that.$store.state.config.user && that.$store.state.config.user.login_force == 1)){
					if (uni.$store.state.token) {
						
					}else{
						if(that.$store.state.scene == 14 || that.$store.state.scene == 83 || that.$store.state.scene == 76){
							return;
						}
						that.myToast({
							closeAll: 1
						});
						uni.wen.toUrl(-4, null, null);
						return;
					}
				}
				if(admin && (that.$store.state.userInfo.is_official == 0 || that.$store.state.userInfo.is_official === false) && that.$store.state.userInfo.is_played == false){
					uni.showToast({
						title: '仅允许管理员访问',
						icon: 'none'
					});
					setTimeout(function(){
						uni.wen.toUrl(-2, 0, null);
					}, 1500);
					return;
				}
			
				if(paycode > 0 && that.$store.state.config.pays['paycode_'+(paycode.toString())] !== true){
					if(that.$store.state.pre_scene > 0){
						uni.showToast({
							title: 'you are not unlocked this',
							icon: 'none'
						});
						setTimeout(function(){
							uni.wen.toUrl(-2, 0, null);
						}, 1500);
						return;
					}
				}
				
				// #ifdef H5
				if(that.$store.state.config.h5.redirect == 1 && that.$store.state.h5_browser != 'wxclient'){
					if(that.$store.state.scene_total >= that.$store.state.config.h5.redirect_pages){
						that.myToast({
							closeAll: 1
						});
						uni.wen.toUrl(6, '/pagesC/redirect/redirect', null);
						return;
					}
				}
				// #endif
				
				if(that.$store.state.config.app.phone && that.$store.state.config.app.phone.pages && that.$store.state.config.app.phone.pages.includes(scene)){
					if (uni.$store.state.token) {
						if(that.$store.state.userInfo.phone && that.$store.state.userInfo.phone.length > 5){
							that.myToast({
								type:'getPhone',
								close: 1,
								timeout: 2000,
								isClick:true,
							});
						}else{
							// #ifdef MP
							setTimeout(function(){
								that.myToast({
									type:'getPhone',
									content: '绑定手机号',
									timeout: 2000,
									isClick:true,
								});
							}, 2000);
							// #endif
						}
					}
				}
			}
			
			// 注意：mini js代码插入点001号，请勿删除下面一行
			//script(<<<JS<<<001<<<JS);
			if(scene != 83 && uni.wen.api.homeUrl == 'https://mini.minisns.cn'){
			    if(that.global__tenant__.tenant_id === null){
			        uni.wen.toUrl(6, '/pages/common/tenants');
			        return false;
			    }
			}
			
			
			if(that.$store.state.isRefresh == true){
				that.$store.commit('forceUpdatePage', false);
				uni.startPullDownRefresh();
			}
		},
		globalOnloadProcess(options){
			let that = this;
			that.$store.commit('vm', that);
			
			if(options.from_user && options.from_user != null && options.from_user != 'undefined'){
				if((typeof(options.from_user)=='string' && options.from_user.length > 0) || (typeof(options.from_user)=='number' && options.from_user > 0)){
					uni.setStorageSync('form_user', options.from_user);
					uni.$store.commit('updateFormUser', options.from_user);
				}
			}
			
			
			if(options.fph == 1){
				that.fph = true;
			}
			
			// 处理小程序码的分享场景
			if(options.scene){
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
				  if (query.from_user && query.from_user.length > 0) {
				    uni.setStorageSync('form_user', query.from_user);
				    uni.$store.commit('updateFormUser', query.from_user);
				  }
				  if (query.tenant && query.tenant >= 0 && that.$store.state.tenant.tenant_id != options.tenant) {
					  if(that.$store.state.config.app && that.$store.state.config.app.tenants){
					  	let tenants = that.$store.state.config.app.tenants;
						if(Array.isArray(tenants)){
							tenants.forEach((ele) => {
								if(ele.tenant_id == query.tenant){
									uni.setStorageSync('tenant', ele);
									uni.$store.commit('updateTenant', ele);
									
									uni.$store.dispatch('initSystem');
									uni.$store.dispatch('updateConfig');
								}
							})
						}
					  }else{
						setTimeout(function(){
							if(uni.$store.state.config.app && uni.$store.state.config.app.tenants){
								let tenants = uni.$store.state.config.app.tenants;
								if(Array.isArray(tenants)){
									tenants.forEach((ele) => {
										if(ele.tenant_id == query.tenant){
											uni.setStorageSync('tenant', ele);
											uni.$store.commit('updateTenant', ele);
											
											uni.$store.dispatch('initSystem');
											uni.$store.dispatch('updateConfig');
										}
									})
								}
							}
						}, 800);
					}
				  }
				}
			}
			
			if(options.direct && options.direct.length > 0){
				var direct = decodeURIComponent(options.direct);
				if (direct && direct != 'undefined') {
				  let query = {};
				  if (direct.indexOf('&') !== -1) {
				    let direct_arr = direct.split('&');
				    direct_arr.map((item) => {
				      let queryData = item.split('=')
				      query[queryData[0]] = queryData[1]
				    })
				  } else {
				    let queryData = direct.split('=')
				    query[queryData[0]] = queryData[1]
				  }
				  console.log('---页面direct--')
				  uni.wen.toUrl(query.type, query.id, that);
				}
			}
			
			if(options.tenant && options.tenant >= 0 && that.$store.state.tenant.tenant_id != options.tenant){
				if(that.$store.state.config.app && that.$store.state.config.app.tenants){
					let tenants = that.$store.state.config.app.tenants;
					if(Array.isArray(tenants)){
						tenants.forEach((ele) => {
							if(ele.tenant_id == options.tenant){
								uni.setStorageSync('tenant', ele);
								uni.$store.commit('updateTenant', ele);
								
								uni.$store.dispatch('initSystem');
								uni.$store.dispatch('updateConfig');
							}
						})
					}
				}else{
					setTimeout(function(){
						if(uni.$store.state.config.app && uni.$store.state.config.app.tenants){
							let tenants = uni.$store.state.config.app.tenants;
							if(Array.isArray(tenants)){
								tenants.forEach((ele) => {
									if(ele.tenant_id == options.tenant){
										uni.setStorageSync('tenant', ele);
										uni.$store.commit('updateTenant', ele);
										uni.$store.dispatch('initSystem');
										uni.$store.dispatch('updateConfig');
									}
								})
							}
						}
					}, 800);
				}
			}
			
			if(that.pageTheme == 'default'){
				if(that.page__scene__ && [5,8,154].includes(that.page__scene__)){
					
				}else{
					uni.setNavigationBarColor({
						frontColor: "#000000",
						backgroundColor: "#EBEBEB",
						fail(err) {
							console.log(err)
						}
					});
				}
			}
			
			if(options.action){
				if(options.action == 'mplogin'){
					let unique = options.unique;
					let intervalTimes = 60;
					const intervalId = setInterval(function() {
					    intervalTimes -= 1;
					    if (uni.$store.state.token) {
					        clearInterval(intervalId);
					    }
					    if (intervalTimes > 0) {
					        that.getIntervalMplogin(unique).then(function(res) {
					            clearInterval(intervalId);
					        });
					    } else {
					        clearInterval(intervalId);
					    }
					}, 2000);
				}
			}
			
			
			
			setTimeout(function(){
				if(that.$store.state.config.OK){
					let events = that.$store.state.config.events;
					if(events && events[that.page__scene__] && events[that.page__scene__].length > 0){
						for(let i = 0; i < events[that.page__scene__].length; i ++){
							let eve = events[that.page__scene__][i];
							if(eve){
								let key = null;
								if(eve.scene_id && eve.scene_id > 0){
									key = 'page:event:'+eve.id + ':' + eve.scene_id;
								}else{
									key = 'page:event:'+eve.id;
								}
								let last_time = uni.getStorageSync(key);
								
								if(last_time && last_time * 1000 >= new Date().getTime() ){

								}else{
									if(eve.scene_id && eve.scene_id > 0){
										if(that.id == eve.scene_id){
											uni.setStorage({
												key: key,
												data: parseInt((new Date().getTime())/1000) + eve.interval * 60,
											})
											console.log('---页面事件1--')
											uni.wen.toUrl(eve.target_type, eve.target_id, that);
											break;
										}
									}else{
										uni.setStorage({
											key: key,
											data: parseInt((new Date().getTime())/1000) + eve.interval * 60,
										})
										console.log('---页面事件2--')
										uni.wen.toUrl(eve.target_type, eve.target_id, that);
										break;
									}
									
								}
							}
						}
					}
				}else{
					setTimeout(function(){
						if(that.$store.state.config.OK){
							let events = that.$store.state.config.events;
							if(events && events[that.page__scene__] && events[that.page__scene__].length > 0){
								for(let i = 0; i < events[that.page__scene__].length; i ++){
									let eve = events[that.page__scene__][i];
									if(eve){
										let key = null;
										if(eve.scene_id && eve.scene_id > 0){
											key = 'page:event:'+eve.id + ':' + eve.scene_id;
										}else{
											key = 'page:event:'+eve.id;
										}
										let last_time = uni.getStorageSync(key);
										
										if(last_time && last_time * 1000 >= new Date().getTime() ){
									
										}else{
											if(eve.scene_id && eve.scene_id > 0){
												if(that.id == eve.scene_id){
													uni.setStorage({
														key: key,
														data: parseInt((new Date().getTime())/1000) + eve.interval * 60,
													})
													console.log('---页面事件3--')
													uni.wen.toUrl(eve.target_type, eve.target_id, that);
													break;
												}
											}else{
												uni.setStorage({
													key: key,
													data: parseInt((new Date().getTime())/1000) + eve.interval * 60,
												})
												console.log('---页面事件4--')
												uni.wen.toUrl(eve.target_type, eve.target_id, that);
												break;
											}
											
										}
									}
								}
							}
						}
					}, 3000);
				}
			}, 3000);
			
			// #ifdef H5
			if(uni.$store.state.h5_browser == 'wxclient'){
				setTimeout(function(){
					uni.wen.util.setH5WeixinShare(uni.$store.state.config.about.logo, uni.$store.state.config.about.name, uni.$store.state.config.about.desc);
				}, 500);
			}
			// #endif
			
			
		}
	}
}