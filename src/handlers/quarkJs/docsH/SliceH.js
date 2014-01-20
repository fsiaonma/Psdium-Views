/**
 * Psdium-Views quarkJs 切片文件处理方法
 * @params {Objcet} doc 当前文本对象
 */
PVQ.G = {
    d : null,
    log = function(str){
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
            if(!PVQ.G.isRepeat (l.name) && !PVQ.G.isIgnored(l.name)){
                if(l.typename == "LayerSet"){
                    PVQ.G.log(PVQ.G.tab + "进入文件夹: " + l.name);
                    PVQ.G.tab += "  ";
                    PVQ.G.searching(l.layers);
                    PVQ.G.tab = PVQ.G.tab.substring(0, PVQ.G.tab.length - 2);
                    PVQ.G.log(PVQ.G.tab + "退出文件夹: " + l.name);
                    continue;
                }else if(l.typename == "ArtLayer" && l.kind != LayerKind.SOLIDFILL){
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
                        PVQ.G.log(PVQ.G.tab + "换行, 下一个Y坐标是: " + y);
                    }
                    var hh = PVQ.G.y + h;
                    if(hh > PVQ.G.maxH){
                        //另起文件
                        PVQ.G.savePNG(PVQ.G.newDoc);
                        PVQ.G.newDoc = PVQ.G.newDocument(d);
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
                    newL.translate(-newBounds[0] + x, -newBounds[1] + y, OffsetUndefinedAreas.SETTOBACKGROUND);
                    PVQ.G.log(PVQ.G.tab + "输出新切片: " + newL.name);
                    //添加到配置字符串
                    PVQ.G.output += '\t"' + l.name + '" : [' + Number(x) + ',' + Number(y) + ',' + Number(w) + ',' + Number(h) + '],' + '\n';
                
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




/***********************************************     下面是md5算法     ************************************************/


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}