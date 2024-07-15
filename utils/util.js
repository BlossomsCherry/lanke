// #ifdef H5
var jweixin = require('jweixin-module');
// #endif

// 防抖
let t = null
export const debounce = function (fn, delay) {
  if (t !== null) {
    clearTimeout(t)
  }
  t = setTimeout(() => {
    fn()
  }, delay)
}

/**
 * 小程序检查权限
 */
const checkMpPermission = function (t, e, n) {
	return new Promise(function (resolve, reject) {
		uni.getSetting({
			success: function (a) {
				null == a.authSetting[t] ?
					uni.authorize({
						scope: t,
						success: () => n(),
						fail: (err) => {
							console.log(err)
						}
					}) :
					a.authSetting[t] ?
						n() :
						uni.showModal({
							title: '提示',
							content: e,
							success: (t) => {
								t.confirm ? uni.openSetting({}) : t.cancel;
							}
						});
				resolve({})
			},
			fail: function (e) {
				console.log(e);
				reject({})
			}
		});
	});
};

/**
 * App检查权限
 */
const checkAppPermission = function (t, e, n, that = null ) {
	return new Promise(function (resolve, reject) {
		if(uni.$store.state.platform == 'android'){
			
			let p = '';
			let tip = '';
			if (t == "location") {
				p = 'android.permission.ACCESS_FINE_LOCATION';
				tip = '位置权限';
			} else if (t == "camera") {
				p = 'android.permission.CAMERA';
				tip = '摄像头权限';
			} else if (t == "photoLibrary-read") {
				p = 'android.permission.READ_EXTERNAL_STORAGE';
				tip = '相册读取权限';
			} else if (t == "photoLibrary-write") {
				p = 'android.permission.WRITE_EXTERNAL_STORAGE';
				tip = '相册写入权限';
			} else if (t == "record") {
				p = 'android.permission.RECORD_AUDIO';
				tip = '麦克风权限';
			} else if (t == "push") {
				p = '';
			} else if (t == "contact-read") {
				p = 'android.permission.READ_CONTACTS';
				tip = '通讯录读取权限';
			} else if (t == "contact-write") {
				p = 'android.permission.WRITE_CONTACTS';
				tip = '通讯录写入权限';
			} else if (t == "calendar-read") {
				p = 'android.permission.READ_CALENDAR';
				tip = '日历读取权限';
			} else if (t == "calendar-write") {
				p = 'android.permission.WRITE_CALENDAR';
				tip = '日历写入权限';
			} else if (t == "phone") {
				p = 'android.permission.CALL_PHONE';
				tip = '拨打电话权限';
			} else if (t == "phone-log") {
				p = 'android.permission.READ_CALL_LOG';
				tip = '获取通话记录权限';
			} else if (t == "sms-read") {
				p = 'android.permission.READ_SMS';
				tip = '短信读取权限';
			} else if (t == "sms-send") {
				p = 'android.permission.SEND_SMS';
				tip = '短信发送权限';
			} else if (t == "sms-new") {
				p = 'android.permission.RECEIVE_SMS';
				tip = '接收新短信权限';
			} else if (t == "state") {
				p = 'android.permission.READ_PHONE_STATE';
				tip = '手机识别码信息权限';
			}
			
			
			if(that){
				
			}else{
				that = uni.$store.state.$vm;
				if(!that || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
					let pages = getCurrentPages();
					//这句话 获取的才是当前页面实例
					that = pages[pages.length - 1];
					// #ifdef MP
					that = that.$vm;
					// #endif
					if(that){
						uni.$store.commit('vm', that);
					}
				}
			}
			
			let flag = true;
			let old = uni.getStorageSync('permission:'+t);
			let old_timestamp = uni.getStorageSync('permission:timestamp:'+t);
			if(old == undefined || old == null || old === 0 || !old){
				old = -2;
			}
			if(old_timestamp == undefined || old_timestamp == null || old_timestamp === 0 || !old_timestamp){
				old_timestamp = parseInt(new Date().getTime() / 1000);
			}
			
			if(old == 1){
				
			}else if(old === 0){
				// 临时拒绝
				if(parseInt(new Date().getTime() / 1000) - old_timestamp > (24 * 3600)){
					if(that){
						that.myToast({
							type: 'permisstip',
							uuid: 'permisstip-xxxx',
							content: e
						});
					}
				}else{
					flag = false;
					if(that){
						that.myToast({
							type: 'permisstip',
							close: 1,
							uuid: 'permisstip-xxxx'
						});
					}
					n();
					resolve();
				}
			}else if(old == -1){
				// 永久拒绝
				flag = false;
				uni.showModal({
					title: '[' + tip  + ']被拒绝',
					content: '是否打开App设置页进行权限设置',
					success: (t) => {
						if(t.confirm){
							uni.wen.util.gotoAppPermissionSetting()
						}else{
							
						}
					}
				});
			}else if(old == -2){
				if(that){
					that.myToast({
						type: 'permisstip',
						uuid: 'permisstip-xxxx',
						content: e
					});
				}
			}
			
			if(flag && p){
				plus.android.requestPermissions(
					[p],
					function(resultObj) {
						
						if(that){
							that.myToast({
								type: 'permisstip',
								close: 1,
								uuid: 'permisstip-xxxx'
							});
							console.log('permisstip-close-1')
						}
						let result = 0;
						if(resultObj.granted.length > 0){
							result = 1;
						}else if(resultObj.deniedPresent.length > 0){
							result = 0;
						}else if(resultObj.deniedAlways.length > 0){
							result = -1
						}
						if (result == 1) {
							uni.setStorageSync('permission:'+t, 1);
							uni.setStorageSync('permission:timestamp:'+t, parseInt(new Date().getTime() / 1000));
							n();
							resolve({});
						}else{
							// 无权限
							if(result == -1){
								uni.setStorageSync('permission:'+t, -1);
								uni.setStorageSync('permission:timestamp:'+t, parseInt(new Date().getTime() / 1000));
							}else{
								uni.setStorageSync('permission:'+t, 0);
								uni.setStorageSync('permission:timestamp:'+t, parseInt(new Date().getTime() / 1000));
							}
							// 若所需权限被拒绝,则提示打开APP设置界面
							uni.showModal({
								title: '[' + tip  + ']被拒绝',
								content: '是否打开App设置页进行权限设置',
								success: (t) => {
									if(t.confirm){
										uni.wen.util.gotoAppPermissionSetting()
									}else{
										uni.showToast({
											title: '[' + tip  + ']被拒绝',
											icon: 'none'
										});
									}
								}
							});
							reject({})
						}
					},
					function(error) {
						console.log(error);
						reject({})
					}
				);
			}else{
				if(that){
					that.myToast({
						type: 'permisstip',
						close: 1,
						uuid: 'permisstip-xxxx'
					});
				}
				n();
				resolve(result);
			}
			

		}else{
			// 提示由uniapp配置提供
			n();
			resolve({});
		}
	});
};

