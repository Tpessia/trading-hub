const Color = require('color');

const sizeXs = 576
const sizeSm = 768
const sizeMd = 992
const sizeLg = 1200
const sizeXl = 1600
const sizeXxl = 1600

const primaryColor = '#004AE9'
const primary2 = Color(primaryColor).darken(0.85)
const borderColorBase = '#434343'
const componentBackground = '#141414'
const bodyBackground = '#000'
const bodySecundary = '#090909'
const itemActiveBg = Color(primaryColor).darken(0.65)
const success = '#389e0d'
const error = '#cf1322'

const variables = {
    primaryColor,
    primary2,
    borderColorBase,
    componentBackground,
    bodyBackground,
    bodySecundary,
    itemActiveBg,
    success,
    error,
    sizeXs,
    sizeSm,
    sizeMd,
    sizeLg,
    sizeXl,
    sizeXxl,
}

module.exports = variables;