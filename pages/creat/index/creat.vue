<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <navBar :back="true" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#000000' : '#f7f7f7'">
        <!-- #ifdef MP -->
        <view slot="left" class="create-select-editor">
          <view :class=" 'editor-type simple' + (editer == 'simple' ? ' cur' : '')" @tap="switchEditer(1)">发笔记</view>
		  <block v-if="config_page_create_imagetext_switch">
			<view style="width: 25rpx;"></view>
			<view :class=" 'editor-type imagetext' + (editer == 'imagetext' ? ' cur' : '')" @tap="switchEditer(2)" v-if="config_page_create_imagetext_switch">写图文</view>
		  </block>
        </view>
        <!-- #endif -->
        <!-- #ifdef APP || H5 -->
        <view slot="center" class="create-select-editor" :style=" !config_page_create_imagetext_switch ? 'justify-content: left;width: 100%;' : ''">
          <view :class=" 'editor-type simple' + (editer == 'simple' ? ' cur' : '')" @tap="switchEditer(1)">发笔记</view>
		  <block v-if="config_page_create_imagetext_switch">
				<view style="width: 25rpx;"></view>
			    <view :class=" 'editor-type imagetext' + ((editer == 'imagetext' && config_page_create_imagetext_switch) ? ' cur' : '')" @tap="switchEditer(2)" v-if="config_page_create_imagetext_switch">写图文</view>
		  </block>
	    </view>
        <!-- #endif -->
        <view slot="right">
          <i class="create-icon mini-icon mini-a-weibiaoti-10_huaban1 create-post-icon-scene-3" @tap="creatForums"></i>
        </view>
      </navBar>
	  <block v-if=" circle_alert_tip && circle_alert_tip.length > 0 ">
		  <u-alert :title="circle_alert_tip" type = "warning" :closable="true"></u-alert>
	  </block>
      <view class="containers" v-show="editer == 'simple'">
			<textarea class="content-text" :auto-height="true" :adjust-position="false" @input="onContentInput" @focus="focusEditor" @keyboardheightchange="keyboardheightchange" @blur="bCursor" maxlength="3000" :focus="isTextareaFocus"
                :placeholder="config2_placeholder_publish_word" placeholder-class="_input_place_holder" v-model="textinput" :show-confirm-bar="false"></textarea>
        <view class="content-media">
          <view class="media-picture">
            <mini-upload-img ref="miniUploader" style="width: 710rpx;" @uploading=" isUploading = true " :number="20" @change="miniUploadImgChange" :tapUploader="tapUploader" :showAdd="false"></mini-upload-img>
          </view>
		  
		  
          <block v-if="video_url && video_url.length > 0">
            <view class="media-video">
              <!-- #ifdef APP || H5 -->
              <view @tap="create_video_play">
                <dom-video style="width: 400rpx;height: 300rpx;" ref="domVideo" :src="video_url"/>
              </view>
              <!-- #endif -->
              <!-- #ifdef MP -->
              <video class="video-source" :controls="true" :src="video_url"></video>
              <!-- #endif -->
              <i @tap.stop.prevent="onVideoDelete" class="picture-delete mini-icon mini-chacha"></i>
            </view>
          </block>
		  
		  <block v-if="videoProgress > 0 && videoProgress < 100">
			  <view class="media-video">
			    <view class="placeholder-video">
					<view class="box">
						<view class="tip">视频上传中</view>
						<progress :percent="videoProgress" show-info stroke-width="12" border-radius ="40" :activeColor="primaryColor" :backgroundColor="global__theme__ == 'black' ? '#2d2d36' : '#e4e4e4'"/>
					</view>
			    </view>
			  </view>
		  </block>
		  
		  <!-- #ifdef MP-WEIXIN -->
		  <block v-if="is_confirm_sph && sph_video_feed_token && sph_video_feed_token.length ">
			  <view class="media-video">
				<mini-sph :feedToken="sph_video_feed_token" styles="width: 400rpx; height: 300rpx; border-radius: 8rpx;"/>
			  </view>
		  </block>
		  <!-- #endif -->

        </view>
      </view>

      <view class="containers" v-show="editer == 'imagetext'">
        <view class="imgtext-editor">
			<input v-model="posts_title" placeholder="输入标题(选填)" class="posts_title" :placeholder-style=" 'color: ' + (global__theme__ == 'black' ? '#ffffff' : '#000000') + ';' "/>
			<mp-html ref="article" class="_mp_html_edit" :scene="3" :content="imagetext_content" :editable="true" @remove="imagetext_remove_image"/>
        </view>
      </view>

      <view class="add-goods" v-if="goods.length > 0">
        <view class="goods-box" @tap.stop.prevent="toSliderUrl(3, item.id)" v-for="(item, index) in goods"
              :key="index">
          <image class="img" :src="item.pic" mode="aspectFill"></image>

          <view class="name">{{ item.name }}</view>
		  <view class="del-btn">
			  <i class="mini-icon mini-shanchu1" @tap.stop.prevent="delGoods"></i>
		  </view>
        </view>
        <view style="width: 15px; flex-shrink: 0"></view>
      </view>
	  
	  <view class="add-used-goods" v-if="selectUseds.length > 0">
		<view class="inner">
			<view class="list_box" v-for="(item, index) in selectUseds" :key="index" @tap.stop.prevent="toSliderUrl(28, item.id)">
				<view class="list_box_cont">
					<image class="image" :src="item.pic"
						mode="aspectFill"></image>
					<view class="cont">
						<view class="title u-line-1">
							{{ item.title }}
						</view>
						<view class="pirce"><text>￥</text>{{ item.price }}</view>
						<view class="tip">
							想要{{ item.needed_count }}
						</view>
					</view>
					<i class="mini-icon mini-chacha" @tap.stop.prevent="removeSelectUsed(index)"></i>
				</view>
				<view style="height: 20rpx;"></view>
			</view>
		</view>
	  </view>
	  
	  <view class="add-bureau-goods" v-if="selectBureaus.length > 0">
		<view class="inner">
			<view class="list_box" v-for="(item, index) in selectBureaus" :key="index" @tap.stop.prevent="toSliderUrl(34, item.id)">
				<view class="list_box_cont">
					<image class="image" :src="item.pic"
						mode="aspectFill"></image>
					<view class="cont">
						<view class="title u-line-1">
							{{ item.title }}
						</view>
						<view class="pirce">{{ item.least_price_tip }}</view>
						<view class="other-text-wrapper">
						  <u-icon name="clock" size="25" color="A3A3A3"/>
						  <view class="time">{{ item.service_date_start + ' ' + item.service_time_start }}</view>
						</view>
						
						<view class="other-text-wrapper">
						  <u-icon name="map" size="25" color="A3A3A3"/>
						  <view class="address">{{ item.distance }} {{ item.address_detailed }}</view>
						</view>
					</view>
					<i class="mini-icon mini-chacha" @tap.stop.prevent="removeSelectBureau(index)"></i>
				</view>
				<view style="height: 20rpx;"></view>
			</view>
		</view>
	  </view>

      <view class="bottom-wrap" v-if="editer == 'simple'">
        <view v-if="sounds_files && sounds_files.length > 0" class="sounds_files_content upload_files_content">
          <view class="upload_files_list">
            <view v-for="(sounds_item,sound_index) in sounds_files" :key="sound_index" class="file_item">
              <text class="vote_txt">{{ sounds_item.name }}</text>
              <i class="mini-icon mini-chacha color-danger" @tap.stop.prevent="delSoundRecordItem(sound_index)"></i>
            </view>
          </view>
        </view>
        <!-- todo:  v-if="!isVoteContent && config_page_create_max_file > 0" -->
        <view v-if="upload_files && upload_files.length > 0" class="upload_files_content">
          <view class="upload_files_list">
            <view v-for="(file_item,file_index) in upload_files" :key="file_index" class="file_item">
              <text class="vote_txt">{{ file_item.name }}</text>
              <i class="mini-icon mini-chacha color-danger" @tap.stop.prevent="delFileItem(file_index)"></i>
            </view>
          </view>
        </view>
        <view v-if="isVoteContent" class="bottom-item">
          <view class="left">
            <i class="bottom-item-icon mini-icon mini-toupiao-m1"></i>
            <text class="bottom-item-text">投票</text>
          </view>
          <view class="vote_content_list">
            <view v-for="(item,index) in voteInputList" :key="index" class="vote_item">
              <text class="vote_txt">{{ item.value }}</text>
            </view>
            <i class="mini-icon mini-chacha color-danger" @tap.stop.prevent="delVote"></i>
          </view>
        </view>
        <view class="upload_files_content contact_phone" v-if="contact_phone && contact_phone.length > 0">
          <view class="upload_files_list">
            <view class="file_item">
              <view class="vote_txt" @tap.stop.prevent="toolItemTap({id: 108, pos: 1})">
                <i class="mini-icon mini-dianhua inline"></i>
                {{ contact_phone }}
              </view>
              <i class="mini-icon mini-chacha color-danger" @tap.stop.prevent=" contact_phone = '' "></i>
            </view>
          </view>
        </view>
      </view>

      <block v-if="editer == 'imagetext'">
        <view class="container-with" style="min-height: 100vh;" @tap.stop.prevent="imagetext_containers_tap"></view>
      </block>


      <view class="foot-tools" :class="popupLayerClass">
        <view class="three" v-if="tags && tags.length > 0">
          <view class="inner">
            <scroll-view :show-scrollbar="false" scrollX enableFlex="enable-flex" enhanced="enhanced"
                         scrollWithAnimation="scroll-with-animation" :showScrollbar="false" class="tag-all-view">
              <view class="tag-list">
                <view @tap.stop.prevent="removeTag(tag.id)" class="tag-view" v-for="(tag, index) in tags" :key="index"># {{ tag.tags_name }}</view>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="second">
          <view class="inner">
            <view class="left">
              <block v-if="config_page_create_fix2_left.includes('location')">
                <block v-if="locationState">
                  <view class="item location" @tap.stop.prevent="onLocationClick">
                    <view class="icon">
                      <i class="mini-icon mini-pailietubiao-26"></i>
                    </view>
                    <view class="name">添加位置</view>
                  </view>
                </block>
                <block v-else>
                  <view class="item location done" @tap.stop.prevent="delAddsTap">
                    <view class="icon">
                      <i class="mini-icon mini-pailietubiao-26" style="color: #12c05f !important;"></i>
                    </view>
                    <view class="name">{{ location.address_detailed }}</view>
                  </view>
                </block>
              </block>

              <block v-if="config_page_create_fix2_left.includes('circle')">
                <block v-if="circle != '' && circle.id > 0">
                  <view class="item circle done" @tap.stop.prevent="delSelectCircle">
                    <view class="icon">
                      <i class="mini-icon mini-quanzi3 has-circle"></i>
                    </view>
                    <view class="name">{{ circle.circle_name }}</view>
                  </view>
                </block>
                <block v-else>
                  <view class="item circle" @tap.stop.prevent="onSelectCircleClick">
                    <view class="icon">
                      <i class="mini-icon mini-quanzi3"></i>
                    </view>
                    <view class="name">选择圈子</view>
                  </view>
                </block>
              </block>

            </view>
			
            <view class="right">
              <block v-if="config_page_create_fix2_right.includes('pay')">
                <block v-if="pay_content_obj.price > 0">
                  <view class="item" @tap.stop.prevent="toPayConfig">
                    <view :class="'icon ' + (pay_content_obj.credit_type == 0 ? 'seagreen' : 'balance-color') ">
                      <i class="mini-icon mini-lock-full"></i>
                    </view>
                    <view :class="'name ' + (pay_content_obj.credit_type == 0 ? 'seagreen' : 'balance-color')">{{
                        (pay_content_obj.credit_type == 0 ?
                            (config_app_coins_name + '：') :
                            '余额：') + pay_content_obj.price
                      }}
                    </view>
                    <i class="mini-icon mini-shanchu1" @tap.stop.prevent="clean_pay_config" style="color: red;"></i>
                  </view>
                </block>
                <block v-else>
                  <view class="item" @tap.stop.prevent="toPayConfig" v-if="config_app_mode != 'examine'">
                    <view class="icon">
                      <i class="mini-icon mini-unlock-full"></i>
                    </view>
                    <view class="name">付费</view>
                  </view>
                </block>
              </block>
            </view>
          </view>
        </view>

        <view class="first">
          <view class="inner1" v-if="myUserInfo.publish && myUserInfo.publish.length > 0">
            <block v-for="(item, index) in myUserInfo.publish" :key="index">
              <block v-if="(item.pos == 1 && editer == 'simple') || (item.pos == 3 && editer == 'imagetext')">
                <block v-if=" item.id == 101 ">
                  <view :class="'icon ' + (video_url && video_url.length > 0 ? 'disbale' : '') " @tap.stop.prevent="toolItemTap(item)">
                    <i :class="item.icon"></i>
                  </view>
                </block>
                <block v-else-if=" item.id == 102 ">
                  <view :class="'icon ' + (image_urls && image_urls.length > 0 ? 'disbale' : '') " @tap.stop.prevent="toolItemTap(item)">
                    <i :class="item.icon"></i>
                  </view>
                </block>
                <block v-else-if="item.id == 204">
                  <view :class="'icon ' + (upload_files.length >= config_page_create_max_file > 0 ? 'disbale' : '') " @tap.stop.prevent="toolItemTap(item)">
                    <i :class="item.icon"></i>
                  </view>
                </block>
                <block v-else>
                  <view class="icon" @tap.stop.prevent="toolItemTap(item)">
                    <i :class="item.icon"></i>
                  </view>
                </block>
              </block>
            </block>
          </view>
        </view>

        <!-- 抽屉栏 -->
        <view class="popup-layer" @touchmove.stop.prevent="stopPrevent">
          <!-- 表情 -->
          <swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
            <block v-if="config2_emoji.page_1 && config2_emoji.page_1.length > 0">
              <swiper-item class="_swiper-item">
                <scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true">
                  <view class="emoji-srcoll-content">
                    <view class="_view" v-for="(em,index) in config2_emoji.page_1" :key="index" @tap.stop.prevent="addEmoji(em.alt)">
                      <image class="_image" mode="widthFix" :src=" em.emoji "></image>
                    </view>
                  </view>

                </scroll-view>
              </swiper-item>
            </block>
            <block v-if="config2_emoji.page_2 && config2_emoji.page_2.length > 0">
              <swiper-item class="_swiper-item">
                <scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true">
                  <view class="emoji-srcoll-content">
                    <view class="_view" v-for="(em2,index2) in config2_emoji.page_2" :key="index2" @tap.stop.prevent="addEmoji(em2.alt)">
                      <image class="_image" mode="widthFix" :src=" em2.emoji "></image>
                    </view>
                  </view>
                </scroll-view>
              </swiper-item>
            </block>
            <block v-if="config2_emoji.page_3 && config2_emoji.page_3.length > 0">
              <swiper-item class="_swiper-item">
                <scroll-view class="emoji-srcoll" :scroll-y="true" :enable-flex="true">
                  <view class="emoji-srcoll-content">
                    <view class="_view" v-for="(em3,index3) in config2_emoji.page_3" :key="index3" @tap.stop.prevent="addEmoji(em3.alt)">
                      <image class="_image" mode="widthFix" :src=" em3.emoji "></image>
                    </view>
                  </view>
                </scroll-view>
              </swiper-item>
            </block>
          </swiper>

          <!-- 更多功能 相册-拍照-红包 -->
          <view class="more-layer" :class="{hidden:hideMore}">
            <view class="list">
              <block v-for="(item, index) in myUserInfo.publish" :key="index">
                <block v-if="(item.pos == 2 && editer == 'simple') || (item.pos == 4 && editer == 'imagetext')">
                  <block v-if=" item.id == 101 ">
                    <view class="item flex-column" @tap.stop.prevent="toolItemTap(item)">
                      <view :class="'box ' + (video_url && video_url.length > 0 ? 'disbale' : '') ">
                        <i :class="item.icon"></i>
                      </view>
                      <view class="name">{{ item.name }}</view>
                    </view>
                  </block>
                  <block v-else-if=" item.id == 102 ">
                    <view class="item flex-column" @tap.stop.prevent="toolItemTap(item)">
                      <view :class="'box ' + (image_urls && image_urls.length > 0 ? 'disbale' : '') ">
                        <i :class="item.icon"></i>
                      </view>
                      <view class="name">{{ item.name }}</view>
                    </view>
                  </block>
                  <block v-else-if="item.id == 204">
                    <view class="item flex-column" @tap.stop.prevent="toolItemTap(item)">
                      <view :class="'box ' + (upload_files.length >= config_page_create_max_file ? 'disbale' : '') ">
                        <i :class="item.icon"></i>
                      </view>
                      <view class="name">{{ item.name }}</view>
                    </view>
                  </block>
                  <block v-else>
                    <view class="item flex-column" @tap.stop.prevent="toolItemTap(item)">
                      <view class="box">
                        <i :class="item.icon"></i>
                      </view>
                      <view class="name">{{ item.name }}</view>
                    </view>
                  </block>
                </block>
              </block>
            </view>
          </view>
        </view>
		<view class="safe_area_height" :style=" textareaBottom > 0 ? ('height: '+textareaBottom+'px;transition: height 0.1s;') : ''"></view>
      </view>

      <!-- #ifndef MP -->
      <!-- 第二种方案 -->
      <!-- <view @tap="creatForums" class="top-button-confirm footer-btn">
        <image src="/static/image/add.png" />
        发布
      </view> -->
      <!-- #endif -->

      <u-popup :show="linkPopup" @close="toAddLink" :zIndex="999999" closeable>
        <view class="link-box">
          <view class="link-popup-title">
            添加超链接
            <!--            <i class="mini-icon mini-shanchu2" @tap.stop.prevent="toAddLink"/>-->
          </view>
          <view class="link-input">
            <view>名称：</view>
            <input placeholder="请输入链接显示名称" :value="linkName" data-type="0" @input="onLinkInput"/>
          </view>
          <view class="link-input">
            <view>链接：</view>
            <input placeholder="请输入链接地址（要带https://哦）" cursor="9" data-type="1" :value="linkAdds" @input="onLinkInput"/>
          </view>
          <view class="link-add-btn" @tap="openAddLink">确认添加</view>
        </view>
      </u-popup>

      <u-popup :show="showVotePopup" @close="toVote" mode="bottom" :zIndex="999999">
        <you-touchbox ref="touchBox" :auto="false" customStyle="border-radius: 15px 15px 0 0;" maxTop="0.95">
          <view class="vote_box">
            <view class="link-popup-title">
              <view class="vote_complete">
                <text :class="isVoteSumbit?'vote_btn':'vote_btn vote_btn_none'" @tap.stop.prevent="btnSubmitVote">完成</text>
              </view>
              <text class="vote_title">投票</text>
              <i class="mini-icon mini-shanchu2 close-icon" @tap.stop.prevent="toVote"/>
            </view>
            <view class="vote_content">
              <view v-for="(item_input,index_input) in voteInputList" :key="index_input" class="input-wrap">
                <input class="vote_input" @input="btnVoteInput" adjust-position="false"
                       :placeholder="'选项' + (index_input + 1) " :data-index="index_input" :value="item_input.value"/>
                <i v-if="index_input>1" class="mini-icon mini-chacha color-danger" @tap.stop.prvent="btnDelVoteItem(index_input)"></i>
              </view>
              <text v-if="isBtnVoteAddShow" class="vote_add" @tap.stop.prevent="btnAddVoteItem">+ 添加一个选项</text>
            </view>
          </view>
        </you-touchbox>
      </u-popup>

      <u-popup :show="showPayConfigPopup" @close="toPayConfig" mode="bottom" :zIndex="99999">
        <you-touchbox ref="touchBox" :auto="false" customStyle="border-radius: 15px 15px 0 0;" maxTop="0.9" initTop="0.7">
          <view class="payconfig_box">
            <view class="dialog_box_title">
              <text class="title">付费设置</text>
              <i class="mini-icon mini-shanchu2" @tap.stop.prevent="toPayConfig"></i>
            </view>
            <view class="dialog_conent">
              <view class="item">
                <view class="title">文字</view>
                <view class="desc">免费查看字数/%</view>
                <slider :value="pay_content_obj.words_percent" style="margin: 40rpx 10rpx 30rpx 20rpx;" :activeColor="primaryColor" @change="pay_words_percent_change" min="50" max="100" show-value/>
              </view>
			  <view class="item flex-row">
			    <view class="title">隐藏图片</view>
			    <textSwitch :checked="pay_content_obj.is_img == 1" :disable="!(config_pays.paycode_7 == true)" disable_tip="不支持该功能" uncheck_text="关闭" checked_text="开启" @change="switch_pay('img')" width="130" style="transform:scale(0.8)"></textSwitch>
			  </view>
			  <!-- <view class="item flex-row">
			    <view class="title">隐藏视频</view>
			    <textSwitch :checked="pay_content_obj.is_video == 1" :disable="!(config_pays.paycode_7 == true)" disable_tip="不支持该功能" uncheck_text="关闭" checked_text="开启"
			                @change="switch_pay('video')" width="130" style="transform:scale(0.8)"></textSwitch>
			  </view> -->
              <view class="item flex-row">
                <view class="title">隐藏附件</view>
                <textSwitch :checked="pay_content_obj.is_file == 1" :disable="!(config_pays.paycode_7 == true)" disable_tip="不支持该功能" uncheck_text="关闭" checked_text="开启"
                            @change="switch_pay('file')" width="130" style="transform:scale(0.8)"></textSwitch>
              </view>
              <view class="item">
                <textarea :value="pay_content_obj.hidden" @input="pay_hidden_input" class="pay_content" placeholder="隐藏内容" :maxlength="2000"
                          placeholder-style="color:#999; font-size:26rpx" :fixed="true" :show-confirm-bar="false"/>
              </view>
              <view class="item flex-row">
                <view class="title">付费价格 <i style="display: inline;color: red;">*</i></view>
                <view class="flex-row">
                  <input class="price_input" maxlength="5" @input="price_input_event" :value="pay_content_obj.price" type="number" placeholder="数额"
                         placeholder-style="font-size: 26rpx; color: #ccc;"/>
                  <textSwitch :checked="pay_content_obj.credit_type == 1" :disable="!(config_pays.paycode_7 == true)" disable_tip="不支持该功能"
                              :uncheck_text="config_app_coins_name" checked_text="余额" @change="switch_price_type" width="130" style="transform:scale(0.8)"></textSwitch>
                </view>

              </view>
			  <view style="height: 30rpx;"></view>
            </view>
            <uni-view class="dialog_tips">平台保留付费内容处置权利，请勿发布违规内容</uni-view>
          </view>
        </you-touchbox>
      </u-popup>


      <!-- <u-popup :show="publishWarnPopup" @close="confirmNotice">
        <view class="publishWarnPopupWrap">
          <view class="items-img">
            <i class="notice-img mini-icon mini-chacha"></i>
          </view>
          <view class="items-warn">
            <view>我们拒绝以下内容：</view>
            <view>1、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的信息</view>
            <view>2、侮辱或者诽谤他人，侵害他人合法权益的信息</view>
            <view>3、煽动民族仇恨、民族歧视，破坏民族团结的信息</view>
          </view>
          <view class="items-warn-button" @tap.stop.prevent="confirmNotice">朕知道了</view>
        </view>
      </u-popup> -->

      <u-popup :show="!(myUserInfo && myUserInfo.id > 0)">
        <view class="login-tip-popup">
          <image class="login-tip-popup-img" :src="config_about_logo"></image>
          <view class="login-tip-popup-title">温馨提示</view>
          <view class="login-tip-popup-content">检测到您还未登录</view>
          <view class="login-tip-popup-btn" @tap.stop.prevent="toSliderUrl(-4, null)">立即登录</view>
          <view class="login-tip-popup-btn-2" @tap.stop.prevent="navigateBack">继续浏览</view>
        </view>
      </u-popup>
	  
	  <u-popup :show="taokePublishPopup" @close="shutTaokePublishPopup">
	    <view class="taokePublishPopupWrap">
			<view class="title">
				<view class="left">
					第三方商品
				</view>
				<view class="right">
					<i class="mini-icon mini-shejiaotubiao-44" style="color: #fc8848;"></i>
					<i class="mini-icon mini-jingdong2" style="color: #e21b1a;"></i>
					<i class="mini-icon mini-pinduoduo" style="color: #f50008;"></i>
					<i class="mini-icon mini-douyin" style="color: #000000;"></i>
				</view>
			</view>
			<view class="content">
				<textarea
				class="_textarea"
				placeholder="粘贴淘宝, 京东, 拼多多等的商品链接"
				:style="'height:440rpx;min-height:440rpx;font-size: 26rpx; width: 600rpx;'"
				:auto-height="false"
				:focus=" false "
				v-model="taoke_parse_url"
				maxlength="1000"
				:cursor-spacing="60"
				:show-confirm-bar="false"
				:adjust-position="false"
				:auto-blur="true"
				confirm-type="done"
				></textarea>
			</view>
			<view class="bottom">
				<button :loading="taoke_parse_loading" class="u-reset-button taoke-parse-button" @tap.stop.prevent="taokeParseUrl">立即解析</button>
			</view>
	    </view>
	  </u-popup>
	  
	  <u-popup :show="sphPopup" @close="shutSphPopup">
		<view class="sph-popup-wrap">
			<view class="content flex-row">
				<view class="left">
					<textarea
					class="_textarea"
					placeholder="粘贴feed-token"
					:style="'height:570rpx;min-height:570rpx;font-size: 26rpx; width: 350rpx;'"
					:auto-height="false"
					:focus=" false "
					v-model="sph_video_feed_token"
					maxlength="1000"
					:cursor-spacing="60"
					:show-confirm-bar="false"
					:adjust-position="false"
					:auto-blur="true"
					confirm-type="done"
					@confirm="confirm_sph_input"
					></textarea>
				</view>
				<view class="right">
					<block v-if="sph_image_urls && sph_image_urls.length > 0">
						<view class="img_item">
							<image class="upload_img" :src="sph_image_urls[0].url" mode="aspectFill"></image>
							<i class="delete_icon mini-icon mini-shanchu1" @tap.stop.prevent="deleteSphImg"></i>
						</view>
					</block>
					<block v-else>
						<view class="img_item upload" @tap.stop.prevent="uploadSphImg">
							<i class="mini-icon mini-jia upload-icon"></i>
						</view>
					</block>
				</view>
			</view>
			<view class="confirm_btn" @tap.stop.prevent="confirm_sph_input">立即添加</view>
		</view>
	  </u-popup>
	  

      <block v-if="modal">
        <view class="mask"/>
        <view class="modal">
          <view class="modal_title">{{ modal.title }}</view>
          <input class="modal_input" :value="modal.value" maxlength="-1" auto-focus @input="modalInput"/>
          <view class="modal_foot">
            <view class="modal_button" @tap="modalCancel">取消</view>
            <view class="modal_button" style="color:#576b95;border-left:1px solid rgba(0,0,0,.1)"
                  @tap="modalConfirm">确定
            </view>
          </view>
        </view>
      </block>
	  
	  <u-popup :show="showUsedSelectPopup" @close="shutUsedSelectPopup" mode="bottom" :safe-area-inset-bottom="false" :zIndex="99999991009">
	  	<view class="used-select-warap">
	  		<view class="inner">
	  			<view class="title">
	  				选择闲置商品
	  				<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutUsedSelectPopup"></i>
	  			</view>
				<view class="search"><u-search :showAction="true" actionText="搜索" :animation="true" v-model="usedParas.search" @search="getUsedGoodsSearch(1)" @clear="getUsedGoodsSearch(1)"></u-search></view>
	  			<view class="used-tabs">
					<view :class="'tab ' + (usedParas.uid > 0 ? '' : 'active')" @tap.stop.prevent="usedTabClick(0)">全部</view>
					<view :class="'tab ' + (usedParas.uid > 0 ? 'active' : '')" @tap.stop.prevent="usedTabClick(1)">我发布</view>
				</view>
				<scroll-view :scroll-y="true" class="used-select-wrap" @scrolltolower="onReachUsedBottom">
					<block v-if="usedParas.goods && usedParas.goods.length > 0">
						<view class="list_box" v-for="(item, index) in usedParas.goods" :key="index" @tap.stop.prevent="selectUsedGood(item)">
							<view class="list_box_cont">
								<image class="image" :src="item.pic"
									mode="aspectFill"></image>
								<view class="cont">
									<view class="title_">
										{{ item.title }}
									</view>
									<view class="pirce"><text class="_text">￥</text>{{ item.price }}</view>
									<view class="tip">
										想要{{ item.needed_count }}
									</view>
								</view>
							</view>
						</view>
						<u-loadmore v-if="usedParas.loadmoreShow" :status="usedParas.isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898" bgClass="page-box-background-color"/>
						<view style="height: 30rpx;"></view>
					</block>
					<block v-else>
						<u-empty text="空空如也" width="300" height="300" text-size="28" />
					</block>
				</scroll-view>
	  		</view>
	  	</view>
	  </u-popup>
	  
	<u-popup :show="showBureauSelectPopup" @close="shutBureauSelectPopup" mode="bottom" :safe-area-inset-bottom="false" :zIndex="99999991009">
		<view class="bureau-select-warap">
			<view class="inner">
				<view class="title">
					选择组局
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutBureauSelectPopup"></i>
				</view>
				<view class="search"><u-search :showAction="true" actionText="搜索" :animation="true" v-model="bureauParas.search" @search="getBureauGoodsSearch(1)" @clear="getBureauGoodsSearch(1)"></u-search></view>
				<view class="bureau-tabs">
					<view :class="'tab ' + (bureauParas.uid > 0 || bureauParas.collected == 1 ? '' : 'active')" @tap.stop.prevent="bureauTabClick(0)">全部</view>
					<view :class="'tab ' + (bureauParas.uid > 0 ? 'active' : '')" @tap.stop.prevent="bureauTabClick(1)">我的</view>
					<view :class="'tab ' + (bureauParas.collected == 1 ? 'active' : '')" @tap.stop.prevent="bureauTabClick(2)">已收藏</view>
				</view>
				<scroll-view :scroll-y="true" class="bureau-select-wrap" @scrolltolower="onReachBureauBottom">
					<block v-if="bureauParas.goods && bureauParas.goods.length > 0">
						<view class="list_box" v-for="(item, index) in bureauParas.goods" :key="index" @tap.stop.prevent="selectBureauGood(item)">
							<view class="list_box_cont">
								<image class="image" :src="item.pic"
									mode="aspectFill"></image>
								<view class="cont">
									<view class="title_">
										{{ item.title }}
									</view>
									<view class="pirce">{{ item.least_price_tip }}</view>
									<view class="other-text-wrapper">
									  <u-icon name="clock" size="25" color="A3A3A3"/>
									  <view class="time">{{ item.service_date_start + ' ' + item.service_time_start }}</view>
									</view>
									
									<view class="other-text-wrapper">
									  <u-icon name="map" size="25" color="A3A3A3"/>
									  <view class="address">{{ item.distance }} {{ item.address_detailed }}</view>
									</view>
								</view>
							</view>
						</view>
						<u-loadmore v-if="bureauParas.loadmoreShow" :status="bureauParas.isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898" bgClass="page-box-background-color"/>
						<view style="height: 30rpx;"></view>
					</block>
					<block v-else>
						<u-empty text="空空如也" width="300" height="300" text-size="28" />
					</block>
				</scroll-view>
			</view>
		</view>
	  </u-popup>

      <hover-ball v-if="isOfficial > 1"/>
      <my-toast unicom-id="mytotast_3_0" ref="mytoast" :isdistance="true" :toast="mytoast_data" @acceptAiteUser="acceptAiteUser"></my-toast>
      <jc-record ref="soundRecorder" :maxTime="120" :minTime="1" @okClick="saveSoundRecord"></jc-record>
      <l-file ref="lFile" :logo="config_about_logo" @up-success="upload_file_onSuccess"></l-file>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';
	
