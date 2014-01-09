var fs = require('fs'); 
var walk = require('walk');

var base = require('../../common/base');

var cssMerge = (function() {
    var mergeFilesPath = [];

    var prepareMerge = function(paths, devPath) {
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
            mergeFilesPath.push(devPath);
        }
    }

    var doMerge = function(filesIn, fileOut) {
        if (filesIn.length > 0) {
            var origCode = "";
            for (var i = 0, len = filesIn.length; i < len; ++i) {
                console.log("[merge css] merge " + filesIn[i]);
                origCode += fs.readFileSync(filesIn[i], 'utf8');
                origCode += "\n\n";
            };
            base.createFloder(fileOut.substr(0, fileOut.lastIndexOf("/")), function(){
                fs.writeFileSync(fileOut, origCode, 'utf8');
            });
        }
    }

    var o = {};

    o.walkForPaths = function(rootPath, buildPath, cssConfig, paths, callback) {
        cssConfig.merge.map(function(mergeConfig) {
            (function(config) {
                var mergeWalking = 0;
                config.dir.map(function(path) {
                    var callFunc = arguments.callee;
                    var self = this;
                    var devPath = rootPath + path;
                    if (devPath[devPath.length - 1] == '/') {
                        ++mergeWalking;
                        var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                        walker.on("file", function (root, fileStats, next) {
                            var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                            var filePathName = fileRootPathName.substr(rootPath.length);
                            callFunc.call(self, filePathName);
                            next();
                        });
                        walker.on("end", function() {
                            if (--mergeWalking == 0) {
                                doMerge(mergeFilesPath, buildPath + (config.outputFile? config.outputFile : '/merge.css'));
                                callback && callback(mergeFilesPath);
                            }
                        });
                    } else {
                        prepareMerge(paths, devPath);
                    }
                });
                if (mergeWalking == 0) {
                    doMerge(mergeFilesPath, buildPath + (config.outputFile? config.outputFile : '/merge.css'));
                    callback && callback(mergeFilesPath);
                }
            })(mergeConfig);
        });
    }

    return o;
})()

module.exports = cssMerge;