//import * as RNFetchBlob.fs from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'

module.exports.exists =  function(filename, callback){
  RNFetchBlob.fs.exists(filename).then((data) => {return callback(data)});
};

module.exports.rename =  function(filename, newFilename, callback){
  RNFetchBlob.fs.mv(filename, newFilename).then((data) => {return callback(data)});
};

module.exports.writeFile =  function(filename, contents, options, callback){
  if (typeof options === 'function') { callback = options; }
  
  RNFetchBlob.fs.exists(filename).then((exists) => {
    if (!exists)
      RNFetchBlob.fs.createFile(filename, contents, 'utf8').then(() => {return callback()});
    else
      RNFetchBlob.fs.writeFile(filename, contents, 'utf8').then(() => {return callback()});
  });
};

module.exports.appendFile =  function(filename, toAppend, options, callback){
  if (typeof options === 'function') { callback = options; }
  
  RNFetchBlob.fs.exists(filename).then((exists) => {
    if (!exists)
      RNFetchBlob.fs.createFile(filename, toAppend, 'utf8').then(() => {return callback()});
    else
      RNFetchBlob.fs.appendFile(filename, toAppend, 'utf8').then(() => {return callback()});
  });
};

module.exports.readFile =  function(filename, options, callback){
  if (typeof options === 'function') { callback = options; }
  
  RNFetchBlob.fs.exists(filename).then((exists) => {
    if (!exists)
      return callback(null, '');
    else
      RNFetchBlob.fs.readFile(filename, 'utf8').then((data) => {return callback(null, data)});
  });
};

module.exports.unlink =  function(filename, callback){
  RNFetchBlob.fs.unlink(filename).then(() => {return callback()});
};

module.exports.mkdirp =  function(filepath, callback) {
  RNFetchBlob.fs.mkdir(filepath).then(() => callback());
};

module.exports.ensureDatafileIntegrity =  function (filename, callback) {
  var tempFilename = filename + '~';
  
  RNFetchBlob.fs.exists(filename).then((filenameExists) => {
    // Write was successful
    if (filenameExists)
      return callback(null);
    else
    {
      RNFetchBlob.fs.exists(tempFilename).then((oldFilenameExists) => {
          if (!oldFilenameExists)
        RNFetchBlob.fs.writeFile(filename, '', 'utf8').then((err) => { return callback(err) });
      else
        RNFetchBlob.fs.mv(tempFilename, filename).then((data) => {return callback(data)});
      });
    }
  });
};

module.exports.ensureFileDoesntExist = function (file, callback) {
  RNFetchBlob.fs.exists(file).then((exists) => {
    if (!exists)
      return callback(null);
    else
      RNFetchBlob.fs.unlink(file).then(() => {return callback()});
  });
};

module.exports.crashSafeWriteFile = function(filename, contents, callback){
  RNFetchBlob.fs.exists(filename).then((exists) => {
    if (!exists)
      RNFetchBlob.fs.createFile(filename, contents, 'utf8').then(() => {return callback()});
    else
      RNFetchBlob.fs.writeFile(filename, contents, 'utf8').then(() => {return callback()});
  });
};

/**
 * Flush data in OS buffer to RNFetchBlob.fs if corresponding option is set
 * @param {String} options.filename
 * @param {Boolean} options.isDir Optional, defaults to false
 * If options is a string, it is assumed that the flush of the file (not dir) called options was requested
 */
/*RNFetchBlob.fs.flushToRNFetchBlob.fs = function (options, callback) {
  var filename, flags;
  if (typeof options === 'string') {
    filename = options;
    flags = 'r+';
  } else {
    filename = options.filename;
    flags = options.isDir ? 'r' : 'r+';
  }

  // Windows can't fsync (FlushFileBuffers) directories. We can live with this as it cannot cause 100% dataloss
  // except in the very rare event of the first time database is loaded and a crash happens
  if (flags === 'r' && (process.platform === 'win32' || process.platform === 'win64')) { return callback(null); }

  fs.open(filename, flags, function (err, fd) {
    if (err) { return callback(err); }
    fs.fsync(fd, function (errFS) {
      fs.close(fd, function (errC) {
        if (errFS || errC) {
          var e = new Error('Failed to flush to RNFetchBlob.fs');
          e.errorOnFsync = errFS;
          e.errorOnClose = errC;
          return callback(e);
        } else {
          return callback(null);
        }
      });
    });
  });
};*/


/**
 * Fully write or rewrite the datafile, immune to crashes during the write operation (data will not be lost)
 * @param {String} filename
 * @param {String} data
 * @param {Function} cb Optional callback, signature: err
 */
/*RNFetchBlob.fs.crashSafeWriteFile = function (filename, data, cb) {
  var callback = cb || function () {}
    , tempFilename = filename + '~';

  async.waterfall([
    async.apply(RNFetchBlob.fs.flushToRNFetchBlob.fs, { filename: path.dirname(filename), isDir: true })
  , function (cb) {
      RNFetchBlob.fs.exists(filename, function (exists) {
        if (exists) {
          RNFetchBlob.fs.flushToRNFetchBlob.fs(filename, function (err) { return cb(err); });
        } else {
          return cb();
        }
      });
    }
  , function (cb) {
      RNFetchBlob.fs.writeFile(tempFilename, data, function (err) { return cb(err); });
    }
  , async.apply(RNFetchBlob.fs.flushToRNFetchBlob.fs, tempFilename)
  , function (cb) {
      RNFetchBlob.fs.rename(tempFilename, filename, function (err) { return cb(err); });
    }
  , async.apply(RNFetchBlob.fs.flushToRNFetchBlob.fs, { filename: path.dirname(filename), isDir: true })
  ], function (err) { return callback(err); })
};*/
