const config = require('./dev');
config.DEBUG = false;
config.API = JSON.stringify('http://m.baotianqi.cn/moji/');
config.APP_ID = JSON.stringify('b7bc8228ffeadb7f879ea4c1ea13eebd');

module.exports = config;