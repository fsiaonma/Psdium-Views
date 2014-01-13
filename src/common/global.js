/**
 * Global 用于定义全局变量
 * PSD2V Global 类
 * @constructor
 */
PV.Global = (function() {
    return {
        // cm 到 px 转换值
        PX_BUFFER: 37.795276,
        
        // cs6 对象
        ART_LAYER: "ArtLayer",
        LAYER_SET: "LayerSet",

        // 导出库
        LIB_MODE: {
            QUARK: "QuarkJs"
        },

        // QuarkJS 元素
        QUARK: {
            SLICE: "Slice",

            POS: "Pos",

            ELEMENT: {
                IMAGE: "Image",
                BUTTON: "Button",
                TEXT: "Text"
            },

            BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable"
            }
        }
    }
})();