/**
 * Psdium-Views quarkJs 切片文件处理方法
 * @params {Objcet} doc 当前文本对象
 * @method processSliceFile
 */
PVQ.processSliceFile = (function() {
    /**
     * 生成切片文件
     * @params {Objcet} doc 当前文本对象
     * @method doWidthSlice
     */
    var doWidthSliceFile = function(doc) {
        var fs = File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");

        if (fs.exists) {
            fs.open("e:");
            fs.seek(0, 2);
        } else {
            fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js");
            fs.open("e:");
            fs.writeln("Slice = window.Slice || {};");
        }

        fs.encoding = "utf-8";
        
        fs.writeln("");

        var str = "";

        var name = doc.name.substr(0, doc.name.indexOf("."));
        fs.writeln("Slice['" + name + ".png'] = {");
        for (var i = 0, len = doc.layers.length; i < len; ++i) {
            var layer = doc.layers[i];
            if (str != "") {
                fs.write(",\n");
            }

            var name = layer.name;
            var x = Math.round(layer.bounds[0]);
            var y = Math.round(layer.bounds[1]);
            var width = Math.round(layer.bounds[2]) - x;
            var height = Math.round(layer.bounds[3]) - y;

            str = "\t'" + name + "':[" + x + ", " + y + ", " + width + ", " + height + "]";
            fs.write(str);
        }
        fs.writeln("\n};");

        fs.close();
    };

    /**
     * 生成 PNG 图片
     * @params {Objcet} doc 当前文本对象
     * @method generatePNG
     */
    var generatePNG = function(doc) {
        var pngOptions = new PNGSaveOptions();
        var name = doc.name.substr(0, doc.name.indexOf("."));
        doc.saveAs(new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.IMAGE + name + ".png"), pngOptions);
    }

    return function(doc) {
        doWidthSliceFile(doc);
        generatePNG(doc);
    }
})();