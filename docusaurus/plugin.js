const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const resolve = (query) => path.resolve(__dirname, query);

/** @returns {import('@docusaurus/types').Plugin<any>} */
module.exports = () => ({
    configureWebpack: (config, isServer) => {
        return {
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        exclude: /\.module\.scss$/,
                        use: [...config.module.rules.find((r) => String(r.test) === "/\\.css$/").use, "sass-loader"],
                    },
                    {
                        test: /\.module\.scss$/,
                        use: [
                            ...config.module.rules.find((r) => String(r.test) === "/\\.module\\.css$/").use,
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.svg$/,
                        use: [{ loader: "@svgr/webpack", options: { babel: false, dimensions: false } }],
                    },
                    {
                        test: /\.png$/,
                        use: [{ loader: "file-loader" }],
                    },
                ],
            },
            plugins: [
                ...(isServer
                    ? []
                    : [
                          new ForkTsCheckerWebpackPlugin({
                              typescript: { configFile: resolve("../tsconfig.json") },
                          }),
                      ]),
            ],
        };
    },
});
