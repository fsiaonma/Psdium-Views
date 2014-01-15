/**
 * console 
 * PSD2V console 类
 * @constructor
 */
var console = console || {
    /**
     * 打印信息
     * @params {String} msg 信息类容
     * @method log
     */
    log: function(msg) {
    	if (PV.Config.DEBUG) {
    		$.writeln(msg);
    	} else {
    		alert(msg);
    	}
    }
};