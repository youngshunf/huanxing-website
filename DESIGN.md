---
name: 唤星官网
description: 以「可控星图」为北极星，可信、清澈、克制地呈现真正属于用户的 AI 分身
colors:
  brand-primary: "#2563EB"
  brand-primary-hover: "#1D4ED8"
  brand-primary-soft: "rgba(37, 99, 235, 0.10)"
  hero-azure: "#60A5FA"
  accent-gold: "#FFD93D"
  light-canvas: "#F8F9FC"
  light-panel: "#FFFFFF"
  light-float: "#F0F2F5"
  light-input: "#E8EBF0"
  light-text-primary: "#1F2328"
  light-text-secondary: "#656D76"
  light-text-tertiary: "#8B949E"
  light-border-default: "#D0D7DE"
  light-border-hover: "#B0B8C1"
  light-divider: "#E2E6EA"
  dark-canvas: "#0D1117"
  dark-panel: "#161B22"
  dark-float: "#1C2128"
  dark-input: "#242A33"
  dark-text-primary: "#E6EDF3"
  dark-text-secondary: "#8B949E"
  dark-text-tertiary: "#6E7681"
  dark-border-default: "#30363D"
  dark-border-hover: "#484F58"
  dark-divider: "#21262D"
typography:
  display:
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.light-panel}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.brand-primary-hover}"
    textColor: "{colors.light-panel}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.light-text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  chip-brand:
    backgroundColor: "{colors.brand-primary-soft}"
    textColor: "{colors.brand-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  card-default:
    backgroundColor: "{colors.light-panel}"
    textColor: "{colors.light-text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-default:
    backgroundColor: "{colors.light-input}"
    textColor: "{colors.light-text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.light-text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: 唤星官网

## Overview

**Creative North Star: "可控星图"**

唤星官网像一张可控的星图：深空首屏负责唤起想象，清晰的皇家蓝标示行动与连接，明亮的内容表面让复杂能力回到可理解、可验证的秩序。每个视觉节点都应有明确角色和层级，呼应分身有主人、行动可见、关键决定可接管的产品承诺。

整体气质是可信、清澈、克制。默认浅色界面承担长时间阅读和决策，深色只用于首页品牌首屏、用户主动选择的暗色主题及确有沉浸价值的局部；星光、辉光和动效是方向提示，不是持续抢夺注意力的装饰。

**Key Characteristics:**

- 皇家蓝是唯一品牌主声部，暖金只作少量功能点缀。
- 深空品牌瞬间与明亮、易读的内容表面形成节奏对比。
- 色阶和细边框负责常态分层，蓝色环境光只响应交互与关键状态。
- 组件克制而笃定：按钮有力、卡片安静、输入直接。
- 中文系统字体优先，跨平台自然渲染，禁止使用 Inter。

## Colors

调色板以皇家蓝和冷静中性色为骨架，在浅色与深色语义表面之间保持一致的信息层级。

### Primary

- **星轨皇家蓝**：用于主按钮、关键链接、当前状态、焦点与重要图标，是品牌和行动的统一信号。
- **深轨皇家蓝**：用于主操作的悬停与按下状态，不承担第二品牌色。
- **晨星浅蓝**：只在恒深色首屏中承担标题、星核和轨道高光，保证深空中的可读性。

### Tertiary

- **星光暖金**：用于评分、进度终点或少量高价值提示；不得与皇家蓝竞争品牌主导权。

### Neutral

- **晨雾画布与白色面板**：构成默认浅色界面的背景与承载面，适合营销阅读、比较与账号操作。
- **深空画布与深蓝灰面板**：构成暗色主题与沉浸区，依靠逐级提亮而不是重阴影区分层次。
- **主墨、次墨与弱墨**：分别服务标题正文、解释文本和辅助元信息；不要用降低字号代替层级。
- **边框与分隔色**：只说明结构和状态，不成为视觉主体。

### Named Rules

**The One Blue Voice Rule.** 皇家蓝是唯一品牌主声部；禁止用泛 AI 紫色、蓝紫霓虹或多彩渐变制造“智能感”。

