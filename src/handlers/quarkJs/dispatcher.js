/**
 * PVQ.dipatcher QuarkJs 元素处理分派器
 * @constructor
 */
PVQ.dispatcher = (function() {
    // 实例化处理方法
    var ImageH = null;
    var ButtonH = null;
    var TextH = null;
           
    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派文件对象处理事件
         * @method processDoc
         */
        processDoc: function() {
            // 切片文件处理
            var sliceFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.SLICE);
            var files = File.decode(sliceFolder.getFiles()).split(",");
            for (var i = 0, len = files.length; i < len; ++i) {
                var doc = open(File(files[i]));
                PVQ.processSliceFile(doc);
                doc.close();
            }

            // 对文文件处理
            var posFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS);
            var files = File.decode(posFolder.getFiles()).split(",");
            for (var i = 0, len = files.length; i < len; ++i) {
                var doc = open(File(files[i]));
                PVQ.processPosFile(doc);
                doc.close();
            }
        },

        /**
         * 分派元素处理事件
         * @params {Object} fs 需要读写的文件
         * @params {Object} layer 当前需要处理的图层
         * @params {String} type 分派类型
         * @method switchElement
         */
        processElements: function(fs, layer, type) {
            switch (type) {
                case PV.Global.QUARKJS.ELEMENT.BUTTON: {
                    if (!ButtonH) {
                        ButtonH = new PVQ.ButtonH();
                    }
                    ButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.IMAGE: {
                    if (!ImageH) {
                        ImageH = new PVQ.ImageH();
                    }
                    ImageH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TEXT: {
                    if (!TextH) {
                        TextH = new PVQ.TextH();
                    }
                    TextH.describe(fs, layer);
                    break ;
                }
                default: {
                    console.log("找不到类型: " + type);
                }
            }
        }
    }
})();