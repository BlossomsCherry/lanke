
export default {
	init(context){
		let isNoglobalConfigCache = false;
		try {
			let globalConfig = uni.getStorageSync('globalConfig3');
			if (globalConfig) {
				context.commit('setGlobalConfig', globalConfig);
				console.log('从缓存中读取了globalConfig3');
			}else{
				isNoglobalConfigCache = true;
			}
		} catch (e) {
			// error
			isNoglobalConfigCache = true;
			console.log(e);
		}

		if(isNoglobalConfigCache){
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 3}).then(function(res) {
				if (res.status) {
					context.commit('setGlobalConfig', res.data);
					console.log('从网络中读取了globalConfig3');
					try {
						uni.setStorageSync('globalConfig3', res.data);
					} catch (e) {
						console.log(e);
					}
				}
			});
		}else{
			setTimeout(function(){
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 3}).then(function(res) {
					if (res.status) {
						try {
							uni.setStorage({
								key: 'globalConfig3',
								data: res.data,
								success: function () {
									console.log('成功存储本次globalConfig3');
									context.commit('setGlobalConfig', res.data);
								},
								fail() {
									console.log('存储本次globalConfig失败3');
								}
							});
						} catch (e) {
							console.log(e);
						}
					}
				});
			}, 5000);
		}
	},
	update(context){
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 3}).then(function(res) {
			if (res.status) {
				context.commit('setGlobalConfig', res.data);
				console.log('从网络中读取了globalConfig3');
				try {
					uni.setStorageSync('globalConfig3', res.data);
				} catch (e) {
					console.log(e);
				}
			}
		});
	}
}