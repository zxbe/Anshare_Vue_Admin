const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

module.exports = {
  // 域名，默认可以设置/dist/
  // 以下使用./相对路径不支持HTML5 history和构建多页面应用
  baseUrl: './',
  // 生产环境打包时不启用SourceMap
  productionSourceMap: false,
  // public相当于原来的static，所以不需要另行配置static地址
  devServer: {
    port: 80,
  },
  lintOnSave:false,
  // vue-cli3内部的webpack配置通过webpack-chain维护
  // 链式操作可参考 https://cli.vuejs.org/zh/guide/webpack.html
  chainWebpack: (config) => {
    // vue inspect --rules 列出所有规则，可以看到svg是第三个
    // vue inspect module.rules.2 可以列出默认svg规则配置
    // 从默认svg规则中排除src/icons路径，因为会当做图标自动加载
    config.module.rule('svg').exclude.add(resolve('src/icons'));
    // 添加svg-sprite-loader加载器
    config.module
      .rule('svg-sprite-loader')
      .test(/.svg$/)
      .include.add(resolve('src/icons')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });
  },
};
