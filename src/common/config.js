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
                    SLICE: "/c/wamp/www/workplace/testPSD2V/scripts/configs/",
                    POS: "/c/wamp/www/workplace/testPSD2V/scripts/views/",
                    IMAGE: "/c/wamp/www/workplace/testPSD2V/images/"
                }
            }
        }
    }
})();