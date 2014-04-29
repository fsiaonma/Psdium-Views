/**
 * PVQ.dipatcher QuarkJs 元素处理分派器
 * @constructor
 */
PVQ.dispatcher = (function() {
    // 实例化处理方法
    var imageH = null;
    var buttonH = null;
    var textH = null;
    var containerH = null;
    var toggleButtonH = null;
    var switchH = null;
    var inputH = null;
    var animationH = null;
    var dragPanelH = null;
           
    // 返回 PVQ.dispatcher 对象
    return {
        /**
         * 分派文件对象处理事件
         * @method processDoc
         */
        processDoc: function() {
            if (PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS) {
                var posFolder = Folder(PV.Config.LIB_MODE.QUARKJS.SOURCE_PATH.POS);
                var files = File.decode(posFolder.getFiles()).split(",");
                
                for (var i = 0, len = files.length; i < len; ++i) {
                    var doc = open(File(files[i]));

                    PV.Base.walk(doc.layers, function(layer, type) {
                        if (type == PV.Global.QUARKJS.VIEW) {
                            PVQ.processPosFile(layer);
                        }
                        if (type == PV.Global.QUARKJS.ITEM) {
                            PVQ.processItemFile(layer);
                        }
                    });
                
                    // 生成切片文件
                    PVQ.G.d = doc;
                    if(i == 0){
                        PVQ.G.newDoc = PVQ.G.newDocument(PVQ.G.d);
                    }
                    PVQ.G.searching(PVQ.G.d.layers);

                    doc.close(SaveOptions.DONOTSAVECHANGES);
                }
                
                //保存最后一个切图
                PVQ.G.savePNG(PVQ.G.newDoc);
            
                //输出配置
                var fileName = PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.SLICE + "Slice.js";
                var fs = File(fileName);
                fs.open("w");
                fs.encoding = "utf-8";
                fs.writeln(PVQ.G.output);
                fs.close();
            }
        },

        /**
         * 分派元素处理事件
         * @params {Object} fs 需要读写的文件
         * @params {Object} layer 当前需要处理的图层
         * @params {String} type 分派类型
         * @params {Container} ppos 坐标偏移量
         * @method switchElement
         */
        processElements: function(fs, layer, type) {
            switch (type.toLowerCase()) {
                case PV.Global.QUARKJS.ELEMENT.BUTTON.toLowerCase(): {
                    if (!buttonH) {
                        buttonH = new PVQ.ButtonH();
                    }
                    buttonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.IMAGE.toLowerCase(): {
                    if (!imageH) {
                        imageH = new PVQ.ImageH();
                    }
                    imageH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TEXT.toLowerCase(): {
                    if (!textH) {
                        textH = new PVQ.TextH();
                    }
                    textH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.CONTAINER.toLowerCase(): {
                    if (!containerH) {
                        containerH = new PVQ.ContainerH();
                    }
                    containerH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.TOGGLE_BUTTON.toLowerCase(): {
                    if (!toggleButtonH) {
                        toggleButtonH = new PVQ.ToggleButtonH();
                    }
                    toggleButtonH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.SWITCH.toLowerCase(): {
                    if (!switchH) {
                        switchH = new PVQ.SwitchH();
                    }
                    switchH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.INPUT.toLowerCase(): {
                    if (!inputH) {
                        inputH = new PVQ.InputH();
                    }
                    inputH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.ANIMATION.toLowerCase(): {
                    if (!animationH) {
                        animationH = new PVQ.AnimationH();
                    }
                    animationH.describe(fs, layer);
                    break ;
                }
                case PV.Global.QUARKJS.ELEMENT.DRAGPANEL.toLowerCase(): {
                    if (!dragPanelH) {
                        dragPanelH = new PVQ.DragPanelH();
                    }
                    dragPanelH.describe(fs, layer);
                    break ;
                }
                default: {
                    console.log("找不到类型: " + type + ", 图层名: " + layer.name);
                }
            }
        }
    }
})();