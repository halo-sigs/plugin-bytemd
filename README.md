# plugin-bytemd

集成 [bytemd](https://github.com/bytedance/bytemd) 到 Halo。

## 使用方式

1. 下载，目前提供以下两个下载方式：
    - GitHub Releases：访问 [Releases](https://github.com/halo-sigs/plugin-bytemd/releases) 下载 Assets 中的 JAR 文件。
    - Halo 应用市场：<https://halo.run/store/apps/app-HTyhC>。
2. 安装，插件安装和更新方式可参考：<https://docs.halo.run/user-guide/plugins>。
3. 安装完成之后，进入文章新建页面即可在右上角编辑器切换按钮中看到 ByteMD 编辑器。

## 常见问题

1. 如何支持编写数学公式

目前此插件已经支持编写数学公式，但需要同时安装 [plugin-katex](https://github.com/halo-sigs/plugin-katex) 插件才能够正常在编辑器预览区域渲染。另外，还需要在 KaTeX 插件设置中设置 dom 节点才能够在文章中正常渲染，可以参考：<https://github.com/halo-sigs/plugin-katex#%E6%96%87%E7%AB%A0%E9%A1%B5%E6%B8%B2%E6%9F%93%E5%85%AC%E5%BC%8F>

## 开发环境

```bash
git clone git@github.com:halo-sigs/plugin-bytemd.git

# 或者当你 fork 之后

git clone git@github.com:{your_github_id}/plugin-bytemd.git
```

```bash
cd path/to/plugin-bytemd
```

```bash
# macOS / Linux
./gradlew pnpmInstall

# Windows
./gradlew.bat pnpmInstall
```

```bash
# macOS / Linux
./gradlew build

# Windows
./gradlew.bat build
```

修改 Halo 配置文件：

```yaml
halo:
  plugin:
    runtime-mode: development
    classes-directories:
      - "build/classes"
      - "build/resources"
    lib-directories:
      - "libs"
    fixedPluginPath:
      - "/path/to/plugin-bytemd"
```