/**
 * 微信的的request
 */

function request(url, data = {}, method = 'GET', scene = 0) {
  if (method == 'POST') {
    if (uni.$store.state.posting_url == url) {
      uni.loading(false)
      uni.showToast({
        title: '别急，慢一点',
        icon: 'none'
      })
      return false
    } else {
      uni.$store.commit('updatePostingUrl', url)
    }
  }
  return new Promise(function (resolve, reject) {
    uni.request({
      url,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        token: uni.getStorageSync('token'),
        played: uni.$store.state.played,
        fromUser: uni.$store.state.form_user,
        tenant: uni.$store.state.tenant.tenant_id,
        safeCode: uni.wen.api.safeCode,
        platform: uni.$store.state.platform,
		scene: scene > 0 ? scene : uni.$store.state.scene,
        // #ifdef MP
        device: 'mp',
        // #endif
        // #ifdef H5
        device: 'h5',
        // #endif
        // #ifdef APP
        device: 'app',
        // #endif
      },
      success: function (res) {
        // console.log('===============请求数据==================');
        // console.log("url",url)
        // console.log("请求data：", JSON.stringify(data))
        // console.log("res",res)
        // console.log('-----------------------------------------');
        if (method == 'POST') {
          uni.$store.commit('updatePostingUrl', '')
        }
        uni.loading(false)
        if (res.statusCode == 200) {
			  if (res.data.code == 503002) {
				if (uni.$store.state.scene == 14) {
				  return
				}
				uni.wen.toUrl(-4, null, null)
			  } else if (res.data.code == 503003) {
				//token过期
				// #ifdef MP
				getNewToken().
				then(() => {
				  request(url, data, method).
				  then((res) => {
					resolve(res)
				  })
				})
				// #endif

				// #ifndef MP
				//非小程序 ，token过期的话，就直接跳登录
				console.log('token过期 跳登录11')
				uni.removeStorageSync('token')
				uni.$store.commit('updateToken', '')
				
				if(uni.$store.state.websocket){
					uni.$store.state.websocket.close();
				}

				uni.removeStorageSync('userInfo')

				debounce(function () {
				  console.log('token过期 跳登录22')
				  if (uni.$store.state.scene == 14) {
					return
				  }
				  uni.wen.toUrl(-4, null, null)
				}, 1000)
				// #endif
			  } else if( res.data.code == 200043 ){
				uni.showModal({
					title: res.data.data.title,
					content: res.data.data.content,
					showCancel: true,
					confirmText: res.data.data.confirmText,
					confirmColor: '#ff2442',

					success(res2) {
						if (res2.confirm){
							uni.wen.toUrl(res.data.data.target_type, res.data.data.target_id, null);
						}
					}
				});
				return false;
			} else {
				resolve(res.data)
			}
        } else {
          reject(res.errMsg)
        }
      },
      fail: function (err) {
        if (method == 'POST') {
          uni.$store.commit('updatePostingUrl', '')
        }
        console.log('request err', err, url)
        reject(err)
      }
    })
  })
}

