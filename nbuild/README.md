N-Builder
============

## 什么是 N-Builder ?

N-Build 是一个基于nodejs 的 web 工程打包工具。提供了 js, css 压缩打包, png, jpg 图片压缩功能。支持 Windows 和 Linux 两大平台。N-Builder 亦支持多个工程同时打包压缩。使用时只需简单配置 config.js 文件即可。

## 用到哪些工具 ?

+ js 压缩使用 uglify-js

+ css 压缩使用 clean-css

+ 图片压缩使用 smushit

## 使用前需要准备什么 ?

由于 N-Build 是一个基于 nodejs 的打包工具，因此使用前必须具备 nodejs 环境，如果你没有 nodejs 环境，请到 http://www.nodejs.org/ 下载最新版本的 nodejs 再使用 N-Builder。

## 如何配置 config.js ?

### config.js 整体概述

config.js 内涵一个对象 config, config 对象目前拥有 2 个属性：

+ unpackProjects: [ ]，需要打包的项目名，若配置 unpackProjects: 'all', 则打包所有项目。

+ projects: [ ]，一对象数组 数组中每个对象对应一个工程（可同时配置多个对象，同时打包多个工程），每个对象（数组项）中有 7 个可配置属性，如下图所示：

>     config.projects = [{
>		  projectName: '',      
>    	  rootPath: '',         
>   	  buildPath: '',        
>   	  resources: {          
>       	  copyOnly: [],     
>       	  ignore: []        
>   	  },
>   	  images: {             
>       	  compression: [],  
>       	  copyOnly: [],     
>       	  ignore: []        
>   	  },
>   	  js: {                 
>       	  compression: [{   
>           	  dir: [],      
>           	  outputFile: ''
>       	  }],
>       	  copyOnly: [],     
>       	  ignore: []        
>   	  },
>   	  css: {                
>       	  compression: [{   
>           	  dir: [],      
>           	  outputFile: ''
>       	  }],
>       	  copyOnly: [],     
>       	  ignore: []        
>   	  } 
>     }
>     
>     projectName: 项目名称，项目的唯一标识。
>     rootPath: 需要打包的工程的根目录路径，后面所有关于工程的路径均相对于该路径。(必填)
>     buildPath: 打包的目标目录路径。(必填。即需要打包到的目录路径)
>     resources: 资源配置项。(选填)
>     images: 图片配置项。(选填)
>     js: javascripts 配置项。(选填)
>     css: css 配置项。(选填)
>
>     注：在配置路径时，若配置文件夹，必须以斜杠结尾。

### resources 项如何配置 ?

>     resources: {            
>  		  copyOnly: [],          
>         ignore: []         
>  	  }
>
>	  copyOnly: 需要复制的资源路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>	  ignore: 不用打包的资源路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>
>     注：在配置路径时，若配置文件夹，N-Builder 会递归处理该文件夹下所有资源文件（除 js，css，html，png，jpg 以外的文件）。

### images 项如何配置 ?

>     images: {
>         compression: [],  
>      	  copyOnly: [],     
>      	  ignore: []   
>     }
>
>     compression: 需要压缩的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>     copyOnly: 需要复制的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>     ignore: 不用打包的图片路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>
>     注：在配置路径时，若配置文件夹，N-Builder 会递归处理该文件夹下所有 png 和 jpg 文件。

### js 项如何配置 ?

>     js: {
>         compression: [{   
>		      dir: [],      
>		      outputFile: ''
>		  }],
>		  copyOnly: [],     
>		  ignore: []        
>     }
>     
>     compression: javascript 压缩配置项。（数组中可配置多个对象）  
>         dir: 需要压缩的 js 文件路径，相对于 rootPath。（必填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）	
>         outputFile: 压缩合并后的 js 文件名。 （选填。默认为 min.js）
>    
>     copyOnly: 需要复制的 js 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>         
>     ignore：不用打包的 js 文件路径，相对于 rootPath。（选填。接受文件路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>
>     注：在配置路径时，若配置文件夹，N-Builder 会递归处理该文件夹下所有 js 文件。 

### css 项如何配置 ?

>     css: {
>         compression: [{   
>             dir: [],      
>             outputFile: ''
>         }],
>         copyOnly: [],
>         ignore: []
>     }
>       
>     compression: css 压缩配置项。（数组中可配置多个对象）  
>	      dir: 需要压缩的 css 文件路径，相对于 rootPath。（必填。接受文件路径路径或文件夹路径，若配置文件夹路径必须以 '/' 结尾）
>		  outputFile: 压缩合并后的 css 文件名。（选填。默认为 min.css）
>
>     copyOnly: 不需压缩只需复制的 css 文件的路径集合（可多填），可配置 文件路径 以及 文件夹路径。
>               若配置的是文件夹路径，N-Builder 将根据 css 文件夹原有目录结构，复制该文件夹下所有 css 文件。
>         
>     ignore：不需要做什么处理的 css 文件的路径集合（可多填），可配置 文件路径 以及 文件夹路径。 
>             若配置的是文件夹路径, N-Builder 将不处理该文件下的所有 css 文件。
>
>     注：在配置路径时，若配置文件夹，N-Builder 会递归处理该文件夹下所有 css 文件。

## 用例

### 打包单个工程
	  
>	  var config = config || {
>	      unpackProjects: ['Bubble Trouble']
>	  };	
>
>     config.projects = [{
>	      projectName: 'Bubble Trouble',
>	      rootPath: '../Bubble_Trouble/',
>	      buildPath: '../production/Bubble_Trouble/',
>	      images: {
>	          compression: ['i/']
>	      },
>	      js: {
>	          compression: [{
>	              dir: ['src/base.js', 'src/bubble.js'],
>	              outputFile: 'bubble_trouble.min.js'
>	          }, {
>	              dir: ['js/game.js', 'js/main.js'],
>	              outputFile: 'main.min.js'
>	          }]
>	      },
>	      css: {
>	          compression: [{
>	              dir: ['css/base.css'],
>	              outputFile: 'css/bubble_trouble.min.css'
>	          }]
>	      }
>	  } 
>
>     module.exports = config;

### 打包多个工程

>     var config = config || {
>         unpackProjects: [
>             'Block Dream', 
>             'Alien Puzzle', 
>             'Laser Puzzle'
>         ]
>     };
>     
>     config.projects = [{
>         projectName: 'Block Dream',
>         rootPath: '../Block_Dream/',
>         buildPath: '../production/Block_Dream/',
>         images: {    
>             compression: ['static/']
>         },
>         js: {
>             compression: [{
>                 dir: ['static/'],
>                 outputFile: 'static/block_dream.min.js'
>             }]
>         },
>         css: {
>             compression: [{
>                 dir: ['static/'],
>                 outputFile: 'static/block_dream.min.css'
>             }]
>         }
>     }, {
>         projectName: 'Alien Puzzle',
>         rootPath: '../AlienPuzzle/',
>         buildPath: '../production/AlienPuzzle/',
>         images: {
>             compression: ['assets/']
>         },
>         js: {
>             compression: [{
>                 dir: ['js/bugengine.js', 'js/alienpuzzle.js'],
>                 outputFile: 'alienPuzzle.min.js'
>             }]
>         },
>         css: {
>             compression: [{
>                 dir: ['css/'],
>                 outputFile: 'css/alienPuzzle.min.css'
>             }]
>         }
>     }, {
>         projectName: 'Laser Puzzle',
>         rootPath: '../LaserPuzzle/',
>         buildPath: '../production/LaserPuzzle/',
>         images: {
>             compression: ['images/']
>         },
>         js: {
>             compression: [{
>                 dir: ['js/utils.js',
>                       'js/grid.js',
>                       'js/levels.js',
>                       'js/imagelayer.js',
>                       'js/laserlayer.js',
>                       'js/menulayer.js',
>                       'js/doorlayer.js',
>                       'js/pivotbacklayer.js',
>                       'js/components/pivot.js',
>                       'js/components/filter.js',
>                       'js/systems/pivots.js',
>                       'js/gamescene.js',
>                       'js/spritesheet.js',
>                       'js/game.js'],
>                 outputFile: 'laserPuzzle.min.js'
>             }],
>             copyOnly: ['playcraft.js']
>         }
>     }, 
>
>     module.exports = config;

## 如何运行 ?

>     Windows 运行 build.bat。或命令行进入 N-Builder 目录，输入命令：node src/app.js

>     Linux 运行 build.sh。或命令行进入 N-Builder 目录，输入命令：node src/app.js