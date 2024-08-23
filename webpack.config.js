const path = require("path");
const fs = require("fs");
const nodePreGyp = require("@mapbox/node-pre-gyp");
const webpack = require("webpack");

// The following block assumes that the current file is in the project root, so we could calculate paths as relative to __dirname
const sqliteBindingPath = nodePreGyp.find(
  path.join(__dirname, "node_modules", "sqlite3", "package.json")
);
const sqlitePatchFileName = "sqlite3-binding-with-binary-find-patch.js";
const sqlitePatchFilePath = path.resolve(
  path.join(__dirname, "node_modules", "sqlite3", "lib", sqlitePatchFileName)
);

// Here we might write an absolute path. Webpack will take care to produce a portable bundle, in which this
// absolute path will be changes to a path, relative to the bundle itself.
fs.writeFileSync(
  sqlitePatchFilePath,
  `module.exports = require(${JSON.stringify(sqliteBindingPath)});`
);

// Add this to your webpack config
module.exports = {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /sqlite3\/lib\/sqlite3-binding\.js$/,
      `./${sqlitePatchFileName}`
    ),
  ],
};
