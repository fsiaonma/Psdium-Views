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
		
		var name = aniLayer.name;
        var x = Math.round(aniLayer.bounds[0]);
        var y = Math.round(aniLayer.bounds[1]);
        var width = Math.round(aniLayer.bounds[2]) - x;
        var height = Math.round(aniLayer.bounds[3]) - y;

        var parent = this.getParent(aniLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];

        var str = "\t\tvar " + name + " = G.Animation.create({\n\t\t\tactions: " + actions + "\n\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.AnimationH.prototype = new PVQ.BaseH();