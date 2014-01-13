/**
 * Psdium-Views quarkJs 对位文件处理方法
 * @params {Objcet} doc 当前文本对象
 * @method processPosFile
 */
PVQ.processPosFile = function(doc) {
    var docName = doc.name;
    var strStart = docName.indexOf("_") + 1;
    var strLen = docName.indexOf(".") - strStart;
    var vName = docName.substr(strStart, strLen) + "V";

    var fs = new File(PV.Config.EXPORT_PATH.VIEWS + vName + ".js");
    fs.encoding = "utf-8";

    fs.open("w:");

    fs.writeln(
        "var " + vName + " = G.Container.getClass().extend({\n" +
        "\tinit:function(){\n\n" + 
        "\t\tthis._super(arguments);\n"
    );

    PV.Base.walk(doc.layers, function(layer, type) {
        PVQ.dispatcher.processElements(fs, layer, type);
    });
    
    fs.writeln("\t}");
    fs.writeln("});");

    fs.close();
};