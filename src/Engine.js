/* @flow */
/* eslint-disable require-await */
const path = require('path');
const fs = require('fs-extra');
const appRoot = require('boldr-utils/lib/node/appRoot');
const debug = require('debug')('boldr:engine');
const logger = require('boldr-utils/lib/logger');
const loadConfiguration = require('./config/loadConfig');

module.exports = class Engine {
  cwd: string;
  configFileName: string;
  plugins: Array<PluginController>;

  constructor(cwd: any) {
    this.cwd = cwd;
    this.configFileName = 'boldr.config.js';
  }

  getConfigPath(): string {
    return path.resolve(this.cwd, './boldr.config.js');
  }

  getConfiguration(): Config {
    return loadConfiguration(this);
  }

  // determine our NODE_ENV used as the identifier
  getNodeEnv(): string {
    return this.getConfiguration().env.NODE_ENV;
  }

  async build(): Promise<any> {
    const config: Config = loadConfiguration(this);

    const pluginControllers: PluginController[] = await Promise.all(
      config.plugins.map(plugin => plugin(this, true)),
    );

    await Promise.all(pluginControllers.map(pluginController => pluginController.build()));
  }

  async dev(): Promise<any> {
    const config: Config = loadConfiguration(this);
    this.plugins = await Promise.all(config.plugins.map(plugin => plugin(this, false)));

    await Promise.all(this.plugins.map(p => p.dev()));
  }

  async start(): Promise<any> {
    const config: Config = loadConfiguration(this);
    this.plugins = await Promise.all(config.plugins.map(plugin => plugin(this, false)));

    await Promise.all(this.plugins.map(p => p.start()));
  }

  async restart(): Promise<any> {
    // terminate all plugins
    await Promise.all(this.plugins.map(pluginController => pluginController.end()));

    // start all plugins
    await this.start();
  }

  async stop(): Promise<any> {
    await Promise.all(this.plugins.map(pluginController => pluginController.end()));
  }
};
