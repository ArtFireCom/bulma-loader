const fs = require("fs");
const loaderUtils = require("loader-utils");
const path = require("path");
const validateOptions = require("schema-utils");

const bulmaPattern = /node_modules\/bulma\/.+sass$/;

const schema = {
  type: 'object',
  properties: {
    theme: {
      type: 'string'
    }
  }
}

function bulmaLoader(source) {
  const self = this;
  const callback = self.async();

  const options = loaderUtils.getOptions(self);
  validateOptions(schema, options, 'Bulma Loader');

  // Only act on bulma sass imports
  if (!bulmaPattern.test(self.resourcePath)) {
    return callback(null, source);
  }

  const themePath = path.resolve(options.theme);
  const themeExists = fs.existsSync(themePath);
  if (!themeExists) {
    return callback(new Error(`The path ${themePath} does not exist!`))
  }

  self.dependency(themePath);

  fs.readFile(themePath, "utf-8", function(err, theme) {
    if (err) {
      return callback(err);
    }

    callback(null, theme + '\n' + source);
  });
};

module.exports = bulmaLoader;