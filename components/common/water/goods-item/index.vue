<template>
    <view class="shop-box" @tap.stop.prevent="toSliderUrl(3, data.id)">
        <image class="shop-box-cover" mode="widthFix" :src="data.pic[0]" />
        <view class="shop-info">
            <view class="shop-info-title">{{ data.name }}</view>
            <view class="shop-info-duce" v-if="data.intro">{{ data.intro }}</view>
			<view class="price">
				<block v-if="data.credit_type == 1">
					<view class="shop-info-vip-price">
						¥<text class="_text">{{ data.vip_price }}</text>
					</view>
					<view class="shop-info-price">
						¥<text class="_text">{{ data.price }}</text>
					</view>
				</block>
				<block v-else-if="data.credit_type === 0">
					<view class="shop-info-price gold">
						<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
						<text class="gold-color _text">{{ data.price }}</text>
					</view>
				</block>
			</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {
        data: Object
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
};
</script>
<style lang="scss">
@import './index.scss';
</style>
