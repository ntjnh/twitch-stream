const { dest, series, src, parallel } = require("gulp");
const terser = require("gulp-terser");
const rename = require("gulp-rename");

const js = () => {
    return src("js/**/*.js")
        .pipe(terser())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest("build/js"));
};

module.exports = {
    default: series(js),
    js: js
};