/**
 * 微信的上传uploadFile
 */

function uploadFile(url, filePath, scene) {
  let that = this
  return new Promise(function (resolve, reject) {
    uni.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      header: {
        token: uni.getStorageSync('token'),
        played: uni.$store.state.played,
        safeCode: uni.wen.api.safeCode,
        tenant: uni.$store.state.tenant.id,
        // #ifdef MP
        device: 'mp',
        // #endif
        // #ifdef H5
        device: 'h5',
        // #endif
        // #ifdef APP
        device: 'app',
        // #endif
        scene: scene
      },
      success: function (res) {
        uni.loading(false)
        let data = JSON.parse(res.data)
        if (res.statusCode == 200) {
          if (data.code == 503002) {
            if (uni.$store.state.scene == 14) {
              return
            }
            uni.wen.toUrl(-4, null, null)
          } else if (data.code == 503003) {
            //token过期
            // #ifdef MP
            getNewToken().
            then(() => {
              uploadFile(url, filePath, scene).
              then((res) => {
                resolve(res)
              })
            })
            // #endif

            // #ifndef MP
            //非小程序 ，token过期的话，就直接跳登录
            console.log('token过期 跳登录11')
            uni.removeStorageSync('token')
            uni.$store.commit('updateToken', '')
			
			if(uni.$store.state.websocket){
				uni.$store.state.websocket.close();
			}

            uni.removeStorageSync('userInfo')
            uni.$store.commit('updateUserInfo',
              {
                id: '',
                user_name: '未登录用户',
                user_avatar: uni.$store.state.config.img.default_avatar,
                user_introduce: uni.$store.state.config.user.user_default_introduce,
                user_background_maps: uni.$store.state.config.user.user_background_maps,
                is_authentication: false,
                is_member: false,
                is_official: false,
                is_played: false,
                gender: 0
              },
            )

            debounce(function () {
              console.log('token过期 跳登录22')
              if (uni.$store.state.scene == 14) {
                return
              }
              uni.wen.toUrl(-4, null, null)
            }, 1000)
            // #endif
          } else {
            resolve(data)
          }
        } else {
          reject(res.errMsg)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

/**
 * 更新token
 */
function getNewToken() {
  let code = null
  console.log('getNewToken', 1)
  return new Promise((resolve, reject) => {
    // #ifdef MP
    return login().
    then((res) => {
      code = res.code
      return getUserInfo()
    }).
    then((userInfo) => {
      //登录远程服务器
      request(
        uni.wen.api.ApiRootUrl + 'login', {
          code: code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv
        },
        'POST'
      ).
      then((res) => {
        if (res.code === 200) {
          uni.setStorageSync('token', res.data.token)
          uni.$store.commit('updateToken', res.data.token)

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
          	uni.$store.state.websocket.restart();
          }
		  
          resolve(res)
        } else {
          reject(res)
        }
      }).
      catch((err) => {
        reject(err)
      })
    }).
    catch((err) => {
      reject(err)
    })
    // #endif

    // #ifndef Mp
    resolve()
    // #endif
  })
}

/**
 * 检查微信会话是否过期
 */

function checkSession() {
  return new Promise(function (resolve, reject) {
    uni.checkSession({
      success: function () {
        resolve(true)
      },
      fail: function () {
        reject(false)
      }
    })
  })
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    uni.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    uni.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

//更新用户信息
function updateUserInfo(scene = 0, that = null) {
  setTimeout(function () {
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/info', {
		cid: uni.$store.state.cid
	}).then(function (res) {
      if (res.status) {
        uni.setStorageSync('userInfo', res.data);
        uni.$store.commit('updateUserInfo', res.data);
        uni.$store.commit('userUpdateTimes', 1);
		
		if(scene == 5){
			if(that){
				that.lastRefrshTimeStamp = res.data.timeStamp;
			}
		}
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
		    uni.$store.dispatch('userAddPlateAction', res2.data);
		});

        if (res.code == 200025) {
          uni.showModal({
            title: '用户名为空',
            content: '系统检测到您的用户名为空，是否前往修改？',
            confirmText: '立即前往',
            cancelText: '下次',
            success: function (res) {
              if (res.confirm) {
                uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine')
              } else if (res.cancel) {

              }
            }
          })
        }
		
      }
    })
  }, 500)

}

/**
 * 判断页面是否需要登录
 */

function loginNow() {
  let that = this
  let token = uni.$store.state.token

  if (token == '' || token === undefined) {
    if (uni.$store.state.scene == 14) {
      return
    }
    uni.wen.toUrl(-4, null, null)
    return false
  } else {
    return true
  }
}

function log(data) {
  request(uni.wen.api.ApiRootUrl + 'common/putlog', { log: data }, 'POST').
  then(function (res) {
    if (res.status) {

    } else {
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 1500
      })
    }
  })
}

