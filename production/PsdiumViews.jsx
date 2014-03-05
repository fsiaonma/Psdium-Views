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

﻿/**
 * Psdium-Views quarkJs 切片文件处理方法
 * @params {Objcet} doc 当前文本对象
 */
PVQ.G = {
    d : null,
    log: function(str) {
        //$.write (str);
    },
     
    //忽略列表
    ignoreList : [/^text_/, /area/, /^input_/],
    
    //实际画布大小
    totalW : 0,
    totalH : 0,
    //新建画布大小, 预留大些
    orgW : 2000,
    orgH : 2000,
    
    //设置填充间隙
    gap : 5,
    
    //日志缩进
    tab : "",
    
    //输出配置字符串
    output : "Slice = window.Slice || {};\n",
    count : 0,
    maxW : 1024,
    maxH : 1024,
    x : 0,
    y : 0,
    nextY : 0,
    //检查名字是否重复
    sliceNames : [],
    //当前新文档
    newDoc : null,
    
    //新建
    newDocument : function(d){
        var name = "slice" + PVQ.G.count;
        PVQ.G.count++;
        var doc = app.documents.add(PVQ.G.orgW, PVQ.G.orgH, PVQ.G.d.resolution, name, 
                            PVQ.G.d.mode.ColorModel, DocumentFill.TRANSPARENT, 1);
        PVQ.G.log(PVQ.G.tab + "新建文件: " + name);
        PVQ.G.output += 'Slice["' + name + '.png"] = {' + '\n';
        return doc;
    },
    //保存
    savePNG : function(doc){
        var name = doc.name;
        app.activeDocument = doc;
        doc.resizeCanvas (PVQ.G.totalW, PVQ.G.totalH, AnchorPosition.TOPLEFT);
        var newFile = File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.IMAGE + name);
        var opt = new PNGSaveOptions();
        opt.compression = 0;
        doc.saveAs (newFile, opt);
        PVQ.G.log(PVQ.G.tab + "保存文件: " + name);
        doc.close (SaveOptions.DONOTSAVECHANGES);
        PVQ.G.output = PVQ.G.output.substring(0, PVQ.G.output.length - 2);
        PVQ.G.output += '\n};\n';
    },
    //检查名字是否重复
    isRepeat : function(name){
        for(var i=0; i<PVQ.G.sliceNames.length; i++){
            var s = PVQ.G.sliceNames[i];
            if(s == name){
                PVQ.G.log(PVQ.G.tab + "[WARN] 切片名字重复: " + name);
                return true;
            }
        }
        return false;
    },
    //检查名字是否在忽略列表
    isIgnored : function(name){
        var nname = name.toLowerCase();
        for(var i=0; i<PVQ.G.ignoreList.length; i++){
            var regexp = PVQ.G.ignoreList[i];
            if(nname.match (regexp) != null){
                PVQ.G.log(PVQ.G.tab + "[WARN] 忽略该切片名字: " + name);
                return true;
            }
        }
        return false;
    },
    
    searching : function(ls){
        for(var i=0; i<ls.length; i++){
            var l = ls[i];
            app.activeDocument = PVQ.G.d;
            PVQ.G.d.activeLayer = l;
            //判断图层名称, 该位置不要放错
            if(!PVQ.G.isIgnored(l.name)){
                if(l.typename == "LayerSet"){
                    PVQ.G.log(PVQ.G.tab + "进入文件夹: " + l.name);
                    PVQ.G.tab += "  ";
                    PVQ.G.searching(l.layers);
                    PVQ.G.tab = PVQ.G.tab.substring(0, PVQ.G.tab.length - 2);
                    PVQ.G.log(PVQ.G.tab + "退出文件夹: " + l.name);
                    continue;
                }else if(!PVQ.G.isRepeat (l.name) && l.typename == "ArtLayer" && l.kind != LayerKind.SOLIDFILL){
                    //获取宽高
                    var bounds = l.bounds;
                    var w = bounds[2] - bounds[0];
                    var h = bounds[3] - bounds[1];
                    
                    //越界处理
                    var ww = PVQ.G.x + w;
                    if(ww >PVQ.G.maxW){
                        //换行
                        PVQ.G.y = PVQ.G.nextY;
                        PVQ.G.x = 0;
                        ww = w;
                        PVQ.G.log(PVQ.G.tab + "换行, 下一个Y坐标是: " + PVQ.G.y);
                    }
                    var hh = PVQ.G.y + h;
                    if(hh > PVQ.G.maxH){
                        //另起文件
                        PVQ.G.savePNG(PVQ.G.newDoc);
                        PVQ.G.newDoc = PVQ.G.newDocument(PVQ.G.d);
                        PVQ.G.x = PVQ.G.y = PVQ.G.nextY = PVQ.G.totalW = PVQ.G.totalH = 0;
                        ww = PVQ.G.x + w;
                        hh = PVQ.G.y + h;
                        PVQ.G.log(PVQ.G.tab + "另起文件: " + PVQ.G.newDoc.name);
                    }
                    
                    //粘贴到新文档
                    app.activeDocument = PVQ.G.d;
                    PVQ.G.d.activeLayer = l;
                    PVQ.G.log(PVQ.G.tab + "发现切片: " + l.name + ", " + l.kind);
                    l.copy();
                    app.activeDocument = PVQ.G.newDoc;
                    var newL = PVQ.G.newDoc.paste ();
                    PVQ.G.newDoc.activeLayer = newL;
                    var newBounds = newL.bounds;
                    PVQ.G.log(PVQ.G.tab + "Bounds: " + newBounds[0] + ", " + newBounds[1] + ", " + newBounds[2] + ", " + newBounds[3] 
                                        + ", 宽高: " + w + ", " + h);
                    //设置位置
                    newL.translate(-newBounds[0] + PVQ.G.x, -newBounds[1] + PVQ.G.y, OffsetUndefinedAreas.SETTOBACKGROUND);
                    PVQ.G.log(PVQ.G.tab + "输出新切片: " + newL.name);
                    //添加到配置字符串
                    PVQ.G.output += '\t"' + l.name + '" : [' + Number (PVQ.G.x) + ',' + Number (PVQ.G.y) + ',' + Number(w) + ',' + Number(h) + '],' + '\n';
                
                    //计算实际画布大小
                    PVQ.G.totalW = ww > PVQ.G.totalW ? ww : PVQ.G.totalW;
                    PVQ.G.totalH = hh > PVQ.G.totalH ? hh : PVQ.G.totalH;
                    PVQ.G.log('PVQ.G.totalW = ' + PVQ.G.totalW + ', PVQ.G.totalH = ' + PVQ.G.totalH);
                    //计算下一次切图摆放位置
                    PVQ.G.x += w + PVQ.G.gap;
                    PVQ.G.nextY = PVQ.G.totalH + PVQ.G.gap;
                    //记住该名字
                    PVQ.G.sliceNames.push(l.name);
                }else{
                    PVQ.G.log(PVQ.G.tab + "[WARN] 切片格式不支持: " + l.name + ", LayerKind: " + l.kind);
                }
            }
        }
    }//end searching
};





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
    },

    /**
     * 获取当前图层常用配置
     * @params {Object} layer 当前需要处理的图层
     * @params {Object} parent 当前需要处理的图层的父图层
     * @method getConfig
     */
    this.getConfig = function(layer, parent) {
        var name = PV.Base.getComponentName(layer.name);
        var x = Math.round(layer.bounds[0]);
        var y = Math.round(layer.bounds[1]);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(layer.bounds[2]) - x;
        var height = Math.round(layer.bounds[3]) - y;
        var visible = layer.visible? true : false;

        return {
            name: name,
            pos: [x, y, width, height],
            visible: visible
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
        // var parent = self.getParent(imageLayer);
        (function(layer) {
            var callFunc = arguments.callee;
            PV.Base.walk(layer.layers, function(layer, type) {
                var imageLayer = layer;
                if (imageLayer.typename == PV.Global.ART_LAYER) {
                    var parent = self.getParent(imageLayer);
                    var config = self.getConfig(imageLayer, parent);
                    var str = "\t\tvar " + config.name + " = G.Image.create({slice: G.getSlice('" + config.name + "')});\n" + 
                              "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                              "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" + 
                              "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                              "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
        var parent = this.getParent(buttonLayer);
        var config = this.getConfig(buttonLayer, parent);

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
       
        var str = "\t\tvar " + config.name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" + 
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
     * @params {Object} textLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, textLayer) {
        var name = PV.Base.getComponentName(textLayer.name);

        var area = textLayer.layers[0];

        var parent = this.getParent(textLayer);
        var config = this.getConfig(area, parent);

        var textItem = area.textItem;
        var fontSize = Math.round(textItem.size);
        var lineHeight = Math.round(textItem.leading);
        var align =  textItem.justification.toString().split(".")[1].toLowerCase();
        var color = textItem.color.rgb.hexValue;
        var content = textItem.contents.replace(/\r/gi, "");

        var str = "\t\tvar " + name + " = G.Text.create();\n" + 
                  "\t\t" + name + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" + 
                  "\t\t" + name + ".setWidth(" + config.pos[2] + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setColor('#" + color + "');\n" + 
                  "\t\t" + name + ".setTextAlign('" + align + "');\n" + 
                  "\t\t" + name + ".setText('" + content + "');\n" + 
                  "\t\t" + name + ".setVisible(" + config.visible + ");\n" +
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
        var parent = this.getParent(toggleButtonLayer);
        var config = this.getConfig(toggleButtonLayer, parent);

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
       
        var str = "\t\tvar " + config.name + " = G.ToggleButton.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + strs.checkedImgUp + strs.checkedImgDown + strs.checkedImgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
        var parent = this.getParent(switchLayer);
        var config = this.getConfig(switchLayer, parent);

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
       
        var str = "\t\tvar " + config.name + " = G.Switch.create({\n" +
                  "\t\t\twidth: " + config.pos[2] + ",\n" + 
                  strs.bg + strs.upBar + strs.downBar + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
        var config, parent, fontSize, lineHeight;

        for (var i = 0, len = inputLayer.layers.length; i < len; ++i) {
            if (inputLayer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.AREA) {
                var area = inputLayer.layers[i];
                parent = this.getParent(area);
                config = this.getConfig(area, parent);
            } else if (inputLayer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.TEXT) {
                var textItem = inputLayer.layers[i].textItem;
                fontSize = Math.round(textItem.size);
                lineHeight = Math.round(textItem.leading);
            }
        }

        var name = PV.Base.getComponentName(inputLayer.name);
        var containerName = name + "Container";

        var str = "\t\tvar " + containerName + " = G.Container.create();\n" +
                  "\t\t" + containerName + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + containerName + ");\n" + 
                  "\t\tvar " + name + " = G.Input.create();\n" + 
                  "\t\t" + name + ".setWidth(" + config.pos[2] + ");\n" +
                  "\t\t" + name + ".setHeight(" + config.pos[3] + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" +
                  "\t\t" + name + ".setVisible(" + config.visible + ");\n" +
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
        var parent = this.getParent(aniLayer);
        var config = this.getConfig(aniLayer, parent);

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
		
        var str = "\t\tvar " + config.name + " = G.Animation.create({\n\t\t\tactions: " + actions + "\n\t\t});\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" + 
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" +
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
        var parent = this.getParent(containerLayer);
        var config = this.getConfig(containerLayer, parent);

        var str = "\t\tvar " + config.name + " = G.Container.create();\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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
        var config, parent;
        var item;

        var self = this;
        PV.Base.walk(dragLayer.layers, function(layer, type) {
            if (layer.name == PV.Global.QUARKJS.DRAGPANEL_STATUS.AREA) {
                var area = dragLayer.layers[i];
                parent = self.getParent(area);
                config = self.getConfig(area, parent);
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
                  "\t\t" + name + ".setWidth(" + config.pos[2] + ");\n" +
                  "\t\t" + name + ".setHeight(" + config.pos[3] + ");\n" +
                  "\t\t" + name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + name + ".setPos([" + config.pos + "]);\n" + 
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

﻿/**
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
            if (PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS) {
                var posFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS);
                var files = File.decode(posFolder.getFiles()).split(",");
                
                for (var i = 0, len = files.length; i < len; ++i) {
                    var doc = open(File(files[i]));

                    PV.Base.walk(doc.layers, function(layer, type) {
                        if (type == PV.Global.QUARKJS.VIEW) {
                            // 生成视图文件
                            PVQ.processPosFile(layer);
                        }
                    });
                
                    // 生成切片文件
                    PVQ.G.d = doc;
                    if(i == 0){
                        PVQ.G.newDoc = PVQ.G.newDocument(PVQ.G.d);
                    }
                    PVQ.G.searching(PVQ.G.d.layers);

                    doc.close(SaveOptions.DONOTSAVECHANGES);
                }
                
                //保存最后一个切图
                PVQ.G.savePNG(PVQ.G.newDoc);
            
                //输出配置
                var fileName = PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js";
                var fs = File(fileName);
                fs.open("w");
                fs.encoding = "utf-8";
                fs.writeln(PVQ.G.output);
                fs.close();
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
            switch (type.toLowerCase()) {
                case PV.Global.QUARKJS.ELEMENT.BUTTON.toLowerCase(): {
                    if (!buttonH) {
                        buttonH = new PVQ.ButtonH();
                    }
                    buttonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.IMAGE.toLowerCase(): {
                    if (!imageH) {
                        imageH = new PVQ.ImageH();
                    }
                    imageH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TEXT.toLowerCase(): {
                    if (!textH) {
                        textH = new PVQ.TextH();
                    }
                    textH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.CONTAINER.toLowerCase(): {
                    if (!containerH) {
                        containerH = new PVQ.ContainerH();
                    }
                    containerH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TOGGLE_BUTTON.toLowerCase(): {
                    if (!toggleButtonH) {
                        toggleButtonH = new PVQ.ToggleButtonH();
                    }
                    toggleButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.SWITCH.toLowerCase(): {
                    if (!switchH) {
                        switchH = new PVQ.SwitchH();
                    }
                    switchH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.INPUT.toLowerCase(): {
                    if (!inputH) {
                        inputH = new PVQ.InputH();
                    }
                    inputH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.ANIMATION.toLowerCase(): {
                    if (!animationH) {
                        animationH = new PVQ.AnimationH();
                    }
                    animationH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.DRAGPANEL.toLowerCase(): {
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

