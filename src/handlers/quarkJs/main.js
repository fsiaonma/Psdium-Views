/**
 * Psdium-Views quarkJs 处理程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
PVQ.main = (function() {
    return function(app) {
    	// 导出切片文件前处理
        var fs = File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");
        if (fs.exists) {
            fs.remove();
        }
    	// 处理函数主入口
        PVQ.dispatcher.processDoc();
    }
})();