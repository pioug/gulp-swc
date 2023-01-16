# gulp-swc ![Run tests](https://github.com/pioug/gulp-swc/workflows/Run%20tests/badge.svg)

## Install

```sh
$ npm install github:pioug/gulp-swc#1.0.0
```

### Example

```js
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const swc = require("gulp-swc");
const swcOptions = {
  compress: {
    drop_console: true,
  },
  format: {
    comments: false,
  },
};

gulp
  .src("script.js")
  .pipe(sourcemaps.init(swcOptions))
  .pipe(swc())
  .pipe(sourcemaps.write(""))
  .pipe(gulp.dest("build"));
```

- See https://swc.rs/docs/configuration/minification for more minification options
- See https://github.com/gulp-sourcemaps/gulp-sourcemaps for advance usage of sourcemaps
