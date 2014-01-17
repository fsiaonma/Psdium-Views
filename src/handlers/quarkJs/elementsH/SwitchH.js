/**
 * SwitchH 
 * PSD2V Switch 处理方法
 * @constructor
 */
PVQ.SwitchH = function() {
    /**
     * 修饰 Switch 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} switchLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, switchLayer) {
        var parent = this.getParent(switchLayer);
        var config = this.getConfig(switchLayer, parent);

        var bg, up, down;

        for (var i = 0, len = switchLayer.layers.length; i < len; ++i) {
            var status = switchLayer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.SWITCH_STATUS.BG: {
                    if (status.layers && status.layers.length > 0) {
                        bg = status.layers[0].name;
                    }
                    break ;
                } 
                case PV.Global.QUARKJS.SWITCH_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.SWITCH_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
            }
        }

        var current = "";

        var strs = {
            bg: "",
            upBar: "",
            downBar: ""
        }

        if (bg) {
            strs.bg = "\t\t\tbg: G.getSlice('" + bg + "')";
            current = "bg";
        }

        if (up) {
            strs[current] += ",\n"
            strs.upBar = "\t\t\tupBar: G.getSlice('" + up + "')";
            current = "upBar";
        }

        if (down) {
            strs[current] += ",\n";
            strs.downBar = "\t\t\tdownBar: G.getSlice('" + down + "')";
            current = "downBar";
        }
       
        var str = "\t\tvar " + config.name + " = G.Switch.create({\n" +
                  "\t\t\twidth: " + config.pos[2] + ",\n" + 
                  strs.bg + strs.upBar + strs.downBar + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + config.name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + config.name + ".setPos([" + config.pos + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + config.name + ");\n" + 
                  "\t\t" + parent.name + "." + config.name + " = " + config.name + ";\n";

        fs.writeln(str);
    }
};

PVQ.SwitchH.prototype = new PVQ.BaseH();