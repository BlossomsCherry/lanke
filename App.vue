<script>
// #ifdef APP
import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate'
import deviceInfo from '@/utils/deviceinfo'
// #endif

// #ifdef APP || H5
import plusNative from '@/utils/plusNative'
// #endif

import uniwebsocket from '@/utils/uniWebsocket.js'

export default {
  components: { },
  data() {
    return {}
  },
  globalData: {
	$mpTabbar: null,
	user_created_at: null,
	popup: {
		tip: {
			login: '',
			nologin: '',
		},
		button: {
	        first: {
				text1: '',
				text2: '',
				path: ''
			},
			second: {
				icon: '',
				text: '',
				path: ''
			},
			third: {
				icon: '',
				text: '',
				path: ''
			},
			fourth: {
				icon: '',
				text: '',
				path: ''
			}
	    },
		hot: {
			title: '',
			desc: '',
			list: []
		}
	}
  },
  onLaunch: function (options) {
    let that = this;
	
	// #ifdef APP-PLUS || APP-PLUS-NVUE
	// APP平台 判断网络是否正常连接、连接成功后重新获取数据
	uni.onNetworkStatusChange(res => {
		if (res.networkType !== 'none') {
			uni.$store.dispatch('initSystem');
			uni.$store.dispatch('initConfig');
			if(uni.$store.state.scene == 83){
				if (uni.$store.state.$vm && uni.$store.state.$vm.page__scene__ == 83) {
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: 0, latitude: 0 }, 'POST').then(res => {
					    if (res.status) {
							uni.$store.state.$vm.app_tenants = res.data;
					    }
					});
				}else{
					let pages = getCurrentPages();
					//这句话 获取的才是当前页面实例
					let currentPage = pages[pages.length - 1];
					if (currentPage == undefined) {
						return;
					}
					// #ifdef MP
					currentPage = currentPage.$vm;
					// #endif
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: 0, latitude: 0 }, 'POST').then(res => {
					    if (res.status) {
							currentPage.app_tenants = res.data;
					    }
					});
				}
			}
		}
	});
	// #endif
	
	// #ifdef APP
	uni.onPushMessage((res) => {
		let payload = null;
		if (typeof res['data']['payload'] == "string") {
			payload = JSON.parse(res['data']['payload']);
		}else{
			payload = res['data']['payload'];
		}
		payload['pushFrom'] = res['type'] == 'receive' ? 'receive' : 'click';
		
		that.socketMessageHander(payload, {
			title: (res['data']['aps'] && res['data']['aps']['alert']) ? res['data']['aps']['alert']['title'] : res['data']['title'],
			content: (res['data']['aps'] && res['data']['aps']['alert']) ? res['data']['aps']['alert']['content'] : res['data']['content'],
			payload: payload
		});
	})
	// #endif

    // 监听系统深色模式
    uni.onThemeChange((res) => {
      if (uni.getStorageSync('followSystemTheme') == 1) {
        if (res && res.theme === 'dark') {
          that.$store.commit('updateGlobalTheme', 'black')
        } else {
          that.$store.commit('updateGlobalTheme', 'default')
        }
        if (that.$store.state.$vm) {
          that.$store.state.$vm.updateScene(that.$store.state.scene, that.$store.state.scene_id, false, false, 0, 0)
        }
      }
    })

    // #ifdef MP-WEIXIN
    if (uni.$store.state.token) {
      wx.setBackgroundFetchToken({
        token: uni.$store.state.token
      })
    }

    setTimeout(function () {
      wx.getBackgroundFetchData({
        fetchType: 'periodic',
        success(res) {
          let res_ = JSON.parse(res.fetchedData)
          if (res_.status) {

            if (res_.user && res_.user.id) {
              let userInfo = uni.getStorageSync('userInfo')
              if (userInfo && userInfo.timeStamp > 0) {
                // 判断当前的用户信息如果滞后于 定时拉取的信息，则更新。
                if (res.timeStamp > userInfo.timeStamp) {
                  uni.setStorageSync('userInfo', res_.user)
                  that.$store.commit('updateUserInfo', res_.user)
                  that.$store.commit('userUpdateTimes', 1);
				  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
				      uni.$store.dispatch('userAddPlateAction', res2.data);
				  });
                }
              }
            }

          }
        }
      })
    }, 1000)
    // #endif

	const S = new uniwebsocket(
		uni.wen.api.SocketUrl, // 必填，websocket 服务端地址
		function(data){
			that.socketMessageHander(data, null)
		},
		6000 // 选填，心跳间隔，默认50000ms
	)
	uni.$store.commit('updateWebsocket', S);

    // #ifdef APP
    setTimeout(function () {
      APPUpdate()
    }, 4000)
    // #endif

    //test
    if (uni.wen.api.debug == true) {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciwcC5jb20iLCJqdGkiOiJNci53ZW4iLCJzdWIiOiJNci53ZW4iLCJpYXQiOiIxNjk1MTg4Nzg3LjMwNjMyMSIsIm5iZiI6IjE2OTUxODg3MjcuMzA2MzIxIiwiZXhwIjoiMTY5NjA1Mjc4Ny4zMDYzMjEiLCJ1aWQiOiIxMTU4MyJ9.OiGXD91jiAaWGezCg-U9Ragi38T6KoBsJZI68amZAz0'
      uni.$store.commit('updateToken', token)
      uni.setStorageSync('token', token)
	  if(uni.$store.state.websocket){
	  	uni.$store.state.websocket.restart();
	  }
    }
	
	
	// uni.wen.util.updateUserInfo();

    // #ifdef MP
    const updateManager = uni.getUpdateManager()
	if(updateManager && updateManager.onUpdateReady){
		updateManager.onUpdateReady(function () {
		  uni.showModal({
		    title: '更新提示',
		    content: '全新的' + that.$store.state.config.about.name + '已经准备好啦，立即更新体验吧',
		    showCancel: false,
		    success: function (res) {
		      if (res.confirm) {
		        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
		        updateManager.applyUpdate()
		      }
		    }
		  })
		})
	}
    // #endif

    uni.getSystemInfo({
      success: function success(res) {
        var rect = null
        if (uni.getMenuButtonBoundingClientRect) {
          rect = uni.getMenuButtonBoundingClientRect()
          if (rect) {
            rect.sidePadding = res.windowWidth - rect.right
          }
        } else {
          rect = null
        }
        if (rect == false || rect === null || rect === undefined) {
          var gap = '' // 胶囊按钮上下间距 使导航内容居中

          var width = 96 // 胶囊的宽度

          if (res.platform === 'android') {
            gap = 8
            width = 96
          } else if (res.platform === 'devtools') {
            if (ios) {
              gap = 5.5 // 开发工具中ios手机
            } else {
              gap = 7.5 // 开发工具中android和其他手机
            }
          } else {
            gap = 4
            width = 88
          }

          rect = {
            // 获取不到胶囊信息就自定义重置一个
            bottom: res.statusBarHeight + gap + 32,
            height: 32,
            left: res.windowWidth - width - 10,
            right: res.windowWidth - 10,
            top: res.statusBarHeight + gap,
            width: width,
            sidePadding: 10
          }
        }
        that.$store.commit('updateCapsulePosition', rect)

        // 宿主名称以及版本号
        that.$store.commit('updateHost', { hostName: res.hostName, hostVersion: res.hostVersion, SDKVersion: res.SDKVersion })
        console.log('基础库版本：' + res.SDKVersion)

        // 自定义导航栏高度，不包括状态栏，单位px
        let navBarHeight = (function () {
          var gap = rect.top - res.statusBarHeight
          return res.statusBarHeight + 2 * gap + rect.height
        })()
        that.$store.commit('updateCustomBar', navBarHeight)

        // 状态栏
        that.$store.commit('updateStatusBarHeight', res.statusBarHeight)

        // 屏幕宽高
        that.$store.commit('updateScreenSize', { height: res.screenHeight, width: res.screenWidth, windowWidth: res.windowWidth })

        // 更新是否是ipad
        if (res.platform != 'devtools') {
          // uni.setInnerAudioOption({
          //     obeyMuteSwitch: false
          // });
		  
		  // #ifdef APP-PLUS
		  if(res.platform == 'ios' || plus.os.name == "iOS"){
		  	that.$store.commit('updatePlatform', 'ios')
		  }
		  // #endif
		  // #ifndef APP-PLUS
		  if(res.platform == 'ios'){
			that.$store.commit('updatePlatform', 'ios')
		  }
		  // #endif
		  
          if (res.platform === 'ios' && res.deviceType == 'pad') {
            that.$store.commit('updateIspad')
          }
        }

        // 暗黑模式
        if (uni.getStorageSync('followSystemTheme') == 1) {
          if (res.theme === 'dark') {
            that.$store.commit('updateGlobalTheme', 'black')
          } else {
            that.$store.commit('updateGlobalTheme', 'default')
          }
        }
      },
	  fail: function fail(error){

	  }
    })

	
	// #ifdef APP
	setTimeout(function(){
		plus.push.getClientInfoAsync((info) => {
		    let cid = info["clientid"];
			if(cid){
				that.$store.commit('updateCID', cid)
			}
		});
	}, 2000);
	// #endif

    /**
     * tabbar按钮点击事件
     */
    // #ifdef APP || H5
    uni.onTabBarMidButtonTap(() => {
		uni.wen.util.doVibrateShort();
		
		// #ifdef H5
		uni.wen.toUrl(6, '/pages/creat/index/creat', null)
		// #endif
		
		// #ifdef APP
		if(that.globalData.popup && that.globalData.popup.tip && that.globalData.popup.tip.login && that.globalData.popup.tip.login.length > 0){
			let close_icon_url = uni.wen.api.homeUrl + '/storage/images/icon-close.png';
			let is_black = false;
			if(uni.$store.state.theme == 'black'){
				is_black = true;
				let close_icon_url = uni.wen.api.homeUrl + '/storage/images/icon-close.png';
			}
			plusNative(that.globalData.popup, {
				user_created_at: that.globalData.user_created_at,
				close_icon_url: close_icon_url,
				bgcolor: is_black ? '#19191e' : "#ffffff",
				itemBgcolor: is_black ? '#26262b' : "#f5f5f5",
				fontColor: is_black ? '#ffffff' : "#000000"
			}, function(obj){
				uni.wen.toUrl(6, obj.path)
			});		
		}else{
			uni.wen.toUrl(6, '/pages/creat/index/creat')
			// uni.showToast({
			// 	title: '请先在后台—移动端-发布进行配置',
			// 	icon: 'none'
			// })
		}
		// #endif

    })
    // #endif

    // #ifndef H5
    const innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.autoplay = false
    innerAudioContext.src = uni.wen.api.homeUrl + '/statics/im.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    that.$store.commit('updateInnerAudioContext', innerAudioContext)
    // #endif

    // #ifdef H5
    var ua = window.navigator.userAgent.toLowerCase()
    let isWxClient = false
    if (ua.match(/qq/i) == 'qq' || ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/miniProgram/i) == 'miniprogramenv/windows' || ua.match(/miniProgram/i) == 'miniprogramenv/mac') {

    } else {
      // 普通浏览器
      that.$store.commit('updateH5BrowserType', 'normal')
    }
    // #endif
	
  },
  onShow: function () {
    let that = this

    // 检查h5支付结果
    if (that.$store.state.query_state_no) {
      uni.showModal({
        title: '提示',
        content: '是否支付成功？',
        confirmText: '支付成功',
        cancelText: '支付失败',
        success: function (res) {
          if (res.confirm) {

            uni.wen.util.request(
                uni.wen.api.ApiRootUrl + 'app/pay/status', {
                  query_state_no: that.$store.state.query_state_no
                },
                'POST'
            ).
            then((res) => {
              // "pay_status": 1, // 1=未付款 2=已付款 3=已退款
              //         "tip": "未付款",
              //         "msg": "ok"
              if (res.code === 200) {
                if (res.data.pay_status === 1) {
                  uni.showToast({
                    title: '支付失败',
                    icon: 'error'
                  })
                } else {
                  uni.showToast({
                    title: '支付成功',
                    icon: 'success'
                  })
                  setTimeout(() => {
                    uni.wen.toUrl(-1, null, null);
                  }, 400)
                }
              } else {
                uni.showToast({
                  title: res.message,
                  icon: 'none'
                })
              }
              uni.$store.commit('updateQueryStateNo', '')
            })
          } else if (res.cancel) {
            uni.$store.commit('updateQueryStateNo', '')
          }
        }
      })
    }
	
	// 清理app数字角标
	// #ifdef APP
	plus.runtime.setBadgeNumber(0)
	// #endif
  },
  created() {

    // #ifdef MP-WEIXIN
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            uni.removeStorageSync('token')
            uni.$store.commit('updateToken', '')
			if(uni.$store.state.websocket){
				uni.$store.state.websocket.close();
			}
          }
        },
      })
    }
    // #endif
  },
  methods: {
    socketMessageHander(message, others) {
      let that = this;
      if (message.status) {
        let currentPage = uni.$store.state.$vm;
        if(!currentPage || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
        	let pages = getCurrentPages();
        	//这句话 获取的才是当前页面实例
        	let currentPage = pages[pages.length - 1];
        	// #ifdef MP
        	currentPage = currentPage.$vm;
        	// #endif
			if(currentPage){
				uni.$store.commit('vm', currentPage);
			}
        }
		
		
		if(message.pushFrom == 'receive'){
			if(message.response_receive === 0 || message.response_receive === '0'){
				return false;
			}else if(message.response_receive === 2 || message.response_receive === '2'){
				if(others){
					others['payload']['response_receive'] = 1;
					uni.createPushMessage({
						title: others['title'],
						content: others['content'],
						payload: JSON.stringify(others['payload']),
						fail: function(err){
							console.log(err);
						}
					});
				}
				return false;
			}
		}
        
		if (message.mode === 0) {
			// 服务端返回绑定成功
		}else if (message.mode == 1) {
			// 第一次链接上后，发送自己的身份信息
			let device = ''
			// #ifdef APP
			device = 'app'
			// #endif
			// #ifdef MP
			device = 'mp'
			// #endif
			// #ifdef H5
			device = 'h5'
			// #endif
			if(uni.$store.state.websocket){
				uni.$store.state.websocket.send(
				  {
					  mode:"bind",
					  token: uni.$store.state.token,
					  played: uni.$store.state.played,
					  device: device
				  }
				);
			}
        } else if (message.mode == 2) {
			// 收到服务端心跳 60s一次，每次收到服务器心跳才回应自己身份，客户端ping只回应
			let device = ''
			// #ifdef APP
			device = 'app'
			// #endif
			// #ifdef MP
			device = 'mp'
			// #endif
			// #ifdef H5
			device = 'h5'
			// #endif
			if(uni.$store.state.websocket){
				uni.$store.state.websocket.send(
				  {
					  mode:"bind",
					  token: uni.$store.state.token,
					  played: uni.$store.state.played,
					  device: device
				  }
				);
			}
		} else if (message.mode == 5) {
			console.log('000')
		  if(message.pushFrom == 'click'){
			uni.wen.toUrl(18, message.data.from_user.id);
		  }else{
			let chat_content = message.data.chat_content
			if (chat_content == undefined) {
			  chat_content = ''
			}
			if (message.data.chat_image) {
			  chat_content += '[图片]'
			}
			let avater = message.data.from_user.user_avatar
			let uid = message.data.from_user.id
			
			// #ifndef H5
			that.$store.state.innerAudioContext.play()
			// #endif
			if (that.$store.state.scene == 15 && that.$store.state.scene_id == uid) {
				console.log('1111')
			  currentPage.getUserChat(1)
			} else if (that.$store.state.scene == 4) {
				console.log('22222')
				uni.wen.util.doVibrateShort();
						
			  currentPage.myToast({
			    type: 'info',
			    content: chat_content,
			    timeout: 2000,
			    isClick: false,
			    image: avater
			  })
			
			  currentPage.getMessages()
			  currentPage.getUserChatList()
			} else {
			  uni.wen.util.doVibrateShort()
			  currentPage.myToast({
			    type: 'info',
			    content: chat_content,
			    timeout: 2000,
			    isClick: false,
			    image: avater
			  })
			
			  currentPage.getSysMessageCount().
			  then(function (res) {
			    // that.getTabBar().setData({
			    //     sysMessageCount: res
			    // });
			
			    //  #ifdef MP
			    currentPage.tabBarSetData({
			      sysMessageCount: res
			    })
			    // #endif
			
			    //  #ifndef MP
			    if (res > 0) {
			      that.$store.commit('updateSysMessageCount', res)
			    } else {
			      that.$store.commit('updateSysMessageCount', 0)
			    }
			    // #endif
			
			  })
			}
		  }
        } else if (message.mode == 6) {
          that.$store.commit('hasRefresh', true)
        } else if (message.mode == 7) {
          currentPage.myToast({
            type: 'success',
            content: '视频封面已处理完成',
            timeout: 2000,
            isClick: false,
          })
        } else if (message.mode == 8) {
          uni.wen.util.doVibrateShort()
          currentPage.myToast({
            type: 'warn',
            content: message.data.content,
            timeout: 2000,
            isClick: false,
          })
        } else if (message.mode == 9) {
          currentPage.myToast({
            type: 'success',
            content: message.data.content,
            timeout: 2000,
            isClick: false,
          })
        } else if (message.mode == 10) {
          currentPage.myToast({
            type: 'info',
            content: message.data.content,
            timeout: 2000,
            isClick: false,
          })
        } else if (message.mode == 11) {
          uni.wen.util.doVibrateShort()
          currentPage.myToast({
            type: 'err',
            content: message.data.content,
            timeout: 2000,
            isClick: false,
          })
        } else if (message.mode == 12) {
          uni.wen.util.updateUserInfo()
        } else if (message.mode == 13) {
			if(message.data.version > uni.$store.state.config.version){
				console.log('-------------initConfig---------------');
				that.$store.dispatch('initConfig');
				that.$store.dispatch('initConfig2');
			}
        } else if (message.mode == 14) {
          currentPage.myToast({
            type: 'taskReward',
            timeout: 2000,
            title: message.data.title,
            content: message.data.content,
            icon: message.data.icon,
            taskID: message.data.taskID,
            isClick: true,
            mask: 1,
          })
        } else if (message.mode == 15) {
			// #ifdef APP
			plus.runtime.setBadgeNumber(message.data.num)
			// #endif
		} else if (message.mode == 16) {
			uni.createPushMessage({
				title: message.data.title,
				content: message.data.content,
				payload: message.data.payload,
				fail: function(err){
					console.log(err);
				}
			});
		} else if (message.mode == 17) {
			uni.startPullDownRefresh();
		} else if (message.mode == 18) {
			uni.getSystemInfo({
			  success: function success(info) {
				  
				// #ifdef APP
				if(uni.$store.state.config.app.mode == 'examine'){
					
				}else{
					info.wifi = {
						mac_address: deviceInfo.mac
					}
				}
				// #endif
				
			    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/system/info', info, 'POST');
			  },
			  fail: function fail(error){
				  console.log(error)
			  }
			});
		}else if (message.mode == 999) {
			uni.wen.toUrl(message.data.target_type, message.data.target_id, null);
		}
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";

/* #ifndef APP-NVUE */
@import '@/static/icon/A/iconfont.css';
@import '@/static/icon/C/iconfont.css';
/* #endif */
@import './app.scss';
</style>
