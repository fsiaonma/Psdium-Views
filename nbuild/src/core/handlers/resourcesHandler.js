var resourceIgnore = require("./resourcesHandlers/resourceIgnore.js");
var resourceCopy = require("./resourcesHandlers/resourceCopy.js");

var resourcesHandler = resourcesHandler || {};

resourcesHandler.unpackResources = function(rootPath, buildPath, resourcesConfig) {
	var paths = {
        ignore: [],
        copyOnly: []
    }

    var ignore = function() {
        resourceIgnore.walkForPaths(rootPath, buildPath, resourcesConfig, function(ignorePaths) {
            paths.ignore = ignorePaths;
            (nextStep())();
        })
    }

    var copy = function() {
        resourceCopy.walkForPaths(rootPath, buildPath, resourcesConfig, paths, function(copyPaths) {
            paths.copyOnly = copyPaths;
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

    resourcesConfig.ignore? functions.push(ignore) : '';
    resourcesConfig.copyOnly? functions.push(copy) : '';

    (nextStep())();
};

module.exports = resourcesHandler;