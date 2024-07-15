<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <navBar :back="true" title="选择我的分区" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
        <!-- #ifndef MP -->
        <view class="right" slot="right">
          <view class="box-top-etn" @tap.stop.prevent="parseEventDynamicCode($event, delSta == 0 ? 'bteTap' : 'yesTap')">{{ delSta == 0 ? '编辑' : '完成' }}</view>
        </view>
        <!-- #endif -->

      </navBar>
      <view class="box">
        <view class="box-top">
          <view class="box-top-title">
            我的分区
            <view class="des">随心所欲</view>
          </view>
          <!-- #ifdef MP -->
          <view class="box-top-etn" @tap.stop.prevent="parseEventDynamicCode($event, delSta == 0 ? 'bteTap' : 'yesTap')">{{ delSta == 0 ? '编辑' : '完成' }}</view>
          <!-- #endif -->
        </view>
        <view class="box-plate">
          <view :class="'box-plate-coent ' + (delSta == 0 ? '' : 'cor') + (delSta == 1 && item.plate_id > 0 ? ' shock' : '')" v-for="(item, index) in config_page_index_tab"
                :key="index">{{ item.plate_name }}
            <span @tap.stop.prevent="userPlateDelete(item.plate_id, index)" v-if="delSta == 1 && item.plate_id > 0" class="mini-icon audio-img color-danger">&#xe62f;</span>
          </view>
        </view>
      </view>
      <view class="box">
        <view class="box-top">
          <view class="box-top-title">
            全部分区
            <view class="des">添加自己喜欢的</view>
          </view>
        </view>
        <view class="box-plate">
          <block v-if="cats && cats.length > 0">
            <view class="box-plate-coent add" v-for="(item, index) in cats" :key="index">
              {{ item.plate_name }}
              <i class="mini-icon mini-jiahao- audio-img" @tap.stop.prevent="userPlateAdd" :data-id="item.id" :data-name="item.plate_name"></i>
            </view>
          </block>
          <block v-else>
            <view class="empty-wrap">
              <u-empty text="没有可以添加的" width="300" height="300" text-size="28"/>
            </view>
          </block>
        </view>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const common = require('@/mixins/common');

var options = {};
common(options);
export default {
  mixins: [{ methods: options }],
  components: {
  	myToast,navBar,hoverBall,
  },
  computed: {
    config_page_index_tab: {
      get() {
        let that = this;
        return that.$store.state.config.tab;
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 53,
      header: [],
      allcats: [],
      cats: [],
      page: 1,
      delSta: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.userPlate();
    that.geToptionsList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onNavigationBarButtonTap: function (e) {
    let that = this;
    // e的返回格式为json对象：{"text":"测试","index":0}
    // #ifdef APP
    if (e.index == 0) {
      that.bteTap();
      if (that.delSta == 0) {
        setTimeout(function () {
          let pages = getCurrentPages();
          let currentPage = pages[pages.length - 1];
          currentPage.setTitleNViewButtonStyle(0, {
            text: "\ue66e",
            color: "#989898",
          });
        }, 100);

      } else {
        that.yesTap();
        setTimeout(function () {
          let pages = getCurrentPages();
          let currentPage = pages[pages.length - 1];
          currentPage.setTitleNViewButtonStyle(0, {
            text: "\ue66f",
            color: that.primaryColor
          });
        }, 100);
      }
    }
    // #endif
  },
  onShow: function () {
    let that = this;
    that.updateScene(53, 0, true);
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    cleanCats() {
      let that = this;
      let config_tab = that.$store.state.config.tab;
      let new_cats = [];
      if (config_tab && config_tab.length > 0) {
        if (that.allcats && that.allcats.length > 0) {
          for (var i = 0; i < that.allcats.length; i++) {
            let flag = true;
            for (var j = 0; j < config_tab.length; j++) {
              if (config_tab[j]['plate_name'] == that.allcats[i]['plate_name']) {
                flag = false;
              }
            }
            if (flag) {
              new_cats.push(that.allcats[i]);
            }
          }
        }
        that.setData({
          cats: new_cats
        });
      }
    },
    /**
     * 获取分区列表建圈用
     */
    geToptionsList() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/plate/options').then(function (res) {
        let args = {};
        args.allcats = res.data;
        args.hotload = false;
        that.setData(args);
        setTimeout(function () {
          that.cleanCats();
        }, 100);
      });
    },
    // 用户添加分区
    userPlateAdd(e) {
      let that = this;
      let plate_id = e.currentTarget.dataset.id;
      let plate_name = e.currentTarget.dataset.name;
      uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'user/plate/add', {
            plate_id: plate_id
          },
          'POST'
      ).then(function (res) {
        if (res.status) {
          let header = {};
          header.plate_id = plate_id;
          header.plate_name = plate_name;
          that.$store.dispatch('userAddPlateAction', [header]);
          setTimeout(function () {
            that.cleanCats();
          }, 100);
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    // 用户删除分区
    userPlateDelete(plate_id, index) {
      let that = this;
      uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'user/plate/delete', {
            plate_id: plate_id
          },
          'POST'
      ).then(function (res) {
        if (res.status) {
          that.$store.commit('userDeletePlate', index);
          setTimeout(function () {
            that.cleanCats();
          }, 100);
        } else {
          uni.showToast({
            title: '遇到了一个未知错误，请联系官方客服反馈！',
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    bteTap() {
      let that = this;
      that.setData({
        delSta: 1
      });
    },

    yesTap() {
      let that = this;
      that.setData({
        delSta: 0
      });
    },

  }
};
</script>
<style lang="scss">
@import './list.scss';
</style>
