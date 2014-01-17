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