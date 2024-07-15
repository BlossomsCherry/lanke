export default {
	setGlobalConfig(state, data) {
		state.OK = true;
		state.version = data.version;
		state.theme = data.theme;
		
		if(data.theme){
			// uni.setStorageSync('global__theme__', data.theme);
		}
		
	}
}