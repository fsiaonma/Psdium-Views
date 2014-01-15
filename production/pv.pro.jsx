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

/**
 * Psdium-Views 类, 命名空间，最高层。
 * @class PV
 * @constructor
 */
var PV = PsdiumViews = {};

/**
 * Psdium-Views-Quark 类, 命名空间，次级层。
 * @class PVQ
 * @constructor
 */
var PVQ = PV.QuarkJs = {};

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
        DEBUG: true,

        LIB_MODE: {
        	QUARKJS: {
                SOURCE_PATH: {
                    SLICE: "/d/Github/Psdium-Views/demo/ui_slice/",
                    POS: "/d/Github/Psdium-Views/demo/ui_pos/"
                },
                EXPORT_PATH: {
                    SLICE: "/d/Github/Psdium-Views/demo/r_d_slice/",
                    POS: "/d/Github/Psdium-Views/demo/r_d_pos/",
                    IMAGE: "/d/Github/Psdium-Views/demo/r_d_images/"
                }
            }
        }
    }
})();

/**
 * Global 用于定义全局变量
 * PSD2V Global 类
 * @constructor
 */
PV.Global = (function() {
    return {
        // cs6 对象
        ART_LAYER: "ArtLayer",
        LAYER_SET: "LayerSet",

        // 导出库
        LIB_MODE: {
            QUARKJS: "QUARKJS"
        },

        // QuarkJS 元素
        QUARKJS: {
            ELEMENT: {
                IMAGE: "Image",
                BUTTON: "Button",
                TEXT: "Text",
                CONTAINER: "Container"
            },

            BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable"
            }
        }
    }
})();

/**
 * Psdium-Views quarkJs 切片文件处理方法
 * @params {Objcet} doc 当前文本对象
 * @method processSliceFile
 */
PVQ.processSliceFile = (function() {
    /**
     * 生成切片文件
     * @params {Objcet} doc 当前文本对象
     * @method doWidthSlice
     */
    var doWidthSliceFile = function(doc) {
        var fs = File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");

        if (fs.exists) {
            fs.open("e:");
            fs.seek(0, 2);
        } else {
            fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");
            fs.open("e:");
            fs.writeln("Slice = window.Slice || {};");
        }

        fs.encoding = "utf-8";
        
        fs.writeln("");

        var str = "";

        var name = doc.name.substr(0, doc.name.indexOf("."));
        fs.writeln("Slice['" + name + ".png'] = {");
        for (var i = 0, len = doc.layers.length; i < len; ++i) {
            var layer = doc.layers[i];
            if (str != "") {
                fs.write(",\n");
            }

            var name = layer.name;
            var x = Math.round(layer.bounds[0]);
            var y = Math.round(layer.bounds[1]);
            var width = Math.round(layer.bounds[2]) - x;
            var height = Math.round(layer.bounds[3]) - y;

            str = "\t'" + name + "':[" + x + ", " + y + ", " + width + ", " + height + "]";
            fs.write(str);
        }
        fs.writeln("\n};");

        fs.close();
    };

    /**
     * 生成 PNG 图片
     * @params {Objcet} doc 当前文本对象
     * @method generatePNG
     */
    var generatePNG = function(doc) {
        var pngOptions = new PNGSaveOptions();
        var name = doc.name.substr(0, doc.name.indexOf("."));
        doc.saveAs(new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.IMAGE + name + ".png"), pngOptions);
    }

    return function(doc) {
        doWidthSliceFile(doc);
        generatePNG(doc);
    }
})();

/**
 * Psdium-Views quarkJs 对位文件处理方法
 * @params {Objcet} doc 当前文本对象
 * @method processPosFile
 */
PVQ.processPosFile = (function() {
    return function(doc) {
        var vName = doc.name.substr(0, doc.name.indexOf(".")) + "V";

        var fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.POS + vName + ".js");
        fs.encoding = "utf-8";

        fs.open("w:");

        fs.writeln(
            "var " + vName + " = G.Container.getClass().extend({\n" +
            "\tinit:function(){\n\n" + 
            "\t\tthis._super(arguments);\n"
        );

        PV.Base.walk(doc.layers, function(layer, type) {
            PVQ.dispatcher.processElements(fs, layer, type);
        });
        
        fs.writeln("\t}");
        fs.writeln("});");

        fs.close();
    }
})();

/**
 * BaseH 
 * PSD2V Base 处理方法
 * @constructor
 */
PVQ.BaseH = function() {
    /**
     * 获取当前图层父节点相应属性
     * @params {Object} layer 当前需要处理的图层
     * @method getParent
     */
    this.getParent = function(layer) {
        var pos, name;

        var parent = layer.parent;
        var type = parent.name.substr(0, parent.name.indexOf("_"));

        if (type == PV.Global.QUARKJS.ELEMENT.CONTAINER) {
            name = parent.name;
            pos = [Math.round(parent.bounds[0]), Math.round(parent.bounds[1])];
        } else {
            name = "this";
            pos = [0, 0];
        }

        return {
            pos: pos,
            name: name 
        }
    }
};

/**
 * ImageH 
 * PSD2V Image 处理方法
 * @constructor
 */
