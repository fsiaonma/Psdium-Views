/**
 * Psdium-Views quarkJs 切片文件处理方法
 * @params {Objcet} doc 当前文本对象
 */
PVQ.G = {
    d : null,
    log: function(str) {
        //$.write (str);
    },
     
    //忽略列表
    ignoreList : [/^text_/, /area/, /^input_/],
    
    //实际画布大小
    totalW : 0,
    totalH : 0,
    //新建画布大小, 预留大些
    orgW : 2000,
    orgH : 2000,
    
    //设置填充间隙
    gap : 5,
    
    //日志缩进
    tab : "",
    
    //输出配置字符串
    output : "Slice = window.Slice || {};\n",
    count : 0,
    maxW : 1024,
    maxH : 1024,
    x : 0,
    y : 0,
    nextY : 0,
    //检查名字是否重复
    sliceNames : [],
    //当前新文档
    newDoc : null,
    
    //新建
    newDocument : function(d){
        var name = "slice" + PVQ.G.count;
        PVQ.G.count++;
        var doc = app.documents.add(PVQ.G.orgW, PVQ.G.orgH, PVQ.G.d.resolution, name, 
                            PVQ.G.d.mode.ColorModel, DocumentFill.TRANSPARENT, 1);
        PVQ.G.log(PVQ.G.tab + "新建文件: " + name);
        PVQ.G.output += 'Slice["' + name + '.png"] = {' + '\n';
        return doc;
    },
    //保存
    savePNG : function(doc){
        var name = doc.name;
        app.activeDocument = doc;
        doc.resizeCanvas (PVQ.G.totalW, PVQ.G.totalH, AnchorPosition.TOPLEFT);
        var newFile = File(PV.Config.LIB_MODE.QUARKJS.EXPORT_PATH.IMAGE + name);
        var opt = new PNGSaveOptions();
        opt.compression = 0;
        doc.saveAs (newFile, opt);
        PVQ.G.log(PVQ.G.tab + "保存文件: " + name);
        doc.close (SaveOptions.DONOTSAVECHANGES);
        PVQ.G.output = PVQ.G.output.substring(0, PVQ.G.output.length - 2);
        PVQ.G.output += '\n};\n';
    },
    //检查名字是否重复
    isRepeat : function(name){
        for(var i=0; i<PVQ.G.sliceNames.length; i++){
            var s = PVQ.G.sliceNames[i];
            if(s == name){
                PVQ.G.log(PVQ.G.tab + "[WARN] 切片名字重复: " + name);
                return true;
            }
        }
        return false;
    },
    //检查名字是否在忽略列表
    isIgnored : function(name){
        var nname = name.toLowerCase();
        for(var i=0; i<PVQ.G.ignoreList.length; i++){
            var regexp = PVQ.G.ignoreList[i];
            if(nname.match (regexp) != null){
                PVQ.G.log(PVQ.G.tab + "[WARN] 忽略该切片名字: " + name);
                return true;
            }
        }
        return false;
    },
    
    searching : function(ls){
        for(var i=0; i<ls.length; i++){
            var l = ls[i];
            app.activeDocument = PVQ.G.d;
            PVQ.G.d.activeLayer = l;
            //判断图层名称, 该位置不要放错
            if(!PVQ.G.isIgnored(l.name)){
                if(l.typename == "LayerSet"){
                    PVQ.G.log(PVQ.G.tab + "进入文件夹: " + l.name);
                    PVQ.G.tab += "  ";
                    PVQ.G.searching(l.layers);
                    PVQ.G.tab = PVQ.G.tab.substring(0, PVQ.G.tab.length - 2);
                    PVQ.G.log(PVQ.G.tab + "退出文件夹: " + l.name);
                    continue;
                }else if(!PVQ.G.isRepeat (l.name) && l.typename == "ArtLayer" && l.kind != LayerKind.SOLIDFILL){
                    //获取宽高
                    var bounds = l.bounds;
                    var w = bounds[2] - bounds[0];
                    var h = bounds[3] - bounds[1];
                    
                    //越界处理
                    var ww = PVQ.G.x + w;
                    if(ww >PVQ.G.maxW){
                        //换行
                        PVQ.G.y = PVQ.G.nextY;
                        PVQ.G.x = 0;
                        ww = w;
                        PVQ.G.log(PVQ.G.tab + "换行, 下一个Y坐标是: " + PVQ.G.y);
                    }
                    var hh = PVQ.G.y + h;
                    if(hh > PVQ.G.maxH){
                        //另起文件
                        PVQ.G.savePNG(PVQ.G.newDoc);
                        PVQ.G.newDoc = PVQ.G.newDocument(PVQ.G.d);
                        PVQ.G.x = PVQ.G.y = PVQ.G.nextY = PVQ.G.totalW = PVQ.G.totalH = 0;
                        ww = PVQ.G.x + w;
                        hh = PVQ.G.y + h;
                        PVQ.G.log(PVQ.G.tab + "另起文件: " + PVQ.G.newDoc.name);
                    }
                    
                    //粘贴到新文档
                    app.activeDocument = PVQ.G.d;
                    PVQ.G.d.activeLayer = l;
                    PVQ.G.log(PVQ.G.tab + "发现切片: " + l.name + ", " + l.kind);
                    l.copy();
                    app.activeDocument = PVQ.G.newDoc;
                    var newL = PVQ.G.newDoc.paste ();
                    PVQ.G.newDoc.activeLayer = newL;
                    var newBounds = newL.bounds;
                    PVQ.G.log(PVQ.G.tab + "Bounds: " + newBounds[0] + ", " + newBounds[1] + ", " + newBounds[2] + ", " + newBounds[3] 
                                        + ", 宽高: " + w + ", " + h);
                    //设置位置
                    newL.translate(-newBounds[0] + PVQ.G.x, -newBounds[1] + PVQ.G.y, OffsetUndefinedAreas.SETTOBACKGROUND);
                    PVQ.G.log(PVQ.G.tab + "输出新切片: " + newL.name);
                    //添加到配置字符串
                    PVQ.G.output += '\t"' + l.name + '" : [' + Number (PVQ.G.x) + ',' + Number (PVQ.G.y) + ',' + Number(w) + ',' + Number(h) + '],' + '\n';
                
                    //计算实际画布大小
                    PVQ.G.totalW = ww > PVQ.G.totalW ? ww : PVQ.G.totalW;
                    PVQ.G.totalH = hh > PVQ.G.totalH ? hh : PVQ.G.totalH;
                    PVQ.G.log('PVQ.G.totalW = ' + PVQ.G.totalW + ', PVQ.G.totalH = ' + PVQ.G.totalH);
                    //计算下一次切图摆放位置
                    PVQ.G.x += w + PVQ.G.gap;
                    PVQ.G.nextY = PVQ.G.totalH + PVQ.G.gap;
                    //记住该名字
                    PVQ.G.sliceNames.push(l.name);
                }else{
                    PVQ.G.log(PVQ.G.tab + "[WARN] 切片格式不支持: " + l.name + ", LayerKind: " + l.kind);
                }
            }
        }
    }//end searching
};



