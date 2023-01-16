"use strict";

const { Transform } = require("node:stream");
const swc = require("@swc/core");
const PluginError = require("plugin-error");
const applySourceMap = require("vinyl-sourcemaps-apply");

module.exports = function (options = {}) {
  const stream = new Transform({ objectMode: true });
  stream._transform = async function (file, enc, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new PluginError("gulp-swc", "Streaming is not supported"));
      return;
    }

    if (file.isBuffer()) {
      const o = { sourceMap: {}, ...options };

      if (file.sourceMap) {
        o.sourceMap.filename = file.sourceMap.file;
      }

      try {
        const fileContents = file.contents.toString()
        const { code, map } = await swc.minify(fileContents, o);
        file.contents = Buffer.from(code);

        if (file.sourceMap && map) {
          const vinylSourceMap = {
            ...JSON.parse(map),
            file: file.relative,
            sources: [file.relative],
            sourcesContent: fileContents
          }
          applySourceMap(file, vinylSourceMap);
        }

        this.push(file);
        callback();
      } catch(error) {
        console.log(error.message);
        callback(new PluginError("gulp-swc", error.message));
      }
    }
  };
  return stream;
};
