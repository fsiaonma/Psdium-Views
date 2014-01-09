var fs = require('fs'); 
var walk = require('walk');
var cleanCSS = require('clean-css/lib/clean');

var base = require('../../common/base');


var cssCompression = (function() {
	var compressionFilesPath = [];

    function prepareClean(paths, devPath) {
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
        if (suffix == "css") {
            compressionFilesPath.push(devPath);
        }
    }

    function doCleanFiles(fileIn, fileOut) {
        if (fileIn.length > 0) {
            var finalCode = [];
            var origCode = "";
            for (var i = 0, len = fileIn.length; i < len; ++i) {
                console.log("[cleaning css] cleaning " + fileIn[i]);
                origCode = fs.readFileSync(fileIn[i], 'utf8');
                var minCss = cleanCSS.process(origCode, { debug: false });
                finalCode.push(minCss);
            };

            base.createFloder(fileOut.substr(0, fileOut.lastIndexOf("/")), function() {
                fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
            });
        }
    }

    var o = {};

	o.walkForPaths = function(rootPath, buildPath, cssConfig, paths, callback) {
        cssConfig.compression.map(function(compressionConfig) {
            (function(config) {
                var compressWalking = 0;
                config.dir.map(function(path) {
                    var callFunc = arguments.callee;
                    var self = this;
                    var devPath = rootPath + path;
                    if (devPath[devPath.length - 1] == '/') {
                        ++compressWalking;
                        var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                        walker.on("file", function (root, fileStats, next) {
                            var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                            var filePathName = fileRootPathName.substr(rootPath.length);
                            callFunc.call(self, filePathName);
                            next();
                        });
                        walker.on("end", function() {
                            if (--compressWalking == 0) {
                                doCleanFiles(compressionFilesPath, buildPath + (config.outputFile? config.outputFile : '/min.css'));
                                callback && callback(compressionFilesPath);
                            }
                        });
                    } else {
                        prepareClean(paths, devPath);
                    }
                })
                if (compressWalking == 0) {
                    doCleanFiles(compressionFilesPath, buildPath + (config.outputFile? config.outputFile : '/min.css'));
                    callback && callback(compressionFilesPath);
                }
            })(compressionConfig);
        });
    } 

    return o;
})();

module.exports = cssCompression;