<template>
<uni-shadow-root class="mini-sph-mini-sph"><view class="sph-wrapper">
    <channel-video v-if="type == 'video'" class="sph-inner video" :feed-id="feedId" :feed-token="feedToken" :finder-user-name="finderUserName" :autoplay="autoplay" :loop="loop" :muted="muted" object-fit="contain" :style="styles">
    </channel-video>
	<channel-live v-if="type == 'live'" class="sph-inner live" :feed-id="feedId" :finder-user-name="finderUserName" :style="styles">
	</channel-live>
</view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'mini-sph/mini-sph'
Component({
    properties: {
		type: {type: String, value: 'video'},
        feedToken: {type: String},
        feedId: {type: String},
        finderUserName: {type: String},
        autoplay: {type: Boolean, value: false},
        loop: {type: Boolean, value: false},
        muted: {type: Boolean, value: false},
		styles: {type: String, value: ''}
    },
    data: {},
    methods: {},
});
export default global['__wxComponents']['mini-sph/mini-sph']
</script>
<style platform="mp-weixin">
.sph-wrapper {
    display: inline-flex;
}

.sph-wrapper .sph-inner{
	
}
</style>