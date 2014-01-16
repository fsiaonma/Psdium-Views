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
        var parent, x, y, width, height;

        for (var i = 0, len = dragLayer.layers.length; i < len; ++i) {
            if (dragLayer.layers[i].name == PV.Global.QUARKJS.DRAGPANEL_STATUS.AREA) {
                var area = dragLayer.layers[i];

                x = Math.round(area.bounds[0]);
                y = Math.round(area.bounds[1]);
                width = Math.round(area.bounds[2]) - x;
                height = Math.round(area.bounds[3]) - y;

                parent = this.getParent(area);
                x -= parent.pos[0];
                y -= parent.pos[1];
            }
        }

		var name = dragLayer.name;
        var containerName = name + "Container";

        var str = "\t\tvar " + containerName + " = G.Container.create();\n" + 
                  "\t\tvar " + name + " = G.DragPanel.create();\n" +
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setHeight(" + height + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + name + ".setContent(" + containerName + ");\n" +
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.DragPanelH.prototype = new PVQ.BaseH();