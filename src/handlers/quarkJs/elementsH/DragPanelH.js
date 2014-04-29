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
                var str = "\t\tvar " + item + " = new " + item.replace(item[0], item[0].toUpperCase()) + "();\n";
                fs.writeln(str);
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