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