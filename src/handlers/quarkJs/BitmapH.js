/**
 * Bitmap 
 * PSD2V Bitmap 处理方法
 * @constructor
 */
PVQ.BitmapH = function() {
    /**
     * 修饰 Bitmap 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        if (layer.typename == PV.Global.ART_LAYER) {
            var name = layer.name;
            var x = Math.round(layer.bounds[0] * PV.Global.PX_BUFFER);
            var y = Math.round(layer.bounds[1] * PV.Global.PX_BUFFER);
            var width = Math.round(layer.bounds[2] * PV.Global.PX_BUFFER);
            var height = Math.round(layer.bounds[3] * PV.Global.PX_BUFFER);

            var str = "\t\tvar " + name + " = G.Bitmap.create({slice: G.getSlice('" + name + "')});\n" + 
                      "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                      "\t\tthis.addChild(" + name + ");\n";

            fs.writeln(str);
        }
    }
};