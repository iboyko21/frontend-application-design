const { mode } = require("webpack-nano/argv");
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");

module.exports = {
    mode,
    entry: ["./src", "webpack-plugin-serve/client"],
    // entry point so webpack knows where to look for source code
    watch: mode === "development",
    // instruct webpack to watch for changes in sourxe files when in developement mode
    plugins: [
        new MiniHtmlWebpackPlugin({
             context: {
                title: "Things Todo"
             }
        }),
        new WebpackPluginServe({
            port: parseInt(process.env.PORT, 10) || 8080,
            static: "./dist",
            liveReload: true,
            waitForBuild: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.png$/,
                type: 'asset/resource'
            },
            { 
                test: /\.css$/, 
                use: ["style-loader", "css-loader"] 
            },
        ]
    }
};