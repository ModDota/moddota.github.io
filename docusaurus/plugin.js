const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const resolve = (query) => path.resolve(__dirname, query);

/** @returns {import('@docusaurus/types').Plugin<any>} */
module.exports = () => ({
    configureWebpack: (config, isServer) => {
        return {
            plugins: [
                ...(isServer
                    ? []
                    : [
                          new ForkTsCheckerWebpackPlugin({
                              typescript: { configFile: resolve("../src/tsconfig.json") },
                          }),
                      ]),
            ],
        };
    },
});
