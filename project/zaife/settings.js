/**
 * 前端开发环境配置文件
 * @author Philip
 */
const config = {
  sitePort: 8058,
  apiHost: 'http://devnode.zizai.work/',
  sessionSecret: 'eio3q$32T&()dae!dsdafWRWd^G*&da2',
  // 单位：秒
  sessionExpiresIn: 7 * 24 * 60 * 60,
  sessionCookieName: 'zai-token',
  // 请求服务端 secret
  // accessSecret: 'es&^3d*2;!weYx-^3\sl4,s&Q',
};

module.exports = config;
