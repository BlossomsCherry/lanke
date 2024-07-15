

export default {
	initConfig(context){
		// #ifdef APP-PLUS || APP-PLUS-NVUE
		// APP平台 判断网络是否正常连接、连接成功后重新获取数据
		uni.onNetworkStatusChange(res => {
			if (res.networkType !== 'none') {
				context.dispatch('config/init',[], {root:true} )
			}
		})
		// #endif
		context.dispatch('config/init',[], {root:true} )
	},
	initConfig2(context){
		context.dispatch('config2/init',[], {root:true} )
	},
	initConfig3(context){
		context.dispatch('config3/init',[], {root:true} )
	},
	initConfig4(context){
		context.dispatch('config4/init',[], {root:true} )
	},
	updateConfig(context){
		context.dispatch('config/update',[], {root:true} )
	},
	updateConfig2(context){
		context.dispatch('config2/update',[], {root:true} )
	},
	updateConfig3(context){
		context.dispatch('config3/update',[], {root:true} )
	},
	updateConfig4(context){
		context.dispatch('config4/update',[], {root:true} )
	},
	initSystem(context){

		let tenant = uni.getStorageSync('tenant');
		if(tenant){
			context.commit('updateTenant', tenant);
		}

		let token = uni.getStorageSync('token');
		if(token){
			context.commit('updateToken', token);
			// 用户信息
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo && userInfo.id){
				context.commit('updateUserInfo', userInfo);
				setTimeout(function(){
					uni.wen.util.updateUserInfo();
				}, 10000)
			}

			let played = uni.getStorageSync('played');
			if(played){
				context.commit('updatePlayed', played);
			}
			
			let lastCity = uni.getStorageSync('lastCity');
			if(lastCity){
				context.commit('updateLastCity', lastCity);
			}
		}

		let form_user = uni.getStorageSync('form_user');
		if(form_user){
			context.commit('updateFormUser', form_user);
		}

		// 主题
		let global__theme__ = uni.getStorageSync('global__theme__');
		if(global__theme__ && ['black', 'default'].includes(global__theme__)){
			context.commit('updateGlobalTheme', global__theme__);
		}
	},

	updateScene(context, scene){
		context.commit('updateScene', scene);
	},
	userAddPlateAction(context, plates){
		context.commit('userAddPlate', plates);
	}
}
