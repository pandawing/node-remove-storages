'use strict';
var Promise = require('es6-promise').Promise;

function all () {
  var args = Array.prototype.slice.call(arguments);
  return Promise.all([
    removeLocalStorage(),
    removeIndexedDB.apply(null, args)
  ]);
}
function removeLocalStorage () {
  return new Promise(function (resolve) {
    localStorage.clear();
    resolve();
  });
}

function removingDatabaseList (list) {
  return list.map(function(dbName) {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.deleteDatabase(dbName);
      req.onsuccess = function () {
        resolve();
        return;
      };
      req.onerror = function (event) {
        reject(event);
        return;
      };
    });
  });
}

function removeIndexedDB () {
  var args = Array.prototype.slice.call(arguments);
  return new Promise(function (resolve, reject) {
    if (!indexedDB) {
      reject(new Error('Your browser doesn\'t support a stable version of IndexedDB.'));
      return;
    }
    if (args.length === 0) {
      reject(new Error('#removeIndexedDB requires the target database name.'));
      return;
    }

    return Promise.all(removingDatabaseList(args))
      .then(function () {
      resolve();
    });
  });
}

module.exports = all;
module.exports.all = all;
module.exports.localStorage = removeLocalStorage;
module.exports.indexedDB = removeIndexedDB;
