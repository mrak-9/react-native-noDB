import * as storage from 'react-native-fs';

module.exports.exists =  function(filename, callback){
  storage.exists(filename).then((data) => {return callback(data)});
};

module.exports.rename =  function(filename, newFilename, callback){
  storage.moveFile(filename, newFilename).then((data) => {return callback(data)});
};

module.exports.writeFile =  function(filename, contents, options, callback){
  if (typeof options === 'function') { callback = options; }
  storage.writeFile(filename, contents).then((data) => {return callback(data)});
};

module.exports.appendFile =  function(filename, toAppend, options, callback){
  if (typeof options === 'function') { callback = options; }
  storage.appendFile(filename, toAppend).then((data) => {return callback(data)});
};

module.exports.readFile =  function(filename, options, callback){
  if (typeof options === 'function') { callback = options; }
  storage.readFile(filename).then((data) => {return callback(null, data)});
};

module.exports.unlink =  function(filename, callback){
  storage.unlink(filename).then((data) => {return callback(data)});
};

module.exports.mkdirp =  function(filepath, callback) {
  storage.mkdir(filepath).then(() => callback());
};

module.exports.ensureDatafileIntegrity =  function (filename, callback) {
  var tempFilename = filename + '~';
  
  storage.exists(filename).then((filenameExists) => {
    // Write was successful
    if (filenameExists) { return callback(null); }
    
    storage.exists(tempFilename).then((oldFilenameExists) => {
      // New database
      if (!oldFilenameExists) {
        storage.writeFile(filename, '').then((err) => { return callback(err) });
      }
      
      // Write failed, use old version
      storage.moveFile(tempFilename, filename).then((data) => {return callback(data)});
    });
  });
};

module.exports.ensureFileDoesntExist = function (file, callback) {
  storage.exists(file).then((exists) => {
    if (!exists) { return callback(null); }
    
    storage.unlink(file).then((err) => {return callback(err)});
  });
};

module.exports.crashSafeWriteFile = function(filename, contents, callback){
  storage.writeFile(filename, contents).then((data) => {return callback(data)});
};

/**
 * Flush data in OS buffer to storage if corresponding option is set
 * @param {String} options.filename
 * @param {Boolean} options.isDir Optional, defaults to false
 * If options is a string, it is assumed that the flush of the file (not dir) called options was requested
 */
/*storage.flushToStorage = function (options, callback) {
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
          var e = new Error('Failed to flush to storage');
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
/*storage.crashSafeWriteFile = function (filename, data, cb) {
  var callback = cb || function () {}
    , tempFilename = filename + '~';

  async.waterfall([
    async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  , function (cb) {
      storage.exists(filename, function (exists) {
        if (exists) {
          storage.flushToStorage(filename, function (err) { return cb(err); });
        } else {
          return cb();
        }
      });
    }
  , function (cb) {
      storage.writeFile(tempFilename, data, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, tempFilename)
  , function (cb) {
      storage.rename(tempFilename, filename, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  ], function (err) { return callback(err); })
};*/
