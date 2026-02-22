# 唤星 HuanXing — UI 设计规范

---

## 一、设计原则

### 1.1 沉浸感

界面应该让用户感觉置身于星空之中，而不是在使用一个普通的聊天软件。深色主题不是为了酷，而是为了让用户专注于与分身的对话。

### 1.2 呼吸感

留白是设计的一部分。不要把每个像素都填满信息。让界面有呼吸的空间，像夜空中星星之间的距离。

### 1.3 流动感

所有过渡和动画都应该是流畅的、自然的，像星光的流动。避免生硬的切换和突兀的弹窗。

### 1.4 一致性

所有界面元素遵循统一的设计语言。用户在任何页面都应该感觉"这是唤星"。

---

## 二、色彩系统

### 2.1 主色板

**品牌色**
- 星紫 Primary：#6C5CE7
- 星紫 Hover：#5A4BD5
- 星紫 Active：#4A3BC3
- 星紫 Light：#6C5CE7 (opacity 15%)

**辅助色**
- 星蓝 Secondary：#00D2FF
- 星蓝 Hover：#00B8E6
- 星蓝 Active：#009ECC
- 星蓝 Light：#00D2FF (opacity 15%)

**强调色**
- 星光金 Accent：#FFD93D
- 星光金 Hover：#FFC800
- 星光金 Light：#FFD93D (opacity 15%)

### 2.2 中性色板

**背景层级**（从深到浅）
- Level 0 深空：#0D1117（主背景）
- Level 1 星幕：#161B22（卡片/面板背景）
- Level 2 星尘：#1C2128（悬浮层/弹窗背景）
- Level 3 星雾：#242A33（输入框/交互区域背景）

**文字层级**（从亮到暗）
- Text Primary：#E6EDF3（主要文字）
- Text Secondary：#8B949E（次要文字/说明）
- Text Tertiary：#6E7681（占位符/禁用文字）
- Text Inverse：#0D1117（亮色背景上的文字）

**边框与分割**
- Border Default：#30363D
- Border Hover：#484F58
- Border Active：#6C5CE7
- Divider：#21262D

### 2.3 语义色

**状态色**
- 成功 Success：#3FB950
- 警告 Warning：#D29922
- 错误 Error：#F85149
- 信息 Info：#58A6FF

**在线状态**
- 在线：#3FB950
- 忙碌：#D29922
- 离线：#6E7681
- 待机：#6C5CE7 (breathing animation)

### 2.4 渐变

**品牌渐变**
- Primary Gradient：linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)
- 用途：品牌标识、关键按钮、重要强调