/**
 *
 * @param {*} source 源数组
 * @param {*} count 要取出多少项
 * @param {*} isPermutation 是否使用排列的方式
 * @return {any[]} 所有排列组合,格式为 [ [1,2], [1,3]] ...
 */

function getNumbers(source, count, isPermutation = true) {
  //如果只取一位，返回数组中的所有项，例如 [ [1], [2], [3] ]
  let currentList = source.map((item) => [item])

  if (count === 1) {
    return currentList
  }

  let result = [] //取出第一项后，再取出后面count - 1 项的排列组合，并把第一项的所有可能（currentList）和 后面count-1项所有可能交叉组合

  for (let i = 0; i < currentList.length; i++) {
    let current = currentList[i] //如果是排列的方式，在取count-1时，源数组中排除当前项

    let children = []

    if (isPermutation) {
      children = getNumbers(
        source.filter((item) => item !== current[0]),
        count - 1,
        isPermutation
      )
    } //如果是组合的方法，在取count-1时，源数组只使用当前项之后的
    else {
      children = getNumbers(source.slice(i + 1), count - 1, isPermutation)
    }

    for (let child of children) {
      result.push(current + '_' + child)
      result.push(child + '_' + current)
    }
  }

  return result
}

function setClipboardData(str, toast) {
  if (!str) {
    uni.showToast({
      title: '待复制内容为空',
      icon: 'none'
    })
  }

  uni.setClipboardData({
    data: str.toString(),
	showToast: false,
    success(res) {
      if (toast) {
        uni.showToast({
          title: toast.replace('[data]', res.data),
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: '[' + res.data + ']复制成功',
          icon: 'none'
        })
      }
    },

    fail(res) {
      console.log('复制出错' + JSON.stringify(res))
    }
  })
}

function htmlEncodeByRegExp(str) {
  var s = ''

  if (str.length === 0) {
    return ''
  }

  s = str.replace(/&/g, '&amp;')
  s = s.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')
  s = s.replace(/ /g, '&nbsp;')
  s = s.replace(/\'/g, '&#39;')
  s = s.replace(/\"/g, '&quot;')
  return s
} // 4.使用正则实现html解码

function htmlDecodeByRegExp(str) {
  var s = ''

  if (str.length === 0) {
    return ''
  }

  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, '\'')
  s = s.replace(/&quot;/g, '"')
  return s
}

// 去掉所有的图片样式后缀
function removeStyles(url) {
  let styleNames = uni.$store.state.config.img.styleNames || new Array()
  if (url) {
  	if(styleNames.length > 0){
  		for (var i = 0; i < styleNames.length; i++) {
  			if (styleNames[i].charAt(0) == '/') {
  				url = url.replace(styleNames[i], '');
  			}
  		}
  	}
  	
  	const index = url.indexOf('?imageMo');
  	if(index >= 0){
  		url = url.slice(0, index)
  	}
  }
  return url
}

// 唤起指定qq或者qq群聊， todo：2=群聊
function awakenQQ(qq, type = 1) {
  if (type == 1) {
    // #ifdef APP
    plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + qq + '&version=1&src_type=web ')
    // #endif
    // #ifdef H5
    window.open('mqq://im/chat?chat_type=wpa&uin=' + qq + '&version=1&src_type=web ')
    // #endif
  } else {
    // 将QQ群的号码转换成秘钥
    console.log('唤醒QQ群聊' + qq)
  }
}

