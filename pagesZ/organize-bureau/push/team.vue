<script>
import OrganizeBureauPushItem from '@/pagesZ/organize-bureau/push/components/organize-bureau-push-item.vue'
import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';

export default {
  components: { OrganizeBureauPushItem, miniUploadImg },
	data() {
	  return {
	    mediaCount: 1,
			teamForm: {
				gameTitle: '',
				gameContent: '',
				picture: '',
				gameType: '',
				location: '',
				gameDate: {label: '', value: ['', '']},
				isOpen: '',
				refundPolicy: '',
				userInfo: '',
				group: [
					{
						isShowMore: false,
						teamAmount: '',
						preAmount: '',
						preMoney: '',
						endDate: {label: '', value: ''},
						isWaiting: false,
						isQuota: false,
						signDate: '',
						signRange: ''
					}
				]
			},
			groupItem: {
				isShowMore: false,
				teamAmount: '',
				preAmount: '',
				preMoney: '',
				endDate: {label: '', value: ''},
				isWaiting: false,
				isQuota: false,
				signDate: '',
				signRange: ''
			},
			isValidSubmit: false,
			gameTypeData: [
				{label: '飞盘', value: 1, isDefault: true},
				{label: '橄榄球', value: 2, isDefault: true},
				{label: '匹克球', value: 3, isDefault: true},
				{label: '篮球', value: 4, isDefault: true},
				{label: '足球', value: 5},
				{label: '棍球', value: 6},
				{label: '羽毛球', value: 7},
				{label: '冰壶', value: 8},
				{label: '网球', value: 9},
				{label: '躲猫猫', value: 10},
			],
			gameDateData: [
				[],
				['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
				['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
			],
			endDateData: [
				[],
				['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
				['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
			],
			openData: [
				{label: '公开（所有地方可见）', value: 1},
				{label: '私密（不出现在首页）', value: 2},
				{label: '私密（仅分享链接可见）', value: 3}
			],
			refundData: [
				{label: '活动开始前随时可以下车', value: 1},
				{label: '活动前3个小时', value: 2},
				{label: '活动前12个小时', value: 3},
				{label: '活动前24个小时', value: 4},
				{label: '活动前48个小时', value: 5},
				{label: '活动前3天', value: 6},
				{label: '活动前7天', value: 7},
				{label: '活动不支持无理由退款', value: 8},
			],
			signDateData: [
				['不限制开始报名时间'],
				['-', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
				['-', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
			],
			signRangeData: [
				{label: '所有人', value: 1},
				{label: '仅俱乐部成员', value: 2}
			]
		}
	},
	onLoad() {
		for(let i=0;i<=180;i++){
			let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
			let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
			let day = date.getDate()
			let week = ['日','一','二','三','四','五','六'][date.getDay()]
			this.signDateData[0].push(month + '月' +  day + '日 周' + week)
			this.gameDateData[0].push(month + '月' +  day + '日 周' + week)
		}
	},
	watch: {
		teamForm: {
			handler(newVal){
				let isValid = true
				for(let key in newVal){
					if(['isWaiting', 'isQuota', 'userInfo'].indexOf(key) === -1 && newVal[key]===''){
						isValid = false
					}
				}
				this.isValidSubmit = isValid
			},
			deep: true
		}
	},
	onPullDownRefresh: function () {
	  uni.stopPullDownRefresh();
	},
	methods: {
		miniUploadImgChange(data) {
			this.teamForm.picture = data.urls[0]
			this.teamForm.isUploading = false
		},
		addGroup(){
			this.teamForm.group.push(JSON.parse(JSON.stringify(this.groupItem)))
		},
		deleteGroup(index){
			console.log(index, 'ddddddd')
			if(this.teamForm.group.length > 1){
				this.teamForm.group.splice(index, 1)
			}else{
				uni.showToast({
					title: '至少保留一个分组',
					icon: 'none'
				})
			}
		},
		// 存草稿
		handleDraft(){
			if(this.isValidSubmit){
				console.log(this.teamForm)
			}else{
				uni.showToast({
					title: '请完善信息',
					icon: 'none'
				})
			}
		},
		// 发布
		handleSubmit(){
			if(this.isValidSubmit){
				console.log(this.teamForm)
			}else{
				uni.showToast({
					title: '请完善信息',
					icon: 'none'
				})
			}
			console.log(JSON.stringify(this.teamForm))
		},
		showMore(index){
			this.teamForm.group[index].isShowMore = !this.teamForm.group[index].isShowMore
		}
	}
}
</script>

<template>
  <view class="push-page">
    <view class="one-card-wrapper">
      <input placeholder="输入战队赛标题" v-model="teamForm.gameTitle"/>
      <view class="textarea-wrapper">
        <u--textarea
            class="textarea-input"
            border="none"
            height="200"
            style="padding: 0"
						 v-model="teamForm.gameContent"
            placeholder="描述一下比赛规则、比赛内容、比赛奖励、推荐的人群、贴心tips等，叫大家一起组局打比赛吧~"
        />
      </view>
			<!-- <mini-upload-img ref="miniUploader" style="width: 690rpx;" @uploading=" isUploading = true " :number="mediaCount" @change="miniUploadImgChange" :showAdd="true"></mini-upload-img> -->
      <!-- TODO 添加照片的 闻总你来 -->

      <view class="push-item-wrapper">
        <organize-bureau-push-item label="比赛类型" popupTitle="选择活动类型" v-model="teamForm.gameType" type="gameTypeCheck" :range="gameTypeData" icon="icon-leixing@2x.png"/>
        <organize-bureau-push-item label="集合地点" v-model="teamForm.location" :labelText="teamForm.location" :isLocation="true" icon="icon-didian@2x.png"/>
        <organize-bureau-push-item label="比赛时间" v-model="teamForm.gameDate" :labelText="teamForm.gameDate.label" type="gameDatePick" :range="gameDateData" icon="icon-shijian@2x.png" @setEndDate="setEndDate"/>
        <organize-bureau-push-item label="公开(所有地方可见)" popupTitle="选择可见范围" v-model="teamForm.isOpen" type="openCheck" :range="openData" icon="icon-gongkai@2x.png"/>
        <organize-bureau-push-item label="退款政策" v-model="teamForm.refundPolicy" tip="*超过选择的时间段，申请下车需要主理人同意" type="refundPicker" :range="refundData" icon="icon-tuikuan@2x.png"/>
        <organize-bureau-push-item label="用户信息收集" subPlaceholder="选填" url='/pagesZ/organize-bureau/push/userInfo' type="url" v-model="teamForm.userInfo" icon="icon-yhxinxi@2x.png"/>
      </view>
    </view>
		

		<view class="team-group" v-for="(item, index) in teamForm.group" :key="index">
			<view class="team-group-name" v-if="teamForm.group.length > 1">
				<view class="text">第{{index+1}}组</view>
				<view class="mini-icon mini-shanchu3" @click="deleteGroup(index)"></view>
			</view>
			<view class="two-card-wrapper">
			  <view class="push-item-wrapper">
			    <organize-bureau-push-item label="几支战队" popupTitle="最多几支参与队伍" placeholder="最多几支参与队伍" :labelText="item.teamAmount+'支战队参赛'" v-model="item.teamAmount" type="input-number" max-length="20" icon="icon-zhandui2@2x.png"/>
			    <organize-bureau-push-item label="每队人数" popupTitle="每队最多参赛人数" placeholder="几人一起" :labelText="'每队最多'+item.preAmount+'人'" v-model="item.preAmount" type="input-number" max-length="20" icon="icon-renshu@2x.png"/>
			    <organize-bureau-push-item label="每队多少钱" popupTitle="每队多少钱" placeholder="¥0.00" tip="当价格为0时，不可以设置保险" :labelText="'每队 ¥'+item.preMoney" v-model="item.preMoney" type="input-number" max-length="20" icon="icon-qian@2x.png"/>
			    <organize-bureau-push-item label="报名截止时间" v-model="item.endDate" :labelText="item.endDate.label && ('报名截止：'+item.endDate.label)" type="endDatePick" :range="gameDateData" :startDate='teamForm.gameDate.value' icon="iocn-riqi@2x.png"/>
			    <organize-bureau-push-item label="满座后可候补等位" v-model="item.isWaiting" type="isWaitingSwitch" icon="icon-houbu@2x.png" v-show="item.isShowMore"/>
			    <organize-bureau-push-item label="每人限购一张票" v-model="item.isQuota" type="isQuotaSwitch" icon="iocn-xiangou@2x.png" v-show="item.isShowMore"/>
			    <organize-bureau-push-item label="开始报名时间" :labelText="'开始报名时间：'+item.signDate" v-model="item.signDate" type="signDatePicker" :range="signDateData" icon="icon-dingshi@2x.png" v-show="item.isShowMore"/>
			    <organize-bureau-push-item label="报名范围" v-model="item.signRange" type="signRangeCheck" :range="signRangeData" icon="icon-fanwei@2x.png" v-show="item.isShowMore"/>
			  </view>
				<view class="showMore" @click="showMore(index)">
					<block v-if="!item.isShowMore">
						更多设置<i class="mini-icon mini-xiajiantou" />
					</block>
					<block v-else>
						收起<i class="mini-icon mini-shangjiantou" />
					</block>
				</view>
			</view>
		</view>
		
		<view class="addGroup" @click="addGroup"><i class="mini-icon mini--jia"></i>新增分组</view>

    <view class="bottom-tools-wrapper">
      <view class="draft-button" @click="handleDraft">存草稿</view>
      <view class="push-button" :class="isValidSubmit || 'disabled'" @click="handleSubmit">发布</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import './push.scss';
</style>
