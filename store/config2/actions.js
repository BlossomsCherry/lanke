
export default {
	init(context){
		let isNoglobalConfigCache = false;
		try {
			let globalConfig = uni.getStorageSync('globalConfig2');
			if (globalConfig) {
				context.commit('setGlobalConfig', globalConfig);
			}else{
				isNoglobalConfigCache = true;
			}
		} catch (e) {
			// error
			isNoglobalConfigCache = true;
			console.log(e);
		}

		if(isNoglobalConfigCache){
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 2}).then(function(res) {
				if (res.status) {
					context.commit('setGlobalConfig', res.data);
					try {
						uni.setStorageSync('globalConfig2', res.data);
					} catch (e) {
						console.log(e);
					}
				}
			});
		}else{
			setTimeout(function(){
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 2}).then(function(res) {
					if (res.status) {
						try {
							uni.setStorage({
								key: 'globalConfig2',
								data: res.data,
								success: function () {
									context.commit('setGlobalConfig', res.data);
								},
								fail() {
									console.log('存储本次globalConfig失败2');
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
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'configData',  {which: 2}).then(function(res) {
			if (res.status) {
				context.commit('setGlobalConfig', res.data);
				try {
					uni.setStorageSync('globalConfig2', res.data);
				} catch (e) {
					console.log(e);
				}
			}
		});
	}
}