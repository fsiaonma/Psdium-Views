/**
 * TextH 
 * PSD2V Text 处理方法
 * @constructor
 */
PVQ.TextH = function() {
    /**
     * 修饰 Text 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} textLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, textLayer) {
        var name = PV.Base.getComponentName(textLayer.name);

        var area = textLayer.layers[0];

        var parent = this.getParent(textLayer);
        var config = this.getConfig(area, parent);

        var textItem = area.textItem;
        var fontSize = Math.round(textItem.size);
        var lineHeight = Math.round(textItem.leading);
        var align =  textItem.justification.toString().split(".")[1].toLowerCase();
        var color = textItem.color.rgb.hexValue;
        var content = textItem.contents.replace(/\r/gi, "");

        var str = "\t\tvar " + name + " = G.Text.create();\n" + 
                  "\t\t" + name + ".setPos([" + config.pos + "]);\n" + 
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" + 
                  "\t\t" + name + ".setWidth(" + config.pos[2] + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setColor('#" + color + "');\n" + 
                  "\t\t" + name + ".setTextAlign('" + align + "');\n" + 
                  "\t\t" + name + ".setText('" + content + "');\n" + 
                  "\t\t" + name + ".setVisible(" + config.visible + ");\n" +
                  "\t\t" + parent.name + ".addChild(" + name + ");\n" + 
                  "\t\t" + parent.name + "." + name + " = " + name + ";\n";

        fs.writeln(str);
    }
};

PVQ.TextH.prototype = new PVQ.BaseH();