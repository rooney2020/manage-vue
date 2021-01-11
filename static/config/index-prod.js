/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
<<<<<<< HEAD
  window.SITE_CONFIG['baseUrl'] = 'http://192.144.229.232:51110/manage';
=======
  window.SITE_CONFIG['baseUrl'] = 'http://192.144.229.232:51120/manage/';
>>>>>>> 7802886d2a3d4c6081b6963fbd18a989897c4af2

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();