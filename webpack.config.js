const path = require("path");

module.exports = {
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "bundle.js",
  },
  mode: "development",
  experiments: {
    topLevelAwait: true,
  },
};