let debounce = null;
import textSwitch from "@/components/text-li-switch/text-li-switch.vue";
import jcRecord from '@/pages/creat/components/jc-record/jc-record.vue';
import domVideo from '@/contrib/components/common/ls-dom-video/ls-dom-video';
import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
import LFile from '@/pages/creat/components/l-file/components/l-file/l-file';

import mycos from '@/pages/creat/lib/mycos.js';

const common = require('@/mixins/common');
const forum = require('@/mixins/forum');
var options = {};
common(options);
forum(options);

// 上传图片方法
function upload(src, type) {
  return new Promise(function (resolve, reject) {
    uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', src, 3).then(function (res) {
      resolve(res.data)
    }).catch(function (err) {
      uni.showToast({
        title: err,
        icon: 'none'
      });
    });
  });
}

export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,mpHtml,
    jcRecord,
    domVideo,
    textSwitch,
    miniUploadImg,
	LFile
  },
  computed: {
	config_pays:{
		get(){
			let that = this;
			if(that.$store.state.config && that.$store.state.config.pays){
				return that.$store.state.config.pays || {};
			}
			return {};
		},
		set(v){}
	},
	config_app_mode:{
		get(){
			let that = this;
			return that.$store.state.config.app.mode;
		},
		set(v){}
	},
	config_page_create_fix2_left: {
	  get() {
	    let that = this;
		if(that.$store.state.config.page.create.fix2_left){
			return that.$store.state.config.page.create.fix2_left;
		}
		return ['location', 'circle'];
	  },
	  set(v) {}
	},
	config_page_create_fix2_right: {
	  get() {
	    let that = this;
		if(that.$store.state.config.page.create.fix2_right){
			return that.$store.state.config.page.create.fix2_right;
		}
		return ['pay'];
	  },
	  set(v) {}
	},
    userInfo: {
      get() {
        let that = this;
        return that.$store.state.userInfo;
      },
      set(v) {}
    },
    editer_switch_statu: {
      get() {
        let that = this;
        return (that.editer == 'simple');
      },
      set(v) {}
    },
    config_about_logo: {
      get() {
        let that = this;
        return that.$store.state.config.about.logo;
      },
      set(v) {}
    },
    config_page_create_max_blance: {
      get() {
        let that = this;
        return that.$store.state.config.page.create.max_blance;
      },
      set(v) {}
    },
    config_page_create_max_coins: {
      get() {
        let that = this;
        return that.$store.state.config.page.create.max_coins;
      },
      set(v) {}
    },
    config_page_create_max_file: {
      get() {
        let that = this;
        return that.$store.state.config.page.create.max_file;
      },
      set(v) {}
    },
    config_page_create_imagetext_switch: {
      get() {
        let that = this;
        return that.$store.state.config.page.create.imagetext_switch;
      },
      set(v) {}
    },
    config_app_coins_name: {
      get() {
        let that = this;
        if (that.$store.state.config.app.coins) {
          return that.$store.state.config.app.coins.name;
        }
        return '硬币';
      },
      set(v) {}
    },
    config2_placeholder_publish_word: {
      get() {
        let that = this;
        if (that.$store.state.config2.placeholder && that.$store.state.config2.placeholder.publish_word) {
          return that.$store.state.config2.placeholder.publish_word;
        }
        return '分享我的笔记';
      },
      set(v) {}
    },
    config2_emoji: {
      get() {
        let that = this;
        return that.$store.state.config2.emoji;
      },
      set(v) {}
    },
	circle_alert_tip: {
		get() {
		  let that = this;
		  if(that.circle && that.circle.id > 0){
			let str_ = '';
			if(that.circle.is_publish_follow == 1){
				if(str_ != ''){
					str_ += '/';
				}
				str_ += '已关注';
			}
			if(that.circle.is_publish_vip == 1){
				if(str_ != ''){
					str_ += '/';
				}
				str_ += '会员';
			}
			if(that.circle.is_publish_authentication == 1){
				if(str_ != ''){
					str_ += '/';
				}
				str_ += '认证';
			}
			if(that.circle.is_publish_admin == 1){
				if(str_ != ''){
					str_ += '/';
				}
				str_ += '管理员';
			}
			if(that.circle.is_publish_pay == 1){
				if(str_ != ''){
					str_ += '/';
				}
				str_ += '付费';
				if(that.circle.publish_pay_num > 0){
					if(that.circle.publish_pay_credit == 1){
						str_ += '(' + that.circle.publish_pay_num + '余额/次)';
					}else{
						str_ += '(' + that.circle.publish_pay_num + that.config_app_coins_name + '/次)';
					}
				}
			}
			if(str_.length > 0){
				return '本圈仅允许“' + str_ + '”方式发布';
			}
		  }
		  return '';
		},
		set(v) {}
	}
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 3,
      type: 'forums',
      publishWarnPopup: false,
      editer: 'simple',
	  posts_title: '',
      imagetext_content: '',
      pictureMax: 20,
      format: 'standard',
      image_urls: [],
      tags: [],
      goods: [],

      location: {
        address_detailed: ''
      },

	  isUploading: false,
      textinput: '',
      textLength: 0,
      textLengthMix: 3000,
	  circle: {
		  id: 0,
		  circle_name: ''
	  },
      video_url: '',
      video_thumb_url: '',
      video_height: 0,
      video_width: 0,
      locationState: true,
      linkPopup: false,
      linkName: '',
      linkAdds: 'https://',
      cursor: 0,
      user: '',

      tag: {
        tags_name: ''
      },
      // 是否草稿箱提示
      draftShow: true,
      showVotePopup: false,
      voteInputList: [{
        value: ''
      },
        {
          value: ''
        }
      ], //投票选项数量
      isBtnVoteAddShow: true, //是否显示添加投票btn
      isVoteContent: false, //投票内容框
      isVoteSumbit: false, //投票是否可以提交
      modal: null,
      upload_files: [],
      sounds_files: [],
      showPayConfigPopup: false,
      pay_content_obj: {
        words_percent: 100,
        is_file: 0,
		is_img: 0,
		is_video: 0,
        credit_type: 0,
        hidden: '',
        price: 0
      },

      isTextareaFocus: false,
      textareaBottom: 0,
      tapUploader: 0,


      // 抽屉参数
      popupLayerClass: '',
      // more参数
      hideMore: true,
      //表情定义
      hideEmoji: true,

      contact_phone: '',
	  
	  taokePublishPopup: false,
	  taoke_parse_url: '',
	  taoke_parse_loading: false,
	  
	  sphPopup: false,
	  sph_video_feed_token: '',
	  is_confirm_sph: false,
	  sph_image_urls: [],
	  
		showUsedSelectPopup: false,
		usedParas: {
		classify: {
			id: 0,
			name: ''
		},
		uid: 0,
		search: '',
		orderBy: 'id',
		order: 'desc',
		minPrice: 0,
		maxPrice: 9999999999,
		page: 1,
		loadmoreShow: false,
		isLastPage: false,
		goods: []
		},
		selectUseds: [],
	  
		showBureauSelectPopup: false,
		bureauParas: {
		classify: {
			id: 0,
			name: ''
		},
		uid: 0,
		search: '',
		collected: 0,
		orderBy: 'id',
		order: 'desc',
		page: 1,
		loadmoreShow: false,
		isLastPage: false,
		goods: []
		},
		selectBureaus: [],
	  
		videoProgress: 0
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
	
    that.globalOnloadProcess(options);
	
	if(that.$store.state.token){
		that.isTextareaFocus = true;
	}

    let pictureMax = 9 - that.image_urls.length;
    if (options && 'type' in options) {
		setTimeout(function(){
			if (options.type == 1) {
				if (that.video_url && that.video_url.length > 0) {
			      return false;
			    }
			    that.setData({
			      tapUploader: that.tapUploader + 1
			    });
			}else if (options.type == 2) {
				if (that.image_urls.length > 0) {
					return false;
				}
				that.uploadPictures(3, 'video_url');
				that.setData({
					format: 'video'
				});
			}
		}, 700)
    }
    uni.getStorage({
      key: 'releaseDraft',
      success: (res) => {
        const data = JSON.parse(res.data)

        if (data) {
          that.setData({
            textinput: data.textinput || '',
            textLength: data.textLength || 0,
            image_urls: data.image_urls || [],
            video_url: data.video_url || '',
            video_thumb_url: data.video_thumb_url || '',
            video_height: data.video_height || 0,
            video_width: data.video_width || 0,
            voteInputList: data.voteInputList || [{ value: '' }, { value: '' }],
            isBtnVoteAddShow: data.isBtnVoteAddShow || true, //是否显示添加投票btn
            isVoteContent: data.isVoteContent || false, //投票内容框
            isVoteSumbit: data.isVoteSumbit || false, //投票是否可以提交
            imagetext_content: data.imagetext_content || '',
            editer: data.editer || 'simple',
            upload_files: data.upload_files || [],
            sounds_files: data.sounds_files || [],
          });
		  if(that.image_urls && that.image_urls.length > 0){
			that.$refs.miniUploader.setInitValue(that.image_urls);
		  }
        }
		uni.removeStorage({
			key: 'releaseDraft'
		});
      }
    })

    if (that.$store.state.userInfo.phone && that.$store.state.userInfo.phone.length) {
      let publishWarnPopup = uni.getStorageSync('publishWarnPopup');
      if (publishWarnPopup != 1) {
        setTimeout(function () {
          that.publishWarnPopup = true;
          uni.setStorageSync('publishWarnPopup', 1);
        }, 3000);
      }
    }
	
	if(options.tag_id && options.tag_id > 0){
		setTimeout(function(){
			that.addTags(options.tag_id, options.tags_name)
		}, 200);
	}
	
  },
  onPullDownRefresh: function() {
	uni.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(3, 0, false, false, 0, 2);

    that.setData({
      user: that.$store.state.userInfo,
      tags: uni.getStorageSync('userSelectedTags'),
      goods: uni.getStorageSync('postsGoods')
    });
	
	let selectCircle = uni.getStorageSync('userSelectedCircle');
    if (selectCircle != '' && selectCircle.id > 0 && selectCircle.circle_name) {
	  that.circle = selectCircle;
    }
	
  },
  onHide: function () {
    let that = this;
    // #ifdef MP
    if (that.isShowDraftTip()) {
      that.saveDraft();
    }
    // #endif
  },
  // 监听返回按钮
  onBackPress() {
    // 如果有内容
    let that = this;
    if (that.isShowDraftTip()) {
      that.tipDraft()
      return true // 不执行默认返回
    }else{
		uni.removeStorage({
		  key: 'releaseDraft'
		});
	}
	
  },
  onReady() {
    let that = this;
    setTimeout(function(){
    	that.article_getsrc_init();
    }, 200);
  },
  methods: {
	removeSelectUsed(index){
		let that = this;
		that.selectUseds.splice(index, 1);
	},
	removeSelectBureau(index){
		let that = this;
		that.selectBureaus.splice(index, 1);
	},
	selectUsedGood(item){
		let that = this;
		that.selectUseds.push(item);
		that.shutUsedSelectPopup();
	},
	selectBureauGood(item){
		let that = this;
		that.selectBureaus.push(item);
		that.shutBureauSelectPopup();
	},
	usedTabClick(type){
		let that = this;
		if(type > 0){
			that.usedParas.uid = that.myUserInfo.id;
		}else{
			that.usedParas.uid = 0;
		}
		that.getUsedGoodsSearch(1);
	},
	bureauTabClick(type){
		let that = this;
		if(type == 1){
			that.bureauParas.uid = that.myUserInfo.id;
			that.bureauParas.collected = 0;
		}else if(type == 2){
			that.bureauParas.uid = 0;
			that.bureauParas.collected = 1;
		}else{
			that.bureauParas.uid = 0;
			that.bureauParas.collected = 0;
		}
		that.getBureauGoodsSearch(1);
	},
	onReachUsedBottom(){
		let that = this;
		if(!that.usedParas.isLastPage && that.usedParas.goods.length > 0){
			that.usedParas.page = that.usedParas.page + 1;
			that.usedParas.loadmore = true;
			that.getUsedGoodsSearch();
		}
	},
	onReachBureauBottom(){
		let that = this;
		if(!that.bureauParas.isLastPage && that.bureauParas.goods.length > 0){
			that.bureauParas.page = that.bureauParas.page + 1;
			that.bureauParas.loadmore = true;
			that.getBureauGoodsSearch();
		}
	},
	getBureauGoodsSearch(type) {
		let that = this;
		if(type == 1){
			// 刷新
			uni.loading(true);
			that.bureauParas.isLastPage = false;
			that.bureauParas.page = 1;
			that.bureauParas.loadmoreShow = false;
		}else{
			// 更多
			if(that.bureauParas.isLastPage){
				return false;
			}
			that.bureauParas.loadmoreShow = true;
		}
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/list', {
			user_id: that.bureauParas.uid,
			keyword: that.bureauParas.search,
			page: that.bureauParas.page,
			collected: that.bureauParas.collected,
			orderBy: that.bureauParas.orderBy,
			classify: that.bureauParas.classify.id,
			order: that.bureauParas.order,
			minPrice: that.bureauParas.minPrice,
			maxPrice: that.bureauParas.maxPrice
		}).then(function(res) {
			
			if(type == 1){
				uni.loading(false);
			}
			if(res.status){
				if(res.data.current_page != that.bureauParas.page){
					return false;
				}
				
				let data = res.data;
				let args = {};
					
				if (data.data.length > 0) {
					if(type == 1){
						that.bureauParas.goods = data.data;
					}else{
						that.bureauParas.goods = that.bureauParas.goods.concat(data.data);
					}
					if(data.data.length < 10){
						that.bureauParas.isLastPage = true;
						that.bureauParas.loadmoreShow = true;
					}else{
						that.bureauParas.loadmoreShow = false;
					}
				}else{
					if(type == 1){
						that.bureauParas.goods = [];
					}
					that.bureauParas.isLastPage = true;
					that.bureauParas.loadmoreShow = true;
				}
				that.bureauParas.page = data.current_page;
			}
			
		});
	},
	getUsedGoodsSearch(type) {
		let that = this;
		if(type == 1){
			// 刷新
			uni.loading(true);
			that.usedParas.isLastPage = false;
			that.usedParas.page = 1;
			that.usedParas.loadmoreShow = false;
		}else{
			// 更多
			if(that.usedParas.isLastPage){
				return false;
			}
			that.usedParas.loadmoreShow = true;
		}
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/list', {
			user_id: that.usedParas.uid,
			keyword: that.usedParas.search,
			page: that.usedParas.page,
			orderBy: that.usedParas.orderBy,
			classify: that.usedParas.classify.id,
			order: that.usedParas.order,
			minPrice: that.usedParas.minPrice,
			maxPrice: that.usedParas.maxPrice
		}).then(function(res) {
			
			if(type == 1){
				uni.loading(false);
			}
			if(res.status){
				if(res.data.current_page != that.usedParas.page){
					return false;
				}
				
				let data = res.data;
				let args = {};
					
				if (data.data.length > 0) {
					if(type == 1){
						that.usedParas.goods = data.data;
					}else{
						that.usedParas.goods = that.usedParas.goods.concat(data.data);
					}
					if(data.data.length < 10){
						that.usedParas.isLastPage = true;
						that.usedParas.loadmoreShow = true;
					}else{
						that.usedParas.loadmoreShow = false;
					}
				}else{
					if(type == 1){
						that.usedParas.goods = [];
					}
					that.usedParas.isLastPage = true;
					that.usedParas.loadmoreShow = true;
				}
				that.usedParas.page = data.current_page;
			}
			
		});
	},
	shutUsedSelectPopup(){
		let that = this;
		that.showUsedSelectPopup = !that.showUsedSelectPopup;
		if(that.showUsedSelectPopup && that.usedParas.goods.length <= 0){
			that.getUsedGoodsSearch(1);
		}
	},
	shutBureauSelectPopup(){
		let that = this;
		that.showBureauSelectPopup = !that.showBureauSelectPopup;
		if(that.showBureauSelectPopup && that.bureauParas.goods.length <= 0){
			that.getBureauGoodsSearch(1);
		}
	},
	addTags: function (tag_id, tags_name) {
	  let that = this;
	  let userSelectedTags = uni.getStorageSync('userSelectedTags');
	  if(!userSelectedTags){
		userSelectedTags = new Array();
	  }
	  let readsave = true; // 过滤重复值
	
	  if (userSelectedTags.length > 0) {
	    for (let i = 0; i < userSelectedTags.length; i++) {
	      if (userSelectedTags[i].id == tag_id) {
	        readsave = false;
	        uni.showToast({
	          title: '您已经添加过该话题了',
	          icon: 'none'
	        });
	        break;
	      }
	    }
	  }
	
	  if (readsave) {
	    let args = {};
	    args.id = tag_id;
	    args.tags_name = tags_name;
	    userSelectedTags.unshift(args);
	    uni.setStorageSync('userSelectedTags', userSelectedTags);
		that.tags.unshift(args);
	  }
	},
	removeTag: function (tag_id) {
	  let that = this;
	  let list = uni.getStorageSync('userSelectedTags');
	
	  for (var i = 0; i < list.length; i++) {
	    if (list[i].id === tag_id) {
	      list.splice(i, 1);
		  that.tags.splice(i, 1);
	    }
	  }
	  uni.setStorageSync('userSelectedTags', list);
	},
	keyboardheightchange(e){
		let that = this;
		that.textareaBottom = e.detail.height;
	},
	deleteSphImg(){
		let that = this;
		that.sph_image_urls = []
	},
	uploadSphImg(){
		let that = this;
	
		let _uploadSphImg = (sourceType) => {
			uni.chooseImage({
				count: 1,
				sourceType: [sourceType],
				sizeType: ['original'],
			
				success(res) {
					uni.loading(true);
					const tempFilePaths = res.tempFilePaths;
					uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function(res) {
						uni.loading(false);
						if(res.status){
							that.sph_image_urls.push({ url: res.data });
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1500
							});
						}
					});
				},
			
				fail(err) {
			
				}
				
			});
		};

		uni.showActionSheet({
			itemList: ['拍摄', '从相册选择'],
			success: function (res) {
				
				// #ifdef MP
				_uploadSphImg(res.tapIndex === 1 ? 'album' : 'camera')
				// #endif
				
				// #ifdef APP
				uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于发表图片笔记' : '[摄像头权限]获取您此刻所拍的照片，用于发表图片笔记', () => {
					_uploadSphImg(res.tapIndex === 1 ? 'album' : 'camera')
				}, that);
				// #endif
				
				// #ifdef H5
				_uploadSphImg(res.tapIndex === 1 ? 'album' : 'camera')
				// #endif
		
			},
			fail: function (res) {
				console.log(res.errMsg);
			}
		});
		
		
	},
	confirm_sph_input(){
		let that = this;
		if(!that.sph_video_feed_token || that.sph_video_feed_token.lenght <= 0){
			uni.showToast({
				title: 'feed-token错误',
				icon: 'none'
			});
			return false;
		}
		that.is_confirm_sph = true;
		that.sphPopup = false;
	},
	shutTaokePublishPopup(){
		let that = this;
		that.taokePublishPopup = !that.taokePublishPopup;
	},
	shutSphPopup(){
		let that = this;
		that.sphPopup = !that.sphPopup;
	},
    navigateBack() {
      // 判断上一次是否还有栈、否则跳回首页
      const res = getCurrentPages()
      if (res.length > 1) {
        uni.navigateBack({ delta: 1 })
      } else {
        uni.switchTab({ url: '/pages/tabbar/index/index' });
      }
    },
    // 选择表情
    chooseEmoji(type) {
      let that = this;
      if (type == 1) {
        that.hideMore = true;

        if (that.hideEmoji) {
          that.hideEmoji = false;
          that.openDrawer();
        } else {
          that.hideDrawer();
        }

      } else {
        that.setData({
          hideMore: true,
          hideEmoji: true
        });
        that.hideDrawer();
      }

    },

    //添加表情
    addEmoji(alt) {
      let that = this;
      setTimeout(function () {
        if (that.cursor > 0) {
          that.setData({
            textinput: that.textinput.slice(0, that.cursor) + alt + ' ' + that.textinput.slice(that.cursor),
            showSendBtn: true,
			cursor: that.cursor + alt.lenght
          });
        } else {
          that.setData({
            textinput: that.textinput + alt,
            showSendBtn: true,
			cursor: that.cursor + alt.lenght
          });
        }
      }, 100);
    },
    //更多功能(点击+弹出)
    showMore() {
      this.isVoice = false;
      this.hideEmoji = true;
      if (this.hideMore) {
        this.hideMore = false;
        this.openDrawer();
      } else {
        this.hideDrawer();
      }
    },
    // 打开抽屉
    openDrawer() {
      this.popupLayerClass = 'showLayer';
    },
    // 隐藏抽屉
    hideDrawer() {
      this.popupLayerClass = '';
      setTimeout(() => {
        this.hideMore = true;
        this.hideEmoji = true;
      }, 150);
    },
    miniUploadImgChange(data) {
      let that = this;
      let image_urls = [];
      for (var i = 0; i < data.urls.length; i++) {
        image_urls.push({
          url: data.urls[i]
        })
      }
      that.setData({
        image_urls: image_urls,
		isUploading: false
      });
    },
    toolItemTap(item) {
      let that = this;
	  
	  if(that.publishWarnPopup){
		  that.publishWarnPopup = false;
	  }
	  
      if (item.id == 106 || item.id == 308) {
        that.showMore()
        return false;
      }

      if (item.pos == 2 || item.pos == 4) {
        that.showMore()
      }

      if (item.id == 101) {
        // 上传图片
        // that.setData({
        // 	format: 'standard'
        // });
        // that.uploadPictures(2, 'url', 20);
        if (that.video_url && that.video_url.length > 0) {
          return false;
        }
        that.setData({
          tapUploader: that.tapUploader + 1
        });
        return false;
      } else if (item.id == 102) {
        if (that.image_urls.length > 0) {
          return false;
        }
		that.setData({
		  format: 'video'
		});
        mycos.cosUploadPictures(that, 3, 'video_url');
        return false;
      } else if (item.id == 103) {
        that.onTagClick();
        return false;
      } else if (item.id == 104) {
        uni.showToast({
          title: '程序员小哥哥还没来得及写',
          icon: 'none'
        });
        return false;
      } else if (item.id == 105) {
        that.chooseEmoji(1);
        return false;
      } else if (item.id == 107) {
        that.openAiteUser(true);
        return false;
      } else if (item.id == 108) {
        uni.showModal({
          title: '请输入手机号',
          content: that.contact_phone,
          editable: true,
          success: res => {
            if (res.confirm && res.content.trim() !== '') {
              let phone = res.content.trim();
              if (!uni.wen.util.validatePhoneNumber(phone)) {
                uni.showToast({ title: '非法手机号！', icon: 'none', duration: 2000 });
                return;
              }
              that.contact_phone = phone;
            }
          }
        })
        return false;
      } else if (item.id == 201) {
        that.toSoundRecord();
        return false;
      } else if (item.id == 202) {
        that.toVote();
        return false;
      } else if (item.id == 203) {
        uni.wen.toUrl(6, '/pages/creat/goods/goods', null);
        return false;
      } else if (item.id == 204) {
        that.upload_file_onUpload();
        return false;
      } else if (item.id == 205) {
        that.toAddLink();
        return false;
      } else if (item.id == 206) {
        that.shutTaokePublishPopup();
        return false;
      } else if (item.id == 207) {
		that.shutSphPopup();
		return false;
	  } else if (item.id == 208) {
		that.shutUsedSelectPopup();
		return false;
	  } else if (item.id == 209) {
		that.shutBureauSelectPopup();
		return false;
	  } else if (item.id == 301) {
        that.$refs.article['insertText']();
        return false;
      } else if (item.id == 302) {
		that.article_getsrc_init();
        that.$refs.article['insertImg']();
		setTimeout(function () {
		  that.$refs.article['insertText']();
		}, 500);
        return false;
      } else if (item.id == 303) {
		that.article_getsrc_init();
        that.$refs.article['insertVideo']();
		setTimeout(function () {
		  that.$refs.article['insertText']();
		}, 500);
        return false;
      } else if (item.id == 304) {
		that.article_getsrc_init();
        that.$refs.article['insertLink']();
        return false;
      } else if (item.id == 305) {
		that.article_getsrc_init();
        that.$refs.article['insertAudio']();
		setTimeout(function () {
		  that.$refs.article['insertText']();
		}, 500);
        return false;
      } else if (item.id == 306) {
        uni.showModal({
          title: '表格信息',
          editable: true,
          placeholderText: '几行几列，空格隔开',
          confirmText: '生成',
          success: function (res) {
            if (res.confirm) {
              if (res.content && res.content.indexOf(' ') !== false) {
                let res_arr = res.content.split(' ');
                if (res_arr[1] > 10) {
                  uni.showToast({
                    title: '不能超过10列',
                    icon: 'none'
                  })
                } else if (res_arr[0] > 100) {
                  uni.showToast({
                    title: '不能超过100行',
                    icon: 'none'
                  })
                } else {

                  that.$refs.article['insertTable'](res_arr[0], res_arr[1]);
                  setTimeout(function () {
                    that.$refs.article['insertText']();
                  }, 500);
                }
              } else {
                uni.showToast({
                  title: '填写错误',
                  icon: 'none'
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
        return false;
      } else if (item.id == 307) {
        that.$refs.article['undo']();
        return false;
      }
    },
    setTextareaBottom(height) {
      this.textareaBottom = height;
    },
    focusEditor(e) {
      let that = this;
      that.setData({
        isTextareaFocus: true,
        textareaBottom: e.detail.height
      })
    },
    acceptAiteUser(e) {
      let that = this;
      if (that.editer == 'imagetext') {
        that.imagetext_content = that.imagetext_content.slice(0, e.cursor) + e.name + ' ' + that.imagetext_content.slice(e.cursor);
      } else {
        that.textinput = that.textinput.slice(0, e.cursor) + e.name + ' ' + that.textinput.slice(e.cursor);
        that.isTextareaFocus = false;
      }
    },
    create_video_play() {
      let domVideo = this.$refs.domVideo;
      domVideo.play();
    },
    switchEditer(type) {
      let that = this;
      if (that.editer == 'simple' && type == 2) {
        // that.initImagetextEditer();
        uni.setNavigationBarTitle({
          title: "写图文"
        });
        that.setData({
          editer: 'imagetext',
          textareaBottom: 0
        });
        uni.setStorage({
          key: 'editer',
          data: 'imagetext'
        })
      } else {
        that.imagetext_save();
        uni.setNavigationBarTitle({
          title: "发笔记"
        });
        that.setData({
          editer: 'simple',
          textareaBottom: 0
        });
        uni.setStorage({
          key: 'editer',
          data: 'simple'
        })
      }
    },
    imagetext_save() {
      let that = this;
      that.imagetext_content = that.$refs.article.getContent();
    },
    imagetext_remove_image(o) {
      console.log('删除媒体', o);

      if (o && o.src) {
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'files/del', { url: o.src }, 'POST').then(function (res) {
          console.log(res);
        });
      }

    },
    // 图文编辑器处理模态框
    modalInput(e) {
      this.value = e.detail.value
    },
    modalConfirm() {
      this.callback.resolve(this.value || this.modal.value || '')
      this.$set(this, 'modal', null)
    },
    modalCancel() {
      this.callback.reject()
      this.$set(this, 'modal', null)
    },
    isShowDraftTip() {
      let that = this;
      if ((that.textLength >
          0 ||
          (that.image_urls && that.image_urls.length) ||
          that.video_url ||
          that.isVoteContent ||
          that.upload_files.length >
          0 ||
          that.sounds_files.length >
          0 ||
          (that.editer == 'imagetext' && that.imagetext_content)) && that.draftShow) {
        return true;
      }
      return false;
    },
    tipDraft() {
      uni.showModal({
        content: "是否要保存为草稿",
        cancelText: "不保存",
        confirmText: "保存",
        success: res => {
          // 确定
          if (res.confirm) this.saveDraft()
          // 取消
          else uni.removeStorage({
            key: 'releaseDraft'
          })
          this.draftShow = false
          uni.switchTab({
            url: '/pages/tabbar/index/index'
          });
        }
      })
    },
    // 保存草稿
    saveDraft() {
      let that = this;
      uni.setStorage({
        key: 'releaseDraft',
        data: JSON.stringify({
          textinput: that.textinput,
          textLength: that.textLength,
          image_urls: that.image_urls,
          video_url: that.video_url,
          video_thumb_url: that.video_thumb_url,
          video_height: that.video_height,
          video_width: that.video_width,
          voteInputList: that.voteInputList,
          isBtnVoteAddShow: that.isBtnVoteAddShow,
          isVoteContent: that.isVoteContent,
          isVoteSumbit: that.isVoteSumbit,
          imagetext_content: that.imagetext_content,
          editer: that.editer,
          upload_files: that.upload_files,
          sounds_files: that.sounds_files,
        })
      })
    },
    saveSoundRecord(recordPath, time) {
      let that = this;
      if (recordPath) {
        uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', recordPath, 3).then(function (res) {
          if (res.status) {
            let lenght = that.sounds_files.push({
              name: '录音' + (that.sounds_files.length + 1) + '.mp3',
              url: res.data,
              time: time
            });
            console.log(lenght);
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            });
          }

        }).catch(function (err) {
          uni.showToast({
            title: err,
            icon: 'none'
          });
        });
      }
    },

    delGoods(e) {
      let idx = e.currentTarget.dataset.idx;
      let goods = this.goods;
      goods.splice(idx, 1);
      this.setData({
        goods: goods
      });
      uni.setStorageSync('postsGoods', goods);
    },

    // 获取用户输入笔记内容
    onContentInput: function (e) {
      let that = this;

      that.setData({
        textLength: e.detail.value.length,
        cursor: e.detail.cursor
      });

      if (e.detail.value) {
        let char = e.detail.value.charAt(that.cursor - 1);
        if (char != '@') {
          return false;
        }
        that.openAiteUser(false);
      }
      return false;
    },
    openAiteUser(isPrefix) {
      let that = this;
      if (debounce !== null) {
        clearTimeout(debounce);
      }
      if (!that.$store.state.config.pays.paycode_0) {
        return false;
      }
      debounce = setTimeout(() => {
        that.isTextareaFocus = false;
        let child = this.$unicom("#mytotast_" + that.$store.state.scene + '_' + that.$store.state.scene_id);
        if (child) {
          child.open({
            type: 'aite',
            content: '@用户',
            timeout: 2000,
            isClick: true,
            mask: 1,
            cursor: that.cursor,
            isPrefix: isPrefix
          });
          return false;
        }
      }, 250);
    },

    //打开/关闭添加链接弹窗
    toAddLink() {
      let that = this;
      that.setData({
        linkPopup: !that.linkPopup
      });
    },

    //打开/关闭添加链接弹窗
    toVote() {
      let that = this;
      that.setData({
        showVotePopup: !that.showVotePopup
      });
    },
    //打开/关闭付费配置弹窗
    toPayConfig() {
      let that = this;
      that.setData({
        showPayConfigPopup: !that.showPayConfigPopup
      });
    },
    toSoundRecord() {
      let that = this;
      // #ifdef H5
      uni.showToast({
        title: '仅App或小程序支持该功能',
        icon: 'none'
      })
      // #endif

      // #ifndef H5
      if (that.sounds_files.length >= that.$store.state.config.page.create.max_sounds) {
        uni.showToast({
          title: '已达到最大音频数',
          icon: 'none'
        });
        return;
      }
      that.$refs.soundRecorder.showPicker();
      // #endif
    },

    //监听链接输入
    onLinkInput(e) {
      let that = this;
      let type = e.currentTarget.dataset.type;
      let args = {};

      if (type == 0) {
        args.linkName = e.detail.value;
      } else {
        args.linkAdds = e.detail.value;
      }

      that.setData(args);
    },

    //输入框失去焦点时触发
    bCursor(e) {
      this.setData({
        cursor: e.detail.cursor,
        textareaBottom: 0,
      });
    },

    //添加链接
    openAddLink() {
      let that = this;

      let textinput = that.textinput;
      let linkName = that.linkName;
      let linkAdds = that.linkAdds;

      if (linkName == '' || linkName == null) {
        uni.showToast({
          title: '请填写链接显示名称',
          icon: 'none'
        });
        return;
      }

      if (linkAdds == '' || linkAdds == 'https://' || linkAdds == null) {
        uni.showToast({
          title: '请填写链接地址',
          icon: 'none'
        });
        return;
      }

      let cursor = that.cursor;
      let postsContent = '';

      if (cursor == 0) {
        postsContent += '<a href="' + linkAdds + '">' + linkName + '</a>';
      } else if (cursor >= textinput.length) {
        postsContent += textinput + '<a href="' + linkAdds + '">' + linkName + '</a>';
      } else {
        for (let i = 0; i < textinput.length; i++) {
          if (i == cursor) {
            postsContent += '<a href="' + linkAdds + '">' + linkName + '</a>';
          }

          postsContent += textinput[i];
        }
      }

      that.setData({
        textinput: postsContent,
        linkPopup: !that.linkPopup,
        linkName: '',
        linkAdds: 'https://'
      });
    },
    //删除视频
    onVideoDelete() {
      this.setData({
        video_url: '',
        video_thumb_url: '',
        video_height: 0,
        video_width: 0
      });
    },

    //选择圈子
    onSelectCircleClick: function () {
      uni.navigateTo({
        url: '/pages/creat/circle/circle',
        animationType: 'slide-in-bottom',
        animationDuration: 250,
      });
      // uni.wen.toUrl(6, '/pages/creat/circle/circle', null);
    },

    delSelectCircle() {
      let that = this;
      that.setData({
        circle: {
			id: 0,
			circle_name: ''
		},
      });
      uni.removeStorageSync('userSelectedCircle');
	  
    },

    // 选择位置
    onLocationClick: function () {
      var that = this;
	  
	  // #ifdef MP
	  uni.wen.util.checkMpPermission('scope.userLocation', '请到设置页面授权“位置信息”权限', () => {
	  	that.startChooseLocation()
	  });
	  // #endif
	  
	  // #ifdef APP
	  uni.wen.util.checkAppPermission('location', '[位置权限]获取您的位置等信息，用于标记笔记的位置', () => {
	  	that.startChooseLocation()
	  }, that);
	  // #endif
	  
	  // #ifdef H5
	  that.startChooseLocation()
	  // #endif
    },

    startChooseLocation: function () {
      var that = this;
      uni.chooseLocation({
        success: function (a) {
          let location = {};
          location.latitude = a.latitude;
          location.longitude = a.longitude;
          location.address_name = a.address;
          location.address_detailed = a.name;
          that.setData({
            location: location,
            locationState: false
          });
        },
		fail: function(err){
			console.log(err);
		}
      });
    },

    // 清空位置
    delAddsTap() {
      this.setData({
        location: {},
        locationState: true
      });
    },

    // 选择话题
    onTagClick: function () {
      // uni.wen.toUrl(6, '', null);
      uni.navigateTo({
        url: '/pages/creat/tags/tags',
        animationType: 'slide-in-bottom',
        animationDuration: 250,
      });
    },
    confirmNotice() {
      this.setData({
        publishWarnPopup: false
      });
    },
    /**
     * 添加投票选项
     */
    btnAddVoteItem(e) {
	  let that = this;
      that.voteInputList.push({
        value: ''
      });
      let len = that.voteInputList.length;
      if (len >= that.$store.state.config.page.create.max_vote_option) {
        that.isBtnVoteAddShow = false;
      } else {
        that.isBtnVoteAddShow = true;
      }
    },
    delVote(e) {
	  let that = this;
      that.isVoteContent = false;
      //清空 投票 项
      that.voteInputList = [{ value: '' }, { value: '' }];
    },
    /**
     * 删除投票选项
     */
    btnDelVoteItem(index) {
      let that = this;
      let voteList = that.voteInputList;
      voteList.splice(index, 1);
      let len = voteList.length;
      let flag = false;
      if (len >= that.$store.state.config.page.create.max_vote_option) {
        flag = false;
      } else {
        flag = true;
      }
      that.setData({
        voteInputList: voteList,
        isBtnVoteAddShow: flag
      });
    },
    /**
     * 投票输入选项
     * @param {Object} e
     */
    btnVoteInput(e) {
      let index = e.target.dataset.index;
      this.voteInputList[index].value = e.detail.value;

      if (this.isCheckVote()) {
        this.isVoteSumbit = true;
      } else {
        this.isVoteSumbit = false;
      }
    },
    /**
     * 提交投票信息
     */
    btnSubmitVote() {
      if (!this.isCheckVote(true)) {
        return;
      }
      //添加内容
      this.isVoteContent = true;
      this.toVote();
    },
    isCheckVote(tip = false) {
      if (this.voteInputList.length < 2) {
        if (tip) {
          uni.showToast({
            title: '至少2个选项',
            icon: 'none'
          });
        }
        return false;
      }
      for (let i = 0; i < this.voteInputList.length; i++) {
        if (this.voteInputList[i].value == '') {
          if (tip) {
            uni.showToast({
              title: '存在空白选项',
              icon: 'none'
            });
          }
          return false;
        }
      }
      return true;
    },
    /* 上传 */
    upload_file_onUpload() {
      let that = this;
      if (that.upload_files.length >= that.$store.state.config.page.create.max_file) {
        uni.showToast({
          title: '已达到最大附件数',
          icon: 'none'
        });
        return;
      }

      /**
       * url：上传接口地址
       * name：附件key,服务端根据key值获取文件流，默认file,上传文件的key
       * header: 上传接口请求头
       */
      that.$refs.lFile.upload({
        //替换为你的上传接口地址
        url: uni.wen.api.ApiRootUrl + 'files/uploads',
        // 服务端接收附件的key
        name: 'file',
        //根据你接口需求自定义 (优先不传content-type,安卓端无法收到参数再传)
        header: {
          token: uni.getStorageSync('token'),
          played: uni.$store.state.played,
          tenant: uni.$store.state.tenant.id,
          // #ifdef MP
          device: 'mp',
          // #endif
          // #ifdef H5
          device: 'h5',
          // #endif
          // #ifdef APP
          device: 'app',
          // #endif
          safeCode: uni.wen.api.safeCode,
		  scene: uni.$store.state.scene,
        },

        // 限制选择附件的大小上限，默认10M
        // maxSize: 10,

        // 若需要在body单独添加附件名或附件大小如下方式传入组件：
        // addName: '后端要的附件名称字段key,此处请勿写name的同值如(file)，会覆盖name',
        // addSize: '后端要的附件大小字段key'

        // body参数直接写key,value,如：
        // date: '2020-1-1',
        // key2: 'value2',
      });
    },
    upload_file_onSuccess(res) {
      console.log('上传成功回调', JSON.stringify(res));
      let that = this;
      if (res && res.fileName) {
        if (res.data.status) {
          that.upload_files.push({
            name: res.fileName,
            url: res.data.data,
            size: res.size
          });
        } else {
          uni.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      } else {
        console.log(res);
        uni.showToast({
          title: '选取失败',
          icon: 'none'
        })
      }
    },
    delFileItem(index) {
      let that = this;
      that.upload_files.splice(index, 1);
    },
    delSoundRecordItem(index) {
      let that = this;
      that.sounds_files.splice(index, 1);
    },
    imagetext_containers_tap() {
      let that = this;
      that.$refs.article['_maskTap']();
    },
    switch_price_type(e) {
      let that = this;
      if (e.checked) {
        that.pay_content_obj.credit_type = 1;
      } else {
        that.pay_content_obj.credit_type = 0;
      }
    },
    switch_pay(type) {
      let that = this;
      if (type == 'file') {
		  if(that.pay_content_obj.is_file == 1){
			that.pay_content_obj.is_file = 0;
		  }else{
			that.pay_content_obj.is_file = 1;
		  }
      } else if(type == 'img'){
        if(that.pay_content_obj.is_img == 1){
			that.pay_content_obj.is_img = 0;
        }else{
			that.pay_content_obj.is_img = 1;
        }
      }else if(type == 'video'){
		if(that.pay_content_obj.is_video == 1){
			that.pay_content_obj.is_video = 0;
		}else{
			that.pay_content_obj.is_video = 1;
		}
	  }
    },
    pay_words_percent_change(e) {
      let that = this;
      that.pay_content_obj.words_percent = e.detail.value;
    },
    price_input_event(e) {
      let that = this;
      that.pay_content_obj.price = e.detail.value;

    },
    pay_hidden_input(e) {
      let that = this;
      that.pay_content_obj.hidden = e.detail.value;
    },
    clean_pay_config() {
      let that = this;
      that.pay_content_obj = {
        words_percent: 100,
        is_file: 0,
        credit_type: 0,
        hidden: '',
        price: 0
      };
    },
	taokeParseUrl(){
		let that = this;
		if(that.taoke_parse_loading){
			return false;
		}
		if(!that.taoke_parse_url){
			uni.showToast({
				title: '链接为空',
				icon: 'none'
			});
			return false;
		}
		uni.loading(true);
		that.taoke_parse_loading = true;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/taoke/parse', {
			url: that.taoke_parse_url
		}, 'POST').then(function(res) {
			uni.loading(false);
			that.taoke_parse_loading = false;
			if(res.status){
				let postsGoods = uni.getStorageSync('postsGoods');
				let return_id = res.data.id;
				that.taoke_parse_url = '';
				
				if(postsGoods && postsGoods.length > 0){
					for (let i in postsGoods) {
					    if (postsGoods[i].id == return_id) {
							uni.showToast({
								title: '你已经添加过了',
								icon: 'none'
							});
					        return;
					    }
					}
				}else{
					postsGoods = [];
				}
				let goods = {};
				goods.id = res.data.id;
				goods.name = res.data.name;
				goods.pic = res.data.pic;
				postsGoods.push(goods);
				uni.setStorageSync('postsGoods', postsGoods);
				that.taokePublishPopup = false;
				uni.showToast({
					title: '解析成功！',
					icon: 'none'
				});
				setTimeout(function(){
					uni.wen.toUrl(3, res.data.id, that);
				}, 500);
			}else{
				that.taoke_parse_url = '';
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
	article_getsrc_init(){
		let that = this;
		/**
		 * @description 设置获取链接的方法
		 * @param {String} type 链接的类型（img/video/audio/link）
		 * @param {String} value 修改链接时，这里会传入旧值
		 * @returns {Promise} 返回线上地址
		 *   type 为音视频时可以返回一个数组作为源地址
		 *   type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
		 */
		if(that.$refs.article && !that.$refs.article.getSrc){
			that.$refs.article.getSrc = (type, value) => {
				return new Promise((resolve, reject) => {
				  let getSrc_  = function(sourceType, type, value){
					  
						  if (type === 'img' || type === 'video') {
							// 本地选取
							if (type === 'img') {
							  uni.chooseImage({
								sourceType: [sourceType],
								sizeType: ['original'],
								count: value === undefined ? 9 : 1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
								success: res => {
								  // #ifdef MP-WEIXIN
								  if (res.tempFilePaths.length == 1 && wx.editImage) {
									// 单张图片时进行编辑
									wx.editImage({
									  src: res.tempFilePaths[0],
									  complete: res2 => {
										uni.loading(true);
										upload(res2.tempFilePath || res.tempFilePaths[0], type).then(res => {
										  uni.hideLoading()
										  resolve(res)
										})
									  }
									})
								  } else {
									// #endif
									uni.loading(true);
									(async () => {
									  const arr = []
									  for (let item of res.tempFilePaths) {
										// 依次上传
										const src = await upload(item, type)
										arr.push(src)
									  }
									  return arr
									})().then(res => {
									  uni.hideLoading()
									  resolve(res)
									})
									// #ifdef MP-WEIXIN
								  }
								  // #endif
								},
								fail: reject
							  })
							} else {
								uni.chooseVideo({
									sourceType: [sourceType],
									compressed: that.$store.state.config.page.create.video_press == 1,
									success: res => {
										uni.loading(true);
										upload(res.tempFilePath, type).then(res => {
											uni.hideLoading()
											resolve(res)
										})
									},
									fail: reject
								})
							}
						  } else {
							that.callback = {
							  resolve,
							  reject
							}
							let title
							if (type === 'audio') {
							  title = '音频链接'
							} else if (type === 'link') {
							  title = '链接地址'
							}
							that.$set(that, 'modal', {
							  title,
							  value
							})
						  }
				  };
				  // getSrc_ 函数结束
					if (type === 'img' || type === 'video') {
						uni.showActionSheet({
							itemList: ['拍摄', '从相册选择'],
							success: function (res) {
								
								// #ifdef MP
								getSrc_((res.tapIndex === 1 ? 'album' : 'camera'), type, value)
								// #endif
								
								// #ifdef APP
								uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于您的资料完善，申请圈子等场景' : '[摄像头权限]获取您此刻所拍的照片，用于您的资料完善，申请圈子等场景', () => {
									getSrc_((res.tapIndex === 1 ? 'album' : 'camera'), type, value)
								}, that);
								// #endif
								
								// #ifdef H5
								getSrc_((res.tapIndex === 1 ? 'album' : 'camera'), type, value)
								// #endif
						
							},
							fail: function (res) {
								console.log(res.errMsg);
							}
						});
					}else{
						getSrc_('', type, value);
					}
					
				});
			
			}
		}
	}
  }
};
</script>
<style lang="scss">
.create-select-editor {
  display: flex;
  /* #ifdef MP */
  padding-left: 20rpx;
  /* #endif */
  .editor-type {
    @include color(color-lighter-er-dark);
    white-space: nowrap;
    font-size: $uni-font-size-base;
    position: relative;
  }

  .editor-type.cur {
    @include color(color-darkest);
    font-size: $uni-font-size-lg;
  }

  .editor-type.cur:after {
    content: '';
    height: 8rpx;
    background-color: $uni-color-primary;
    position: absolute;
    width: 27%;
    right: 0;
    z-index: 0;
    /* #ifdef MP */
    bottom: 1rpx;
    /* #endif */
    /* #ifdef APP || H5 */
    bottom: -16rpx;
    /* #endif */
    left: 0;
    margin: auto;
    border-radius: 60rpx;
  }
}

@import './creat.scss';

/deep/ .uni-nav-bar-text {
  font-size: 16px;
}

.creat-title {
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.footer-btn {
  position: relative;
  width: 80%;
  margin: 0 auto;
}

.publishWarnPopupWrap {
  @include background_color(page-box-background-color);
  width: 80%;
  margin: auto;
  border-radius: 5%;
  padding: 20px;
}

.items-img {
  text-align: center;
  padding: 10px;
}

.notice-img {
  width: 128rpx;
  color: $uni-color-error;
  font-size: 90rpx;
  margin: auto;
}

.items-warn {
  font-size: 14px;
  @include color(color-light-dark);
}

.items-warn-button {
  width: 65%;
  background-color: $uni-color-follow;
  color: $uni-color-follow-font;
  text-align: center;
  margin: 15px auto;
  padding: 8px;
  border-radius: 40rpx;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 35%;
  z-index: 999;
  left: 16px;
  right: 16px;
  @include background_color(page-box-background-color);
  border-radius: 12px;
  transform: translateY(-50%);
}

.modal_title {
  padding: 32px 24px 16px;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
}

.modal_input {
  display: block;
  padding: 5px;
  margin: 0 24px 32px 24px;
  font-size: 14px;
  border: 1px solid;
  @include border_color(border-color-box-item-background-color);
}

.modal_foot {
  display: flex;
  line-height: 56px;
  font-weight: 700;
  border-top: 1px solid rgba(0, 0, 0, .1);
}

.modal_button {
  flex: 1;
  text-align: center;
}

/* 蒙版 */
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: black;
  opacity: 0.5;
  z-index: 999;
}

.upload_files_content {
  position: relative;
  box-sizing: border-box;

  .upload_files_list {
    width: 750rpx;

    .file_item {
      display: flex;
      justify-content: space-between;
      background-color: aliceblue;
      padding: 10px;
      box-sizing: border-box;
      font-size: $uni-font-size-sm-base;
    }
  }

}

.lxy-nav-bar__right .create-icon {
  color: $uni-color-primary;
  font-size: 70rpx;
}

.payconfig_box {
  width: 750rpx;
  min-height: 1060rpx;
  border-top-right-radius: 24rpx;
  border-top-left-radius: 24rpx;
  padding-bottom: calc( env(safe-area-inset-bottom) + 30rpx );
  @include background_color(page-box-background-color);
  .dialog_box_title {
    width: 710rpx;
    margin: 0 auto;
    height: 80rpx;
    font-size: $uni-font-size-base;
    @include color(color-light-dark);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .mini-shanchu2 {
      position: absolute;
      right: 0;
      font-size: 42rpx;
      @include color(color-lighter-dark);
    }
  }

  .dialog_conent {
    width: $page-content-body-width;
    margin: 0 auto;
    padding: 30rpx;

    .item {
      width: 100%;

      .title {
        @include color(color-lighter-dark);
        font-size: $uni-font-size-medium;
        height: 52rpx;
        line-height: 52rpx;
      }

      .desc {
        @include color(color-lighter-dark);
        font-weight: 300;
        font-size: $uni-font-size-sm-base;
        margin: 20rpx 0;
      }

      .pay_content {
        width: 690rpx;
        border-radius: 20rpx;
        padding: 20rpx;
        background-color: rgba(211, 211, 211, 0.3);
        @include background_color(page-box-item2-background-color);
        box-sizing: border-box;
        margin: 20rpx 0;
        font-size: $uni-font-size-sm-base;
        @include color(color-light-dark);
      }

      .price_input {
        border-bottom: 1px solid;
        height: 27px;
        line-height: 27px;
        @include border_color(border-color-lightest-est-dark);
        @include color(color-light-dark);
      }
    }

    .item.flex-row {
      justify-content: space-between;
    }
  }

  .dialog_tips {
    padding: 20rpx 34rpx;
    color: #ccc;
    font-size: 22rpx;
    position: absolute;
    bottom: 10rpx;
    width: 750rpx;
    text-align: center;
    box-sizing: border-box;
  }
}

.bottom-item .clean_pay_icon {
  position: absolute;
  right: 30rpx;
  width: 32rpx;
  height: 32rpx;
  top: 0;
}
</style>
