/**
 * Psdium-Views quarkJs 处理程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
PVQ.main = function(app) {
	// 导出切片文件前处理
    for (var i = 0, len = PV.Config.LIB_MODE.length; i < len; ++i) {
        var mode = PV.Config.LIB_MODE[i];
        if (mode.libName == PV.Global.LIB_MODE.QUARK && mode.slice) {
        	var fs = File(PV.Config.EXPORT_PATH.SLICE + "Slice.js");
        	if (fs.exists) {
        		fs.remove();
        	}
        }
    }

	// 处理函数主入口
	if (app.documents) {
        for (var i = 0, len = app.documents.length; i < len; ++i) {
            PVQ.dispatcher.processDoc(app.documents[i]);
        }
    }
};