# plugin-bytemd

集成 [bytemd](https://github.com/bytedance/bytemd) 到 Halo。

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

## 使用方式

1. 在 [Releases](https://github.com/halo-sigs/plugin-bytemd/releases) 下载最新的 JAR 文件。
2. 在 Halo 后台的插件管理上传 JAR 文件进行安装。
3. 启动插件之后，即可在新建文章时选择此编辑器。
