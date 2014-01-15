/**
 * ButtonH 
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
        var x = Math.round(layer.bounds[0]);
        var y = Math.round(layer.bounds[1]);
        var width = Math.round(layer.bounds[2]) - x;
        var height = Math.round(layer.bounds[3]) - y;

        var up, down, disable;

        for (var i = 0, len = layer.layers.length; i < len; ++i) {
            var status = layer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.BUTTON_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.BUTTON_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.BUTTON_STATUS.DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        disable = status.layers[0].name;
                    }
                    break ;
                } 
            }
        }

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: ""
        }

        if (up) {
            strs.imgUp = "\t\t\timgUp: G.getSlice('" + up + "')";
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

        var parent = this.getParent(layer);
        x -= parent.pos[0];
        y -= parent.pos[1];
       
        var str = "\t\tvar " + name + " = G.Button.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.ButtonH.prototype = new PVQ.BaseH();