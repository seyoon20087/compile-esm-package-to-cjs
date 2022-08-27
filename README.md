# Example of compiling ESM-only packages to CJS

This repo is a minimal example for compiling an ESM-only package into CommonJS.

This may be useful if you're using frameworks that does not yet support ESM (like Gatsby) and want to use it (like `remark-gfm`).

This example repo compiles [`@mdx-js/mdx@^2.1.3`](https://npmjs.com/@mdx-js/mdx) to CJS.


## Try it out

This guide assumes you already have [Node.js](https://nodejs.org/) 14+ and 
[Yarn Classic](https://classic.yarnpkg.com/en/docs/install#install-via-npm) v1 installed on your workstation.

1. Download or clone the repo yourself.

2. Install the packages by running `yarn install`.

3. Try running `yarn build`. The built package will be in the `dist` folder.

4. If you want to try building another one (like `remark-gfm`) delete `@mdx-js/mdx` first (`yarn remove @mdx-js/mdx`),
   install that ESM-only package (e.g. `yarn add --dev remark-gfm`), modify `build-package.cjs` appropriately as outlined there, then try rebuilding it as described above.