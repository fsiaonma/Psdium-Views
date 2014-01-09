var cssIgnore = require("./cssHandlers/cssIgnore.js");
var cssCopy = require("./cssHandlers/cssCopy.js");
var cssMerge = require("./cssHandlers/cssMerge.js");
var cssCompression = require("./cssHandlers/cssCompression.js");

var cssHandler = cssHandler || {};

cssHandler.unpackCss = function(rootPath, buildPath, cssConfig) {
    var paths = {
        ignore: [],
        copyOnly: [],
        compression: []
    }

    var ignore = function () {
        cssIgnore.walkForPaths(rootPath, buildPath, cssConfig, function(ignorePaths) {
            paths.ignore = ignorePaths;
            (nextStep())();
        });
    }

    var copy = function () {
        cssCopy.walkForPaths(rootPath, buildPath, cssConfig, paths, function(copyPaths) {
            paths.copyOnly = copyPaths;
            (nextStep())();
        });
    }

    var merge = function() {
        cssMerge.walkForPaths(rootPath, buildPath, cssConfig, paths, function(mergePaths) {
            paths.merge = mergePaths;
            (nextStep())();
        })
    }

    var compression = function() {
        cssCompression.walkForPaths(rootPath, buildPath, cssConfig, paths, function(compressionPaths) {
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

    cssConfig.ignore? functions.push(ignore) : '';
    cssConfig.copyOnly? functions.push(copy) : '';
    cssConfig.merge? functions.push(merge) : '';
    cssConfig.compression? functions.push(compression) : '';

    (nextStep())();
};

module.exports = cssHandler;