var jsIgnore = require("./jsHandlers/jsIgnore.js");
var jsCopy = require("./jsHandlers/jsCopy.js");
var jsMerge = require("./jsHandlers/jsMerge.js");
var jsCompression = require("./jsHandlers/jsCompression.js");

var jsHandler = jsHandler || {};

jsHandler.unpackJs = function(rootPath, buildPath, jsConfig) {
    var paths = {
        ignore: [],
        copyOnly: [],
        merge: [],
        compression: []
    }

    var ignore = function () {
        jsIgnore.walkForPaths(rootPath, buildPath, jsConfig, function(ignorePaths) {
            paths.ignore = ignorePaths;
            (nextStep())();
        });
    }

    var copy = function () {
        jsCopy.walkForPaths(rootPath, buildPath, jsConfig, paths, function(copyPaths) {
            paths.copyOnly = copyPaths;
            (nextStep())();
        });
    }

    var merge = function() {
        jsMerge.walkForPaths(rootPath, buildPath, jsConfig, paths, function(mergePaths) {
            paths.merge = mergePaths;
            (nextStep())();
        })
    }

    var compression = function() {
        jsCompression.walkForPaths(rootPath, buildPath, jsConfig, paths, function(compressionPaths) {
            paths.compression = compressionPaths;
            (nextStep())();
        })
    }

    var nextStep = function () {
        if (functions.length > 0) {
            return functions.shift();
        } else {
            return function() {};
        }
    }

    var functions = [];

    jsConfig.ignore? functions.push(ignore) : '';
    jsConfig.copyOnly? functions.push(copy) : '';
    jsConfig.merge? functions.push(merge) : '';
    jsConfig.compression? functions.push(compression) : '';

    (nextStep())();
};

module.exports = jsHandler;