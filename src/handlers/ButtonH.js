/**
 * Button 
 * PSD2V Button 处理方法
 * @constructor
 */
var ButtonH = ButtonH || {
    /**
     * 修饰 Button 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    describe: function(fs, layer) {
        var name = layer.name;
        var x = Math.round(layer.bounds[0] * Config.PX_BUFFER);
        var y = Math.round(layer.bounds[1] * Config.PX_BUFFER);
        var width = Math.round(layer.bounds[2] * Config.PX_BUFFER);
        var height = Math.round(layer.bounds[3] * Config.PX_BUFFER);

        var normal, down, disable;

        (function(layer) {
            if (layer.typename == Global.LAYER_SET) {
                for (var i = 0, len = layer.layers.length; i < len; ++i) {
                    arguments.callee(layer.layers[i]);
                }
            } else if (layer.typename == Global.ART_LAYER) {
                var exName = layer.name.substr(0, layer.name.indexOf("_"));
                switch (exName) {
                    case Global.BUTTON_STATUS.NORMAL: {
                        normal = layer.name;
                        break ;
                    }
                    case Global.BUTTON_STATUS.DOWN: {
                        down = layer.name;
                        break ;
                    }
                    case Global.BUTTON_STATUS.DISABLE: {
                        disable = layer.name;
                        break ;
                    } 
                }
            }
        })(layer);

        var imgUpStr = normal? "\t\t\timgUp: G.getSlice('" + normal + "')\n" : '';
        var imgDownStr = down? "\t\t\t,imgDown: G.getSlice('" + down + "')\n" : '';
        var imgDisableStr = disable? "\t\t\t,imgDisable: G.getSlice('" + disable + "')\n" : '';

        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  imgUpStr + imgDownStr + imgDisableStr + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\tthis.addChild(" + name + ");\n";

        fs.writeln(str);
    }
};