function textRaw(text, length = 0) {
  if (text) {
    text = text.replace(/<[^>]+>/g, '').
    replace(/&nbsp;/ig, '')
    if (length > 0) {
      if (text.length >= length) {
        text = text.substring(0, length) + '...'
      }
    }
  }

  return text
}

//扫码
function scanCodeMethods(onlyFromCamera, that = null) {
	
	let _scanCodeMethods = (onlyFromCamera) => {
		//扫码
		uni.scanCode({
		onlyFromCamera: onlyFromCamera,
		
		success(res) {
		  if (typeof res.path != 'undefined') {
			uni.wen.toUrl(6, '/' + res.path, null)
		  }
		  if(res.result && res.result.startsWith('shop:order:coupon:')){
			if(uni.$store.state.pre_scene == 102){
				uni.setStorageSync('shop:order:coupon:code', res.result.replace('shop:order:coupon:', '') );
				uni.wen.toUrl(-2, null);
			}else{
				uni.wen.toUrl(6, '/pagesS/sellers/deliver/deliver?code=' + res.result.replace('shop:order:coupon:', ''));
			}
		  }
		},
		fail(err) {
		  console.log(err)
		}
		})
	}
	
	// #ifdef MP
	_scanCodeMethods(onlyFromCamera);
	// #endif
	
	// #ifdef APP
	uni.wen.util.checkAppPermission('camera', '[摄像头权限]用于扫一扫登录，核销等场景', () => {
		_scanCodeMethods(onlyFromCamera)
	}, that);
	// #endif
	
	// #ifdef H5
	_scanCodeMethods(onlyFromCamera)
	// #endif
	
}



function parseUrlQuery(path) {
  let query = {}
  let queryList = path.split('?')
  //获取query
  if (queryList[1]) {
    let queryDataList = queryList[1].split('&')
    queryDataList.map((item) => {
      let queryData = item.split('=')
      query[queryData[0]] = queryData[1]
    })
    return query
  } else {
    return query
  }
}

/**
 *打开微信小程序
 *  {appId:小程序appid,gid:微信小程序原始id}*/
function toMpWeixin(appid, gid = '', path = '') {
  // #ifdef MP-WEIXIN
  uni.navigateToMiniProgram({ appId: appid, path: path })
  // #endif

  // #ifdef APP-PLUS
  plus.share.getServices(shareList => {
    let shareWx = shareList.find(val => val.id == 'weixin')
    if (shareWx) {
      shareWx.launchMiniProgram({ id: gid, path: path })
    } else {
      uni.showToast({ icon: 'none', title: '未安装微信,无法打开对应小程序' })
    }
  }, e => {
    uni.showToast({ icon: 'none', title: '获取分享服务列表失败:' + JSON.stringify(e) })
  })
  // #endif
}

function pointGridCode(x, y) {
  const columnWidth = uni.$store.state.screenWidth / 3
  const rowHeight = uni.$store.state.screenLiHeight / 4
  const columnIndex = Math.floor(x / columnWidth)
  const rowIndex = Math.floor(y / rowHeight)
  // 判断列位置
  switch (columnIndex) {
    case 0:
      switch (rowIndex) {
        case 0:
          return 1
        case 1:
          return 4
        case 2:
          return 7
        case 3:
          return 10
      }
      break
    case 1:
      switch (rowIndex) {
        case 0:
          return 2
        case 1:
          return 5
        case 2:
          return 8
        case 3:
          return 11
      }
      break
    case 2:
      switch (rowIndex) {
        case 0:
          return 3
        case 1:
          return 6
        case 2:
          return 9
        case 3:
          return 12
      }
      break
  }
  return 0
}

function deepClone(obj) {
  if (obj) {
    let objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          //判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = deepClone(obj[key])
          } else {
            //如果不是，简单复制
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  }
  return null
}

