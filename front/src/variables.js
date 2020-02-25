const Color = require('color');

const primaryColor = '#004AE9'
const primary2 = Color(primaryColor).darken(0.85)
const borderColorBase = '#434343'
const componentBackground = '#141414'
const bodyBackground = '#000'
const bodySecundary = '#080808'
const itemActiveBg = Color(primaryColor).darken(0.65)

const variables = {
    primaryColor,
    primary2,
    borderColorBase,
    componentBackground,
    bodyBackground,
    bodySecundary,
    itemActiveBg,
}

module.exports = variables;