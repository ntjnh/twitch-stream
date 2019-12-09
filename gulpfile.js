const { dest, parallel, series, src, watch } = require("gulp");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const cleanCSS = require("gulp-clean-css");

const js = () => {
    return src("js/**/*.js")
        .pipe(terser())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest("build/js"));
};

const scss = () => {
    return src(["!_.scss", "css/**/*.scss"])
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(dest("build/css"));
};

const watchAll = () => watch(["css/**/*.scss", "js/**/*.js"], parallel(scss, js));

module.exports = {
    default: series(scss, js),
    js: js,
    scss: scss,
    watch: watchAll
};