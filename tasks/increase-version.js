/*
 * grunt-increase-version
 * https://github.com/jstools/grunt-increase-version
 *
 * Copyright (c) 2014 Jesús Germade
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('increase-version', 'Increases package ( and specified files ) version', function() {

    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var pkg = grunt.file.readJSON('package.json');

    var version = pkg.version.split('.');
    version[2]++;
    version = version.join('.');

    function writeVersion ( filepath ) {
      if( !grunt.file.exists(filepath) ) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
      } else {
        var data = grunt.file.readJSON(filepath);
        data.version = version;
        grunt.file.write( filepath, JSON.stringify(data, null, 4) );
      }
    }

    writeVersion('package.json');

    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.orig.src.forEach(function(filepath) {

        writeVersion(filepath);

      });

      src += options.punctuation;
    });
  });

};
