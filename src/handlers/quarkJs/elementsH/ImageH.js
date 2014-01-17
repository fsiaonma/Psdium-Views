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
        // var parent = self.getParent(imageLayer);
        (function(layer) {
            var callFunc = arguments.callee;
            PV.Base.walk(layer.layers, function(layer, type) {
                var imageLayer = layer;
                if (imageLayer.typename == PV.Global.ART_LAYER) {
                    var parent = self.getParent(imageLayer);
                    var config = self.getConfig(imageLayer, parent);
                    var str = "\t\tvar " + config.name + " = G.Image.create({slice: G.getSlice('" + config.name + "')});\n" + 
                              "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                              "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" + 
                              "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                              "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

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