**The Light-by-Default Rule.** 除恒深色品牌首屏和用户主动选择的暗色主题外，面向用户的官网默认使用浅色表面。

**The Gold Is Punctuation Rule.** 暖金像标点一样稀少，只强化特定信息，不铺满按钮、标题或大面积背景。

## Typography

**Display Font:** 中文系统无衬线字体栈，以 PingFang SC 为首选，并回退到 Microsoft YaHei、Noto Sans SC 与系统字体。

**Body Font:** 与展示字体使用同一中文系统无衬线字体栈，依靠字号、字重和行高建立层级。

**Label/Mono Font:** 标签沿用中文系统字体；代码与协议片段使用 JetBrains Mono、Fira Code、SF Mono、Menlo 的等宽回退栈。

**Character:** 字体表达应直接、现代、跨平台稳定，不通过外来西文字体制造技术感。中文排版优先保证字形质量和阅读节奏。

### Hierarchy

- **Display**（粗体、响应式大字号、紧凑行高）：只用于首页 Slogan 和少量首屏品牌表达。
- **Headline**（粗体、响应式标题、紧凑字距）：用于逐屏主张和页面级标题，优先控制在两行内。
- **Title**（半粗、小标题尺度）：用于卡片标题、关键数字和主要按钮文字。
- **Body**（常规、正文尺度、舒展行高）：用于解释产品价值与操作含义；长段落控制在约 65–75 个拉丁字符的视觉宽度内。
- **Label**（半粗、辅助尺度）：用于眉题、标签、导航和短状态，不以全大写英文制造层级。

### Named Rules

**The Native Chinese Rule.** 禁止使用 Inter；中文系统字体始终排在字体栈最前，并在 macOS、Windows 和 Linux 上保持可靠回退。

**The Size Is Not Hierarchy Rule.** 正文不得小于正常阅读尺度；层级优先通过字重、颜色和间距建立，辅助文字才使用更小字号。

## Layout

营销页面采用居中单列叙事与响应式网格结合的空间模型。常规内容容器约为 1152px，导航和高密度比较区可扩展至 1280px；正文说明收窄到约 672–768px，避免长行阅读。页面水平留白从移动端 16–24px 逐步增加到桌面端 32–48px。

常规章节使用 96px 的上下节奏，大屏提升到 128px。卡片网格从单列过渡到双列、三列或五列；比较表在大屏保留横向结构，在小屏改为逐项卡片，不依赖横向滚动完成主要阅读。主要响应断点沿用 Tailwind 的 640px、768px、1024px 和 1280px。

**The One Screen, One Claim Rule.** 每个营销屏先表达一个主张，再用不超过一组证据或一个结构化组件支撑；不要把多个同权重区块塞进同一视觉层级。

## Elevation & Depth

系统采用“色阶分层为主、状态抬升为辅”的混合方式。静止表面主要通过画布、面板、浮层色阶和 1px 细边框建立深度；常态卡片不依赖浓重阴影。悬停、聚焦、推荐方案和悬浮助手可以出现低透明度皇家蓝环境光，模态框和菜单则使用结构性阴影确保覆盖关系。

### Shadow Vocabulary

- **蓝色环境微光**（`0 0 18–24px rgba(37, 99, 235, 0.10–0.15)`）：只用于可交互卡片的悬停、选中或推荐状态。
- **行动聚光**（`0 0 24px rgba(37, 99, 235, 0.40–0.45)`）：只用于深空首屏或关键 CTA 的悬停反馈。
- **浮层结构阴影**（浏览器/Tailwind 的 `shadow-lg` 与 `shadow-2xl`）：用于菜单、对话框和浮动帮助面板，表达真实覆盖关系。

### Named Rules

**The Flat-at-Rest Rule.** 普通卡片静止时保持安静；只有交互、焦点或明确的优先级才获得蓝色环境光。

**The Glow Must Explain Rule.** 每一道辉光都必须解释“可点击、已选中或品牌焦点”之一；纯装饰辉光应删除。

## Shapes

