<template>
	<view>
		<view class="top">
			<view class="topIcon" @click="gotoback">
				<u-icon name="arrow-left" color="#fff" size="34"></u-icon>
			</view>
			<view class="topTitle">答题</view>
			<view class="topright"> </view>
		</view>
		<!-- 进度条 -->
		<view class="schedule">
			<u-line-progress :percentage="(indexnub+1)/countall*100" activeColor="#5DC838" height="20"></u-line-progress>
		</view>
		<view class="content">
			<view class="timeout"><u-count-down :time="dumiao*1000" format="ss" @finish="finish" ref="countDown"></u-count-down></view>
			<view class="questionName">第{{indexnub+1}}题</view>
			
			<view class="questionTitle">{{questionList[indexnub]['问题']}}</view>
			<view class="answerBox" v-for="(item,index) in questionList[indexnub]['选项']">
				<view class="answerLi" @click="questionClick(index)">{{item}}</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import color from '../../uni_modules/uview-ui/libs/config/color'
	export default {
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
				countall:0, //总题数
				indexnub: 0, //当前题数
				dumiao:30,
				questionList: [{
						"问题": "以下哪个国家是篮球运动的发源地？",
						"选项": [
							"美国",
							"中国",
							"俄罗斯",
							"加拿大"
						]
					},
					{
						"问题": "下列哪个星座不属于黄道十二宫？",
						"选项": [
							"狮子座",
							"双子座",
							"双鱼座",
							"天秤座"
						]
					},
					{
						"问题": "以下哪个国家拥有最多的人口？",
						"选项": [
							"印度",
							"中国",
							"美国",
							"巴西"
						]
					},
					{
						"问题": "下列哪一种动物没有冬眠的习性？",
						"选项": [
							"刺猬",
							"青蛙",
							"熊",
							"蛇"
						]
					},
					{
						"问题": "以下哪个国家是举办过冬季奥运会的？",
						"选项": [
							"美国",
							"德国",
							"日本",
							"俄罗斯"
						]
					}
				],
				answer:[]
			}
		},
		onLoad() {
			this.countall = this.questionList.length
		},
		methods: {
			gotoback() {
				uni.navigateBack(1)
			},
			finish() {
				var that = this
				console.log("倒计时结束")
				that.answer[that.indexnub] = ''
				if(that.indexnub < that.countall-1){
					that.indexnub++ 
					that.$refs.countDown.reset();
				}else{
					that.tijiao()
				}
				
			},
			questionClick(e){
				// 记录答案
				var that = this
				that.answer[that.indexnub] = e
				if(that.indexnub < that.countall-1){
					that.indexnub++ 
					that.$refs.countDown.reset();
				}else{
					that.tijiao()
				}
				
				console.log(e)
			},
			tijiao(){
				var that =this
				// console.log("提交")
				uni.showToast({
					icon:"success",
					title:"答题完成",
					duration:2000
				})
				 that.$refs.countDown.pause();
				console.log(that.answer)
			}
		},
	}
</script>

<style scoped>
	page {
		background: #657FCA;
	}

	.top {
		height: 45px;
		line-height: 45px;
		display: flex;
		justify-content: space-between;
		background: #657FCA;
	}

	.topTitle {
		font-weight: bold;
		color: #fff;
		padding-left: -15rpx;
	}

	.topIcon {
		display: flex;
		padding-left: 15px;
	}

	.schedule {
		width: 700rpx;
		margin: 0 auto;
	}

	.content {
		width: 700rpx;
		margin: 0 auto;
		background: #fff;
		border-radius: 30rpx;
		padding: 30rpx 0;
		margin-top: 40rpx;
		padding-bottom: 60px;
	}
	.timeout{
		text-align: center;
	}
	.questionName{
		text-align: center;
		    line-height: 70px;
	}
	.questionTitle{
		text-align: center;
		    font-size: 20px;
		    font-weight: bold;
		    padding: 15px;
	}
	.answerBox{
		width: 300px;
		    height: 50px;
		    line-height: 50px;
		    margin: 0 auto;
		    border: 1px solid #ccc;
		    border-radius: 60px;
		    padding-left: 20px;
		    margin-top: 20px;
	}
	uni-text.u-count-down__text {
	    font-size: 32px !important;
	    line-height: 40px !important;
	}
</style>