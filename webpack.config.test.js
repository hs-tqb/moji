/**
 * Created by realm on 2017/5/11.
 */

const webpack = require('webpack');
const config = require('./webpack.config');
const test = require('./config/test');

config.watch = config.devtool = false;
config.output.filename = '[name].min.js';
config.plugins = [
  new webpack.DefinePlugin(test)
];

module.exports = config;