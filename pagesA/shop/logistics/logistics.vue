<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__ + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__">
    <view class="mini-page-body">
	  <navBar :back="true" :home="fph" title="物流信息" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
	  
	  </navBar>
      <block v-if="wlInfo">
        <logistics :wlInfo="wlInfo"></logistics>
      </block>
      <block v-else>
        <u-empty text="绌 width="300" height="300" text-size="28"/>
      </block>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import logistics from '@/pagesA/components/xinyu-logistics/xinyu-logistics.vue'

export default {
  components: { 
	  myToast,navBar,hoverBall,
	  logistics
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 34,
      wlInfo: null,
	  express_no: '',
	  express_type: ''
    };
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
	
	that.express_no = options.nu;
	that.express_type = options.type;
	
	that.getShopKuaidiUrl();
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  onShow: function () {
    let that = this;
    that.updateScene(34, 0);
  },
  methods: {
	  getShopKuaidiUrl(){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/kuaidi', {
		  no: that.express_no,
		  type: that.express_type
		}).then(function (res) {
		  if (res.status) {
		    that.setData({
		      wlInfo: res.data
		    });
		  } else {
		    uni.showToast({
		      title: res.message,
		      icon: 'none'
		    });
		  }
		});
	  }
  }
};
</script>
<style lang="scss">
@import './logistics.scss';
</style>
