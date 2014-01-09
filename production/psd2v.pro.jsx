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

/**
 * Config 
 * PSD2V 相关配置文件
 * @constructor
 */
var Config = Config || {
	// cm 到 px 转换值
	PX_BUFFER: 37.795276
};

/**
 * Global 用于定义全局变量
 * PSD2V Global 类
 * @constructor
 */
var Global = Global || {
	BITMAP: "Bitmap",
	BUTTON: "Button",
	TEXT: "Text",

	ART_LAYER: "ArtLayer",
	LAYER_SET: "LayerSet",

	BUTTON_STATUS: {
		NORMAL: "normal",
		DOWN: "down",
		DISABLE: "disable"
	}
};

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
 * Bitmap 
 * PSD2V Bitmap 处理方法
 * @constructor
 */
var BitmapH = BitmapH || {
	/**
     * 修饰 Bitmap 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
	describe: function(fs, layer) {
		if (layer.typename == Global.ART_LAYER) {
			var name = layer.name;
			var x = Math.round(layer.bounds[0] * Config.PX_BUFFER);
			var y = Math.round(layer.bounds[1] * Config.PX_BUFFER);
			var width = Math.round(layer.bounds[2] * Config.PX_BUFFER);
			var height = Math.round(layer.bounds[3] * Config.PX_BUFFER);

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
var ButtonH = ButtonH || {
	/**
     * 修饰 Button 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
	describe: function(fs, layer) {
		var name = layer.name;
		var x = Math.round(layer.bounds[0] * Config.PX_BUFFER);
		var y = Math.round(layer.bounds[1] * Config.PX_BUFFER);
		var width = Math.round(layer.bounds[2] * Config.PX_BUFFER);
		var height = Math.round(layer.bounds[3] * Config.PX_BUFFER);

		var normal, down, disable;

		(function(layer) {
			if (layer.typename == Global.LAYER_SET) {
				for (var i = 0, len = layer.layers.length; i < len; ++i) {
					arguments.callee(layer.layers[i]);
				}
			} else if (layer.typename == Global.ART_LAYER) {
				var exName = layer.name.substr(0, layer.name.indexOf("_"));
				switch (exName) {
					case Global.BUTTON_STATUS.NORMAL: {
						normal = layer.name;
						break ;
					}
					case Global.BUTTON_STATUS.DOWN: {
						down = layer.name;
						break ;
					}
					case Global.BUTTON_STATUS.DISABLE: {
						disable = layer.name;
						break ;
					} 
				}
			}
		})(layer);

		var imgUpStr = normal? "\t\t\timgUp: G.getSlice('" + normal + "')\n" : '';
		var imgDownStr = down? "\t\t\t,imgDown: G.getSlice('" + down + "')\n" : '';
		var imgDisableStr = disable? "\t\t\t,imgDisable: G.getSlice('" + disable + "')\n" : '';

		var str = "\t\tvar " + name + " = G.Button.create({\n" + 
				  imgUpStr + imgDownStr + imgDisableStr + 
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
var TextH = TextH || {
	/**
     * 修饰 Text 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
	describe: function(fs, layer) {
		console.log(layer.name);
	}
};

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


                                                                                                                                                                                                                              

