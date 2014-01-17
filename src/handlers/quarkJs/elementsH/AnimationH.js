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