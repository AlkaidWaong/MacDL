# Awesome Mac 与 MacAppHQ：定位、协作与 SEO 研究

- 核验日期：2026-11-19
- 方法：只读取 awesome-mac 与 MacAppHQ 的一手仓库/站点源文件；以下“建议”是基于这些已核实事实的编辑建议，不将其表述为对外部效果的保证。

## 已核实的内容模型

| 维度 | awesome-mac | MacAppHQ |
| --- | --- | --- |
| 核心单元 | README 中按大类/子类排列的一行软件条目；条目可带开源、免费、App Store、原生应用和关联 Awesome 列表标记。 | `posts` Markdown 文章；schema 支持 slug、日期/更新时间、简介、价格、平台、官方链接、来源、引用、速览、适用人群、FAQ、分类、标签与别名。 |
| 内容深度 | README 自述是收集并系统分类优质 macOS 软件，便于查找；贡献规则要求条目有用、放入对应分类、按字母顺序且描述简洁。 | 站点自述以实际使用、资料核对与同类比较，说明产品能做什么、适合谁和价格是否匹配；评测页还要求说明不适合的人、限制、来源与更新。 |
| 覆盖与分发 | 英、中、日、韩、葡五份 README；构建会把各语言 README 中 `<!--start-->` 至 `<!--end-->` 转为 npm 发布的 JSON；RSS 从各 README 的最近 50 个提交中提取新增条目。 | 发布文章会进入站内 JSON 搜索索引、RSS；`llms.txt`/`llms-full.txt` 按分类提供文章标题、摘要、日期、价格与 URL。 |
| 编辑入口 | 通过 GitHub PR；每项单独 PR，新增时需同步 README 与目录（适用时）。 | 提交页接受软件推荐、独立产品收录、商务共创、更正；付费软件收录要求可完整体验的授权，但明确不保证收录或正面评价。 |

## 定位结论

两者应是**目录发现**与**中文选型/工作流决策**的互补关系，而非逐条镜像的竞争关系：

1. **awesome-mac** 适合回答“这一类 Mac 软件有哪些”，凭借广泛分类、多语言 README、机器可消费 JSON 与近期新增 RSS 承接发现需求。
2. **MacAppHQ** 应坚持回答“在这个具体场景该选哪一个、为什么、代价与边界是什么”。现有文章字段、评测准则和对比文章结构已经支持这一定位。
3. 因此 MacAppHQ 不应把“最大软件清单”作为主张；优先建设“场景 + 对比 + 可核验结论”的中文内容资产。

## 协作建议

1. **候选池而非转载源**：可把 awesome-mac 的分类和新增 RSS 当作选题发现信号；每个候选在 MacAppHQ 仍按现有评测页要求安装/使用或明确资料边界，并回到开发者官方资料核实。
2. **双向但不捆绑**：当某工具已在 MacAppHQ 有实测文章，可向 awesome-mac 提交符合其规则的、一句话、分类正确、按字母排序、五语同步的条目 PR；PR 不应以换链接或收录 MacAppHQ 文章为条件。
3. **避免批量复制**：awesome-mac 的 `package.json` 声明 `CC-BY-SA-4.0`，但仓库 `LICENSE` 文件为 CC0 1.0；两份一手文件的授权信号不一致。授权澄清前，不批量复制其条目文字、分类数据或生成 JSON；仅将其作为人工核验后的选题线索。
4. **区分赞助与编辑判断**：awesome-mac README 显示赞助与维护者应用推广位；MacAppHQ 的评测页承诺未来赞助/联盟合作将明确标识并与编辑判断分开。合作页或外链说明也应保留这种边界。

## SEO 与可引用性建议

1. **关键词分工**：目录型、泛发现词（如“Mac 软件分类/清单”）不必正面复制；MacAppHQ 聚焦“产品名 + 使用场景/替代方案/对比/价格/系统要求”等可由现有文章结构直接回答的长尾查询。
2. **把核心页面做成稳定入口**：每篇评测在开头保留短结论、适合/不适合人群、关键数据表、官方来源和替代方案；这是项目模板与评测页已定义的结构，应保持一致并随版本/价格变更更新日期。
3. **强化主题簇，不复制目录**：从一款评测页链接到其场景对比页、替代方案和相邻工作流工具；现有 `categories`、`tags`、FAQ、别名及 `llms.txt` 分类输出可承载这类内部关联。
4. **保留机器可读分发面**：继续维护 `search-index.json`、RSS、sitemap、`llms.txt` 与 `llms-full.txt` 的发布可用性；源代码已使它们只纳入非草稿文章，并让完整 LLM 目录包含分类、摘要、更新时间和可选价格。
5. **外链策略以读者任务为准**：在 MacAppHQ 的文章中链接开发者官网作为下载/事实来源；若引用 awesome-mac，仅在“更广泛同类目录”确有帮助时说明其目录性质，而不要把它当作产品事实的唯一依据。

## 一手来源

### awesome-mac

- [README（英文）](https://github.com/jaywcjlove/awesome-mac/blob/master/README.md)：项目目的、分类、标记与多语言/RSS入口。
- [README（中文）](https://github.com/jaywcjlove/awesome-mac/blob/master/README-zh.md)：中文分类与标记说明。
- [贡献规范](https://github.com/jaywcjlove/awesome-mac/blob/master/docs/CONTRIBUTING.md)：PR、分类、排序、单句描述与多语言同步要求。
- [package.json](https://github.com/jaywcjlove/awesome-mac/blob/master/package.json)：JSON 导出、构建脚本、package 授权字段。
- [Markdown→JSON 构建脚本](https://github.com/jaywcjlove/awesome-mac/blob/master/build/ast.mjs)：五语 README 的 AST/JSON 生成范围。
- [RSS 构建脚本](https://github.com/jaywcjlove/awesome-mac/blob/master/build/feed.mjs) 与 [RSS 说明](https://github.com/jaywcjlove/awesome-mac/blob/master/feed/feed.md)：最近 50 次提交、增量与每语言 feed 的机制。
- [部署工作流](https://github.com/jaywcjlove/awesome-mac/blob/master/.github/workflows/ci.yml)：构建、生成 JSON/RSS、发布与 npm 流程。
- [LICENSE](https://github.com/jaywcjlove/awesome-mac/blob/master/LICENSE)：CC0 1.0 文本（与 package 字段不一致）。

### MacAppHQ（本仓库当前 `main`）

- [内容 schema](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/content.config.ts)
- [关于 MacAppHQ](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/content/pages/about.md)
- [评测方法](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/content/pages/how-we-review.md)
- [产品提交规则](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/content/pages/submit.md)
- [AI 友好文章模板](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/content/posts/_ai-friendly-template.md)
- [搜索索引路由](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/pages/search-index.json.ts)、[RSS 路由](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/pages/rss.xml.ts)、[LLM 简表](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/pages/llms.txt.ts)、[LLM 完整目录](https://github.com/AlkaidWaong/MacDL/blob/main/astro/src/pages/llms-full.txt.ts)
