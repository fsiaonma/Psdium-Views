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
        $.writeln(msg);
    }
};

/**
 * Psdium-Views 类, 命名空间，最高层。
 * @class PV
 * @constructor
 */
var PV = PsdiumViews = {};

/**
 * Psdium-Views-Quark 类, 命名空间，次级层。
 * @class PV
 * @constructor
 */
var PVQ = PV.Quark = {};

/**
 * Base 
 * PSD2V 基类
 * @constructor
 */
PV.Base = (function() {
    return {
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
        }
    }
})();

/**
 * Config 
 * PSD2V 相关配置文件
 * @constructor
 */
PV.Config = (function() {
    return {
        LIB_MODE: ["QuarkJs"],
        EXPORT_PATH: "/d/Github/Tpsd2v/"
    }
})();

/**
 * Global 用于定义全局变量
 * PSD2V Global 类
 * @constructor
 */
PV.Global = (function() {
    return {
        // cm 到 px 转换值
        PX_BUFFER: 37.795276,
        
        // cs6 对象
        ART_LAYER: "ArtLayer",
        LAYER_SET: "LayerSet",

        // 导出库
        LIB_MODE: {
            QUARK: "QuarkJs"
        },

        // QuarkJS 元素
        QUARK: {
            ELEMENT: {
                BITMAP: "Bitmap",
                BUTTON: "Button",
                TEXT: "Text"
            },

            BUTTON_STATUS: {
                NORMAL: "normal",
                DOWN: "down",
                DISABLE: "disable"
            }
        }
    }
})();

/**
 * Bitmap 
 * PSD2V Bitmap 处理方法
 * @constructor
 */
PVQ.BitmapH = function() {
    /**
     * 修饰 Bitmap 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        if (layer.typename == PV.Global.ART_LAYER) {
            var name = layer.name;
            var x = Math.round(layer.bounds[0] * PV.Global.PX_BUFFER);
            var y = Math.round(layer.bounds[1] * PV.Global.PX_BUFFER);
            var width = Math.round(layer.bounds[2] * PV.Global.PX_BUFFER);
            var height = Math.round(layer.bounds[3] * PV.Global.PX_BUFFER);

            var str = "\t\tvar " + name + " = G.Bitmap.create({slice: G.getSlice('" + name + "')});\n" + 
                      "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                      "\t\tthis.addChild(" + name + ");\n";

            fs.writeln(str);
        }
    }
};

/**
 * Button 
 * PSD2V Button 处理方法
 * @constructor
 */
PVQ.ButtonH = function() {
    /**
     * 修饰 Button 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var name = layer.name;
        var x = Math.round(layer.bounds[0] * PV.Global.PX_BUFFER);
        var y = Math.round(layer.bounds[1] * PV.Global.PX_BUFFER);
        var width = Math.round(layer.bounds[2] * PV.Global.PX_BUFFER);
        var height = Math.round(layer.bounds[3] * PV.Global.PX_BUFFER);

        var normal, down, disable;

        (function(layer) {
            if (layer.typename == PV.Global.LAYER_SET) {
                for (var i = 0, len = layer.layers.length; i < len; ++i) {
                    arguments.callee(layer.layers[i]);
                }
            } else if (layer.typename == PV.Global.ART_LAYER) {
                var exName = layer.name.substr(0, layer.name.indexOf("_"));
                switch (exName) {
                    case PV.Global.QUARK.BUTTON_STATUS.NORMAL: {
                        normal = layer.name;
                        break ;
                    }
                    case PV.Global.QUARK.BUTTON_STATUS.DOWN: {
                        down = layer.name;
                        break ;
                    }
                    case PV.Global.QUARK.BUTTON_STATUS.DISABLE: {
                        disable = layer.name;
                        break ;
                    } 
                }
            }
        })(layer);

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: ""
        }

        if (normal) {
            strs.imgUp = "\t\t\timgUp: G.getSlice('" + normal + "')";
            current = "imgUp";
        }

        if (down) {
            strs[current] += ",\n";
            strs.imgDown = "\t\t\timgDown: G.getSlice('" + down + "')";
            current = "imgDown";
        }

        if (disable) {
            strs[current] += ",\n"
            strs.imgDisable = disable? "\t\t\t,imgDisable: G.getSlice('" + disable + "')\n" : '';
            current = "imgDisable";
        }
       
        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\tthis.addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

/**
 * Text 
 * PSD2V Text 处理方法
 * @constructor
 */
PVQ.TextH = function() {
    /**
     * 修饰 Text 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        console.log(layer.name);
    }
};

/**
 * PVQ.dipatcher QuarkJs 元素处理分派器
 * @constructor
 */
PVQ.dispatcher = (function() {
    // 实例化处理方法
    var BitmapH = null;
    var ButtonH = null;
    var TextH = null;

    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派元素处理事件
         * @params {Object} fs 需要读写的文件
         * @params {Object} layer 当前需要处理的图层
         * @params {String} type 分派类型
         * @method switchElement
         */
        processElements: function(fs, layer, type) {
            switch (type) {
                case PV.Global.QUARK.ELEMENT.BUTTON: {
                    if (!ButtonH) {
                        ButtonH = new PVQ.ButtonH();
                    }
                    ButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARK.ELEMENT.BITMAP: {
                    if (!BitmapH) {
                        BitmapH = new PVQ.BitmapH();
                    }
                    BitmapH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARK.ELEMENT.TEXT: {
                    if (!TextH) {
                        TextH = new PVQ.TextH();
                    }
                    TextH.describe(fs, layer);
                    break ;
                }
                default: {
                    console.log("找不到类型: " + type);
                }
            }
        }
    }
})();

/**
 * Psdium-Views quarkJs 处理程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
PVQ.Main = function(app) {
	// 处理函数主入口
	if (app.documents) {
        for (var i = 0, len = app.documents.length; i < len; ++i) {
            var currentDoc = app.documents[i];
            var vName = currentDoc.name.substr(0, currentDoc.name.indexOf(".")) + "V";

            var folder = new Folder(PV.Config.EXPORT_PATH + "QuarkJs/");
            var res = folder.create();
            if (res) {
                var fs = new File(PV.Config.EXPORT_PATH + "QuarkJs/" + vName + ".js");
                fs.open("w:");
                fs.writeln(
                    "var " + vName + " = G.Container.getClass().extend({\n" +
                    "\tinit:function(){\n\n" + 
                    "\t\tthis._super(arguments);\n"
                );

                PV.Base.walk(currentDoc.layers, function(layer, type) {
                    PVQ.dispatcher.processElements(fs, layer, type);
                });

                fs.writeln("\t}");
                fs.writeln("});");
                fs.close();
            }
        }
    }
};

/**
 * PV.dipatcher 全局库模型分派器
 * @constructor
 */
PV.dispatcher = (function() {
    return {
        /**
         * 分派导出库模型
         * @params {String} mode 需要导出的库类型
         * @method switchLibMode
         */
        expoortLibMode: function(mode, app) {
            switch(mode) {
                case PV.Global.LIB_MODE.QUARK: {
                    PVQ.Main(app);
                    break ;
                }
            }
        }
    }
})();

/**
 * Psdium-Views 程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
(function(app) {
    // 遍历需要导出的库
    for (var i = 0, len = PV.Config.LIB_MODE.length; i < len; ++i) {
        var mode = PV.Config.LIB_MODE[i];
        if (app) {
            PV.dispatcher.expoortLibMode(mode, app);
        }
    }
})(app);

