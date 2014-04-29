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
            VIEW: "View",

            ITEM: "Item",

            ELEMENT: {
                IMAGE: "Image",
                BUTTON: "Button",
                TEXT: "Text",
                CONTAINER: "Container",
                TOGGLE_BUTTON: "ToggleButton",
                SWITCH: "Switch",
                INPUT: "Input",
                ANIMATION: "Ani",
                DRAGPANEL: "DragPanel",
                ITEM: "Item"
            },

            BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable"
            },

            TOGGLE_BUTTON_STATUS: {
                UP: "up",
                DOWN: "down",
                DISABLE: "disable",
                CHECK_UP: "checkup",
                CHECK_DOWN: "checkdown",
                CHECK_DISABLE: "checkdisable"
            },

            SWITCH_STATUS: {
                BG: "bg",
                UP: "up",
                DOWN: "down"
            },

            Input_STATUS: {
                AREA: "area",
                TEXT: "text"
            },

            DRAGPANEL_STATUS: {
                AREA: "area"
            }
        }
    }
})();