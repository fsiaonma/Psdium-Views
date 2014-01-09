var imagesIgnore = require("./imagesHandlers/imagesIgnore.js");
var imagesCopy = require("./imagesHandlers/imagesCopy.js");
var imagesCompression = require("./imagesHandlers/imagesCompression.js");

var imagesHandler = imagesHandler || {};

imagesHandler.unpackImages = function(rootPath, buildPath, imagesConfig) {
    var paths = {
        ignore: [],
        copyOnly: [],
        compression: []
    }

    var ignore = function () {
        imagesIgnore.walkForPaths(rootPath, buildPath, imagesConfig, function(ignorePaths) {
            paths.ignore = ignorePaths;
            (nextStep())();
        });
    }

    var copy = function () {
        imagesCopy.walkForPaths(rootPath, buildPath, imagesConfig, paths, function(copyPaths) {
            paths.copyOnly = copyPaths;
            (nextStep())();
        });
    }

    var compression = function() {
        imagesCompression.walkForPaths(rootPath, buildPath, imagesConfig, paths, function(compressionPaths) {
            paths.compression = compressionPaths;
            (nextStep())();
        });
    }

    var nextStep = function () {
        if (functions.length > 0) {
            return functions.shift();
        } else {
            return function() {};
        }
    }

    var functions = [];

    imagesConfig.ignore? functions.push(ignore) : '';
    imagesConfig.copyOnly? functions.push(copy) : '';
    imagesConfig.compression? functions.push(compression) : '';

    (nextStep())();
};

module.exports = imagesHandler;