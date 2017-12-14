/**
 * Created by realm on 2017/5/11.
 */

const webpack = require('webpack');
const config = require('./webpack.config');
const production = require('./config/production');

config.watch = config.devtool = false;
config.output.filename = '[name].min.js';
config.plugins = [
  new webpack.DefinePlugin(production)
];

module.exports = config;