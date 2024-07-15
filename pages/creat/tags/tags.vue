<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <view class="container" style="padding-bottom: 160px">
        <view class="searchBar">
          <view class="tit_seabox_bar">
            <input @confirm="searchTag" placeholder="请添加话题" placeholderStyle="color: #ccc;" type="text" @input="addtag" :value="searchStr" class="_input"/>
            <icon @tap.stop.prevent="activityClear" size="28rpx" type="clear" v-if="searchStr"></icon>
          </view>
          <view @tap.stop.prevent="searchTag" class="activity_seabtn">添加</view>
        </view>
        <view class="no_topic" :data-select="false">推荐话题</view>
        <view @tap.stop.prevent="addTags" :data-name="item.tags_name" :data-id="item.id" class="topic" v-for="(item, index) in tags" :key="index">
          <view class="left">
            <view class="avatar">
              <image :src="item.head_portrait" mode=""></image>
            </view>
            <view class="tag_name">{{ item.tags_name }}</view>
          </view>
          <view class="right">
            <block v-if="item.degree && item.degree > 0">
              <i class="mini-icon mini-arrowTop" style="color: #488ccb;" v-if="item.is_hot"></i>
              {{ filters.toFix(item.degree) }}热度
            </block>
            <block v-else>
              {{ filters.toFix(item.tags_number) }}篇笔记
            </block>
          </view>
          <!-- <view class="sub">{{ item.tags_number }} 篇笔记</view> -->
        </view>
        <u-empty v-if="!isNull" text="一个话题也没有" width="300" height="300" text-size="28"/>
      </view>

      <view class="btnbottom">
        <view class="address-tag-all-view">
          <view @tap.stop.prevent="toSliderUrl(5, tag.id)" class="tag-view" v-for="(tag, index) in userSelectedTags" :key="index">
            <text class="tag-text"># {{ tag.tags_name }}</text>
			<i @tap.stop.prevent="removeTag(tag.id)" class="audio-delete mini-icon mini-chacha"></i>
          </view>
        </view>
        <button @tap.stop.prevent="save" class="issue" hoverClass="primary-button-hover" type="primaryOrange">确定</button>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	
const common = require('@/mixins/forum');
// 防抖
let debounce = null;
var options = {};
common(options);
export default {
  mixins: [{ methods: options }],
  components: {
  	myToast,navBar,hoverBall,
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 23,
      page: 1,
      isNull: true,
      tags: [],
      userSelectedTags: [],
      searchStr: '',

      tag: {
        tags_name: '',
        id: ''
      }
    };
  }
  /**
   * 生命周期函数--监听页面加载
   */,
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.getTagList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(23, 0);

    let userSelectedTags = uni.getStorageSync('userSelectedTags');

    if (userSelectedTags.length <= 0) {
      uni.setStorageSync('userSelectedTags', this.userSelectedTags);
    } else {
      this.setData({
        userSelectedTags: userSelectedTags
      });
    }
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    addtag: function (e) {
      let that = this;
      that.setData({
        searchStr: e.detail.value
      });

      if (debounce !== null) {
        clearTimeout(debounce);
      }
      debounce = setTimeout(() => {
        that.getTagList();
      }, 150);
    },

    /**
     * 添加话题
     * */
    searchTag: function () {
      let that = this;
      let userSelectedTags = uni.getStorageSync('userSelectedTags');

      if (userSelectedTags.length > 8) {
        uni.showToast({
          title: '最多只能添加8个话题',
          icon: 'none'
        });
        return;
      }

      if (that.searchStr.length > 20) {
        uni.showToast({
          title: '话题应小于20个字',
          icon: 'none'
        });
        return;
      }

      that.getAddTagList(that.searchStr);
    },

    addTags: function (e) {
      let that = this;
      let userSelectedTags = uni.getStorageSync('userSelectedTags');
      let id = e.currentTarget.dataset.id;
      let name = e.currentTarget.dataset.name;
      let readsave = true; // 过滤重复值

      if (userSelectedTags.length > 0) {
        for (let i = 0; i < userSelectedTags.length; i++) {
          if (userSelectedTags[i].id == id) {
            readsave = false;
            uni.showToast({
              title: '您已经添加过该话题了',
              icon: 'none'
            });
            break;
          }
        }
      }

      if (readsave) {
        let args = {};
        args.id = id;
        args.tags_name = name;
        userSelectedTags.unshift(args);
        uni.setStorageSync('userSelectedTags', userSelectedTags);
        that.setData({
          userSelectedTags: userSelectedTags,
		  searchStr: ''
        });
      }
    },

    /**
     * 删除话题
     */
    removeTag: function (id) {
      let that = this;
      let list = uni.getStorageSync('userSelectedTags');

      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1);
        }
      }

      uni.setStorageSync('userSelectedTags', list);
      that.setData({
        userSelectedTags: list
      });
    },

    activityClear: function () {
      this.setData({
        searchStr: ''
      });
    },

    save() {
      uni.wen.toUrl(-2, 0, null);
    },


  }
};
</script>
<style lang="scss">
@import './tags.scss';
</style>
