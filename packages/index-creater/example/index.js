const indexCreater = require('../index')

indexCreater([
    {
        root: 'components', // 绝对路径或者现对路径，如果是相对路径会通过path.resolve转为绝对路径
        match: '**/!(*.*)', // 此处参数为glob类型
        separator: /(-|_)/g,
        exportPattern: 'export { default as [name] , I[name]Props } from \'[path]\'',
        ignore: 'button', // glob pattern 或者 glob pattern Array
        suffix: '.ts',
        callback(template, items) {
            return template + '\n// test'
        }
    },
    {
        root: 'otherComponents',
        match: '**/!(*.*)', // 此处参数为glob类型
        separator: /(-|_)/g,
        exportPattern: 'export { default as [name] } from \'[path]\'',
        suffix: '.jsx'
    },
    {
        root: 'autoComponents',
        match: '*/index.*',
        separator: /(-|_)/g,
        suffix: '.js'
    }
])
