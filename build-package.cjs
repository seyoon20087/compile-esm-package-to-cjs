const fs = require("fs");
const { webpack, sources, Compilation } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

/**
 * Webpack config for compiling a package.
 */

const webpackConfig = {
  mode: "production", // The 'production' mode needs to be set so that it will not introduce eval() and strip unneccessary code.
  target: ["es5", "node12"],
  optimization: {
    minimize: true, // Minification is recommended; however if you don't want it to be minified you may set this to false.
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // Do not place comments in the output files
          },
        },
        extractComments: false, // Do not create LICENSE.txt file, such as xxx.js.LICENSE.txt from the output folder
      }),
    ],
    nodeEnv: false, // Do not remove `process.env.XXX` from the file
  },
  experiments: {
    topLevelAwait: true, // Bundle top-level await
    outputModule: false, // Do not output as an ES module
  },
  output: {
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
};

/**
 * Compiles a package with Webpack.
 */

async function buildWithWebpack(config) {
  const compiler = webpack(config);
  return new Promise((resolve, _) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(err);
          process.exit(1);
        }
        const info = stats.toString({
          chunks: false,
          colors: true,
        });
        console.info(info);
        if (stats.hasErrors()) {
          process.exit(1);
        }
        resolve(stats);
      });
    });
  });
}

/**
 * A webpack plugin to generate a package.json in the dist folder
 */

class GeneratePackageJSONPlugin {
  packageName;

  constructor(opts = {}) {
    this.packageName = opts.packageName;
  }

  apply(compiler) {
    compiler.hooks.make.tap("GeneratePackageJSONManifest", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "GeneratePackageJSONManifest",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          assets["package.json"] = new sources.RawSource(
            JSON.stringify({
              name: String(this.packageName),
              version: require(`${this.packageName}/package.json`).version,
              license:
                require(`${this.packageName}/package.json`).license ||
                (
                  require.resolve(`${this.packageName}/package.json`)
                    .licenses || {}
                ).type,
              author: require(`${this.packageName}/package.json`).author,
            })
          );
        }
      );
    });
  }
}

/**
 * Main function. You should call this respectively when running `node build-package.cjs`.
 */

async function main() {
  // Delete existing output
  fs.rmSync("dist", {
    recursive: true,
    force: true,
  });

  // Now, compile it
  // If you are building another one just replace `@mdx-js/mdx` with the package name
  // you just installed
  await buildWithWebpack(
    merge(webpackConfig, {
      entry: require.resolve("@mdx-js/mdx"),
      plugins: [
        new GeneratePackageJSONPlugin({
          packageName: "@mdx-js/mdx",
        }),
      ],
    })
  );
}

main();
