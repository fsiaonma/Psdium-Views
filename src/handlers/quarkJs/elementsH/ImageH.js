/**
 * Bitmap 
 * PSD2V Bitmap 处理方法
 * @constructor
 */
PVQ.ImageH = function() {
    /**
     * 修饰 Bitmap 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var imageLayer = layer.layers[0];

        var name = imageLayer.name;
        var x = Math.round(imageLayer.bounds[0]);
        var y = Math.round(imageLayer.bounds[1]);
        var width = Math.round(imageLayer.bounds[2]) - x;
        var height = Math.round(imageLayer.bounds[3]) - y;

        var str = "\t\tvar " + name + " = G.Bitmap.create({slice: G.getSlice('" + name + "')});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\tthis.addChild(" + name + ");\n";

        fs.writeln(str);
    }
};