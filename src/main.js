/**
 * PSD2V 程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
(function(app) {
    // 遍历 documents 对象
    if (app.documents) {
        for (var i = 0, len = app.documents.length; i < len; ++i) {
            var currentDoc = app.documents[i];
            var vName = currentDoc.name.substr(0, currentDoc.name.indexOf("."));

            var fs = new File("/d/Github/Tpsd2v/Tpsd2vV.js");
            fs.open("w:");
            fs.writeln(
                vName + "V" + " = G.Container.getClass().extend({\n" +
                "\tinit:function(){\n\n" + 
                "\t\tthis._super(arguments);\n"
            );

            Base.walk(currentDoc.layers, function(layer, type) {
                Base.dipatcher(fs, layer, type);
            });

            fs.writeln("\t}");
            fs.writeln("});");
            fs.close();
        }
    }
})(app);

/**
 * Base 
 * PSD2V 基类
 * @constructor
 */
var Base = Base || {
    /**
     * 遍历图层
     * @params {Array} layers 图层集合
     * @params {function} callback 回调函数
     * @method walk
     */
    walk: function(layers, callback) {
        for (var i = layers.length - 1; i > -1; --i) {
            var type = layers[i].name.substr(0, layers[i].name.indexOf("_"));
            callback && callback(layers[i], type);
        }
    },

    /**
     * 分派事件
     * @params {Object} layer 当前需要处理的图层
     * @params {String} type 分派类型
     * @method dipatcher
     */
    dipatcher: function(fs, layer, type) {
        switch (type) {
            case Global.BUTTON: {
                ButtonH.describe(fs, layer);
                break ;
            }
            case Global.BITMAP: {
                BitmapH.describe(fs, layer);
                break ;
            }
            case Global.TEXT: {
                TextH.describe(fs, layer);
                break ;
            }
            default: {
                console.log("找不到类型: " + type);
            }
        }
    }
};