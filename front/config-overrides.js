const {
    override,
    fixBabelImports,
    addLessLoader
} = require('customize-cra');
// const darkTheme = require('@ant-design/dark-theme');
const theme = require('./theme.js')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: theme
    }),
);