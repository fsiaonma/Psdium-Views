var walk = require('walk');
var smushit = require('node-smushit/smushit');

var base = require('../../common/base');

var imagesCompression = (function() {
    var compressionFilesPath = [];

    function doSmushit(rootPath, buildPath, paths, devPath, path) {
        var devPath = rootPath + path;
        for (var i = 0, len = paths.copyOnly.length; i < len; ++i) {
            if (paths.copyOnly[i] == devPath) {
                return ;
            }
        }
        for (var i = 0, len = paths.ignore.length; i < len; ++i) {
            if (paths.ignore[i] == devPath) {
                return ;
            }
        }
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            compressionFilesPath.push(devPath);
            var fileInPath = rootPath + path;
            var fileOutPath = buildPath + path;
            base.copyFile(fileInPath, fileOutPath, function() {
                smushit.smushit(fileOutPath);
            });
        }
    }

    var o = {};

    o.walkForPaths = function(rootPath, buildPath, imagesConfig, paths, callback) {
        var compressWalking = 0;
        imagesConfig.compression.map(function(imagesPath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    ++compressWalking;
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--compressWalking == 0) {
                            callback && callback(compressionFilesPath);
                        }
                    });
                } else {
                    doSmushit(rootPath, buildPath, paths, devPath, path);
                }
            })(imagesPath);
        });
        if (compressWalking == 0) {
            callback && callback(compressionFilesPath);
        }
    }

    return o;
})()

module.exports = imagesCompression;
