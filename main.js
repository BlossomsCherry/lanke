import App from './App';
// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();
// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';
import Base from './mixins/base';
// #ifndef VUE3
import Vue from 'vue';

import store from './store';
Vue.prototype.$store = store;
uni.$store = store;

// 创建事件总线
uni.$eventBus = new Vue();

store.dispatch('initSystem');
store.dispatch('initConfig');
store.dispatch('initConfig2');

// 引入uViewUI
import uView from '@/uni_modules/uview-ui'
Vue.use(uView);
import wen from './common/wen.js';

Vue.mixin(Mixin);
Vue.mixin(Base);


// 导入
import unicom from '@/uni_modules/p-f-unicom/index.js'
// 使用
Vue.use(unicom, {
  name: 'unicom',
  idName: 'unicomId',
  groupName: 'unicomGroup'
})

Vue.prototype.getRelationNodes = function(name) {
	var res = []
	var list = this.$unicom('@' + name)
	// if (node) {
	// 	if (!node.data) node.data = node.$data
	// 	res = [node]
	// }
	return list
}
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App
});

app.$mount();

// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
export function createApp() {
	const app = createSSRApp(App);
	app.mixin(Mixin);
	return {
		app
	};
}
// #endif
