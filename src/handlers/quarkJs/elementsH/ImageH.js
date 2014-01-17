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
        var parent = self.getParent(imageLayer);
        (function(layer) {
            var callFunc = arguments.callee;
            PV.Base.walk(layer.layers, function(layer, type) {
                var imageLayer = layer;
                if (imageLayer.typename == PV.Global.ART_LAYER) {
                    var name = PV.Base.getComponentName(imageLayer.name);
                    var x = Math.round(imageLayer.bounds[0]);
                    var y = Math.round(imageLayer.bounds[1]);
                    x -= parent.pos[0];
                    y -= parent.pos[1];
                    var width = Math.round(imageLayer.bounds[2]) - x;
                    var height = Math.round(imageLayer.bounds[3]) - y;
                    var visible = layer.visible? true : false;

                    var str = "\t\tvar " + name + " = G.Image.create({slice: G.getSlice('" + name + "')});\n" + 
                              "\t\t" + name + ".setVisible(" + visible + ");\n" +
                              "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                              "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                              "\t\t" + parent.name + "." + name + " = " + name + ";\n";

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