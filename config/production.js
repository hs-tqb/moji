/**
 * Created by meathill on 2017/5/14.
 */
const dev = require('./dev');
dev.DEBUG = false;
dev.API = JSON.stringify('http://m.baotianqi.cn/moji/');
dev.APP_ID = JSON.stringify('b7bc8228ffeadb7f879ea4c1ea13eebd');

module.exports = dev;