function validatePhoneNumber(phoneNumber) {
  if (phoneNumber === undefined || phoneNumber === null || phoneNumber === '') {
    return false
  }
  const pattern = /^1[0-9]{10}$/
  return pattern.test(phoneNumber)
}

// 检查基础库是否支持
function hostVersionSupport(version) {

  let v1_version = uni.$store.state.SDKVersion

  let v1 = v1_version.split('.')
  let v2 = version.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return true
    } else if (num1 < num2) {
      return false
    }
  }

  return true
}

// App打开或下载
function openOrDownloadApp() {
  const config_app = uni.$store.state.config.app
  const fn = function () {
    if (uni.$store.state.platform == 'ios') {
      const loadDateTime = new Date()
      window.location = `${config_app.basic.url_schemes}://` //schema链接或者universal link
      window.setTimeout(() => { //如果没有安装app,便会执行setTimeout跳转下载页
        var timeOutDateTime = new Date()
        if (timeOutDateTime - loadDateTime < 5000) {
          uni.wen.toUrl(6, '/pagesC/redirect/redirect', null);
        } else {
          window.close()
        }
      }, 500)
    } else if (uni.$store.state.platform == 'android') {
      try {
        window.location = `${config_app.basic.url_schemes}://` //schema链接或者universal link
        window.setTimeout(function () {
          uni.wen.toUrl(6, '/pagesC/redirect/redirect', null);
        }, 500)
      } catch (e) {}
    }
  }

  if (uni.$store.state.h5_browser === 'wxclient') {
    uni.showModal({
      title: '温馨提示',
      content: '请点击右上角，点击在默认浏览器中打开～！',
      showCancel: false,
      success: result => fn()
    })
  } else {
    fn()
  }
}


function doVibrateShort() {
	// #ifdef APP-PLUS
	if (uni.$store.state.platform == 'ios') {
		const UISelectionFeedbackGenerator = plus.ios.importClass('UISelectionFeedbackGenerator');
		const feedbackGenerator = new UISelectionFeedbackGenerator();
		feedbackGenerator.init();
		setTimeout(() => {
			feedbackGenerator.selectionChanged();
		}, 0)
	} else {
		plus.device.vibrate(15);
	}
	// #endif
	// #ifndef APP-PLUS
	uni.vibrateShort();
	// #endif
};


function getLocation(that = null) {
    return new Promise(function (resolve, reject) {
		const _getLocation = () => {
			uni.getLocation({
				type: 'gcj02',
				altitude: true,
				success: (res) => {
					console.log(res)
					resolve(res)
				},
				fail: (err) => {
					console.log(err)
					reject(err)
				}
			});
		}

		// #ifdef MP
		checkMpPermission('scope.userLocation', '请到设置页面授权“位置信息”权限', () => _getLocation()).catch(err => {
			reject(err)
		});
		// #endif
		
		// #ifdef APP
		checkAppPermission('location', '[位置权限]获取您的位置，经纬度等信息，用于 选择学校，选择城市，标记笔记等场景', () => _getLocation(), that).catch(err => {
			reject(err)
		});
		// #endif

		// #ifdef H5
		_getLocation()
		// #endif
	});
};

function callPhone(phone, that = null){
	let _callPhone = (phone) => {
		uni.makePhoneCall({
			phoneNumber: phone,
			success: function () {
		
			},
			fail: function (error) {
		
			}
		});
	};

	// #ifdef MP
	_callPhone(phone)
	// #endif
	
	// #ifdef APP
	checkAppPermission('phone', '[拨打电话权限]用于 客服，联系笔记作者等场景', () => {
		_callPhone(phone)
	}, that);
	// #endif
	
	// #ifdef H5
	_callPhone(phone)
	// #endif
	
}


function getGeocoder() {
    return new Promise(function (resolve, reject) {
		let resData = null;
        getLocation().then(res => {
            uni.wen.util.request(uni.wen.api.ApiRootUrl + 'geocode/regeo', {longitude: res.longitude, latitude: res.latitude }, 'POST').then(res => {
                if (res.status) {
					resData = res.data;
                    resolve(res.data)
                } else {
                    uni.showToast({title: res.message, icon: 'none', duration: 1500})
                    reject(null)
                }
            }).catch(err => {
                reject(err)
            }).finally(()=>{
				if(resData){
					resolve(resData)
				}else{
					reject({});
				}
			})
        }).catch(err => {
            // TODO 只是测试代码、微信优化协议后在处理
            if (err.errno === 104) {
                uni.showToast({title: '未同意微信隐私保护协议，重新登陆下吧~', icon: 'none', duration: 2000});
            } else {
                uni.showToast({title: '定位失败~', icon: 'none', duration: 2000});
            }
            reject(err)
        })
    });
};