**背景渐变**
- BG Gradient：linear-gradient(180deg, #0D1117 0%, #161B22 100%)
- 用途：页面背景，增加层次感

**星光渐变**
- Glow Gradient：radial-gradient(circle, #FFD93D 0%, transparent 70%)
- 用途：星光效果、高亮提示

---

## 三、字体系统

### 3.1 字体族

**中文主字体**
- 首选：PingFang SC（macOS/iOS）
- 备选：Microsoft YaHei（Windows）
- 兜底：Noto Sans SC（Linux/Web）

**英文/数字字体**
- 首选：Inter
- 备选：SF Pro Text
- 兜底：system-ui

**等宽字体**（代码/技术内容）
- 首选：JetBrains Mono
- 备选：SF Mono
- 兜底：monospace

**CSS Font Stack**

```css
--font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;
```

### 3.2 字号体系

**标题**
- H1：28px / line-height 36px / font-weight 700
- H2：22px / line-height 30px / font-weight 600
- H3：18px / line-height 26px / font-weight 600
- H4：16px / line-height 24px / font-weight 600

**正文**
- Body Large：16px / line-height 24px / font-weight 400
- Body：14px / line-height 22px / font-weight 400
- Body Small：13px / line-height 20px / font-weight 400

**辅助**
- Caption：12px / line-height 18px / font-weight 400
- Overline：11px / line-height 16px / font-weight 600 / letter-spacing 0.5px / uppercase

---

## 四、间距系统

### 4.1 基础单位

基础单位：4px

**间距梯度**
- xs：4px
- sm：8px
- md：12px
- lg：16px
- xl：24px
- 2xl：32px
- 3xl：48px
- 4xl：64px

### 4.2 应用规则

- 组件内部间距：sm(8px) ~ md(12px)
- 组件之间间距：lg(16px) ~ xl(24px)
- 区块之间间距：2xl(32px) ~ 3xl(48px)
- 页面边距：xl(24px)（桌面端）/ lg(16px)（移动端）

---

## 五、圆角系统

- 小圆角 sm：4px（标签、小按钮）
- 中圆角 md：8px（卡片、输入框、按钮）
- 大圆角 lg：12px（弹窗、面板）
- 超大圆角 xl：16px（模态框、大卡片）
- 全圆角 full：9999px（头像、状态指示器、药丸标签）

---

## 六、阴影系统

**深色主题阴影**（使用发光效果代替传统阴影）

- Shadow SM：0 0 8px rgba(108, 92, 231, 0.1)
- Shadow MD：0 0 16px rgba(108, 92, 231, 0.15)
- Shadow LG：0 0 32px rgba(108, 92, 231, 0.2)
- Shadow Glow：0 0 20px rgba(255, 217, 61, 0.3)（星光发光效果）

---

## 七、组件规范

### 7.1 按钮

**主要按钮 Primary**
- 背景：品牌渐变 linear-gradient(135deg, #6C5CE7, #00D2FF)
- 文字：#FFFFFF
- 圆角：8px
- 高度：40px（默认）/ 36px（紧凑）/ 48px（大号）
- 内边距：0 24px
- Hover：亮度提升 10%
- Active：亮度降低 5%
- Disabled：opacity 0.4

**次要按钮 Secondary**
- 背景：transparent
- 边框：1px solid #30363D
- 文字：#E6EDF3
- Hover：背景 #161B22，边框 #484F58
- Active：背景 #1C2128

**幽灵按钮 Ghost**
- 背景：transparent
- 边框：none
- 文字：#8B949E
- Hover：文字 #E6EDF3，背景 rgba(255,255,255,0.05)

**危险按钮 Danger**
- 背景：#F85149
- 文字：#FFFFFF
- Hover：#F9665F

### 7.2 输入框

- 背景：#242A33
- 边框：1px solid #30363D
- 文字：#E6EDF3
- 占位符：#6E7681
- 圆角：8px
- 高度：40px
- 内边距：0 12px
- Focus：边框 #6C5CE7，外发光 0 0 0 3px rgba(108,92,231,0.2)
- Error：边框 #F85149，外发光 0 0 0 3px rgba(248,81,73,0.2)

### 7.3 聊天气泡

**分身消息（左侧）**
- 背景：#161B22
- 边框：1px solid #21262D
- 文字：#E6EDF3
- 圆角：2px 12px 12px 12px
- 最大宽度：75%
- 标识：左上角 ✦ 星标，颜色 #6C5CE7

**用户消息（右侧）**
- 背景：linear-gradient(135deg, #6C5CE7, #5A4BD5)
- 文字：#FFFFFF
- 圆角：12px 2px 12px 12px
- 最大宽度：75%

### 7.4 卡片

- 背景：#161B22
- 边框：1px solid #21262D
- 圆角：12px
- 内边距：16px
- Hover：边框 #30363D，微弱发光

### 7.5 头像/星标

**分身头像**
- 形状：圆形
- 尺寸：36px（聊天）/ 48px（设置）/ 24px（紧凑）
- 默认：星形图标 + 品牌渐变背景
- 边框：2px solid，颜色随分身等级变化
  - 星尘：#6E7681
  - 星芒：#6C5CE7
  - 星辰：#00D2FF
  - 星耀：#FFD93D

---

## 八、动效规范

### 8.1 基础过渡

- 快速：150ms ease-out（hover、focus 等即时反馈）
- 标准：250ms ease-in-out（面板展开、页面切换）
- 缓慢：400ms ease-in-out（模态框、重要状态变化）

### 8.2 特殊动效

**星光呼吸**
- 用途：分身在线状态、加载等待
- 效果：opacity 在 0.6 ~ 1.0 之间循环
- 周期：2s
- 缓动：ease-in-out

**星光粒子**
- 用途：启动画面、重要时刻（分身升级等）
- 效果：微小光点随机漂浮
- 颜色：#FFD93D，opacity 0.3 ~ 0.8
- 数量：20-50 个粒子

**唤醒动画**
- 用途：首次启动、分身苏醒
- 效果：中心光点从暗到亮，向外扩散光芒
- 时长：1.5s
- 配合：微弱的脉冲震动（移动端）

**消息出现**
- 用途：新消息进入聊天区域
- 效果：从下方滑入 + 淡入
- 时长：250ms
- 位移：translateY(8px) → translateY(0)

### 8.3 加载状态

**分身思考中**
- 效果：三个光点依次闪烁（类似打字指示器）
- 光点颜色：#6C5CE7
- 闪烁间隔：300ms
- 配合文字："你的星正在思考..."

---

## 九、图标系统

### 9.1 图标风格

- 风格：线性图标（Outline），1.5px 描边
- 尺寸：16px / 20px / 24px
- 颜色：继承文字颜色
- 推荐图标库：Lucide Icons（开源、风格统一、支持 React）

### 9.2 品牌图标

- 星标 ✦：用于分身消息标识、品牌元素
- 星形：用于等级、收藏、重要标记
- 光芒：用于唤醒、激活、新功能提示

---

## 十、响应式断点

- 紧凑：< 640px（移动端竖屏）
- 标准：640px ~ 1024px（平板/小窗口）
- 宽屏：1024px ~ 1440px（桌面端标准）
- 超宽：> 1440px（大屏幕）

**桌面端 Electron 窗口**
- 最小尺寸：800 × 600px
- 默认尺寸：1200 × 800px
- 侧边栏宽度：280px（可折叠）

---

## 十一、无障碍（Accessibility）

### 11.1 对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大标题与背景对比度 ≥ 3:1
- 交互元素与背景对比度 ≥ 3:1

### 11.2 键盘导航

- 所有交互元素可通过 Tab 键聚焦
- Focus 状态有明显的视觉指示（星紫色外发光）
- 支持 Escape 关闭弹窗/面板
- 支持 Enter 确认操作

### 11.3 屏幕阅读器

- 所有图标配有 aria-label
- 动态内容更新使用 aria-live
- 聊天消息标注发送者角色

---

## 十二、暗色/亮色模式

**MVP 阶段仅支持暗色模式**（与品牌调性一致）

未来亮色模式预留：
- 背景：#F6F8FA → #FFFFFF
- 文字：#1F2328 → #656D76
- 品牌色保持不变
- 渐变和发光效果调整为更柔和的版本

---

*文档版本：v1.0*
*创建日期：2026-02-21*
*作者：大聪明 × 福仔*
