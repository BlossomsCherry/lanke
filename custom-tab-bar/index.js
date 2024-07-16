var app = getApp()

Component({
  data: {
    selected: 0,
    sysMessageCount: 0,
    color: '#949494',
    selectColor: '#333333',
    fontWeight: 'bold',
    background: '#ffffff;',
    showPopup: false,
    list: [
      {
        pagePath: '/pages/tabbar/index/index',
        text: '',
        iconPath: '/static/tabbar/11.png',
        selectedIconPath: '/static/tabbar/1.png'
      },
      {
        pagePath: '/pages/tabbar/bureau/bureau',
        text: '',
        iconPath: '/static/tabbar/22.png',
        selectedIconPath: '/static/tabbar/2.png'
      },
      {
        pagePath: '/pages/tabbar/add/add',
        text: '',
        iconPath: '/static/tabbar/33.png',
        selectedIconPath: '/static/tabbar/3.png'
      },
      {
        pagePath: '/pages/tabbar/notice/notice',
        text: '',
        iconPath: '/static/tabbar/44.png',
        selectedIconPath: '/static/tabbar/4.png'
      },
      {
        pagePath: '/pages/tabbar/mine/mine',
        text: '',
        iconPath: '/static/tabbar/55.png',
        selectedIconPath: '/static/tabbar/5.png'
      }
    ],
    popupTip: '',
    popupStyle: {
      bgcolor: '#ffffff',
      itemBgcolor: '#f5f5f5',
      fontColor: '#000000'
    },
    popup: {
      tip: {
        login: '',
        nologin: ''
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
  attached: function () {},
  methods: {
    miniMoveHandle() {},
    shutPopup: function () {
      app.globalData.$mpTabbar.setData({
        showPopup: false
      })
    },
    navigateTo: function (e) {
      app.globalData.$mpTabbar.setData({
        showPopup: false
      })
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url,
        fail() {
          if (url == '/pagesA/creat/index/creat') {
            wx.navigateTo({
              url: '/pages/creat/index/creat'
            })
          }
        }
      })
    },
    switchTab: function (e) {
      // 短震动骚操作
      wx.vibrateShort()

      let index = e.currentTarget.dataset.index
      let url = e.currentTarget.dataset.url

      if (this.data.list[index].isSpecial) {
        if (
          app.globalData.popup &&
          app.globalData.popup.tip &&
          app.globalData.popup.tip.login &&
          app.globalData.popup.tip.login.length > 0
        ) {
          if (
            app.globalData.user_created_at &&
            app.globalData.user_created_at.length > 0
          ) {
            var now = new Date()
            var targetDate = new Date(app.globalData.user_created_at)
            var timeDiff = now.getTime() - targetDate.getTime()
            var daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

            app.globalData.$mpTabbar.setData({
              popup: app.globalData.popup,
              showPopup: true,
              popupTip: app.globalData.popup.tip.login.replace(
                '[in_days]',
                daysDiff
              )
            })
          } else {
            app.globalData.$mpTabbar.setData({
              popup: app.globalData.popup,
              showPopup: true,
              popupTip: app.globalData.popup.tip.nologin
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/creat/index/creat'
          })
        }
      } else {
        wx.switchTab({
          url
        })
      }
    }
  }
})