const colorHexRgb = function(color, toHex = false){
	if(toHex){
		color_arr = color.split(',');
		r = Math.max(0, Math.min(255, color_arr[0]));
		g = Math.max(0, Math.min(255, color_arr[1]));
		b = Math.max(0, Math.min(255, color_arr[2]));
		let hexColor = ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
		return "#" + hexColor;
	}else{
		var rgb = [];
		color = color.substr(1);
		
		if (color.length === 3) {
		    color = color.replace(/(.)/g, '$1$1');
		}
		color.replace(/../g, function (color_) {
		    rgb.push(parseInt(color_, 0x10));
		    return color_;
		});
		
		return 'rgb(' + rgb.join(',') + ')';
	}
	
}

// 跳转到App应用的权限页面
const gotoAppPermissionSetting = function() {
	if (uni.$store.state.platform == 'ios') {
		var UIApplication = plus.ios.import("UIApplication");
		var application2 = UIApplication.sharedApplication();
		var NSURL2 = plus.ios.import("NSURL");
		// var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");		
		var setting2 = NSURL2.URLWithString("app-settings:");
		application2.openURL(setting2);

		plus.ios.deleteObject(setting2);
		plus.ios.deleteObject(NSURL2);
		plus.ios.deleteObject(application2);
	} else {
		// console.log(plus.device.vendor);
		var Intent = plus.android.importClass("android.content.Intent");
		var Settings = plus.android.importClass("android.provider.Settings");
		var Uri = plus.android.importClass("android.net.Uri");
		var mainActivity = plus.android.runtimeMainActivity();
		var intent = new Intent();
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
		var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
		intent.setData(uri);
		mainActivity.startActivity(intent);
	}
}

const openMap = function(lng, lat, name, scale) {
	uni.openLocation({
		latitude: lat,
		longitude: lng,
		scale: scale,
		name: name,
		success: function() {
			console.log('openLocation success');
		},
		fail: function(err) {
			console.log('openLocation err', err);
		},
	});
}

const mpPay = function(timestamp, nonceStr, paysign, package_, callback, failCallback){
	// #ifdef H5
	jweixin.config({
		 debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		 appId: uni.$store.state.config?.app?.wechat?.mp?.appid, // 必填，公众号的唯一标识
		 timestamp: timestamp, // 必填，生成签名的时间戳
		 nonceStr: nonceStr, // 必填，生成签名的随机串
		 signature: paysign, // 必填，签名
		 jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
	});
	jweixin.ready(function() {
		jweixin.chooseWXPay({
		   timestamp: timestamp, // 时间戳
		   nonceStr: nonceStr, // 随机数
		   package: package_, //
		   signType: 'RSA',
		   paySign: paysign, // 签名
		   success: function(res) {
			   uni.startPullDownRefresh({});
			   callback && callback({status: 1, msg: '支付成功', res: res})
		   },
		   cancel: function() {
				uni.showToast({ title:'取消支付',  icon:'none' });
		   },
		   fail: function(res) {
			 failCallback && failCallback({status: 0, msg: '支付失败', res: res})
		   }
		 })
    });
	// #endif
};


const setH5WeixinShare = function(img, title, desc){
	// #ifdef H5
	if(uni.$store.state.h5_browser == 'wxclient'){
		const url = window.location.href;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'aggregate/config', {
			type: 'jssdk',
			url: url
		}, 'POST').then(function(res) {
			if(res.status){
				jweixin.config({
					debug: false,
					appId: res.data.appId, // 必填，公众号的唯一标识
					timestamp: res.data.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
					signature: res.data.signature, // 必填，签名
					jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的 JS 接口列表
				});
				
				jweixin.ready(() => {
					jweixin.updateAppMessageShareData({
						title: title,
						desc: desc, // 分享描述
						link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
						imgUrl: img, // 分享图标
						success: res => {
							console.log("res11: ", res);
						},
						fail: err => {
							console.error("err22: ", err);
						}
					}),
					jweixin.updateTimelineShareData({
						title: title, // 分享标题
						link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
						imgUrl: img, // 分享图标
						success: res => {
							console.log("res33: ", res);
						},
						fail: err => {
							console.error("err44: ", err);
						},
					})
				});
				jweixin.error((e) => {
					console.log(e, '失败信息')
				})
				
				
			}
		});
	}
	// #endif
}


