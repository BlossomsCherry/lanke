<script>
import PetAdoptionHomeTabs from '@/pagesP/pet-adoption/index/home/components/pet-adoption-home-tabs.vue'
import PetAdoptionHomeGrid from '@/pagesP/pet-adoption/index/home/components/pet-adoption-home-grid.vue'
import PetAdoptionListItem from '@/pagesP/pet-adoption/components/pet-adoption-list-item.vue'

export default {
  components: { PetAdoptionListItem, PetAdoptionHomeGrid, PetAdoptionHomeTabs },
  data() {
    return {
      currentGeocoder: null, // 当前定位微信信息
      tabSwiperIdx: 0, // 当前Tab和Swiper的索引
      swiperHeight: 0, // 当前swiper高度
      tabList: [{ name: '全部', value: 0 }, { name: '猫咪', value: 1 }, { name: '狗狗', value: 2 }],
      bannerList: [], // 轮播图列表
      petList: [], // 宠物列表
      petListParams: {
        pageNo: 1,
        pageSize: 10,
        city: null,
        species: 0,
		keyword: '',
      },
	  index_config: {
		  banner: [],
		  notice: [],
		  nav: []
	  },
    }
  },
  computed:{
  	config_about_name:{
  		get(){
  			let that = this;
  			return that.$store.state.config.about.name;
  		},
  		set(v){}
  	},
  },
  created() {
	let that = this;
	that.config_data();
  },
  
  methods: {
    // 当列表高度改变时，通知页面的swiper同步更改高度
    contentHeightChanged(height) {
      const finalHeight = this.petList.length ? height : 0
      // 限制内容最小高度为屏幕可见高度减z-tabs高度。注意，页面中有使用slot="top"插入的view，则此处的minHeight还应该减去slot="top"插入的view的高度
      const minHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(80)
      // 默认swiper高度为屏幕可用高度-tabsView高度-slot="top"内view的高度
      let relaHeight = Math.max(finalHeight, minHeight)
      this.swiperHeight = relaHeight === 0 ? uni.getSystemInfoSync().windowHeight - uni.upx2px(80) : relaHeight
    },
    // 切换Tab 当前版本只有一个tab
    setCurrent(current) {
      if (current !== this.tabSwiperIdx) {
        // 切换tab时，将上一个tab的数据清空
        this.$refs.pagingRef[this.tabSwiperIdx].clear()
        this.tabSwiperIdx = current
		this.petListParams.species = this.tabList[current]['value']
        // 切换tab时，刷新列表
        this.refresh()
      }
    },

    // ==================== 下方为实际刷新加载数据逻辑 ====================

    // 下拉刷新时，通知当前显示的Tab列表进行reload操作
    refresh(params) {
      if (params) {
        this.petListParams = {...this.petListParams, ...params}
      }
      this.$refs.pagingRef[this.tabSwiperIdx].reload()
    },
    // 当滚动到底部时，通知当前显示的Tab列表加载更多
    loadMore() {
      this.$refs.pagingRef[this.tabSwiperIdx].doLoadMore()
    },
    // reload 执行的方法，查询数据
    queryList(pageNo, pageSize) {
      console.log(pageNo, pageSize, '==============')
      this.petListParams.pageNo = pageNo
      this.petListParams.pageSize = pageSize
      this.fetchPetList()
    },
    // 获取宠物列表
    fetchPetList() {
		let that = this;
		uni.loading(true);
		uni.wen.util.request(
		    uni.wen.api.ApiRootUrl + 'pets/adoption/list', {
				page: that.petListParams.pageNo,
				limit: that.petListParams.pageSize,
				species: that.petListParams.species,
				city: that.petListParams.city,
				filter_age_range: that.petListParams.filter_age_range,
				filter_gender_range: that.petListParams.filter_gender_range,
				filter_pet_status_range: that.petListParams.filter_pet_status_range,
				keyword: that.petListParams.keyword
			}
		).then(function (res) {
		    uni.loading(false);
		    if (res.code == 200) {
				that.$refs.pagingRef[that.tabSwiperIdx].complete(res.data.data)
				that.$emit('endRefresh');
			}else {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
				that.$refs.pagingRef[that.tabSwiperIdx].complete(false);
				that.$emit('endRefresh');
			}
		});
    },
	config_data(){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'pets/adoption/config').then(function (res) {
		    if (res.code == 200) {
				that.index_config = res.data.index;
			}
		});
	},
	search(){
		this.refresh()
	}
  }
}
</script>

<template>
  <view>
	
	
	
    <!-- 轮播 -->
    <view class="banner-list-wrapper">
      <u-swiper :list="index_config.banner" keyName="poster" height="300" previousMargin="60" nextMargin="60" circular radius="16" bgColor="transparent"/>
    </view>
	
	<view class="search-wrap">
		<u-search placeholder="输入编号、宠物名字、品种" v-model="petListParams.keyword" :showAction="false" @change="search"></u-search>
	</view>

    <!-- 金刚位 -->
    <pet-adoption-home-grid :nav="index_config.nav"/>

    <!-- 通知 -->
    <u-notice-bar :text=" config_about_name + '已帮助 '+ index_config.count +' 个毛孩子找到新家'"/>

    <!-- Tab 滑动栏 -->
    <pet-adoption-home-tabs :current="tabSwiperIdx" :tab-list="tabList" @setCurrent="setCurrent"/>

    <!-- 宠物领养列表 -->
    <swiper class="swiper" :style="{ height: `${swiperHeight}px` }" :current="tabSwiperIdx" @animationfinish="e => setCurrent(e.detail.current)">
      <swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
        <view class="content" ref="petListRef">
          <z-paging
              ref="pagingRef"
              :auto="false"
              :refresher-enabled="false"
              use-page-scroll
              v-model="petList"
              :auto-clean-list-when-reload="false"
              @query="queryList"
              @contentHeightChanged="contentHeightChanged"
          >
            <!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
            <view class="item" v-for="(pet,idx) in petList" :key="idx">
              <pet-adoption-list-item :pet="pet"/>
            </view>
            <!-- 空数据显示 -->
            <view slot="empty">
              <u-empty text="还没有待领养的宠物哦～" width="300" height="300" textSize="28"/>
            </view>
          </z-paging>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
.banner-list-wrapper {
  margin-top: 24rpx;
  @include background_color(page-body-background-color);
}

.search-wrap{
	padding-top: 20rpx;
	margin: 0 $page-row-spacing;
}

.swiper {
  height: 1000px;

  .swiper-item {

    .content {
      height: 100%;
    }
  }
}
</style>
