/**
 * Psdium-Views quarkJs 处理程序主入口
 * @params {Objcet} application psd 应用程序
 * @method 
 */
PVQ.Main = function(app) {
	// 处理函数主入口
	if (app.documents) {
        for (var i = 0, len = app.documents.length; i < len; ++i) {
            var currentDoc = app.documents[i];
            var vName = currentDoc.name.substr(0, currentDoc.name.indexOf(".")) + "V";

            var folder = new Folder(PV.Config.EXPORT_PATH + "QuarkJs/");
            var res = folder.create();
            if (res) {
                var fs = new File(PV.Config.EXPORT_PATH + "QuarkJs/" + vName + ".js");
                fs.open("w:");
                fs.writeln(
                    "var " + vName + " = G.Container.getClass().extend({\n" +
                    "\tinit:function(){\n\n" + 
                    "\t\tthis._super(arguments);\n"
                );

                PV.Base.walk(currentDoc.layers, function(layer, type) {
                    PVQ.dispatcher.processElements(fs, layer, type);
                });

                fs.writeln("\t}");
                fs.writeln("});");
                fs.close();
            }
        }
    }
};