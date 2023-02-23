const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

/**
 * Define a map of package directories (excluding app) and their package names.
 * This is used to enable monorepo support when you include the source code of
 * other packages in this bundle.
 */
const packages = {
  'components': '@kineticdata/bundle-components',
};

const absolutePaths = [];
const aliases = {};
// For each package, define paths to its `src` and `assets` directories
// and aliases for imports that point to the `src` and `asset` directories
Object.entries(packages).forEach(([dirName, packageName]) => {
  absolutePaths.push(path.join(__dirname, `packages/${dirName}/src`));
  absolutePaths.push(path.join(__dirname, `packages/${dirName}/assets`));
  aliases[`${packageName}/assets`] = path.resolve(
    __dirname,
    `packages/${dirName}/assets`,
  );
  aliases[`${packageName}`] = path.resolve(
    __dirname,
    `packages/${dirName}/src`,
  );
});

module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Add paths to be transpiled by babel
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader'),
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(absolutePaths);
      }

      // Add paths to the ModuleScopePlugin to allow apps to access these paths
      // even though they fall outside the src directory of the app project
      const moduleScopePlugin = webpackConfig.resolve.plugins.find(
        ({ constructor }) =>
          constructor && constructor.name === 'ModuleScopePlugin',
      );
      if (moduleScopePlugin) {
        moduleScopePlugin.appSrcs = moduleScopePlugin.appSrcs.concat(
          absolutePaths,
        );
      }

      // Add aliases so that imports of packages resolve to their
      // corresponding src directories
      webpackConfig.resolve.alias = Object.assign(
        webpackConfig.resolve.alias,
        aliases,
      );

      // Fix for strict EcmaScript Module error
      // https://github.com/webpack/webpack/issues/11636
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      webpackConfig.resolve.fallback = webpackConfig.resolve.fallback || {};
      webpackConfig.resolve.fallback['path'] = require.resolve(
        'path-browserify',
      );
      webpackConfig.resolve.fallback['stream'] = require.resolve(
        'stream-browserify',
      );

      return webpackConfig;
    },
  },
};
