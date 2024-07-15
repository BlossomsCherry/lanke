<template>
	<view class="container">
		<view class="item" v-for="(item,index) in jobList" @tap.stop.prevent="toSliderUrl(6, '/pagesS/local-serve/detail/job')">
			<view class="iInfo">
				<text class="title">{{item.jobName}}</text>
				<text class="price">{{item.wages}}</text>
			</view>
			<view class="jd">
				<view class="item">
					<u-icon name="github-circle-fill" size="14"></u-icon>
					<text class="jdText" style="margin-left: 4rpx;">{{item.address}}</text>
				</view>
				<view class="item">
					<u-icon name="twitter" size="14"></u-icon>
					<text class="jdText" style="margin-left: 4rpx;">招{{item.people}}人·{{item.ent}}</text>
				</view>
			</view>
			<view class="tag">
				<view class="tagItem first" v-if="index==2||index==4||index==6||index==8">
					<u-icon name="server-man" size="16" color="#ec613d"></u-icon>
					<text>{{item.hot}}</text>
				</view>
				<block v-if="item.tag.length>0">
					<view class="tagItem" v-for="(q,k) in item.tag" :key="k">
						<text>{{q.name}}</text>
					</view>
				</block>
			</view>
			<view class="boss">
				<view class="header">
					<u-avatar size="34" :src="item.header"></u-avatar>
				</view>
				<view class="bInfo">
					<text class="bossName">{{item.bossName}}·{{item.bossJob}}</text>
					<text class="companyName">{{item.company}}</text>
				</view>
				<view class="apply">
					<u-button type="primary" icon="share" color="#ec613e" iconColor="#ec613e" :plain="true" shape="circle" :customStyle="buttonStyle" throttleTime="1000" text="去申请" ></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"job-list",
		data() {
			return {
				buttonStyle:{width:'auto',minWidth:'160rpx',height:'70rpx'},
				jobList:[
					{jobName:'小狗鼻子补漆',wages:'8-12k',address:'成都-高新区',people:'20',ent:'经验不限',hot:'正在急招',tag:[{name:'包吃'},{name:'包住'},{name:'大小周'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'娃哈哈饮料分拣月8千坐班',wages:'8000元',address:'成都-天府新区',people:'1000',ent:'三年经验',hot:'工资高',tag:[{name:'包吃'},{name:'包住'},{name:'周末不休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'电子厂螺丝专业户',wages:'4k底薪上不封顶',address:'成都-郫都区',people:'2',ent:'本科-三年经验',hot:'热门岗位',tag:[{name:'包吃'},{name:'包住'},{name:'周末双休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'红龙果去籽',wages:'8元-12k',address:'成都-武侯区',people:'5',ent:'大专及以上',hot:'正在急招',tag:[{name:'不包吃'},{name:'包住'},{name:'周末单休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'饿了么滴驾驶员',wages:'多劳多得',address:'成都-龙泉驿区',people:'20-50',ent:'18-25岁',hot:'待遇好',tag:[{name:'包吃'},{name:'包住'},{name:'周末双休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'在世华佗',wages:'工资面议',address:'成都-锦江区',people:'10-50',ent:'经验不限',hot:'女同事漂亮',tag:[{name:'包吃'},{name:'不包住'},{name:'周末调休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'小狗鼻子补漆',wages:'8-12k',address:'成都-高新区',people:'20',ent:'经验不限',hot:'正在急招',tag:[{name:'包吃'},{name:'包住'},{name:'大小周'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'娃哈哈饮料分拣月8千坐班',wages:'8000元',address:'成都-天府新区',people:'1000',ent:'三年经验',hot:'工资高',tag:[{name:'包吃'},{name:'包住'},{name:'周末不休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'电子厂螺丝专业户',wages:'4k底薪上不封顶',address:'成都-郫都区',people:'2',ent:'本科-三年经验',hot:'热门岗位',tag:[{name:'包吃'},{name:'包住'},{name:'周末双休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'红龙果去籽',wages:'8元-12k',address:'成都-武侯区',people:'5',ent:'大专及以上',hot:'正在急招',tag:[{name:'不包吃'},{name:'包住'},{name:'周末单休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'饿了么滴驾驶员',wages:'多劳多得',address:'成都-龙泉驿区',people:'20-50',ent:'18-25岁',hot:'待遇好',tag:[{name:'包吃'},{name:'包住'},{name:'周末双休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
					{jobName:'在世华佗',wages:'工资面议',address:'成都-锦江区',people:'10-50',ent:'经验不限',hot:'女同事漂亮',tag:[{name:'包吃'},{name:'不包住'},{name:'周末调休'}],bossName:'刘亦菲',bossJob:'人事经理',company:'四川志多邦人力资源服务有限公司',header:'https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg'},
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
@mixin dflex {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin dflexsb {
  @include dflex;
  justify-content: space-between;
}

@mixin dflexsa {
  @include dflex;
  justify-content: space-around;
}

.container {
  height: 100%;
  background: #fafafc;
  box-sizing: border-box;
  padding-bottom: 100rpx !important;

  .item {
    padding: 16rpx 24rpx;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 16rpx !important;
    border-radius: 16rpx;

    .iInfo {
      @include dflexsb;
      font-size: $uni-font-size-sm-base;
      font-weight: 600;

      .title {
        color: #333;
      }

      .price {
        color: #ec613e;
      }
    }

    .jd {
      @include dflex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 10rpx;

      .item {
        color: #7f7f7f;
        @include dflex;
        justify-content: flex-start;
        border-radius: 4rpx;
        padding: 3rpx 6rpx;
        box-sizing: border-box;
        margin-right: 14rpx;
        font-size: 22rpx;
      }
    }

    .tag {
      @include dflex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .tagItem {
        color: #7f7f7f;
        border: 1rpx solid #ccc;
        border-radius: 4rpx;
        padding: 3rpx 6rpx;
        box-sizing: border-box;
        margin: 0rpx 14rpx 6rpx 0;
        font-size: 22rpx;

        &.first {
          background: #fef8f7;
          @include dflex;
          color: #ec613d;
          font-size: $uni-font-size-sm;
          font-weight: bolder;
        }
      }
    }

    .boss {
      @include dflex;
      justify-content: flex-start;
      margin-top: 14rpx;

      .header {
        width: 80rpx;
        height: 80rpx;
        margin-right: 20rpx;
        @include dflex;
      }

      .bInfo {
        @include dflex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;

        .bossName {
          font-size: $uni-font-size-sm-base;
          color: #000;
        }

        .companyName {
          color: #7f7f7f;
          font-size: 22rpx;
        }
      }

      .apply {
        width: 180rpx;
        height: 70rpx;
        @include dflex;
      }
    }
  }
}

</style>