形状语言以轻柔但不软弱的圆角矩形为主。8px 用于按钮、输入框、导航项和小控件；12px 用于常规卡片；16px 用于大容器、弹窗和叙事面板；胶囊形只用于标签、状态与短特征。品牌图标保留约 10px 的专用圆角。

边框通常为 1px 中性线，选中或推荐状态可提升为品牌蓝或 2px 强调线。形状应服务分组和交互，不使用任意不对称切角、过度胶囊化或大面积玻璃拟态。

## Components

### Buttons

- **Shape:** 笃定的中等圆角矩形（8px），主 CTA 使用宽松的 12px × 32px 内边距。
- **Primary:** 纯色星轨皇家蓝背景、白色半粗文字；新组件优先使用纯色，不以渐变代替品牌主色。
- **Hover / Focus:** 悬停转为深轨皇家蓝；深空关键 CTA 可增加一次轻微蓝色聚光。键盘焦点必须有清晰的皇家蓝焦点环。
- **Secondary / Ghost:** 透明或面板背景配中性边框，悬停时提升文字和边框对比，不争夺主操作层级。

### Chips

- **Style:** 皇家蓝低透明度底色配皇家蓝文字，或在深空中使用低透明白色表面；只承载短标签和特征。
- **State:** 选中状态可使用实心皇家蓝；不可用胶囊代替普通按钮或长句容器。

### Cards / Containers

- **Corner Style:** 常规卡片使用 12px，大型叙事面板使用 16px。
- **Background:** 默认使用主题面板色，次级区块使用浮层色或低透明度品牌底色。
- **Shadow Strategy:** 静止时依靠色阶和边框；交互时才出现蓝色环境微光。
- **Border:** 默认 1px 分隔色，选中或推荐态使用皇家蓝边框。
- **Internal Padding:** 常规 24px，信息密集卡片可使用 20px，大型叙事面板可增加到 32px。

### Inputs / Fields

- **Style:** 8px 圆角、主题输入底色、1px 中性边框，正文与占位文字保持明确对比。
- **Focus:** 容器边框切换为皇家蓝，并提供可见焦点环；不能只依赖颜色极轻的变化。
- **Error / Disabled:** 错误文案就近出现并使用明确错误色；禁用态降低强调度但保持可读，光标与交互状态必须同步。

### Navigation

顶部导航在首页首屏透明覆盖深空背景，滚动后转为带细分隔线和背景模糊的主题表面。桌面端使用紧凑的 8px 圆角导航项；当前路由通过字重与主文字色确认。移动端折叠为纵向菜单，点击路由后关闭，主题切换与登录入口保持可达。

### Starfield Hero

首页恒深色首屏是品牌签名组件：皇家蓝调深空、八角星核、稀疏轨道节点和缓慢呼吸动效共同建立“星辰被唤醒”的瞬间。正文必须保持高对比，星光动画不得遮挡 CTA，也不得扩散成全站霓虹背景。

## Do's and Don'ts

### Do:

- **Do** 使用纯皇家蓝统一主按钮、关键链接、焦点和当前状态。
- **Do** 让浅色界面承担主要阅读与操作，只在品牌首屏和明确的暗色主题中使用深空表面。
- **Do** 使用 8px、12px、16px 的分级圆角和 1px 细边框建立稳定组件秩序。
- **Do** 让动效解释进入、状态变化或可操作性，并尊重用户的减弱动态效果偏好。
- **Do** 使用中文系统字体栈，确保跨平台中文清晰自然。

### Don't:

- **Don't** 使用 Inter，或让远程西文字体排在中文系统字体之前。
- **Don't** 使用泛 AI 紫色、蓝紫渐变、霓虹过载和大面积玻璃拟态作为品牌门面。
- **Don't** 把所有内容做成同权重 SaaS 卡片墙；每一屏必须有明确主张与证据层级。
- **Don't** 让常态卡片普遍悬浮，也不要用浓重阴影掩盖缺失的空间层级。
- **Don't** 为了“科技感”堆叠粒子、发光描边、无限循环动效或难以解释的装饰线。
