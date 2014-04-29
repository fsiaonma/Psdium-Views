var config = config || {
    unpackProjects: ["psd2v"]      // 配置需要打包的项目名，若配置 unpackProjects: 'all', 则打包所有项目。
};

/**
 *  config.projects 为一个对象数组，一个对象是一个项目。
 *
 *  每个项目有对应的：
 *      projectName: 项目名称
 *      rootPath: 项目路径
 *      buildPath: 项目打包路径
 *      resources: 资源打包配置项 
 *      images: 图片打包配置项
 *      js: js 文件打包配置项
 *      css: css 文件打包配置项
 *  
 *   config.projects 数组中可配置多个承载多个对象，配置多个项目。
 *   使 N-Builder 能支持同时打包多个项目。
 *   注：若路径配置为文件夹路径时，N-Builder 会递归处理该文件夹下所有合法文件。
 */
config.projects = [{
    projectName: 'psd2v',        // 项目名称。（必填，项目的唯一标识，不能与其他项目重复）
    rootPath: '../',           // 项目的相对路径。（必填。必须以 '/' 结尾）
    buildPath: '../production/',          // 项目打包的目标路径。（必填。必须以 '/' 结尾）
    resources: {            // 资源打包配置项
        copyOnly: [],           // 需要复制的资源路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
        ignore: []              // 不用打包的资源路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
    },
    images: {               // 图片压缩打包配置项
        compression: [],        // 需要压缩的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
        copyOnly: [],           // 需要复制的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
        ignore: []              // 不用打包的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
    },
    js: {                   // javascript 压缩打包配置项
        compression: [{         // javascript 压缩配置项。（数组中可配置多个对象）
            dir: [
                'src/common/config.js',
                'src/libs/console.js',

                'src/pv.js',

                'src/common/base.js',
                'src/common/global.js',

                'src/handlers/quarkJs/DocsH/ItemH.js',
                'src/handlers/quarkJs/DocsH/SliceH.js',
                'src/handlers/quarkJs/DocsH/PosH.js',

                'src/handlers/quarkJs/ElementsH/BaseH.js',
                'src/handlers/quarkJs/ElementsH/ImageH.js',
                'src/handlers/quarkJs/ElementsH/ButtonH.js',
                'src/handlers/quarkJs/ElementsH/TextH.js',
                'src/handlers/quarkJs/ElementsH/ToggleButtonH.js',
                'src/handlers/quarkJs/ElementsH/SwitchH.js',
                'src/handlers/quarkJs/ElementsH/InputH.js',
                'src/handlers/quarkJs/ElementsH/AnimationH.js',
                'src/handlers/quarkJs/ElementsH/ContainerH.js',
                'src/handlers/quarkJs/ElementsH/DragPanelH.js',
                
                'src/handlers/quarkJs/dispatcher.js',
                'src/handlers/quarkJs/main.js',
                
                'src/dispatcher.js',
                'src/main.js'
            ],                // 需要压缩的 js 文件路径，相对于 rootPath。（必填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
            outputFile: 'PsdiumViews-min.jsx'          // 压缩合并后的 js 文件名。 （选填。默认为 min.js）
        }],
        merge: [{               // javascript 合并配置项。（数组中可配置多个对象）
            dir: [
                'src/libs/console.js',

                'src/pv.js',

                'src/common/base.js',
                'src/common/config.js',
                'src/common/global.js',

                'src/handlers/quarkJs/DocsH/ItemH.js',
                'src/handlers/quarkJs/DocsH/SliceH.js',
                'src/handlers/quarkJs/DocsH/PosH.js',

                'src/handlers/quarkJs/ElementsH/BaseH.js',
                'src/handlers/quarkJs/ElementsH/ImageH.js',
                'src/handlers/quarkJs/ElementsH/ButtonH.js',
                'src/handlers/quarkJs/ElementsH/TextH.js',
                'src/handlers/quarkJs/ElementsH/ToggleButtonH.js',
                'src/handlers/quarkJs/ElementsH/SwitchH.js',
                'src/handlers/quarkJs/ElementsH/InputH.js',
                'src/handlers/quarkJs/ElementsH/AnimationH.js',
                'src/handlers/quarkJs/ElementsH/ContainerH.js',
                'src/handlers/quarkJs/ElementsH/DragPanelH.js',
                
                'src/handlers/quarkJs/dispatcher.js',
                'src/handlers/quarkJs/main.js',
                
                'src/dispatcher.js',
                'src/main.js'
            ],                // 需要合并的 js 文件路径，相对于 rootPath。（必填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
            outputFile: 'PsdiumViews.jsx'          // 合并后的 js 文件名。 （选填。默认为 merge.js）
        }],
        copyOnly: [],           // 需要复制的 js 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
        ignore: []              // 不用打包的 js 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
    },
    css: {                  // css 打包压缩配置项
        compression: [{         // css 压缩配置项。（数组中可配置多个对象）
            dir: [],                // 需要压缩的 css 文件路径，相对于 rootPath。（必填。接受文件路径路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
            outputFile: ''          // 压缩合并后的 css 文件名。（选填。默认为 min.css）
        }],
        merge: [{               // css 合并配置项。（数组中可配置多个对象）
            dir: [],                // 需要合并的 css 文件路径，相对于 rootPath。（必填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
            outputFile: ''          // 合并后的 css 文件名。 （选填。默认为 merge.css）
        }],
        copyOnly: [],           // 需要复制的 css 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
        ignore: []              // 不用打包的 css 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
    }
}];

module.exports = config;