<template>
	<view class="container">
		<view class="title">
			求职保障(单选)
		</view>
		<view class="box">
			<view :class="checkInfo.enSureId==index?'item active':'item'" v-for="(item,index) in ensureList" @click="checkEnsure(item,index)">
				{{item.name}}
			</view>
		</view>
		<view class="title">
			福利(多选)
		</view>
		<view class="box">
			<view class="item" :class="{ 'active': isSelected(item.id) }" v-for="(item,index) in welfareList" @click="checkWelFare(item.id)">
				{{item.name}}
			</view>
		</view>
		<view class="title">
			工作经验(单选)
		</view>
		<view class="box">
			<view :class="checkInfo.workExperienceId==index?'item active':'item'" v-for="(item,index) in workExperienceList"  @click="checkWorkExperience(item,index)">
				{{item.name}}
			</view>
		</view>
		<view class="title">
			学历要求(单选)
		</view>
		<view class="box">
			<view :class="checkInfo.educationId==index?'item active':'item'" v-for="(item,index) in educationList"  @click="checkEducation(item,index)">
				{{item.name}}
			</view>
		</view>
		<view class="btnList">
			<u-button type="primary" color="linear-gradient(to right, #eeeee7, #d0ccc7)" :customStyle="buttonStyle" throttleTime="1000" text="清空选择" @click="cancelCheck"></u-button>
			<u-button type="primary" color="linear-gradient(to right, #ee8c61, #eb6540)" :customStyle="buttonStyle" throttleTime="1000" text="确认选择" @click="confirmlCheck"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonStyle:{width:'auto',minWidth:'220rpx',height:'70rpx'},
				ensureList:[{name:'不限',id:'0'},{name:'求职保障',id:'1'}],
				welfareList:[
					{name:'不限',id:'0'},
					{name:'五险一金',id:'1'},
					{name:'包住',id:'2'},
					{name:'包吃',id:'3'},
					{name:'年底双薪',id:'4'},
					{name:'周末双休',id:'5'},
					{name:'交通补助',id:'6'},
					{name:'加班补贴',id:'7'},
					{name:'饭补',id:'8'},
					{name:'话补',id:'9'},
					{name:'房补',id:'10'},
				],
				workExperienceList:[
					{name:'不限',id:'0'},
					{name:'1年以下',id:'1'},
					{name:'1-2年',id:'2'},
					{name:'3-5年',id:'3'},
					{name:'6-7年',id:'4'},
					{name:'8-10年',id:'5'},
					{name:'10年以上',id:'6'},
				],
				educationList:[
					{name:'不限',id:'0'},
					{name:'高中',id:'1'},
					{name:'技校',id:'2'},
					{name:'中专',id:'3'},
					{name:'大专',id:'4'},
					{name:'本科',id:'5'},
					{name:'博士',id:'6'},
				],
				checkInfo:{
					enSureId:0, // 默认保障初始化current-id
					welfareIdArr:[], // 默认福利初始化current-id
					workExperienceId:0, // 默认工作经验初始化current-id
					educationId:0, // 默认学历初始化current-id
				}, // 选择的对象
				
			}
		},
		methods: {
			isSelected(id) {
				return id === '0' ? this.checkInfo.welfareIdArr.length === 0 : this.checkInfo.welfareIdArr.includes(id);
			},
			// 选择保障
			checkEnsure(e,index){
				this.checkInfo.enSureId=e.id;
			},
			// 选择工作经验
			checkWorkExperience(e,index){
				this.checkInfo.workExperienceId=e.id;
			},
			// 选择教育学历
			checkEducation(e,index){
				this.checkInfo.educationId=e.id;
			},
			// 选择福利
			checkWelFare(id){
				if (id === '0') {
					this.checkInfo.welfareIdArr = [];
				} else {
					const index = this.checkInfo.welfareIdArr.indexOf(id);
					if (index === -1) {
						this.checkInfo.welfareIdArr.push(id);
					} else {
						this.checkInfo.welfareIdArr.splice(index, 1); 
					}
					if (this.checkInfo.welfareIdArr.length > 0) {
						const unlimitedIndex = this.checkInfo.welfareIdArr.indexOf(0);
						if (unlimitedIndex !== -1) {
							this.checkInfo.welfareIdArr.splice(unlimitedIndex, 1);
						}
					}
				}
			},
			// 取消选择
			cancelCheck(){
				this.checkInfo.enSureId=0;
				this.checkInfo.workExperienceId=0;
				this.checkInfo.educationId=0;
				this.checkInfo.welfareIdArr = [];
				
			},
			confirmlCheck(){
				console.log(this.checkInfo,'选择的数据-在传递数据的时候判断数字，如果是空数组，则是0');
				uni.$emit("handFilterInfo", { data: this.checkInfo });
				uni.navigateBack({
					delta:1
				})
			}
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
	  padding: 30rpx;
	  box-sizing: border-box;
	  padding-bottom: calc(constant(safe-area-inset-bottom));
	  padding-bottom: calc(env(safe-area-inset-bottom));
	
	  .title {
	    margin: 24rpx 0 30rpx 0;
	    font-size: $uni-font-size-base;
	    letter-spacing: 4rpx;
	    font-weight: normal;
	    color: #333;
	  }
	
	  .box {
	    @include dflex;
	    justify-content: flex-start;
	    flex-wrap: wrap;
	
	    .item {
	      width: 30.2%;
	      margin: 0 30rpx 30rpx 0;
	      padding: 8rpx 10rpx;
	      min-height: 66rpx;
	      box-sizing: border-box;
	      @include dflex;
	      background-color: #f6f6f6;
	      font-size: 24rpx;
	      color: #333;
	
	      &:nth-child(3n) {
	        margin-right: 0 !important;
	      }
	
	      &.active {
	        background: #fcefec;
	        color: #ec613e;
	      }
	    }
	  }
	
	  .btnList {
	    @include dflexsb;
	  }
	}

</style>
