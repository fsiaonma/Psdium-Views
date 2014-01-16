/**
 * TextH 
 * PSD2V Text 处理方法
 * @constructor
 */
PVQ.TextH = function() {
    /**
     * 修饰 Text 类
     * @params {Objcet} fs 要写入的文件
     * @params {Object} textItemLayer 当前需要处理的图层
     * @method describe
     */
    this.describe = function(fs, textItemLayer) {
        var name = PV.Base.getComponentName(textItemLayer.name);

        var textLayer = textItemLayer.layers[0];
        var x = Math.round(textLayer.bounds[0]);
        var y = Math.round(textLayer.bounds[1]);
        var parent = this.getParent(textItemLayer);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(textLayer.bounds[2]) - x;
        var height = Math.round(textLayer.bounds[3]) - y;
        var fontSize = Math.round(textLayer.textItem.size);
        var lineHeight = Math.round(textLayer.textItem.leading);
        var align =  textLayer.textItem.justification.toString().split(".")[1].toLowerCase();
        var visible = textLayer.visible? true : false;

        var color = textLayer.textItem.color.rgb.hexValue;
        var content = textLayer.textItem.contents.replace(/\r/gi, "");

        var str = "\t\tvar " + name + " = G.Text.create();\n" + 
                  "\t\t" + name + ".setPos([" + x + ", " + y + ", " + width + ", " + height + "]);\n" + 
                  "\t\t" + name + ".setFontSize(" + fontSize + ");\n" + 
                  "\t\t" + name + ".setWidth(" + width + ");\n" +
                  "\t\t" + name + ".setLineHeight(" + lineHeight + ");\n" +
                  "\t\t" + name + ".setColor('#" + color + "');\n" + 
                  "\t\t" + name + ".setTextAlign('" + align + "');\n" + 
                  "\t\t" + name + ".setText('" + content + "');\n" + 
                  "\t\t" + name + ".setVisible(" + visible + ");\n" +
                  "\t\t" + parent.name + ".addChild(" + name + ");\n";

        fs.writeln(str);
    }
};

PVQ.TextH.prototype = new PVQ.BaseH();