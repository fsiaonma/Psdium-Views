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
        },

        /**
         * 获取前缀名
         * @params {String} name 名称
         * @method getExName
         */
        getExName: function(name) {
            return name.substr(0, name.indexOf("_"));
        },

        /**
         * 获取组件名
         * @params {String} name 名称
         * @method getLastName
         */
        getComponentName: function(name) {
            var type = name.substr(0, name.indexOf("_"));
            var componentName = name;
            for (var key in PV.Global.QUARKJS.ELEMENT) {
                if (type == PV.Global.QUARKJS.ELEMENT[key]) {
                    componentName = name.substr(name.indexOf("_") + 1);
                }
            }
            return componentName;
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
                    SLICE: "/c/wamp/www/workplace/testPSD2V/scripts/configs/",
                    POS: "/c/wamp/www/workplace/testPSD2V/scripts/views/",
                    IMAGE: "/c/wamp/www/workplace/testPSD2V/images/"
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
            VIEW: "View",

            ELEMENT: {
                IMAGE: "Image",
                BUTTON: "Button",
                TEXT: "Text",
                CONTAINER: "Container",
                TOGGLE_BUTTON: "ToggleButton",
                SWITCH: "Switch",
                INPUT: "Input",
                ANIMATION: "Ani",
                DRAGPANEL: "DragPanel",
                ITEM: "Item"
            },

            BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable"
            },

            TOGGLE_BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable",
                CHECK_UP: "checkup",
                CHECK_DOWN: "checkdown",
                CHECK_DISABLE: "checkdisable"
            },

            SWITCH_STATUS: {
                BG: "bg",
                UP: "up",
                DOWN: "down"
            },

            Input_STATUS: {
                AREA: "area",
                TEXT: "text"
            },

            DRAGPANEL_STATUS: {
                AREA: "area"
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
            fs.encoding = "utf-8";
            fs.open("e:");
            fs.seek(0, 2);
        } else {
            fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");
            fs.encoding = "utf-8";
            fs.open("e:");
            fs.writeln("Slice = window.Slice || {};");
        }
        
        fs.writeln("");

        var str = "";

        var name = doc.name.substr(0, doc.name.indexOf("."));
        fs.writeln("Slice['" + name + ".png'] = {");

        (function(layers) {
            for (var i = 0, len = layers.length; i < len; ++i) {
                var layer = layers[i];
                if (layer.typename == PV.Global.ART_LAYER) {
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
                } else if (layer.typename == PV.Global.LAYER_SET) {
                    arguments.callee(layer.layers);
                }
            }
        })(doc.layers);

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
 * @params {Objcet} layer 当前视图对象
 * @method processPosFile
 */
