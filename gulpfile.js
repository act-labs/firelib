const { src, dest }  = require('gulp');
exports.copy = function(){
  return src('./src/components/*.less', {base:"src/components"})
    .pipe(dest('./lib/'))
}