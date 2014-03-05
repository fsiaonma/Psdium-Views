/**
 * Config 
 * PSD2V 相关配置文件
 * @constructor
 */
PV.Config = (function() {
    return {
        DEBUG: true,

        LIB_MODE: {
        	QUARKJS: {
                SOURCE_PATH: {
                    POS: "/d/Github/Psdium-Views/demo/ui_pos/"
                },
                EXPORT_PATH: {
                    SLICE: "/d/Github/Psdium-Views/demo/r_d_slice/",
                    POS: "/d/Github/Psdium-Views/demo/r_d_pos/",
                    IMAGE: "/d/Github/Psdium-Views/demo/r_d_images/"
                }
            }
        }
    }
})();