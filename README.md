# 天气宝 墨迹合作页面

## 系统需求

* Node.js >= 8

## 创建开发环境

1. 安装 node.js，确保在命令行下可以使用 node，npm 等命令
2. 进入根目录，`npm i` 安装依赖

## 生成部署用文件

`npm run build`

## 修改配置信息

目前共有三个配置，位于 `config/` 目录内：

1. dev.js 开发配置
2. test.js 测试配置，修改后，运行 `npm run build:test` 将会把文件生成到 `test/` 目录下
3. production.js 生产配置，运行 `npm run build` 将会把文件生成到 `docs/` 目录下 