/**
 * @fileoverview 插件入口文件模板
 */

const data = {} // 全局数据

/**
 * @description 组件被创建时将实例化插件
 * @param {Component} vm 组件实例
 */
function Plugin (vm) {
  this.vm = vm // 保存实例在其他周期使用
  this.compData = {} // 仅在单个组件中使用的数据
  // data.xxx = 'xxx' // 记录全局数据
}
/**
 * @description 解析到一个标签时触发
 * @param {object} node 标签
 * @param {object} parser 解析器实例
 * @returns {boolean|void} 如果返回 false 将移除该标签
 */
Plugin.prototype.onParse = function (node, parser) {
  // 处理文本标签
  if (node.name === 'shopcard') {
    var attrs = node.attrs;
    var id = attrs.id;
    var img = attrs.img;
    var title = attrs.title;
    var price = attrs.price;
    return parser.parse('<a href="/pagesA/shop/goods-details/goods-details?id='+ id +'" class="shopcard"><div class="left"><img src="'+img+'"></div><div class="right"><div class="title">'+title+'</div><div class="price">'+price+'元</div><div class="go-shop-button">去购买</div></div></a>');
    // node.text 文本内容
  }else if (node.name === 'hidden') {
    return parser.parse('<div class="hidden_content_wrap">'+ node.attrs.text +'</div>')
  }else if(node.name === 'mini-emoji'){
	return parser.parse('<img class="_mini_emoji" src="'+node.attrs.emoji+'" style="width: '+ node.attrs.width +'px; height: ' + node.attrs.height + 'px;" mode="aspectFit" /> ');
  }else if(node.name === 'mini-aite'){
      return parser.parse('<a class="_mini_aite" href="/pages/user/user?id=' + node.attrs.uid + '">@' + node.attrs.name + ' </a>');
  }else if(node.name === 'mini-icon'){
      return parser.parse('<i class="' + node.attrs.name + '"></i>');
  }else if(node.name === 'mini-text-img'){
	  return parser.parse('<a class="_mini_text_img" href="/pages/common/img?src=' + node.attrs.src + ' "><i class="mini-icon mini-tupian4"></i>查看图片</a>');
  }else if(node.name === 'mini-contact'){
	  return parser.parse('<a class="_mini_contact" href="'+ node.attrs.type +':' + node.attrs.text + '">📞' + node.attrs.text + ' </a>');
  }
}

export default Plugin