const inviteUser = function(share_path,  share_title, share_scene, share_img){
	// #ifndef MP
	if(!share_scene || share_scene === ''){
		share_scene = 't=x';
	}
	if(!share_img || share_img === ''){
		share_img = uni.$store.state.config.img.default_share;
	}
	let _invite = (providerList) => {
	  let itemList = [];
	  providerList.forEach((v, k)=> {
		itemList.push(v.name)  
	  })
	  uni.showActionSheet({
		itemList: itemList,
		success: (res) => {	
		  // 0:微信  1：朋友圈  2：qq  3：微博  4：QQ空间
		  let provider = providerList[res.tapIndex].id;
		  let platform = 'weixin';
		  let scene = '';
		  
		  if (provider == 0) {
			scene = 'WXSceneSession';
		  } else if (provider == 1) {
			scene = 'WXSenceTimeline';
		  }
		  let type = 0;
		  if (provider == 2) {
			type = 2;
			platform = 'qq';
		  } else if (provider == 0) {
			if (uni.$store.state.config.app.wechat.mini.meta_appid) {
			  type = 5;
			}
		  } else if (provider == 1) {
			if (uni.$store.state.config.app.wechat.mini.meta_appid) {
			  type = 5;
			}
		  } else if (provider == 3) {
			platform = 'sinaweibo';
		  }
		  
		  let share_scene_ = '?fph=1&' + share_scene + '&from_user=' + uni.$store.state.userInfo.id + '&tenant=' + that.global__tenant__?.tenant_id;
	  
		  let shareGoodObj = {
			'provider': platform,
			'type': type,
			'title': share_title,
			'scene': scene,
			'imageUrl': share_img,
			'href': uni.$store.state.config.h5.home + '/#'+ share_path + share_scene_,
			'summary': share_title,
			'miniProgram': {
			  'id': uni.$store.state.config.app?.wechat?.mini?.meta_appid,
			  'path': share_path + share_scene_,
			  'type': 0,
			  'webUrl': uni.$store.state.config.h5.home + '/#'+ share_path + share_scene_,
			},
			
			success: function (res) {
			  console.log("success:" + JSON.stringify(res));
	  
			},
			fail: function (err) {
			  console.log("fail:" + JSON.stringify(err));
			  uni.wen.util.log(JSON.stringify(err));
			}
		  };
		  uni.share(shareGoodObj);
	  
		},
			fail(err) {
				console.log('-----')
			}
	  });
	};
	
	
	let providerList = [];
	 uni.getProvider({
		service: 'share',
		success: function (res) {
			if(res.provider){
				res.provider.forEach((v, k)=>{
					if(v == 'weixin'){
						providerList.push({
						  name: '微信好友',
						  id: 0
						});
						providerList.push({
						  name: '朋友圈',
						  id: 1
						});
					}else if(v == 'qq'){
						providerList.push({
						  name: 'QQ',
						  id: 2
						});
					}else if(v == 'sinaweibo'){
						providerList.push({
						  name: '微博',
						  id: 3
						});
					}
				})
				
				_invite(providerList);
				
			}else{
				uni.showToast({
					title: '分享服务商为空',
					icon: 'none'
				});
				return false;
			}
		}
	});
	// #endif
}


module.exports = {
  checkMpPermission,
  checkAppPermission,
  request,
  uploadFile,
  getNewToken,
  checkSession,
  login,
  getUserInfo,
  loginNow,
  getNumbers,
  setClipboardData,
  htmlEncodeByRegExp,
  htmlDecodeByRegExp,
  awakenQQ,
  removeStyles,
  textRaw,
  scanCodeMethods,
  parseUrlQuery,
  toMpWeixin,
  updateUserInfo,
  pointGridCode,
  log,
  deepClone,
  validatePhoneNumber,
  hostVersionSupport,
  openOrDownloadApp,
  doVibrateShort,
  getLocation,
  getGeocoder,
  colorHexRgb,
  gotoAppPermissionSetting,
  callPhone,
  openMap,
  setH5WeixinShare,
  inviteUser,
  mpPay
}
