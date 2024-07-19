const api = require('@/config/api')
const util = require('@/utils/util')

uni.wen = {}
uni.wen.api = api
uni.wen.util = util
uni.wen.toUrl = function (type, id, that) {
  that = that || undefined

  if (type === undefined) {
    // uni.showToast({ title: "链接错误", icon: 'none' })
    return
  } else if (type == -1 || type == '-1') {
    // 返回首页
    uni.reLaunch({ url: '/pages/tabbar/index/index' })
  } else if (type == -2 || type == '-2') {
    // 返回
    if (uni.$store.state.pre_scene === 0) {
      uni.reLaunch({
        url: '/pages/tabbar/index/index'
      })
    } else {
      uni.navigateBack({
        fail: function () {
          uni.reLaunch({
            url: '/pages/tabbar/index/index'
          })
        }
      })
    }
  } else if (type == -3 || type == '-3') {
    uni.switchTab({
      url: '/pages/tabbar/mine/mine'
    })
  } else if (type == -4 || type == '-4') {
    // 登录
    if (uni.$store.state.token) {
    } else {
      if (uni.$store.state.scene == 14) {
        return false
      }
      if (that) {
        that.myToast({
          closeAll: 1
        })
      }
      if (
        uni.$store.state.config.user &&
        uni.$store.state.config.user.login_style
      ) {
        // #ifdef APP
        if (
          uni.$store.state.platform == 'ios' &&
          uni.$store.state.config.app.mode == 'examine'
        ) {
          uni.navigateTo({
            url: '/pages/common/phone'
          })
          return false
        }
        // #endif

        if (uni.$store.state.ipad) {
          if (uni.$store.state.scene == 76) {
            return
          }
          uni.navigateTo({
            url: '/pages/common/phone'
          })
          return false
        }

        if (
          uni.$store.state.config.user.login_style.includes(0) ||
          uni.$store.state.config.user.login_style.includes(1) ||
          uni.$store.state.config.user.login_style.includes(3)
        ) {
          uni.navigateTo({
            // url: '/pagesF/index/index',
            url: '/pagesF/index/index'
          })
        } else {
          if (uni.$store.state.scene == 76) {
            return
          }
          uni.navigateTo({
            url: '/pages/common/phone'
          })
        }
      } else {
        // #ifdef APP
        if (uni.$store.state.platform == 'ios') {
          if (uni.$store.state.scene == 76) {
            return
          }
          uni.navigateTo({
            url: '/pages/common/phone'
          })
          return false
        }
        // #endif

        uni.navigateTo({
          url: '/pagesF/index/index'
        })
      }
      return
    }
  } else if (type == '0' || type == 0) {
    // 链接类型
    // #ifdef MP
    util.setClipboardData(id, '链接已复制')
    // #endif
    // #ifdef APP
    plus.runtime.openURL(id)
    // #endif
    // #ifdef H5
    window.open(id)
    // #endif
  } else if (type == '1' || type == 1) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_1
    ) {
      uni.navigateTo({
        url: '/pages/sticky/sticky?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_1,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/sticky/sticky?id=' + id
      })
    }
  } else if (type == '2' || type == 2) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_2
    ) {
      uni.navigateTo({
        url: '/pages/circle/list?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_2,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/circle/list?id=' + id
      })
    }
  } else if (type == '3' || type == 3) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_3
    ) {
      uni.navigateTo({
        url: '/pagesA/shop/goods-details/goods-details?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_3,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pagesA/shop/goods-details/goods-details?id=' + id
      })
    }
  } else if (type == '4' || type == 4) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_4
    ) {
      uni.navigateTo({
        url: '/pages/user/user?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_4,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/user/user?id=' + id
      })
    }
  } else if (type == '5' || type == 5) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_5
    ) {
      uni.navigateTo({
        url: '/pages/tags/tags?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_5,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/tags/tags?id=' + id
      })
    }
  } else if (type == '6' || type == 6) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_6
    ) {
      if (id && id.indexOf('/pages') === 0) {
        uni.navigateTo({
          url: id,
          animationType: uni.$store.state.config.page.animation.animation_6,
          animationDuration: 250,
          fail: function () {
            if (id && id.indexOf('/pages/tabbar/') === 0) {
              uni.switchTab({
                url: id,
                fail: function () {
                  id = id.replace('/tabbar/', '/tabbar_clone/')
                  uni.navigateTo({
                    url: id,
                    fail: function () {
                      uni.switchTab({ url: id })
                    }
                  })
                }
              })
            } else {
              if (id == '/pagesA/creat/index/creat') {
                uni.navigateTo({
                  url: '/pages/creat/index/creat'
                })
                return false
              }
            }
            uni.switchTab({ url: id })
          }
        })
      } else {
        if (id && id.indexOf('plugin://') === 0) {
          // #ifdef MP-WEIXIN
          wx.navigateTo({
            url: id
          })
          return false
          // #endif
          // #ifndef MP-WEIXIN
          util.toMpWeixin(
            uni.$store.state.config.app.wechat.mini.appid,
            uni.$store.state.config.app.wechat.mini.meta_appid,
            '/pages/tabbar/index/index?direct=' +
              encodeURIComponent('type=6&id=' + id)
          )
          return false
          // #endif
        }

        uni.showToast({ title: '路径错误', icon: 'none' })
      }
    } else {
      if (id && id.indexOf('/pages') === 0) {
        uni.navigateTo({
          url: id,
          fail: function () {
            if (id && id.indexOf('/pages/tabbar/') === 0) {
              uni.switchTab({
                url: id,
                fail: function () {
                  id = id.replace('/tabbar/', '/tabbar_clone/')
                  uni.navigateTo({
                    url: id,
                    fail: function () {
                      uni.switchTab({ url: id })
                    }
                  })
                }
              })
            } else {
              if (id == '/pagesA/creat/index/creat') {
                uni.navigateTo({
                  url: '/pages/creat/index/creat'
                })
                return false
              }
            }
            uni.switchTab({ url: id })
          }
        })
      } else {
        // #ifdef MP-WEIXIN
        if (id && id.indexOf('plugin://') === 0) {
          wx.navigateTo({
            url: id
          })
          return false
        }
        // #endif
        uni.showToast({ title: '路径错误', icon: 'none' })
      }
    }
  } else if (type == '-6' || type == -6) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_6
    ) {
      if (id && id.indexOf('/pages') === 0) {
        uni.redirectTo({
          url: id,
          animationType: uni.$store.state.config.page.animation.animation_6,
          animationDuration: 250,
          fail: function () {
            if (id && id.indexOf('/pages/tabbar/') === 0) {
              uni.switchTab({
                url: id,
                fail: function () {
                  id = id.replace('/tabbar/', '/tabbar_clone/')
                  uni.redirectTo({
                    url: id,
                    fail: function () {
                      uni.switchTab({ url: id })
                    }
                  })
                }
              })
            } else {
              if (id == '/pagesA/creat/index/creat') {
                uni.redirectTo({
                  url: '/pages/creat/index/creat'
                })
                return false
              }
            }
            uni.switchTab({ url: id })
          }
        })
      } else {
        if (id && id.indexOf('plugin://') === 0) {
          // #ifdef MP-WEIXIN
          wx.redirectTo({
            url: id
          })
          return false
          // #endif
          // #ifndef MP-WEIXIN
          util.toMpWeixin(
            uni.$store.state.config.app.wechat.mini.appid,
            uni.$store.state.config.app.wechat.mini.meta_appid,
            '/pages/tabbar/index/index?direct=' +
              encodeURIComponent('type=6&id=' + id)
          )
          return false
          // #endif
        }

        uni.showToast({ title: '路径错误', icon: 'none' })
      }
    } else {
      if (id && id.indexOf('/pages') === 0) {
        uni.redirectTo({
          url: id,
          fail: function () {
            if (id && id.indexOf('/pages/tabbar/') === 0) {
              uni.switchTab({
                url: id,
                fail: function () {
                  id = id.replace('/tabbar/', '/tabbar_clone/')
                  uni.redirectTo({
                    url: id,
                    fail: function () {
                      uni.switchTab({ url: id })
                    }
                  })
                }
              })
            } else {
              if (id == '/pagesA/creat/index/creat') {
                uni.redirectTo({
                  url: '/pages/creat/index/creat'
                })
                return false
              }
            }
            uni.switchTab({ url: id })
          }
        })
      } else {
        // #ifdef MP-WEIXIN
        if (id && id.indexOf('plugin://') === 0) {
          wx.redirectTo({
            url: id
          })
          return false
        }
        // #endif
        uni.showToast({ title: '路径错误', icon: 'none' })
      }
    }
  } else if (type == '7' || type == 7) {
    if (!id || id == '' || id == undefined) {
      id = 0
    }
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_7
    ) {
      uni.navigateTo({
        url: '/pagesA/shop/list/list?cid=' + id,
        animationType: uni.$store.state.config.page.animation.animation_7,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pagesA/shop/list/list?cid=' + id
      })
    }
  } else if (type == '8' || type == 8) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_8
    ) {
      uni.navigateTo({
        url: '/pages/help/helpDetail/helpDetail?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_8,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/help/helpDetail/helpDetail?id=' + id
      })
    }
  } else if (type == '9' || type == 9) {
    if (id === 1) {
      util.scanCodeMethods(true, that)
    } else {
      util.scanCodeMethods(false, that)
    }
  } else if (type == '10' || type == 10) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_10
    ) {
      uni.navigateTo({
        url: '/pages/web-view/index?url=' + encodeURIComponent(id),
        animationType: uni.$store.state.config.page.animation.animation_10,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/web-view/index?url=' + encodeURIComponent(id)
      })
    }
  } else if (type == '11' || type == 11) {
    let id_arr = id.split('|')
    if ((id_arr.length = 3)) {
      util.toMpWeixin(id_arr[0], id_arr[1], id_arr[2])
    } else {
      util.toMpWeixin(id_arr[0], id_arr[1], '')
    }
  } else if (type == '12' || type == 12) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_12
    ) {
      uni.navigateTo({
        url: '/pagesA/mine/qrcode/qrcode?user_id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_12,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pagesA/mine/qrcode/qrcode?user_id=' + id
      })
    }
  } else if (type == '13' || type == 13) {
    if (id) {
      var left = id.indexOf('(')
      var right = id.indexOf(')')
      var para_length = right - left - 1
      var function_name = id.substr(0, left).trim()
      var para_str = id.substr(left + 1, para_length)
      if (para_str.indexOf(',') === -1) {
        if (function_name == 'flushPlateContent' && that) {
          that.flushPlateContent(para_str)
        }
      } else {
        var para_arr = para_str.split(',')
        var new_para_arr = []
        for (var p in para_arr) {
          new_para_arr.push(para_arr[p].trim())
        }
        // 暂时没有相关函数
      }
    } else {
      uni.showToast({
        title: '缺少参数',
        icon: 'none'
      })
    }
  } else if (type == '14' || type == 14) {
    // 视频号主页
    if (id) {
      // #ifdef MP-WEIXIN
      // 视频号-视频
      wx.openChannelsUserProfile({
        finderUserName: id
      })
      // #endif
      // #ifndef MP-WEIXIN
      util.toMpWeixin(
        uni.$store.state.config.app.wechat.mini.appid,
        uni.$store.state.config.app.wechat.mini.meta_appid,
        '/pages/tabbar/index/index?direct=' +
          encodeURIComponent('type=14&id=' + id)
      )
      // #endif
    }
  } else if (type == '15' || type == 15) {
    if (id) {
      // #ifdef MP-WEIXIN
      // 视频号-视频
      let id_arr = id.split('|')
      wx.openChannelsActivity({
        finderUserName: id_arr[0],
        feedId: id_arr[1]
      })
      // #endif
      // #ifndef MP-WEIXIN
      util.toMpWeixin(
        uni.$store.state.config.app.wechat.mini.appid,
        uni.$store.state.config.app.wechat.mini.meta_appid,
        '/pages/tabbar/index/index?direct=' +
          encodeURIComponent('type=15&id=' + id)
      )
      // #endif
    }
  } else if (type == '16' || type == 16) {
    // 视频号-直播
    if (id) {
      // #ifdef MP-WEIXIN
      wx.openChannelsLive({
        finderUserName: id
      })
      // #endif
      // #ifndef MP-WEIXIN
      util.toMpWeixin(
        uni.$store.state.config.app.wechat.mini.appid,
        uni.$store.state.config.app.wechat.mini.meta_appid,
        '/pages/tabbar/index/index?direct=' +
          encodeURIComponent('type=16&id=' + id)
      )
      // #endif
    }
  } else if (type == '17' || type == 17) {
    util.setClipboardData(id, '内容已复制')
  } else if (type == '18' || type == 18) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_18
    ) {
      uni.navigateTo({
        url: '/pages/message/detail/detail?userid=' + id,
        animationType: uni.$store.state.config.page.animation.animation_18,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/message/detail/detail?userid=' + id
      })
    }
  } else if (type == '19' || type == 19) {
    if (id) {
      // 视频号-视频

      // #ifdef MP-WEIXIN
      let id_arr = id.split('|')
      wx.openEmbeddedMiniProgram({
        appId: id_arr[0],
        path: id_arr[1]
      })
      // #endif
      // #ifndef MP-WEIXIN
      util.toMpWeixin(
        uni.$store.state.config.app.wechat.mini.appid,
        uni.$store.state.config.app.wechat.mini.meta_appid,
        '/pages/tabbar/index/index?direct=' +
          encodeURIComponent('type=19&id=' + id)
      )
      // #endif
    }
  } else if (type == '20' || type == 20) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_20
    ) {
      uni.navigateTo({
        url: '/pages/wallpaper/detail?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_20,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/wallpaper/detail?id=' + id
      })
    }
  } else if (type == '21' || type == 21) {
    if (
      uni.$store.state.config.page.animation &&
      uni.$store.state.config.page.animation.animation_21
    ) {
      uni.navigateTo({
        url: '/pages/wallpaper/list?id=' + id,
        animationType: uni.$store.state.config.page.animation.animation_21,
        animationDuration: 250
      })
    } else {
      uni.navigateTo({
        url: '/pages/wallpaper/list?id=' + id
      })
    }
  } else if (type == '22' || type == 22) {
    util.callPhone(id, that)
  } else if (type == '23' || type == 23) {
    // uni.openEmail({
    // 	to: [emailAddress],
    // 	subject: '邮件主题',
    // 	body: '邮件正文',
    // 	cc: [], // 抄送人邮箱地址列表，可省略
    // 	bcc: [] // 密送人邮箱地址列表，可省略
    // });
  } else if (type == '24' || type == 24) {
    if (that) {
      that.myToast({
        type: 'popImg',
        timeout: 2000,
        img: id,
        isClick: true,
        mask: 1
      })
      return false
    } else if (
      uni.$store.state.$vm &&
      uni.$store.state.$vm.page__scene__ == uni.$store.state.scene
    ) {
      uni.$store.state.$vm.myToast({
        type: 'popImg',
        timeout: 2000,
        img: id,
        isClick: true,
        mask: 1
      })
      return false
    } else {
      let pages = getCurrentPages()
      //这句话 获取的才是当前页面实例
      let currentPage = pages[pages.length - 1]
      if (currentPage == undefined) {
        return
      }
      // #ifdef MP
      currentPage = currentPage.$vm
      // #endif

      if (currentPage) {
        uni.$store.commit('vm', currentPage)
      }

      currentPage.myToast({
        type: 'popImg',
        timeout: 2000,
        img: id,
        isClick: true,
        mask: 1
      })
      return false
    }
  } else if (type == '25' || type == 25) {
    uni.showToast({
      title: id,
      icon: 'none'
    })
  } else if (type == '26' || type == 26) {
    uni.previewImage({
      urls: [id],
      current: 0
    })
  } else if (type == '27' || type == 27) {
    let id_arr = id.split('|')
    // #ifdef APP
    let wechat = null
    plus.share.getServices(
      res => {
        wechat = res.find(i => i.id === 'weixin')
        if (wechat) {
          wechat.openCustomerServiceChat(
            {
              corpid: id_arr[0], //企业ID
              url: id_arr[1] //客服地址
            },
            src => {
              console.log('success:', JSON.stringify(src))
            },
            err => {
              console.log('error:', JSON.stringify(err))
            }
          )
        } else {
          uni.showToast({
            title: '当前环境不支持微信操作',
            icon: 'error'
          })
        }
      },
      function () {
        uni.showToast({
          title: '获取服务失败，不支持该操作。' + JSON.stringify(e),
          icon: 'none'
        })
      }
    )
    // #endif
  } else if (type == '28' || type == 28) {
    uni.navigateTo({
      url: '/pagesU/used-mall/detail/index?id=' + id
    })
  } else if (type == '29' || type == 29) {
    uni.showToast({
      title: '开发中',
      icon: 'none'
    })
  } else if (type == '30' || type == 30) {
    let id_arr = id.split('|')
    util.openMap(
      parseFloat(id_arr[0]),
      parseFloat(id_arr[1]),
      id_arr[2],
      parseInt(id_arr[3])
    )
  } else if (type == '31' || type == 31) {
    if (id) {
      if (id.indexOf('|') > 0) {
        let id_arr = id.split('|')
        if (that) {
          that.myToast({
            type: 'popImg',
            timeout: 2000,
            img: id_arr[0],
            isClick: true,
            target_type: id_arr[1],
            target_id: id_arr[2],
            mask: 1
          })
          return false
        } else if (
          uni.$store.state.$vm &&
          uni.$store.state.$vm.page__scene__ == uni.$store.state.scene
        ) {
          uni.$store.state.$vm.myToast({
            type: 'popImg',
            timeout: 2000,
            img: id_arr[0],
            isClick: true,
            target_type: id_arr[1],
            target_id: id_arr[2],
            mask: 1
          })
          return false
        } else {
          let pages = getCurrentPages()
          //这句话 获取的才是当前页面实例
          let currentPage = pages[pages.length - 1]
          if (currentPage == undefined) {
            return
          }
          // #ifdef MP
          currentPage = currentPage.$vm
          // #endif
          if (currentPage) {
            uni.$store.commit('vm', currentPage)
          }

          currentPage.myToast({
            type: 'popImg',
            timeout: 2000,
            img: id_arr[0],
            isClick: true,
            target_type: id_arr[1],
            target_id: id_arr[2],
            mask: 1
          })
          return false
        }
      } else {
        util
          .request(api.ApiRootUrl + 'common/getIcon', {
            id: id
          })
          .then(function (res) {
            if (res.status) {
              if (that) {
                that.myToast({
                  type: 'popImg',
                  timeout: 2000,
                  img: res.data.img,
                  isClick: true,
                  target_type: res.data.type,
                  target_id: res.data.target_id,
                  mask: 1
                })
                return false
              } else if (
                uni.$store.state.$vm &&
                uni.$store.state.$vm.page__scene__ == uni.$store.state.scene
              ) {
                uni.$store.state.$vm.myToast({
                  type: 'popImg',
                  timeout: 2000,
                  img: res.data.img,
                  isClick: true,
                  target_type: res.data.type,
                  target_id: res.data.target_id,
                  mask: 1
                })
                return false
              } else {
                let pages = getCurrentPages()
                //这句话 获取的才是当前页面实例
                let currentPage = pages[pages.length - 1]
                if (currentPage == undefined) {
                  return
                }
                // #ifdef MP
                currentPage = currentPage.$vm
                // #endif

                if (currentPage) {
                  uni.$store.commit('vm', currentPage)
                }

                currentPage.myToast({
                  type: 'popImg',
                  timeout: 2000,
                  img: res.data.img,
                  isClick: true,
                  target_type: res.data.type,
                  target_id: res.data.target_id,
                  mask: 1
                })
                return false
              }
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
      }
    }
  } else if (type == '32' || type == 32) {
    uni.navigateTo({
      url: '/pagesA/shop/shop/shop?id=' + id
    })
  } else if (type == '33' || type == 33) {
    uni.navigateTo({
      url: '/pagesV/voter/detail/detail?id=' + id
    })
  } else if (type == '34' || type == 34) {
    uni.navigateTo({
      url: '/pagesZ/organize-bureau/details/index?id=' + id
    })
  } else if (type == '35' || type == 35) {
    uni.navigateTo({
      url: '/pagesZ/organize-bureau/club/club?id=' + id
    })
  } else if (type == '36' || type == 36) {
    let id_arr = id.split('|')
    uni.showModal({
      title: id_arr[0],
      content: id_arr[1],
      showCancel: true,
      confirmText: id_arr[2],
      confirmColor: '#ff2442',
      success(res2) {
        if (res2.confirm) {
          uni.wen.toUrl(id_arr[3], id_arr[4], that)
        }
      }
    })
  }
}

uni.loading = function (flag) {
  if (flag) {
    try {
      if (uni.$store.state.$vm) {
        uni.$store.state.$vm.myToast({
          type: 'miniloading',
          timeout: 2000,
          isClick: true,
          mask: 3,
          uuid: 'miniloading-xxxx'
        })
        return false
      } else {
        let pages = getCurrentPages()
        //这句话 获取的才是当前页面实例
        let currentPage = pages[pages.length - 1]
        if (currentPage == undefined) {
          return
        }
        // #ifdef MP
        currentPage = currentPage.$vm
        // #endif

        if (currentPage) {
          uni.$store.commit('vm', currentPage)
        }

        currentPage.myToast({
          type: 'miniloading',
          timeout: 2000,
          isClick: true,
          mask: 3,
          uuid: 'miniloading-xxxx'
        })
        return false
      }
    } catch (err) {
      uni.showLoading()
    }
  } else {
    uni.hideLoading()
    try {
      if (uni.$store.state.$vm) {
        uni.$store.state.$vm.myToast({
          close: 1,
          uuid: 'miniloading-xxxx'
        })
        return false
      } else {
        let pages = getCurrentPages()
        //这句话 获取的才是当前页面实例
        let currentPage = pages[pages.length - 1]
        if (currentPage == undefined) {
          return
        }
        // #ifdef MP
        currentPage = currentPage.$vm
        // #endif

        if (currentPage) {
          uni.$store.commit('vm', currentPage)
        }

        currentPage.myToast({
          close: 1,
          uuid: 'miniloading-xxxx'
        })
        return false
      }
    } catch (err) {
      uni.hideLoading()
    }
  }
}

uni.wen.px2rpx = function (num) {
  return (num * 750) / uni.$store.state.windowWidth
}

// #ifdef MP-WEIXIN
wx.tabBarSetData = function (obj) {
  let pages = getCurrentPages()
  //这句话 获取的才是当前页面实例
  let currentPage = pages[pages.length - 1]
  if (currentPage == undefined) {
    return
  }
  currentPage = currentPage.$vm
  currentPage.tabBarSetData(obj)
}
// #endif
