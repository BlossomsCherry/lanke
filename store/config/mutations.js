export default {  
	setGlobalConfig(state, data) {
		state.app = data.app;
		state.h5 = data.h5;
		state.about = data.about;
		state.pay = data.pay;
		state.share = data.share;
		state.code = data.code;
		state.user = data.user;
		state.img = data.img;
		state.audit = data.audit;
		state.color = data.color;
		state.page = data.page;
		state.admin = data.admin;
		state.ad = data.ad;
		state.pays = data.pays;
		state.events = data.events;
		state.version = data.version;
		state.OK = true;
		
		if(data.tab){
			if(state.tab && state.tab.length > 0){
				for(let i = 0; i < state.tab.length; i++){
					if(state.tab[i].plate_id > 0){
						data.tab.push(state.tab[i]);
					}
				}
			}
			state.tab = data.tab;
		}
		
		if(data.pupop){
			let app = getApp();
			if(app){
				app.globalData.popup = data.pupop;
			}else{
				setTimeout(function(){
					let app = getApp();
					if(app){
						app.globalData.popup = data.pupop;
					}
				}, 500);
			}
		}
		
		// #ifdef APP
		// 判断手机是否安装了微信
		if (!plus.runtime.isApplicationExist({ pname: 'com.tencent.mm', action: 'weixin://' })) {
			if(data.user.login_style && data.user.login_style.includes(0)){
				const index = data.user.login_style.indexOf(0); // 移除元素5
				if (index > -1) {
				  data.user.login_style.splice(index, 1);
				  state.user = data.user;
				}
			}
		}
		// 判断手机是否安装了QQ
		if (!plus.runtime.isApplicationExist({ pname: 'com.tencent.mobileqq', action: 'mqq://' })) {
			if(data.user.login_style && data.user.login_style.includes(3)){
				const index = data.user.login_style.indexOf(3); // 移除元素5
				if (index > -1) {
				  data.user.login_style.splice(index, 1);
				  state.user = data.user;
				}
			}
		}
		// #endif
		
	}
}