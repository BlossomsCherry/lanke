<template>
  <view class="selectCity">

    <!--点击提示-->
    <view class="click_prompt" v-if="isLetter">
      <view class="click_prompt_text">{{ clickLetter }}</view>
    </view>

    <!--搜索框-->
    <view class="search" v-if="isSearch" id="search_box" :style="{top:`${titleBarHeight+statusBarHeight-1}px)`}">
      <view class="search_main">
        <u-search :placeholder="placeholderText" v-model="keyword" :showAction="false" @change="onSearch">
        </u-search>
      </view>
    </view>

    <!--搜索框塌陷处理-->
    <view style="width: 100%;background-color:#FFFFFF;height: 100rpx;" v-if="isSearch"></view>


    <!--城市列表-->
    <scroll-view class="cityList" :scroll-y="true" v-if="scrollShow" :scroll-into-view="scrollIntoView"
                 :enable-back-to-top="true" :style="{height:`${AvailableHeight-searchHeight-5}px`}"
                 :scroll-with-animation="true">
      <view class="cityItem" v-for="(item,key, index) in SortList" :key="index">
        <view class="cityName" :id="key=='#'?'special':key">{{ key }}</view>
        <view class="cityItemContent">
          <view class="cityItemContentItem" :class="[e_index===item.length?'':'baseline']"
                v-for="(element,e_index) in item" :key="e_index" @click="selectData(key,e_index)">

            <view v-if="isAvatar" class="cityItemContentItemAvatar">
              <image :src="element[avatarFieldName]"></image>
            </view>

            <view class="cityItemContentItemInfo" :style="isAvatar===true?'margin-left:20rpx':''">
              <view class="cityItemContentItemInfoName">{{ element[fieldName] }}</view>
              <view class="cityItemContentItemInfoText" v-if="isDeputy">{{ element[DeputyFieldName] }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!--索引-->
    <div class="index">
      <div class="indexItem" v-for="(item,index) in IndexList" :key="index" @click="scrollTo(item)">
        {{ item.firstletter }}
      </div>
    </div>

  </view>

</template>

<script>
/**
 * selectCity  城市/通讯录 选择器
 * @description 用于选择城市/通讯录 该组件功能完整，使用方便 可以直接返回选中数据
 * @property {String }  placeholderText    搜索框提示文字
 * @property {Array}    dataList      数据列表,数据格式
 * @property {String}   fieldName     数据列表中的字段名
 * @property {Boolean}  isSearch      是否需要搜索
 * @property {Boolean}  isDeputy      是否需要副标题
 * @property {String}   DeputyFieldName    副标题字段名
 * @property {Boolean}  isAvatar      是否需要头像
 * @property {String}   avatarFieldName    头像字段名

 * @event  event:selectChange   选中列表项时触发
 * @example    <selectCity placeholderText="请输入城市名称"></selectCity>
 */

import Match from './Match.js'

export default {
  name: "selectCity",
  data() {
    return {
      keyword: "", //搜索关键字
      Match: new Match(), //数据操作类
      SortList: {}, //排序后的数据
      IndexList: [], //索引列表
      titleBarHeight: 0, //标题栏高度
      statusBarHeight: 0, //状态栏高度
      searchHeight: 0, //搜索框高度
      scrollShow: false, //是否显示scroll-view
      AvailableHeight: '', //可用高度
      scrollIntoView: '', //scroll-view滚动到的位置
      clickLetter: 'A', //点击的字母
      isLetter: false, //是否点击了字母
    };
  },
  props: {
    placeholderText: {
      type: String,
      default: "无传参"
    },
    dataList: {
      type: Array,
      default: () => []
    },
    fieldName: {
      type: String,
      default: "name"
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    isDeputy: {
      type: Boolean,
      default: false
    },
    DeputyFieldName: {
      type: String,
      default: "position"
    },
    isAvatar: {
      type: Boolean,
      default: false
    },
    avatarFieldName: {
      type: String,
      default: "avatar"
    },
    isLocation: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    // 监听dataList变化，如果变化则去构建列表
    dataList: {
      handler(newName, oldName) {
        this.initIndex(newName)
      },
      immediate: true
    }
  },
  mounted() {
    this.styleInit()
    if (this.isLocation) {
      console.log('开始定位')
      this.getLocation()
    }
  },
  methods: {

    /**
     * @desc 初始化样式
     * @description 主要是获取页面元素高度，计算可用高度，方便scroll-view的高度设置
     * @return undifined
     */
    styleInit() {
      const that = this;
      if (this.isSearch) {
        let query = uni.createSelectorQuery().in(this);
        query.select('#search_box').boundingClientRect(data => {
          console.log(data)
          that.searchHeight = data.height
        }).exec();
      } else {
        this.searchHeight = 0
      }
      let menuButtonObject = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
      uni.getSystemInfo({ //获取系统信息
        success: res => {
          //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
          that.titleBarHeight = menuButtonObject.height + (menuButtonObject.top - res
              .statusBarHeight) * 2; //标题栏高度
          that.statusBarHeight = res.statusBarHeight //状态栏高度
        },
        fail(err) {
          console.log(err);
        }
      })
      this.AvailableHeight = uni.getSystemInfoSync().windowHeight - this.statusBarHeight - this.titleBarHeight -
          this.searchHeight
      this.scrollShow = true
    },

    /**
     * @desc 搜索框输入时触发
     * @description 搜索完成字段匹配
     * @return undifined
     */
    onSearch() {
      this.scrollShow = false
      console.log(this.keyword)
      if (this.keyword == '') {
        this.initIndex(this.dataList)
      } else {
        let list = []
        for (let key in this.SortList) {
          let arr = this.SortList[key].filter(item => {
            if (item[this.fieldName].indexOf(this.keyword) !== -1) {
              list.push(item)
            }
          })
        }
        this.initIndex(list)
      }
    },

    /**
     * @desc 初始化索引
     * @description 主要用于初始化索引
     * @param {Array} dataList 数据列表
     * @return undifined
     */
    initIndex(dataList) {
      this.SortList = {} //赋值前先清空
      let sort_list = {} //列表数据临时变量
      let UnSortList = [] //未排序的字母列表
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i]; //获取每一项数据
        let firstLetter = this.Match.getFirstLetter(element[this.fieldName]) //获取首字母
        let first = firstLetter.firstletter //首字母
        if (sort_list[first]) {
          sort_list[first].push(element) //如果已经存在该字母，则直接push
        } else {
          sort_list[first] = [element] //如果不存在该字母，则先创建一个数组，再push
        }
        UnSortList.push(firstLetter) //将首字母添加到未排序的字母列表中
      }
      this.SortList = sort_list //赋值给SortList
      this.AlphabeticSort(UnSortList) //对字母进行排序
    },

    /**
     * @desc 处理索引按字母重新排序
     * @description 按字母重新排序索引
     * @param {Array} list 未排序的索引列表
     * @return undefind
     */
    AlphabeticSort(list) {
      //去除对象中的重复项
      let result = [];
      let obj = {};
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i].firstletter]) {
          result.push(list[i]);
          obj[list[i].firstletter] = true;
        }
      }
      //按a-z排序 #放在最后
      result.sort(function (a, b) {
        if (a.firstletter == "#") {
          return 1;
        } else if (b.firstletter == "#") {
          return -1;
        } else {
          return a.firstletter.localeCompare(b.firstletter);
        }
      });
      this.IndexList = result
      this.allDataSort()
    },

    /**
     * @desc 列表数据按字母排序
     * @description 滚动到指定位置
     * @return undefind
     */
    allDataSort() {
      let SortList = {}
      for (let i = 0; i < this.IndexList.length; i++) {
        const element = this.IndexList[i];
        SortList[element.firstletter] = this.SortList[element.firstletter]
      }

      // console.dir(JSON.stringify(SortList))
      this.$set(this, 'SortList', SortList)
      // console.dir(JSON.stringify(this.SortList))
      this.scrollShow = true
      this.$forceUpdate()
    },

    /**
     * @desc 滚动到指定位置
     * @description 滚动到指定位置
     * @param {Object} item 索引列表中的某一项
     * @return undefind
     */
    scrollTo(item) {
      this.clickLetter = item.firstletter
      this.isLetter = true
      setTimeout(() => {
        this.isLetter = false
      }, 700);
      if (item.firstletter == '#') {
        this.scrollIntoView = 'special'
      } else {
        this.scrollIntoView = item.firstletter
      }
    },

    /**
     * @desc 选中某个城市
     * @description 选中列表中某个数据
     * @param {String} key 索引
     * @param {Object} item 索引列表中的某一项
     * @return undefind
     */
    selectData(key, item) {
      this.$emit("selectChange", this.SortList[key][item])
    },
  },
}
</script>

