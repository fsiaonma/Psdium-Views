/**
 * Psdium-Views quarkJs 对位文件处理方法
 * @params {Objcet} layer 当前原件对象
 * @method processItemFile
 */
PVQ.processItemFile = (function() {
    return function(layer) {
        var start = layer.name.indexOf("_") + 1;
        var vName = layer.name.substr(start) + "V";
        vName = vName.replace(vName[0], vName[0].toUpperCase())

        var fs = new File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.ITEMS + vName + ".js");
        fs.encoding = "utf-8";

        fs.open("w:");

        fs.writeln(
            "var " + vName + " = G.Container.getClass().extend({\n" +
            "\tinit:function(){\n\n" + 
            "\t\tthis._super(arguments);\n"
        );

        PV.Base.walk(layer.layers, function(layer, type) {
            PVQ.dispatcher.processElements(fs, layer, type);
        });
        
        fs.writeln("\t}");
        fs.writeln("});");

        fs.close();
    }
})();