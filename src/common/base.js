/**
 * Base 
 * PSD2V 基类
 * @constructor
 */
PV.Base = (function() {
    return {
        /**
         * 遍历图层
         * @params {Array} layers 图层集合
         * @params {function} callback 回调函数
         * @method walk
         */
        walk: function(layers, callback) {
            for (var i = layers.length - 1; i > -1; --i) {
                var type = layers[i].name.substr(0, layers[i].name.indexOf("_"));
                callback && callback(layers[i], type);
            }
        },

        /**
         * 获取前缀名
         * @params {String} name 名称
         * @method getExName
         */
        getExName: function(name) {
            return name.substr(0, name.indexOf("_"));
        },

        /**
         * 获取组件名
         * @params {String} name 名称
         * @method getLastName
         */
        getComponentName: function(name) {
            return name.substr(name.indexOf("_") + 1);
        }
    }
})();