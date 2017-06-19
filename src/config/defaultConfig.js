const getClientEnvironment = require('./env');

const envDefaults = getClientEnvironment();

module.exports = {
  env: {
    NODE_ENV: envDefaults.raw.NODE_ENV,
    BOLDR_PORT: parseInt(envDefaults.raw.BOLDR_PORT, 10),
    BOLDR_DEV_PORT: parseInt(envDefaults.raw.BOLDR_DEV_PORT, 10),
  },
  plugins: [require('../plugins/watchConfig')],
  bundle: {
    cssModules: true,
    wpProfile: false,
    webPath: '/assets/',
    babelrc: null,
    graphlUrl: 'http://localhost:3000/api/v1/graphql',
  },
};
