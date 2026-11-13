# codex

一个简洁的 Hexo 主题，面向技术写作。核心能力是把长篇连载内容（一本书、一个系列）组织成「专栏 → 章 → 文章」三级索引。

- 专栏目录页 `/books/<id>/`，所有专栏汇总在 `/books/`。
- 专栏文章页采用三栏布局：左侧导航树（当前篇高亮，章节可折叠）、正文、右侧本页目录；顶部有面包屑和「第 x / N 篇」，底部有跨章节的上一篇 / 下一篇。在手机上，导航树变成抽屉。
- 普通文章：右侧本页目录（滚动时高亮当前小节）。
- 代码块：语言标签、一键复制、行号；深浅两套配色。
- 深色模式：默认跟随系统，可手动切换并记住选择。
- 提示框：GitHub 语法 `> [!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]`、`[!CAUTION]`。
- giscus 评论；自动生成 `/categories/` 和 `/tags/` 索引页；配合 hexo-generator-feed 提供 RSS。
- 纯 CSS 和原生 JS，没有构建步骤，不加载网络字体。

## 启用

```yaml
# 站点 _config.yml
theme: codex
language: zh-CN        # 或 en
```

先预览、不切换线上主题：`npx hexo server --config _config.yml,_config.preview.yml`，其中 `_config.preview.yml` 只写一行 `theme: codex`。

## 专栏

1. 在 `source/_data/books.yml` 里声明专栏：

   ```yaml
   jvm:
     title: 深入理解 JVM
     description: 类加载、内存结构……
   my-book:
     title: 一本有章节的书
     chapters:            # 可选；不写时专栏只有「专栏 → 文章」两级
       - id: ch1
         title: 第 1 章 入门
       - id: ch2
         title: 第 2 章 进阶
   ```

2. 在文章（post 或 page 都可以）的 front matter 里加入专栏：

   ```yaml
   book: my-book
   chapter: ch1      # 专栏声明了 chapters 时填写
   order: 3          # 可选
   ```

排序规则：
- 有 `order` 的按数值排在前面。
- 没有 `order` 的，post 按发布日期排，page 按文件名自然排序（`1.2` 排在 `1.10` 前面）。

构建时如果 `book` 或 `chapter` 写错，会打印 `[codex]` 警告，不会让构建失败。

## 主题配置（`themes/codex/_config.yml`）

| 配置项 | 作用 |
|---|---|
| `menu` | 导航条，键名对应 `languages/*.yml` 里的 `nav.*` |
| `author` | 首页的头像、所在地、链接；姓名、副标题、简介取自站点配置 |
| `toc.max_depth` | 本页目录收录的最深标题级别 |
| `callout_titles` | 没写标题的提示框使用的默认标题 |
| `giscus` | 评论配置，各个 ID 从 https://giscus.app 获取 |

## 开发

```bash
cd themes/codex && node --test     # 测试目录树生成和提示框转换
```

| 目录 | 内容 |
|---|---|
| `lib/books.js` | 专栏目录树生成（纯函数，不依赖 Hexo） |
| `lib/callouts.js` | 提示框转换（纯函数） |
| `scripts/` | Hexo 插件注册，包括 helper `books()`、`book_nav(page)`，各个生成器和渲染过滤器 |
| `layout/` | EJS 模板 |
| `source/` | CSS、JS 和图片 |
