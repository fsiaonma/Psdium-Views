/**
 * Button 
 * PSD2V Button 处理方法
 * @constructor
 */
PVQ.ButtonH = function() {
    /**
     * 修饰 Button 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} layer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, layer) {
        var name = layer.name;
        var x = Math.round(layer.bounds[0] * PV.Global.PX_BUFFER);
        var y = Math.round(layer.bounds[1] * PV.Global.PX_BUFFER);
        var width = Math.round(layer.bounds[2] * PV.Global.PX_BUFFER);
        var height = Math.round(layer.bounds[3] * PV.Global.PX_BUFFER);

        var normal, down, disable;

        (function(layer) {
            if (layer.typename == PV.Global.LAYER_SET) {
                for (var i = 0, len = layer.layers.length; i < len; ++i) {
                    arguments.callee(layer.layers[i]);
                }
            } else if (layer.typename == PV.Global.ART_LAYER) {
                var exName = layer.name.substr(0, layer.name.indexOf("_"));
                switch (exName) {
                    case PV.Global.QUARK.BUTTON_STATUS.NORMAL: {
                        normal = layer.name;
                        break ;
                    }
                    case PV.Global.QUARK.BUTTON_STATUS.DOWN: {
                        down = layer.name;
                        break ;
                    }
                    case PV.Global.QUARK.BUTTON_STATUS.DISABLE: {
                        disable = layer.name;
                        break ;
                    } 
                }
            }
        })(layer);

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: ""
        }

        if (normal) {
            strs.imgUp = "\t\t\timgUp: G.getSlice('" + normal + "')";
            current = "imgUp";
        }

        if (down) {
            strs[current] += ",\n";
            strs.imgDown = "\t\t\timgDown: G.getSlice('" + down + "')";
            current = "imgDown";
        }

        if (disable) {
            strs[current] += ",\n"
            strs.imgDisable = disable? "\t\t\t,imgDisable: G.getSlice('" + disable + "')\n" : '';
            current = "imgDisable";
        }
       
        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\tthis.addChild(" + name + ");\n";

        fs.writeln(str);
    }
};