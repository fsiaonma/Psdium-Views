/**
 * InputH 
 * PSD2V Input 处理方法
 * @constructor
 */
PVQ.InputH = function() {
    /**
     * 修饰 Input 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var parent, x, y, width, height, fontSize, lineHeight;
        var name = layer.name;
        var containerName = name + "Container";

        for (var i = 0, len = layer.layers.length; i < len; ++i) {
            if (layer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.AREA) {
                var area = layer.layers[i];
                x = Math.round(area.bounds[0]);
                y = Math.round(area.bounds[1]);
                parent = this.getParent(area);
                x -= parent.pos[0];
                y -= parent.pos[1];
                width = Math.round(area.bounds[2]) - x;
                height = Math.round(area.bounds[3]) - y;
            } else if (layer.layers[i].name == PV.Global.QUARKJS.Input_STATUS.TEXT) {
                var textItem = layer.layers[i].textItem;
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
                  "\t\t" + containerName + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.InputH.prototype = new PVQ.BaseH();