PVQ.processPosFile = (function() {
    return function(layer) {

        var start = layer.name.indexOf("_") + 1;
        var vName = layer.name.substr(start) + "V";

        var fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.POS + vName + ".js");
        fs.encoding = "utf-8";

        fs.open("w:");

        fs.writeln(
            "var " + vName + " = G.Container.getClass().extend({\n" +
            "\tinit:function(){\n\n" + 
            "\t\tthis._super(arguments);\n"
        );

        PV.Base.walk(layer.layers, function(layer, type) {
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

        if (type == PV.Global.QUARKJS.ELEMENT.CONTAINER || type == PV.Global.QUARKJS.ELEMENT.ITEM) {
            name = PV.Base.getComponentName(parent.name);
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
     * 修饰 Image 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} imageLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, imageLayer) {
        var self = this;
        var parent = self.getParent(imageLayer);
        (function(layer) {
            var callFunc = arguments.callee;
            PV.Base.walk(layer.layers, function(layer, type) {
                var imageLayer = layer;
                if (imageLayer.typename == PV.Global.ART_LAYER) {
                    var name = PV.Base.getComponentName(imageLayer.name);
                    var x = Math.round(imageLayer.bounds[0]);
                    var y = Math.round(imageLayer.bounds[1]);
                    x -= parent.pos[0];
                    y -= parent.pos[1];
                    var width = Math.round(imageLayer.bounds[2]) - x;
                    var height = Math.round(imageLayer.bounds[3]) - y;
                    var visible = layer.visible? true : false;

                    var str = "\t\tvar " + name + " = G.Image.create({slice: G.getSlice('" + name + "')});\n" + 
                              "\t\t" + name + ".setVisible(" + visible + ");\n" +
                              "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                              "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                              "\t\t" + parent.name + "." + name + " = " + name + ";\n";

                    fs.writeln(str);
                } else if (PV.Base.getExName(imageLayer.name) == PV.Global.QUARKJS.ELEMENT.IMAGE 
                            && imageLayer.typename == PV.Global.LAYER_SET) {
                    callFunc(imageLayer);
                }
            });
        })(imageLayer);
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
     * @params {Object} buttonLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, buttonLayer) {
        var name = PV.Base.getComponentName(buttonLayer.name);
        var x = Math.round(buttonLayer.bounds[0]);
        var y = Math.round(buttonLayer.bounds[1]);
        var parent = this.getParent(buttonLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(buttonLayer.bounds[2]) - x;
        var height = Math.round(buttonLayer.bounds[3]) - y;
        var visible = buttonLayer.visible? true : false;

        var up, down, disable;

        for (var i = 0, len = buttonLayer.layers.length; i < len; ++i) {
            var status = buttonLayer.layers[i];
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
       
        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." +  + name + " = " + name + ";\n";

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
     * @params {Object} textItemLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, textItemLayer) {
        var name = PV.Base.getComponentName(textItemLayer.name);

        var textLayer = textItemLayer.layers[0];
        var x = Math.round(textLayer.bounds[0]);
        var y = Math.round(textLayer.bounds[1]);
        var parent = this.getParent(textItemLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(textLayer.bounds[2]) - x;
        var height = Math.round(textLayer.bounds[3]) - y;
        var fontSize = Math.round(textLayer.textItem.size);
        var lineHeight = Math.round(textLayer.textItem.leading);
        var align =  textLayer.textItem.justification.toString().split(".")[1].toLowerCase();
        var visible = textLayer.visible? true : false;

        var color = textLayer.textItem.color.rgb.hexValue;
        var content = textLayer.textItem.contents.replace(/\r/gi, "");

        var str = "\t\tvar " + name + " = G.Text.create();\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" + 
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setColor('#" + color + "');\n" + 
                  "\t\t" + name + ".setTextAlign('" + align + "');\n" + 
                  "\t\t" + name + ".setText('" + content + "');\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.TextH.prototype = new PVQ.BaseH();

/**
 * ToggleButtonH 
 * PSD2V ToggleButton 处理方法
 * @constructor
 */
PVQ.ToggleButtonH = function() {
    /**
     * 修饰 ToggleButton 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} toggleButtonLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, toggleButtonLayer) {
        var name = PV.Base.getComponentName(toggleButtonLayer.name);
        var x = Math.round(toggleButtonLayer.bounds[0]);
        var y = Math.round(toggleButtonLayer.bounds[1]);
        var parent = this.getParent(toggleButtonLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(toggleButtonLayer.bounds[2]) - x;
        var height = Math.round(toggleButtonLayer.bounds[3]) - y;
        var visible = toggleButtonLayer.visible? true : false;

        var up, down, disable, checkup, checkdown, checkdisable;

        for (var i = 0, len = toggleButtonLayer.layers.length; i < len; ++i) {
            var status = toggleButtonLayer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        disable = status.layers[0].name;
                    }
                    break ;
                } 
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_UP: {
                    if (status.layers && status.layers.length > 0) {
                        checkup = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        checkdown = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        checkdisable = status.layers[0].name;
                    }
                    break ;
                }
            }
        }

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: "",
            checkedImgUp: "",
            checkedImgDown: "",
            checkedImgDisable: ""
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
            strs.imgDisable = disable? "\t\t\timgDisable: G.getSlice('" + disable + "')\n" : '';
            current = "imgDisable";
        }

        if (checkup) {
            strs[current] += ",\n";
            strs.checkedImgUp = "\t\t\tcheckedImgUp: G.getSlice('" + checkup + "')";
            current = "checkedImgUp";
        }

        if (checkdown) {
            strs[current] += ",\n";
            strs.checkedImgDown = "\t\t\tcheckedImgDown: G.getSlice('" + checkdown + "')";
            current = "checkedImgDown";
        }

        if (checkdisable) {
            strs[current] += ",\n"
            strs.checkedImgDisable = checkdisable? "\t\t\tcheckedImgDisable: G.getSlice('" + checkdisable + "')" : '';
            current = "checkedImgDisable";
        }
       
        var str = "\t\tvar " + name + " = G.ToggleButton.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + strs.checkedImgUp + strs.checkedImgDown + strs.checkedImgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.ToggleButtonH.prototype = new PVQ.BaseH();

/**
 * SwitchH 
 * PSD2V Switch 处理方法
 * @constructor
 */
PVQ.SwitchH = function() {
    /**
     * 修饰 Switch 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} switchLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, switchLayer) {
        var name = PV.Base.getComponentName(switchLayer.name);
        var x = Math.round(switchLayer.bounds[0]);
        var y = Math.round(switchLayer.bounds[1]);
        var parent = this.getParent(switchLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(switchLayer.bounds[2]) - x;
        var height = Math.round(switchLayer.bounds[3]) - y;
        var visible = switchLayer.visible? true : false;

        var bg, up, down;

        for (var i = 0, len = switchLayer.layers.length; i < len; ++i) {
            var status = switchLayer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.SWITCH_STATUS.BG: {
                    if (status.layers && status.layers.length > 0) {
                        bg = status.layers[0].name;
                    }
                    break ;
                } 
                case PV.Global.QUARKJS.SWITCH_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.SWITCH_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
            }
        }

        var current = "";

        var strs = {
            bg: "",
            upBar: "",
            downBar: ""
        }

        if (bg) {
            strs.bg = "\t\t\tbg: G.getSlice('" + bg + "')";
            current = "bg";
        }

        if (up) {
            strs[current] += ",\n"
            strs.upBar = "\t\t\tupBar: G.getSlice('" + up + "')";
            current = "upBar";
        }

        if (down) {
            strs[current] += ",\n";
            strs.downBar = "\t\t\tdownBar: G.getSlice('" + down + "')";
            current = "downBar";
        }
       
        var str = "\t\tvar " + name + " = G.Switch.create({\n" +
                  "\t\t\twidth: " + width + ",\n" + 
                  strs.bg + strs.upBar + strs.downBar + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.SwitchH.prototype = new PVQ.BaseH();

/**
 * InputH 
 * PSD2V Input 处理方法
 * @constructor
 */
PVQ.InputH = function() {
    /**
     * 修饰 Input 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} inputLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, inputLayer) {
        var parent, x, y, width, height, fontSize, lineHeight, visible;
        var name = PV.Base.getComponentName(inputLayer.name);
        var containerName = name + "Container";

        for (var i = 0, len = inputLayer.layers.length; i < len; ++i) {
            if (inputLayer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.AREA) {
                var area = inputLayer.layers[i];
                x = Math.round(area.bounds[0]);
                y = Math.round(area.bounds[1]);
                parent = this.getParent(area);
                x -= parent.pos[0];
                y -= parent.pos[1];
                width = Math.round(area.bounds[2]) - x;
                height = Math.round(area.bounds[3]) - y;
                visible = inputLayer.visible? true : false;
            } else if (inputLayer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.TEXT) {
                var textItem = inputLayer.layers[i].textItem;
                fontSize = Math.round(textItem.size);
                lineHeight = Math.round(textItem.leading);
            }
        }

        var str = "\t\tvar " + containerName + " = G.Container.create();\n" +
                  "\t\t" + containerName + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + containerName + ");\n" + 
                  "\t\tvar " + name + " = G.Input.create();\n" + 
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setHeight(" + height + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" +
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + containerName + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n" + 
                  "\t\t" + parent.name + "." + containerName + " = " + containerName + ";\n";

        fs.writeln(str);
    }
};

PVQ.InputH.prototype = new PVQ.BaseH();

/**
 * AnimationH 
 * PSD2V Animation 处理方法
 * @constructor
 */
PVQ.AnimationH = function() {
    /**
     * 修饰 Animation 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} aniLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, aniLayer) {
		var animations = aniLayer.layers;

		var tmpStr = "";
		var actions = "[";
		for (var i = 0, len = animations.length; i < len; ++i) {
			if (tmpStr != "") {
				actions += ",";
			}
			tmpStr = "\n\t\t\t\tG.Action.create({slice: G.getSlice('" + animations[i].name + "')})";
			actions += tmpStr;
		}
		actions += "\n\t\t\t]"
		
		var name = PV.Base.getComponentName(aniLayer.name);
        var x = Math.round(aniLayer.bounds[0]);
        var y = Math.round(aniLayer.bounds[1]);
        var parent = this.getParent(aniLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(aniLayer.bounds[2]) - x;
        var height = Math.round(aniLayer.bounds[3]) - y;
        var visible = aniLayer.visible? true : false;

        var str = "\t\tvar " + name + " = G.Animation.create({\n\t\t\tactions: " + actions + "\n\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" +
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.AnimationH.prototype = new PVQ.BaseH();

/**
 * ContainerH 
 * PSD2V Container 处理方法
 * @constructor
 */
PVQ.ContainerH = function() {
	/**
     * 修饰 Container 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} containerLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, containerLayer) {
        var name = PV.Base.getComponentName(containerLayer.name);
        var x = Math.round(containerLayer.bounds[0]);
        var y = Math.round(containerLayer.bounds[1]);
        var parent = this.getParent(containerLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(containerLayer.bounds[2]) - x;
        var height = Math.round(containerLayer.bounds[3]) - y;
        var visible = aniLayer.visible? true : false;

        var str = "\t\tvar " + name + " = G.Container.create();\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);

       	PV.Base.walk(containerLayer.layers, function(layer, type) {
            PVQ.dispatcher.processElements(fs, layer, type);
        });
    }
};

PVQ.ContainerH.prototype = new PVQ.BaseH();

/**
 * DragPanelH 
 * PSD2V DragPanel 处理方法
 * @constructor
 */
PVQ.DragPanelH = function() {
    /**
     * 修饰 DragPanel 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} dragLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, dragLayer) {
        var parent, x, y, width, height, visible;
        var item;

        var self = this;
        PV.Base.walk(dragLayer.layers, function(layer, type) {
            if (layer.name == PV.Global.QUARKJS.DRAGPANEL_STATUS.AREA) {
                var area = dragLayer.layers[i];
                x = Math.round(area.bounds[0]);
                y = Math.round(area.bounds[1]);
                parent = self.getParent(area);
                x -= parent.pos[0];
                y -= parent.pos[1];
                width = Math.round(area.bounds[2]) - x;
                height = Math.round(area.bounds[3]) - y;
                visible = dragLayer.visible? true : false;
            } else if (PV.Base.getExName(layer.name) == PV.Global.QUARKJS.ELEMENT.ITEM) {
                item = PV.Base.getComponentName(layer.name);
                var str = "\t\tvar " + item + " = G.Container.create();\n";
                fs.writeln(str);
                PV.Base.walk(layer.layers, function(layer, type) {
                    PVQ.dispatcher.processElements(fs, layer, type);
                });
            }
        });
        
		var name = PV.Base.getComponentName(dragLayer.name);
        var containerName = name + "Container";
        
        var str = "\t\tvar " + containerName + " = G.Container.create();\n" + 
                  "\t\tvar " + name + " = G.DragPanel.create();\n" +
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setHeight(" + height + ");\n" +
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + name + ".setContent(" + containerName + ");\n" +
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" +
                  "\t\t" + containerName + ".addChild(" + item + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n" + 
                  "\t\t" + parent.name + "." + containerName + " = " + containerName + ";\n" + 
                  "\t\t" + parent.name + "." + item + " = " + item + ";\n";

        fs.writeln(str);
    }
};

PVQ.DragPanelH.prototype = new PVQ.BaseH();

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
    var toggleButtonH = null;
    var switchH = null;
    var inputH = null;
    var animationH = null;
    var dragPanelH = null;
           
    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派文件对象处理事件
         * @method processDoc
         */
        processDoc: function() {
            // 切片文件处理
            if (PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.SLICE) {
                var sliceFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.SLICE);
                var files = File.decode(sliceFolder.getFiles()).split(",");
                for (var i = 0, len = files.length; i < len; ++i) {
                    var doc = open(File(files[i]));
                    PVQ.processSliceFile(doc);
                    doc.close();
                }
            }
            
            // 对位文件处理
            if (PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS) {
                var posFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS);
                var files = File.decode(posFolder.getFiles()).split(",");
                for (var i = 0, len = files.length; i < len; ++i) {
                    var doc = open(File(files[i]));

                    PV.Base.walk(doc.layers, function(layer, type) {
                        if (type == PV.Global.QUARKJS.VIEW) {
                            PVQ.processPosFile(layer);
                        }
                    });

                    doc.close();
                }
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
                case PV.Global.QUARKJS.ELEMENT.TOGGLE_BUTTON: {
                    if (!toggleButtonH) {
                        toggleButtonH = new PVQ.ToggleButtonH();
                    }
                    toggleButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.SWITCH: {
                    if (!switchH) {
                        switchH = new PVQ.SwitchH();
                    }
                    switchH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.INPUT: {
                    if (!inputH) {
                        inputH = new PVQ.InputH();
                    }
                    inputH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.ANIMATION: {
                    if (!animationH) {
                        animationH = new PVQ.AnimationH();
                    }
                    animationH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.DRAGPANEL: {
                    if (!dragPanelH) {
                        dragPanelH = new PVQ.DragPanelH();
                    }
                    dragPanelH.describe(fs, layer);
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
	app.preferences.rulerUnits = Units.PIXELS;

    // 转换字体单位为像素
    app.preferences.typeUnits = TypeUnits.PIXELS;
	
	// 禁止弹出框
	displayDialogs =DialogModes.NO;

    // 遍历需要导出的库
    for (var key in PV.Config.LIB_MODE) {
        if (app) {
            PV.dispatcher.expoortLibMode(key, app);
        }
    }
})(app);

