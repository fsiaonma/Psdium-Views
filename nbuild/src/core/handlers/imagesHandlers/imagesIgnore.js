var walk = require('walk');

var imageIgnore = (function() {
	var ignoreFilesPath = [];

	function doIgnore(devPath) {
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
        	console.log("[ignore js] ignore " + devPath);
            ignoreFilesPath.push(devPath);
        }
    }

    var o = {};

	o.walkForPaths = function(rootPath, buildPath, imagesConfig, callback) {
		var ignoreWalking = 0;

        imagesConfig.ignore.map(function(ignoreFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    ++ignoreWalking;
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--ignoreWalking == 0) {
                            callback && callback(ignoreFilesPath);
                        }
                    });
                } else {
                	doIgnore(devPath);
                }
            })(ignoreFilePath);
        });

        if (ignoreWalking == 0) {
            callback && callback(ignoreFilesPath);
        }
	}

	return o;
})()

module.exports = imageIgnore;