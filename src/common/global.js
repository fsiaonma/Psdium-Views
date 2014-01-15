/**
 * Global 用于定义全局变量
 * PSD2V Global 类
 * @constructor
 */
PV.Global = (function() {
    return {
        // cs6 对象
        ART_LAYER: "ArtLayer",
        LAYER_SET: "LayerSet",

        // 导出库
        LIB_MODE: {
            QUARKJS: "QUARKJS"
        },

        // QuarkJS 元素
        QUARKJS: {
            ELEMENT: {
                IMAGE: "Image",
                BUTTON: "Button",
                TEXT: "Text",
                CONTAINER: "Container"
            },

            BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable"
            }
        }
    }
})();