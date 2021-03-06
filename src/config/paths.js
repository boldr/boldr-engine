/* eslint-disable object-shorthand */
const path = require('path');
const fs = require('fs-extra');
const appRoot = require('boldr-utils/lib/node/appRoot');

/**
 * Path of the current working directory, with symlinks taken
 * into account.
 * @type {String}
 */
const cwd = fs.realpathSync(process.cwd());

/**
 * Get the path from the user's project root
 * @param  {String} args the path we are trying to reach
 * @return {any}      whatever it is we're looking for
 */
function resolveProject(...args) {
  return path.resolve(cwd, ...args);
}

/**
 * Get the path from the root of the boldr-dx directory
 * @param  {String} args the path we are trying to reach
 * @return {any}      whatever it is we're looking for
 */
function resolveBoldr(...args) {
  return path.resolve(__dirname, '../..', ...args);
}

/**
 * Enables resolving paths via NODE_PATH. Shout out to create-react-app
 * https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/paths.js#L24
 * @type {String}
 */
const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveProject);

const ownPackageJson = require('../../package.json');
const boldrEnginePath = resolveProject(`node_modules/${ownPackageJson.name}`);
const boldrEngineLinked =
  fs.existsSync(boldrEnginePath) && fs.lstatSync(boldrEnginePath).isSymbolicLink();

if (
  !boldrEngineLinked &&
  __dirname.indexOf(path.join('packages', 'boldr-engine', 'lib', 'config')) !== -1
) {
  console.log('hello');
}

module.exports = {
  nodePaths: nodePaths,
  dotEnvPath: resolveProject('.env'),
  boldrNodeModules: resolveBoldr('node_modules'),
  projectNodeModules: resolveProject('node_modules'),
  projectPkg: resolveProject('package.json'),
  cacheDir: resolveProject('node_modules/.boldr_cache'),
};
