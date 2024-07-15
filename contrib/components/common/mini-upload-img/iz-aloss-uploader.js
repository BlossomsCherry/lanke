const env = require('./config.js');
import moment from './moment.js'

const base64 = require('./base64.js');
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');


/*
 *上传文件到阿里云oss
 *@param - filePath :文件的本地资源路径
  @param - path :上传oss哪个路径下
  postfix : 文件后缀
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
const uploadFile = function(filePath, fix,successc, failc) {
	if (!filePath || filePath.length < 9) {
	  wx.showModal({
	    title: '文件错误',
	    content: '请重试',
	    showCancel: false,
	  })
	  return;
	}
  return uni.uploadFile({
    url: uni.wen.api.ApiRootUrl + 'files/uploads', //开发者服务器 url
    filePath: filePath, //要上传文件资源的路径
	header: {
		token: uni.getStorageSync('token'),
		played: uni.$store.state.played,
		safeCode: uni.wen.api.safeCode,
		tenant: uni.$store.state.tenant.id,
		scene: uni.$store.state.scene,
		// #ifdef MP
		device: 'mp',
		// #endif
		// #ifdef H5
		device: 'h5',
		// #endif
		// #ifdef APP
		device: 'app',
		// #endif
	},
    name: 'file', //必须填file
    success: function(res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
	  let data = JSON.parse(res.data);
      successc(data.data);
    },
    fail: function(err) {
		console.log(err);
      failc(err);
    },
  })
}

const getPolicyBase64 = function() {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, env.maxSize] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}


function izArrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
	let signature = base64.encode(binary)
	return signature
}


const getSignature = function(policyBase64) {
  const accesskey = env.AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature=izArrayBufferToBase64(bytes)
  return signature;
}


module.exports = uploadFile;