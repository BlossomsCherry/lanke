<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


export default {
  components: {
  	  myToast,navBar,hoverBall,
  },
  data() {
    return {
      tableColumns: [
        { label: '真实姓名', field: 'name' },
        { label: '性别', field: 'gender' },
        { label: '身份', field: 'identity' },
        { label: '所在地', field: 'region' },
        { label: '身份证号', field: 'IDCard' },
        { label: '手机号', field: 'phone' },
        { label: '微信号', field: 'wechat' },
        { label: '微信昵称', field: 'wechatName' },
      ],
      detailsInfo: {
        name: '张XX',
        gender: '女',
        identity: '领养人',
        region: '上海市',
        IDCard: '111111111111111111',
        phone: '18888888888',
        wechat: 'NP******71',
        wechatName: '小啊领取a啊啥的啊啥的',
        reportContent: '此人领养猫一年多，今年6月底猫丢了以后没有积极寻找，把我们和楼下一楼的一个大姐拉了一个群，自己没有做到每天晚上出去找猫，全都指望一楼大姐帮忙找，牛牛没有走远就在附近呆着，一楼大姐天天出去喊猫，在固定地方放猫粮罐头吸引牛牛，大姐找到猫问能不能马上接走也不回消息，早已把我拉黑。',
        reportPicture: [
          'https://c-ssl.dtstatic.com/uploads/blog/202201/23/20220123222213_2899a.thumb.1000_0.jpeg',
          'https://c-ssl.dtstatic.com/uploads/blog/202207/09/20220709150824_97667.thumb.1000_0.jpg',
          'https://c-ssl.dtstatic.com/uploads/blog/202201/23/20220123222213_2899a.thumb.1000_0.jpeg',
          'https://c-ssl.dtstatic.com/uploads/blog/202207/09/20220709150824_97667.thumb.1000_0.jpg',
          'https://c-ssl.dtstatic.com/uploads/blog/202201/23/20220123222213_2899a.thumb.1000_0.jpeg',
          'https://c-ssl.dtstatic.com/uploads/blog/202207/09/20220709150824_97667.thumb.1000_0.jpg'
        ]
      }
    }
  }
}
</script>

<template>
  <view class="report-details-pages">
    <view class="title-wrapper">失信人信息</view>
    <view class="tips-wrapper">
      <u-icon name="info-circle" size="30" color="#ff9b39"/>
      <view>温馨提示：以下信息真实性由发布者个人承担。如侵犯您的个人权益，请联系我们</view>
    </view>

    <!-- 用户信息表格 -->
    <view class="table-info-wrapper">
      <view v-for="(item, index) in tableColumns" :key="index" :class="['item-wrapper', index === tableColumns.length - 1 && 'none-border']">
        <view class="label">{{ item.label }}</view>
        <view class="content">{{ detailsInfo[item.field] }}</view>
      </view>
    </view>

    <view class="title-wrapper">举报理由</view>

    <view class="report-content-wrapper">{{ detailsInfo.reportContent }}</view>

    <!-- 举报图片 -->
    <view class="report-picture-wrapper">
      <image v-for="(item, index) in detailsInfo.reportPicture" :key="index" class="img" :src="item"/>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$picture-width: calc((100vw - 60upx - 24px) / 3);

.report-details-pages {
  margin: $uni-spacing-col-lg $page-row-spacing;
  padding-bottom: calc(env(safe-area-inset-bottom) + 42rpx);

  .title-wrapper {
    margin-top: $uni-spacing-col-lg;
    font-size: 42rpx;
    font-weight: bold;
  }

  .tips-wrapper {
    margin-top: $uni-spacing-col-lg;
    display: flex;
    align-items: flex-start;
    gap: $uni-spacing-row-sm;
    color: #ff9b39;
    font-size: $uni-font-size-sm;
  }

  .table-info-wrapper {
    margin-top: $uni-spacing-col-lg;
    border: 2rpx solid $uni-border-color;

    .item-wrapper {
      height: 120rpx;
      display: flex;
      align-items: center;
      border-bottom: 2rpx solid $uni-border-color;
      line-height: 120rpx;
      text-align: center;

      &.none-border {
        border-bottom: none;
      }

      .label {
        height: 100%;
        width: 200rpx;
        border-right: 2rpx solid $uni-border-color;
      }

      .content {
        height: 100%;
        flex: 1;
      }
    }
  }

  .report-content-wrapper {
    margin-top: $uni-spacing-col-lg;
    font-size: $uni-font-size-medium;
  }

  .report-picture-wrapper {
    margin-top: $uni-spacing-col-lg;
    display: grid;
    grid-template-columns: repeat(3, $picture-width);
    grid-gap: $uni-spacing-col-lg $uni-spacing-row-lg;

    .img {
      width: 100%;
      height: $picture-width;
      border-radius: $uni-border-radius-lg-er;
    }
  }
}
</style>
