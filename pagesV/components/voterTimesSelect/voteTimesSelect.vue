<template>
	<view class="container">
		<picker mode="multiSelector" :range="range" :value="tempValue" @change="onChange" @columnchange="onColumnChange"
			@cancel="onCancel">
			<view class="flex-row" v-if="value.length == 0 && !pickerChanged">
				<text class="_text placeholder">点击设置</text>
				<u-icon name="arrow-right" color="#666" size="18"></u-icon>
				<i class="mini-icon mini-youjiantou"></i>
			</view>
			<view class="flex-row" v-else>
				<text class="_text">{{selectedProvince}}{{selectedCity}}</text>
				<i class="mini-icon mini-youjiantou"></i>
			</view>
		</picker>
	</view>
</template>

<script>
	import {
		typeData,
		timesData
	} from './times.js';

	export default {
		name: "voterTimesSelect",
		data() {
			return {
				proData: typeData,
				cityData: timesData,
				selectedProvince: '',
				selectedCity: '',
				tempProvince: '',
				tempCity: '',
				range: [
					[],
					[]
				],
				value: this.localdata,
				tempValue: [0, 0],
				pickerChanged: false
			};
		},
		props: {
			localdata: ''
		},
		watch: {
			localdata: {
				immediate: true, // 首次加载时立即触发
				handler(newValue) {
					if (newValue.length) {
						this.value = [...newValue]; // 更新 value
						this.tempValue = [...newValue]; // 更新 tempValue
						// 你可能还需要更新其他的状态，比如 selectedProvince 和 selectedCity
				// console.log('this.value', this.value)
				// console.log('this.tempValue', this.tempValue)
						this.selectedProvince = typeData[this.value[0]].name;
						this.selectedCity = timesData[this.value[1]].name;
					}
				}
			}
		},
		methods: {
			loadProvinces() {
				let provinces = this.proData.map(item => item.name);
				this.range[0] = provinces;
				this.tempProvince = this.range[0][this.tempValue[0]];
			},
			loadCities(provinceIndex) {
				let cities = this.cityData.filter(city => city.ProID === this.proData[provinceIndex].ProID).map(city =>
					city.name);
				this.range[1] = cities;
				this.tempCity = this.range[1][this.tempValue[1]];
			},
			onChange(e) {
				console.log('this.value1', e)
				this.value = this.tempValue;
				this.selectedProvince = this.tempProvince;
				this.selectedCity = this.tempCity;
				this.pickerChanged = true;
				this.$emit('onTimesSelected', this.value); // emit an event with the selected indexes
				// console.log('this.value2', this.value)
			},
			onColumnChange(e) {
				if (e.mp.detail.column === 0) {
					this.tempValue = [e.mp.detail.value, 0];
					this.loadCities(e.mp.detail.value);
				} else {
					this.tempValue[1] = e.mp.detail.value;
				}
				this.tempProvince = this.range[0][this.tempValue[0]];
				this.tempCity = this.range[1][this.tempValue[1]];
			},
			onCancel() {
				if (this.value.length > 0) {
					this.tempValue = [...this.value];
					this.tempProvince = this.selectedProvince;
					this.tempCity = this.selectedCity;
				}
			}
		},
		mounted() {
			this.loadProvinces();
			if (this.value.length > 0) {
				this.tempValue = [...this.value];
				this.loadCities(this.tempValue[0]);
				this.selectedProvince = this.range[0][this.value[0]];
				this.selectedCity = this.range[1][this.value[1]];
				this.tempProvince = this.selectedProvince;
				this.tempCity = this.selectedCity;
			} else {
				this.loadCities(this.tempValue[0]);
			}
		}
	}
</script>



<style lang="scss" scoped>
.container{
	._text{
		font-size: $uni-font-size-base;
		@include color(color-light-dark);
	}
	._text.placeholder{
		@include color(color-lightest-est-dark);
	}
	.mini-youjiantou{
		font-size: $uni-font-size-base;
		display: inline-flex;
		@include color(color-lightest-est-dark);
	}
}
</style>