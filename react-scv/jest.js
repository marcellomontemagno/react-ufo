const path = require('path')
const config = require('react-scv/config/jest')

const rootPath = path.resolve(__dirname, '..')

config.roots = [rootPath]
config.rootDir = rootPath

config.collectCoverageFrom = ["src/module/**/*.js", "!**/node_modules/**", "!**/vendor/**"]

module.exports = config
