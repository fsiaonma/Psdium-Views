/**
 * PSD2V 程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
(function(app) {
    // 遍历 documents 对象
    if (app.documents) {
        for (var i = 0, len = app.documents.length; i < len; ++i) {
            var currentDoc = app.documents[i];
            var vName = currentDoc.name.substr(0, currentDoc.name.indexOf("."));

            var fs = new File("/d/Github/Tpsd2v/Tpsd2vV.js");
            fs.open("w:");
            fs.writeln(
                vName + "V" + " = G.Container.getClass().extend({\n" +
                "\tinit:function(){\n\n" + 
                "\t\tthis._super(arguments);\n"
            );

            Base.walk(currentDoc.layers, function(layer, type) {
                Base.dipatcher(fs, layer, type);
            });

            fs.writeln("\t}");
            fs.writeln("});");
            fs.close();
        }
    }
})(app);