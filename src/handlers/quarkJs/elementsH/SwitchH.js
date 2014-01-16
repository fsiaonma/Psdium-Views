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
        var name = PV.Base.getComponentName(switchLayer.name);
        var x = Math.round(switchLayer.bounds[0]);
        var y = Math.round(switchLayer.bounds[1]);
        var parent = this.getParent(switchLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(switchLayer.bounds[2]) - x;
        var height = Math.round(switchLayer.bounds[3]) - y;
        var visible = switchLayer.visible? true : false;

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
       
        var str = "\t\tvar " + name + " = G.Switch.create({\n" +
                  "\t\t\twidth: " + width + ",\n" + 
                  strs.bg + strs.upBar + strs.downBar + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" +  
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.SwitchH.prototype = new PVQ.BaseH();