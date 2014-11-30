/*
 * grunt-increase-version
 * https://github.com/jstools/grunt-increase-version
 *
 * Copyright (c) 2014 Jesús Germade
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('increase_version', 'Increases package and bower version', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var pkg = grunt.file.readJSON('package.json');

    var version = pkg.version.split('.');
    version[2]++;
    version = version.join('.');

    function writeVersion ( filepath ) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
      } else {
        var data = grunt.file.readJSON(filepath);
        data.version = version;
        grunt.file.write( JSON.stringify(data), null, 4 );
      }
    }

    // pkg.version = version;
    // bower.version = version;

    // grunt.file.write( 'package.json', JSON.stringify(pkg, null, 4) );
    // grunt.file.write( 'bower.json', JSON.stringify(bower, null, 4) );

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      console.log('filegroup', f);

      // Concat specified files.
      var src = f.orig.src.forEach(function(filepath) {

        writeVersion(filepath);

      });

      // Handle options.
      src += options.punctuation;

      // // Write the destination file.
      // grunt.file.write(f.dest, src);

      // // Print a success message.
      // grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
