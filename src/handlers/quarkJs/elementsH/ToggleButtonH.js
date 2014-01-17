/**
 * ToggleButtonH 
 * PSD2V ToggleButton 处理方法
 * @constructor
 */
PVQ.ToggleButtonH = function() {
    /**
     * 修饰 ToggleButton 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} toggleButtonLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, toggleButtonLayer) {
        var name = PV.Base.getComponentName(toggleButtonLayer.name);
        var x = Math.round(toggleButtonLayer.bounds[0]);
        var y = Math.round(toggleButtonLayer.bounds[1]);
        var parent = this.getParent(toggleButtonLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(toggleButtonLayer.bounds[2]) - x;
        var height = Math.round(toggleButtonLayer.bounds[3]) - y;
        var visible = toggleButtonLayer.visible? true : false;

        var up, down, disable, checkup, checkdown, checkdisable;

        for (var i = 0, len = toggleButtonLayer.layers.length; i < len; ++i) {
            var status = toggleButtonLayer.layers[i];
            var type = status.name;
            switch (type) {
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.UP: {
                    if (status.layers && status.layers.length > 0) {
                        up = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        down = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        disable = status.layers[0].name;
                    }
                    break ;
                } 
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_UP: {
                    if (status.layers && status.layers.length > 0) {
                        checkup = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_DOWN: {
                    if (status.layers && status.layers.length > 0) {
                        checkdown = status.layers[0].name;
                    }
                    break ;
                }
                case PV.Global.QUARKJS.TOGGLE_BUTTON_STATUS.CHECK_DISABLE: {
                    if (status.layers && status.layers.length > 0) {
                        checkdisable = status.layers[0].name;
                    }
                    break ;
                }
            }
        }

        var current = "";

        var strs = {
            imgUp: "",
            imgDown: "",
            imgDisable: "",
            checkedImgUp: "",
            checkedImgDown: "",
            checkedImgDisable: ""
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
            strs.imgDisable = disable? "\t\t\timgDisable: G.getSlice('" + disable + "')\n" : '';
            current = "imgDisable";
        }

        if (checkup) {
            strs[current] += ",\n";
            strs.checkedImgUp = "\t\t\tcheckedImgUp: G.getSlice('" + checkup + "')";
            current = "checkedImgUp";
        }

        if (checkdown) {
            strs[current] += ",\n";
            strs.checkedImgDown = "\t\t\tcheckedImgDown: G.getSlice('" + checkdown + "')";
            current = "checkedImgDown";
        }

        if (checkdisable) {
            strs[current] += ",\n"
            strs.checkedImgDisable = checkdisable? "\t\t\tcheckedImgDisable: G.getSlice('" + checkdisable + "')" : '';
            current = "checkedImgDisable";
        }
       
        var str = "\t\tvar " + name + " = G.ToggleButton.create({\n" + 
                  strs.imgUp + strs.imgDown + strs.imgDisable + strs.checkedImgUp + strs.checkedImgDown + strs.checkedImgDisable + "\n" + 
                  "\t\t});\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.ToggleButtonH.prototype = new PVQ.BaseH();