### V1.0.0

>     实现基本功能，包括：打包 js，css，image 文件。

### V1.0.1

>     修改小量功能的逻辑实现，补充注释，md 说明文档编写。

### V1.1.0

>     1. 修改 config.js 文件配置方式，使对用户更友好。去除 jsBuildPath, imagesBuildPath, cssBuildPath 3 个不友好配置项。增加 projectName 属性。
>     2. 允许通过配置使 js，css 压缩成多个不同的文件，通过各自的 compression 配置项实现（compression 改为对象数组配置形式，支持配置多个压缩项）。
>     3. 增加资源打包功能，通过配置 resources 配置项实现。
>     4. 允许用户自行选择工程进行打包，不须每次打包所有项目。
>     5. config.js 文件添加注释，使用户更为方便使用。

TODO:

>     1. 增加 merge 配置项，用于合并 js 文件。
>     2. 增加 jsHint 配置项，配置文件。
>     3. 增加 自动创建项目功能。
>     4. 重构代码。