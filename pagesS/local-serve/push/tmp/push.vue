<template>
	<view class="container">
		<view style="padding: 30rpx;box-sizing: border-box;">
			<u--form labelPosition="left" labelWidth="144rpx" :model="releaseForm" ref="releaseFormRef">
				<u-form-item label="发布分类" borderBottom @click="showType = true;" prop="releaseType">
					<u--input v-model="releaseForm.releaseType" disabled disabledColor="#ffffff" placeholder="请选择准备发布的板块"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="标题" borderBottom prop="title">
					<u--input placeholder="为您发布的内容制定一个标题" border="none" count :maxlength="50" showWordLimit
						v-model="releaseForm.title"></u--input>
				</u-form-item>
				<u-form-item label="主要内容" prop="substance"></u-form-item>
				<u--textarea placeholder="在这里发布您所需信息, 请勿发布违反法律规定的内容哟,否则会被拉入黑名单的哟~" border="bottom" :height="160" count
					:maxlength="500" v-model="releaseForm.substance"></u--textarea>
				<u-form-item label="图片上传"></u-form-item>
				<u-upload :fileList="imgList" @afterRead="imgAfterRead" @delete="imgDeletePic" :name="1" multiple :maxCount="10"
					:previewFullImage="true"></u-upload>
				<u-form-item label="联系方式" borderBottom prop="contact">
					<u--input type="number" placeholder="请规范填写您的联系方式" border="none" count :maxlength="11" showWordLimit
						v-model="releaseForm.contact" v-if="!showType"></u--input>
				</u-form-item>
				<u-form-item label="联系地址" borderBottom prop="address">
					<u--input placeholder="为您发布的内容填写地址" border="none" count :maxlength="50" showWordLimit
						v-model="releaseForm.address"></u--input>
				</u-form-item>
				<u-form-item label="制定标签" borderBottom>
					<view class="" style="display: flex;justify-content: space-between;">
						<u--input placeholder="选择您的标签内容" border="none" count :maxlength="50" showWordLimit
							v-model="tagName"></u--input>
						<u-button type="primary" shape="circle" color="#eb6540" size="mini" :customStyle="buttonConfirmStyle"
							throttleTime="1000" text="确认添加" @click="writeTag"></u-button>
					</view>
				</u-form-item>
				<view v-if="releaseForm.tagList.length>0"
					style="height: 20px;line-height:20px;border-left: 5px solid #eb6540;margin-top: 35rpx;padding-left: 15rpx;margin-bottom: 30rpx;font-size: 14px;">
					已选标签<text style="color: #8a8a8a;font-size: 24rpx;margin-left: 6rpx;">(单击标签可删除哦!)</text>
				</view>
				<view style="display: flex;justify-content: flex-start;flex-wrap:wrap;align-items: center;margin-top: 15rpx;">
					<block v-for="(item,index) in releaseForm.tagList" :key="index">
						<u-tag :text="item.name" :borderColor="item.color" :color="item.color" plain size="mini"
							@click="deleteTag(item,index)"></u-tag>
					</block>
				</view>
				<view
					style="height: 20px;line-height:20px;border-left: 5px solid #eb6540;margin-top: 35rpx;padding-left: 15rpx;margin-bottom: 30rpx;font-size: 14px;">
					其他选项
				</view>
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 15rpx;">
					<view style="font-size: 14px;">是否推荐</view>
					<view>
						<u-switch v-model="releaseForm.isRecommend" activeColor="#eb6540" @change="isRecommendChange"
							size="34"></u-switch>
					</view>
				</view>
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 15rpx;">
					<view style="font-size: 14px;">是否加急</view>
					<view>
						<u-switch v-model="releaseForm.isisUrgent" activeColor="#eb6540" @change="isUrgentChange"
							size="34"></u-switch>
					</view>
				</view>
			</u--form>
			<view style="margin: 50rpx 60rpx 30rpx 60rpx;">
				<u-button type="primary" shape="circle" color="#eb6540" :customStyle="buttonStyle" throttleTime="1000"
					text="立即发布" @click="submit()"></u-button>
			</view>
		</view>
		<u-picker confirmColor="#eb6540" :show="showType" :closeOnClickOverlay="true" :columns="typeList" keyName="name"
			@close="showType=false" @cancel="showType = false" @confirm="typeSelect" :immediateChange="true"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 展示分类
				showType: false,
				// 图片数组
				imgList: [],
				// 发布表单数据
				releaseForm: {
					releaseType: '', // 发布分类
					title: '', // 标题
					address: '', // 地址
					contact: '', // 联系方式
					status: '', // status
					substance: '', // 发布内容
					isRecommend: false, // 是否推荐
					isisUrgent: false, // 是否加急
					tagList: [], // 标签
				},
				// 分类列表
				typeList: [
					[{
						name: '找工作',
						id: '0'
					}, {
						name: '找房屋',
						id: '1'
					}, {
						name: '找服务',
						id: '2'
					}]
				],
				// 表单验证
				releaseFormRules: {
					releaseType: {
						type: 'string',
						required: true,
						message: '请填写您发布的内容分类',
						trigger: ['blur', 'change']
					},
					title: {
						type: 'string',
						required: true,
						message: '请填写您的发布标题',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '请填写您的地址',
						trigger: ['blur', 'change']
					},
					contact: {
						type: 'number',
						required: true,
						len: '11',
						message: '请填写您的联系方式',
						trigger: ['blur', 'change']
					},
					substance: {
						type: 'string',
						required: true,
						message: '请填写您发布的内容介绍',
						trigger: ['blur', 'change']
					},
					// imgList:{
					// 	type: 'array',
					// 	required: true,
					// 	message: '请选择您的发布内容图片介绍',
					// 	trigger: ['blur','change']
					// }
				},
				// 标签名
				tagName: '',
				// 标签颜色数据
				buttonStyle: {
					width: '100%',
					height: '70rpx'
				},
				buttonConfirmStyle: {
					width: '120rpx',
					height: '50rpx'
				},
			};
		},
		onReady() {
			this.$refs.releaseFormRef.setRules(this.releaseFormRules);
			uni.showModal({
				showCancel: false,
				title: "信息发布说明",
				content: "发布成功后，您提交的内容可能存在不当词汇，目前转入人工审核，审核成功后将自动展现!",
				confirmText: "我已知晓",
				confirmColor: '#eb6540',
				success(res) {
					if (res.confirm) {

					}
				}
			})
		},
		methods: {
			submit() {
				if (this.imgList.length > 0 && this.imgList.length < 2) {
					return uni.showToast({
						title: '嗷嗷，配图最少两张哟~',
						icon: "none"
					})
				}
				this.$refs.releaseFormRef.validate().then(res => {
					uni.showToast({
						title: '恭喜您已完成发布!',
						icon: "none"
					})
					uni.navigateBack({
						delta: 1
					})
				}).catch(errors => {
					uni.showToast({
						title: '请完善您的信息哦!',
						icon: "none"
					})
				})
			},
			typeSelect(e) {
				this.releaseForm.releaseType = e.value[0].name
				this.showType = false
			},
			// 删除图片
			imgDeletePic(event) {
				this.imgList.splice(event.index, 1)
			},
			// 新增图片
			async imgAfterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this.imgList.length
				lists.map((item) => {
					this.imgList.push({
						...item,
					})
				})
			},
			getRandomColor() {
				return '#' + Math.floor(Math.random() * 16777215).toString(16);
			},
			isRecommendChange(e) {
				this.releaseForm.isRecommend = e
			},
			isUrgentChange(e) {
				this.releaseForm.isisUrgent = e
			},
			writeTag() {
				if (this.releaseForm.tagList.length >= 15) {
					uni.showToast({
						icon: 'none',
						title: '您添加的标签已达上限哦!',
						duration: 1000
					})
				} else {
					if (this.tagName.trim() !== '') {
						this.releaseForm.tagList.push({
							name: this.tagName.trim(),
							color: this.getRandomColor()
						});
						this.tagName = ''
					}
				}
			},
			deleteTag(item, index) {
				let that = this;
				uni.showModal({
					showCancel: true,
					title: "温馨提示",
					content: "您确认要删除该标签吗?",
					confirmText: "确认删除",
					cancelText: '取消操作',
					cancelColor: '#5e5e5e',
					confirmColor: '#eb6540',
					success(res) {
						if (res.confirm) {
							that.releaseForm.tagList.splice(index, 1)
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/deep/.u-tag-wrapper {
		margin: 0 16rpx 16rpx 0 !important;
	}

	/deep/.u-upload__wrap__preview__image {
		width: 150rpx !important;
		height: 150rpx !important;

		.u-icon__icon {
			font-size: 20rpx;
		}
	}

	/deep/.u-upload__button {
		width: 150rpx !important;
		height: 150rpx !important;

		.u-icon__icon {
			font-size: $uni-font-size-medium !important;
		}
	}

	/deep/.u-popup__content {
		background: #fff !important;
		position: fixed !important;
		bottom: 0;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>