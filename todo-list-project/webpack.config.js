const { mode } = require("webpack-nano/argv");
const {
    MiniHtmlWebpackPlugin
} = require("mini-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");
// console.log(mode);

module.exports = {
    mode,
    entry: ["./src", "webpack-plugin-serve/client"],
    // entry point so webpack knows where to look for source code
    watch: mode === "development",
    // instruct webpack to watch for changes in sourxe files when in developement mode
    plugins: [
        new MiniHtmlWebpackPlugin({
             context: {
                title: "Superhero Greeter"
             }
        }),
        new WebpackPluginServe({
            port: parseInt(process.env.PORT, 10) || 8080,
            static: "./dist",
            liveReload: true,
            waitForBuild: true
        })
    ],
};