/**
 * Psdium-Views 程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
(function(app) {
	// 转换长度单位为像素
	preferences.rulerUnits = Units.PIXELS;
	
	// 禁止弹出框
	displayDialogs =DialogModes.NO;

    // 遍历需要导出的库
    for (var i = 0, len = PV.Config.LIB_MODE.length; i < len; ++i) {
        var mode = PV.Config.LIB_MODE[i].libName;
        if (app) {
            PV.dispatcher.expoortLibMode(mode, app);
        }
    }
})(app);