<style scoped lang="scss">
.selectCity {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .search {
    width: 100%;
    height: 100rpx;
    @include background_color(page-box-background-color);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 999;
    left: 0;
  }

  .search_main {
    width: 92%;
  }

  .index {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .indexItem {
      width: 100%;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: $uni-font-size-sm-base;
      @include color(color-lighter-dark);
    }
  }

  .cityList {
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);

    .cityName {
      width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 30rpx;
      text-align: left;
      font-size: $uni-font-size-base;
      @include color(color-lighter-dark);
      background-color: #f1f3f5;

    }

    .cityItemContent {
      width: 100%;
      box-sizing: border-box;
      padding: 0 30rpx;


      .baseline {
        border-bottom: 1px solid #f8f9fa;
      }

      .cityItemContentItem {
        width: 100%;
        display: flex;
        height: 120rpx;

        text-align: left;
        font-size: $uni-font-size-base;
        @include color(color-lighter-dark);
        @include background_color(page-box-background-color);

        .cityItemContentItemAvatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin: 20rpx 0;
          background-color: #f1f3f5;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .cityItemContentItemInfo {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .cityItemContentItemInfoName {
            font-size: $uni-font-size-base;
            color: #333;
          }

          .cityItemContentItemInfoText {
            font-size: $uni-font-size-sm;
            @include color(color-lighter-dark);
          }
        }
      }
    }
  }


  .click_prompt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200rpx;
    height: 200rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10rpx;
    z-index: 9999;

    .click_prompt_text {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 60rpx;
      font-weight: bold;
    }
  }
}
</style>
