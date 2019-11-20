const path = require('path')

module.exports = function (config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-ufo': path.resolve(__dirname, '../src/module/'),
  }
  return config
}

