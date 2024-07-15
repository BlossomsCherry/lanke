export default {
	setGlobalConfig(state, data) {
		state.OK = true;
		state.version = data.version;
		state.pets = data.pets;		
	}
}