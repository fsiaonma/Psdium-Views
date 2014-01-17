/**
 * BaseH 
 * PSD2V Base 处理方法
 * @constructor
 */
PVQ.BaseH = function() {
    /**
     * 获取当前图层父节点相应属性
     * @params {Object} layer 当前需要处理的图层
     * @method getParent
     */
    this.getParent = function(layer) {
        var pos, name;

        var parent = layer.parent;
        var type = parent.name.substr(0, parent.name.indexOf("_"));

        if (type == PV.Global.QUARKJS.ELEMENT.CONTAINER || type == PV.Global.QUARKJS.ELEMENT.ITEM) {
            name = PV.Base.getComponentName(parent.name);
            pos = [Math.round(parent.bounds[0]), Math.round(parent.bounds[1])];
        } else {
            name = "this";
            pos = [0, 0];
        }

        return {
            pos: pos,
            name: name 
        }
    },

    /**
     * 获取当前图层常用配置
     * @params {Object} layer 当前需要处理的图层
     * @params {Object} parent 当前需要处理的图层的父图层
     * @method getConfig
     */
    this.getConfig = function(layer, parent) {
        var name = PV.Base.getComponentName(layer.name);
        var x = Math.round(layer.bounds[0]);
        var y = Math.round(layer.bounds[1]);
        x -= parent.pos[0];
        y -= parent.pos[1];
        var width = Math.round(layer.bounds[2]) - x;
        var height = Math.round(layer.bounds[3]) - y;
        var visible = layer.visible? true : false;

        return {
            name: name,
            pos: [x, y, width, height],
            visible: visible
        }
    }
};