var fs = require('fs'); 
var walk = require('walk');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var base = require('../../common/base');

var jsCompression = (function() {
	var compressionFilesPath = [];

	var prepareCompression = function(paths, devPath) {
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
        if (suffix == "js") {
            compressionFilesPath.push(devPath);
        }
    }

    var doCompression = function(filesIn, fileOut) {
        if (filesIn.length > 0) {
            var finalCode = [];
            var origCode = "";
            var ast = "";
            for (var i = 0, len = filesIn.length; i < len; ++i) {
                console.log("[compressing js] compressing " + filesIn[i]);
                origCode = fs.readFileSync(filesIn[i], 'utf8');
                ast = jsp.parse(origCode);
                ast = pro.ast_mangle(ast); 
                ast = pro.ast_squeeze(ast);
                finalCode.push(pro.gen_code(ast), ';');
            };
            base.createFloder(fileOut.substr(0, fileOut.lastIndexOf("/")), function(){
                fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
            });
        }
    }

	var o = {};

	o.walkForPaths = function(rootPath, buildPath, jsConfig, paths, callback) {
        jsConfig.compression.map(function(compressionConfig) {
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
                                doCompression(compressionFilesPath, buildPath + (config.outputFile? config.outputFile : '/min.js'));
                                callback && callback(compressionFilesPath);
                            }
                        });
                    } else {
                        prepareCompression(paths, devPath);
                    }
                });
                if (compressWalking == 0) {
                    doCompression(compressionFilesPath, buildPath + (config.outputFile? config.outputFile : '/min.js'));
                    callback && callback(compressionFilesPath);
                }
            })(compressionConfig);
        });
    }

    return o;
})();

module.exports = jsCompression;