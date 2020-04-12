/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
module.exports = {
    lintOnSave: process.env.NODE_ENV !== "production",
    devServer: {
        port: 8081,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    chainWebpack: config => {
        config.resolve.modules.add("styles");

        config.resolve.alias.set("@web", path.resolve(__dirname, "src")).set("@shared", path.resolve(__dirname, "..", "shared", "src"));

        config.plugin("html").tap(args => {
            args[0].title = "Fishbowl - Play Online";
            return args;
        });
    }
};
