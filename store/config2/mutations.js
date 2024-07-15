export default {  
	setGlobalConfig(state, data) {
		state.OK = true;
		state.version = data.version;
		state.page = data.page;
		state.emoji = data.emoji;
		state.invite = data.invite;
		state.app = data.app;
		state.placeholder = data.placeholder;
		state.user = data.user;
		state.used = data.used;
		state.waterfall = data.waterfall;
		state.cos = data.cos;
		state.bureau = data.bureau;
	}
}