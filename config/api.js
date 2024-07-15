const domain = 'www.lanke.pro'; // 配置这里的域名，不带https
const safeCode = ''; // 安全码（可选） 请看教程：https://doc.minisns.cn/doc/68/

module.exports = {
	debug: false,
	safeCode: safeCode,
	version: '1.2.0.6',
	homeUrl: 'https://' + domain,
	
	WebRootUrl: 'https://' + domain + '/',
	ApiRootUrl: 'https://' + domain + '/api/v1/',
	SocketUrl: 'wss://' + domain + '/wss',
	JiaoWuUrl: 'https://jiaowu.minisns.cn/', // 教务服务地址
};
