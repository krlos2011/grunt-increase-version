/*
 * grunt-increase-version
 * https://github.com/jstools/grunt-increase-version
 *
 * Copyright (c) 2014 Jesús Germade
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.getNextVersion = function(current, options) {
    options = options || {};
    var validIncrements = ['major', 'minor', 'patch'];
    var increment = grunt.option('increment') || options.defaultIncrement;
    var betaIncrement = !!grunt.option('beta-increment');

    if(!increment && !betaIncrement ||
        (increment && validIncrements.indexOf(increment) === -1)) {
      return false;
    }

    var currentSplit = current.split('-');

    var versionSplit = currentSplit[0].split('.');
    var betaSplit = null;

    switch(increment) {
      case 'major':
        versionSplit[0] = parseInt(versionSplit[0]) + 1;
        versionSplit[1] = 0;
        versionSplit[2] = 0;
        break;

      case 'minor':
        versionSplit[1] = parseInt(versionSplit[1]) + 1;
        versionSplit[2] = 0;
        break;

      case 'patch':
        versionSplit[2] = parseInt(versionSplit[2]) + 1;
        break;
    }

    if(betaIncrement){
      betaSplit = currentSplit[1] ? currentSplit[1].split('.') : null;
      if( !betaSplit ){
        betaSplit = ['beta', '0'];
      }
      betaSplit[1] = parseInt(betaSplit[1]) + 1;
    }

    var result = [versionSplit.join('.')];
    if(betaSplit){
      result.push(betaSplit.join('.'));
    }

    return result.join('-');
  };

  grunt.registerMultiTask('increase-version', 'Increases package ( and specified files ) version', function() {

    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var pkg = grunt.file.readJSON(this.files[0].src);
    var version = grunt.getNextVersion(pkg.version, options);

    if(!version) {
      return false;
    }

    function writeVersion ( filepath ) {
      if( !grunt.file.exists(filepath) ) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
      } else {
        var data = grunt.file.readJSON(filepath);
        data.version = version;
        grunt.file.write( filepath, JSON.stringify(data, null, 4) );
      }
    }

    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.orig.src.forEach(function(filepath) {
        writeVersion(filepath);
      });

      src += options.punctuation;
    });

    return true;
  });

};
