/**
 * PVQ.dipatcher QuarkJs 元素处理分派器
 * @constructor
 */
PVQ.dispatcher = (function() {
    // 实例化处理方法
    var BitmapH = null;
    var ButtonH = null;
    var TextH = null;

    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派元素处理事件
         * @params {Object} fs 需要读写的文件
         * @params {Object} layer 当前需要处理的图层
         * @params {String} type 分派类型
         * @method switchElement
         */
        processElements: function(fs, layer, type) {
            switch (type) {
                case PV.Global.QUARK.ELEMENT.BUTTON: {
                    if (!ButtonH) {
                        ButtonH = new PVQ.ButtonH();
                    }
                    ButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARK.ELEMENT.BITMAP: {
                    if (!BitmapH) {
                        BitmapH = new PVQ.BitmapH();
                    }
                    BitmapH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARK.ELEMENT.TEXT: {
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