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