PVQ.ImageH = function() {
    /**
     * 修饰 Bitmap 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var imageLayer = layer.layers[0];

        var name = imageLayer.name;
        var x = Math.round(imageLayer.bounds[0]);
        var y = Math.round(imageLayer.bounds[1]);
        var width = Math.round(imageLayer.bounds[2]) - x;
        var height = Math.round(imageLayer.bounds[3]) - y;

        var parent = this.getParent(layer);
        x -= parent.pos[0];
        y -= parent.pos[1];

        var str = "\t\tvar " + name + " = G.Image.create({slice: G.getSlice('" + name + "')});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.ImageH.prototype = new PVQ.BaseH();

/**
 * ButtonH 
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
        var x = Math.round(layer.bounds[0]);
        var y = Math.round(layer.bounds[1]);
        var width = Math.round(layer.bounds[2]) - x;
        var height = Math.round(layer.bounds[3]) - y;

        var up, down, disable;

        for (var i = 0, len = layer.layers.length; i < len; ++i) {
            var status = layer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.BUTTON_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.BUTTON_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.BUTTON_STATUS.DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        disable = status.layers[0].name;
                    }
                    break ;
                } 
            }
        }

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: ""
        }

        if (up) {
            strs.imgUp = "\t\t\timgUp: G.getSlice('" + up + "')";
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

        var parent = this.getParent(layer);
        x -= parent.pos[0];
        y -= parent.pos[1];
       
        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.ButtonH.prototype = new PVQ.BaseH();

/**
 * TextH 
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
        var name = layer.name;

        var textLayer = layer.layers[0];
        var x = Math.round(textLayer.bounds[0]);
        var y = Math.round(textLayer.bounds[1]);
        var width = Math.round(textLayer.bounds[2]) - x;
        var height = Math.round(textLayer.bounds[3]) - y;
        var fontSize = Math.round(textLayer.textItem.size);
        var lineHeight = Math.round(textLayer.textItem.leading);
        var align =  textLayer.textItem.justification.toString().split(".")[1].toLowerCase();

        var color = textLayer.textItem.color.rgb.hexValue;
        var content = textLayer.textItem.contents.replace(/\r/gi, "");

        var parent = this.getParent(layer);
        x -= parent.pos[0];
        y -= parent.pos[1];

        var str = "\t\tvar " + name + " = G.Text.create();\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" + 
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setColor('#" + color + "');\n" + 
                  "\t\t" + name + ".setTextAlign('" + align + "');\n" + 
                  "\t\t" + name + ".setText('" + content + "');\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.TextH.prototype = new PVQ.BaseH();

/**
 * ContainerH 
 * PSD2V Container 处理方法
 * @constructor
 */
PVQ.ContainerH = function() {
	/**
     * 修饰 Container 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var containerLayer = layer;

        var name = containerLayer.name;
        var x = Math.round(containerLayer.bounds[0]);
        var y = Math.round(containerLayer.bounds[1]);
        var width = Math.round(containerLayer.bounds[2]) - x;
        var height = Math.round(containerLayer.bounds[3]) - y;

        var parent = this.getParent(layer);
        x -= parent.pos[0];
        y -= parent.pos[1];

        var str = "\t\tvar " + name + " = G.Container.create();\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);

       	PV.Base.walk(containerLayer.layers, function(layer, type) {
            PVQ.dispatcher.processElements(fs, layer, type);
        });
    }
};

PVQ.ContainerH.prototype = new PVQ.BaseH();

/**
 * PVQ.dipatcher QuarkJs 元素处理分派器
 * @constructor
 */
PVQ.dispatcher = (function() {
    // 实例化处理方法
    var imageH = null;
    var buttonH = null;
    var textH = null;
    var containerH = null; 
           
    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派文件对象处理事件
         * @method processDoc
         */
        processDoc: function() {
            // 切片文件处理
            var sliceFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.SLICE);
            var files = File.decode(sliceFolder.getFiles()).split(",");
            for (var i = 0, len = files.length; i < len; ++i) {
                var doc = open(File(files[i]));
                PVQ.processSliceFile(doc);
                doc.close();
            }

            // 对文文件处理
            var posFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS);
            var files = File.decode(posFolder.getFiles()).split(",");
            for (var i = 0, len = files.length; i < len; ++i) {
                var doc = open(File(files[i]));
                PVQ.processPosFile(doc);
                doc.close();
            }
        },

        /**
         * 分派元素处理事件
         * @params {Object} fs 需要读写的文件
         * @params {Object} layer 当前需要处理的图层
         * @params {String} type 分派类型
         * @params {Container} ppos 坐标偏移量
         * @method switchElement
         */
        processElements: function(fs, layer, type) {
            switch (type) {
                case PV.Global.QUARKJS.ELEMENT.BUTTON: {
                    if (!buttonH) {
                        buttonH = new PVQ.ButtonH();
                    }
                    buttonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.IMAGE: {
                    if (!imageH) {
                        imageH = new PVQ.ImageH();
                    }
                    imageH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TEXT: {
                    if (!textH) {
                        textH = new PVQ.TextH();
                    }
                    textH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.CONTAINER: {
                    if (!containerH) {
                        containerH = new PVQ.ContainerH();
                    }
                    containerH.describe(fs, layer);
                    break ;
                }
                default: {
                    console.log("找不到类型: " + type + ", 图层名: " + layer.name);
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
                case PV.Global.LIB_MODE.QUARKJS: {
                    PVQ.main(app);
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
	// 转换长度单位为像素
	preferences.rulerUnits = Units.PIXELS;
	
	// 禁止弹出框
	displayDialogs =DialogModes.NO;

    // 遍历需要导出的库
    for (var key in PV.Config.LIB_MODE) {
        if (app) {
            PV.dispatcher.expoortLibMode(key, app);
        }
    }
})(app);

