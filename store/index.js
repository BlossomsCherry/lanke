import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import state from '@/store/state';
import mutations from '@/store/mutations';
import actions from '@/store/actions';
import config from '@/store/config/config';
import config2 from '@/store/config2/config';
import config3 from '@/store/config3/config';
import config4 from '@/store/config4/config';

const store = new Vuex.Store({
    state,
    mutations,
	actions,
	modules: {
		config,
		config2,
		config3,
		config4
	}
})
export default store;
