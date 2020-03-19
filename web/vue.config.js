/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@web", path.resolve(__dirname, "src"))
      .set("@shared", path.resolve(__dirname, "..", "shared", "src"));
  }
};
