# 唤星 HuanXing 隐私政策 / Privacy Policy

> 版本 / Version: v1.0（M1 草案 · 2026-04-21）
> 生效日期 / Effective Date: 2026-05-01
> 适用产品 / Applies To: 唤星 Android App（com.huanxing.app） · 唤星 Web
> 运营主体 / Operator: 唤星（公司主体以工商登记为准）
> 联系方式 / Contact: privacy@huanxing.ai

---

## 中文版（以中文版为准）

### 1. 我们是谁

唤星（HuanXing）是一款 AI 数字分身产品。本政策说明我们**收集哪些信息**、**为什么收集**、**保留多久**、**与哪些第三方共享**，以及**您如何行使访问、更正、删除、导出权利**。

### 2. 我们收集的信息

| 类别 | 具体字段 | 何时收集 | 是否必要 |
|------|---------|---------|---------|
| **账户信息** | 手机号 / 邮箱、密码哈希、昵称 | 注册、登录时 | 必要 |
| **身份凭据** | JWT、owner_api_key（仅存储您本地设备的 Android Keystore / iOS Keychain） | 登录成功后 | 必要 |
| **设备信息** | 设备型号、操作系统版本、分辨率、语言、时区、匿名设备 ID | App 启动、崩溃上报时 | 必要（崩溃诊断、兼容性） |
| **网络信息** | IP 地址、网络类型（WiFi / 蜂窝） | API 请求时 | 必要（反滥用、路由选择） |
| **对话 / 记忆内容** | 您与分身的聊天记录、文档、偏好、记忆片段 | 使用产品时 | 必要（产品核心功能） |
| **崩溃日志** | 堆栈、发生时间、出错模块；**已脱敏**（凭据、消息正文不上报） | App 崩溃时 | 可选（可关闭） |
| **使用埋点** | 页面访问、按钮点击、功能使用频率 | 使用产品时 | 可选（可关闭） |
| **推送令牌** | 手机厂商推送通道 Token（小米 / 华为 / OPPO / vivo / 魅族） | 授权通知后 | 可选（用于推送） |

> **我们不收集**：您的通讯录、相册（除非您主动授权导入）、精确位置、麦克风录音、健康数据、人脸生物特征。

### 3. 我们如何使用这些信息

- **提供核心功能**：让分身"记住"您、回答您、替您做事。
- **账户安全**：登录验证、异常登录提醒、令牌吊销。
- **崩溃诊断**：复现问题、修复 Bug（仅脱敏堆栈，不含消息正文）。
- **产品改进**：统计功能使用频率，决定迭代方向（聚合后分析，不关联到个人）。
- **推送通知**：发送消息提醒、订阅到期提醒（**推送正文不包含对话内容**）。
- **法律合规**：按法律要求配合监管部门。

### 4. 我们如何共享您的信息

我们**不出售**您的个人信息。在以下有限场景会共享：

| 接收方 | 场景 | 共享内容 | 法律依据 |
|--------|------|---------|---------|
| **友盟+（U-Push / U-App）** | 推送通道路由 + 匿名使用统计 | 匿名设备 ID、推送 Token、事件名 | 履行合同 |
| **腾讯 Bugly** | 崩溃诊断 | 脱敏堆栈、设备型号、App 版本 | 合法利益 |
| **手机厂商推送（小米 / 华为 / OPPO / vivo / 魅族）** | 厂商级推送通道 | 推送 Token、推送标题（**无正文**） | 履行合同 |
| **云服务提供商（阿里云 / 腾讯云）** | 服务器托管 | 加密存储的业务数据 | 履行合同 |
| **监管部门** | 法律强制要求 | 具体请求范围内的数据 | 法律义务 |

### 5. 我们保留信息多久

| 数据类型 | 保留期 | 到期处理 |
|---------|--------|---------|
| 账户信息 | 账户存续期间 + 注销后 30 天宽限期 | 物理删除 |
| 对话 / 记忆内容 | 账户存续期间 | 账户注销后 30 天内删除 |
| 崩溃日志 | 90 天 | 自动滚动删除 |
| 使用埋点 | 180 天 | 自动滚动删除 |
| 支付记录 | 5 年（税务合规） | 到期后匿名化 |
| 登录日志 | 180 天 | 自动滚动删除 |

### 6. 您的权利

依据《个人信息保护法》《民法典》等法律，您有权：

- **访问**：查看我们持有的您的个人信息副本（App 内 "设置 - 我的数据" 可导出 JSON）。
- **更正**：更新不准确的信息。
- **删除**：注销账户或单独请求删除某类数据（privacy@huanxing.ai）。
- **导出**：以机器可读格式（JSON）下载您的数据。
- **撤回同意**：关闭埋点 / 崩溃上报 / 推送通知（App 设置内自助）。
- **投诉**：向网信办或所在地消费者协会投诉；也可以联系我们：privacy@huanxing.ai。

### 7. 数据安全

- 传输层：全站 HTTPS（TLS 1.3）。
- 存储层：密码走 Argon2id；凭据（owner_api_key、JWT）存储于设备 Android Keystore / iOS Keychain，**从不明文落盘**、**从不通过带外通道传输**。
- 访问控制：最小权限原则；审计日志留痕 180 天。
- 崩溃上报：堆栈中敏感字段（owner_api_key / JWT / 手机号）自动脱敏为 `***REDACTED***`。

### 8. 未成年人

本产品不面向 14 周岁以下儿童。如发现收集了儿童信息，我们会立即删除。家长/监护人如发现未成年人使用，请联系 privacy@huanxing.ai。

### 9. 政策变更

本政策更新时，我们会通过 App 内弹窗 + 邮件通知。重大变更生效前 15 天发出。历史版本保留在 https://huanxing.ai/privacy/history 。

### 10. 联系我们

- 邮件 / Email：privacy@huanxing.ai
- 官网 / Website：https://huanxing.ai
- 数据保护负责人 / DPO：dpo@huanxing.ai

---

## English Version (Chinese version prevails in case of discrepancy)

### 1. Who We Are

HuanXing is an AI digital-avatar product. This policy explains **what information we collect**, **why**, **how long we keep it**, **with whom we share it**, and **how you can exercise your rights** of access, correction, deletion, and portability.

### 2. Information We Collect

| Category | Specific Fields | Collected When | Required? |
|---|---|---|---|
| **Account** | Phone / email, password hash, nickname | Sign-up, login | Required |
| **Credentials** | JWT, owner_api_key (stored only in your device's Android Keystore / iOS Keychain) | After login | Required |
| **Device** | Model, OS version, resolution, language, timezone, anonymous device ID | App launch, crash report | Required (diagnostics, compatibility) |
| **Network** | IP address, connection type (WiFi / cellular) | On API request | Required (anti-abuse, routing) |
| **Conversations / Memory** | Chats, documents, preferences, memory fragments with your avatar | In-app usage | Required (core product) |
| **Crash Logs** | Stack trace, time, failing module; **redacted** (no credentials, no message bodies) | On app crash | Optional (can be disabled) |
| **Analytics Events** | Page views, button clicks, feature usage frequency | In-app usage | Optional (can be disabled) |
| **Push Tokens** | Manufacturer push channel tokens (Xiaomi / Huawei / OPPO / vivo / Meizu) | After notification permission | Optional (for push) |

> **We do NOT collect**: contacts, photo library (unless you import), precise location, microphone recordings, health data, biometric facial features.

### 3. How We Use This Information

- **Deliver core features**: Let your avatar remember you, answer you, act for you.
- **Account security**: Login validation, anomaly alerts, token revocation.
- **Crash diagnostics**: Reproduce & fix bugs (redacted stack only, no message bodies).
- **Product improvement**: Aggregate feature-usage stats to guide iteration (no personal attribution).
- **Push notifications**: Message alerts, subscription renewals (**push bodies never contain chat content**).
- **Legal compliance**: Regulatory requests within lawful scope.

### 4. How We Share Your Information

We **do not sell** your personal information. We share in limited scenarios:

| Recipient | Purpose | Shared Content | Legal Basis |
|---|---|---|---|
| **Umeng+ (U-Push / U-App)** | Push routing + anonymous usage stats | Anonymous device ID, push token, event names | Contract performance |
| **Tencent Bugly** | Crash diagnostics | Redacted stack, device model, app version | Legitimate interest |
| **OEM Push (Xiaomi/Huawei/OPPO/vivo/Meizu)** | Vendor-level push channels | Push token, push title (**no body**) | Contract performance |
| **Cloud providers (Alibaba / Tencent Cloud)** | Server hosting | Encrypted business data | Contract performance |
| **Regulatory authorities** | Legal mandate | Data within the specific request scope | Legal obligation |

### 5. How Long We Keep Information

| Data Type | Retention | Upon Expiry |
|---|---|---|
| Account info | For account lifetime + 30-day grace after closure | Physical deletion |
| Conversations / memory | For account lifetime | Deleted within 30 days after account closure |
| Crash logs | 90 days | Automatic rolling deletion |
| Analytics events | 180 days | Automatic rolling deletion |
| Payment records | 5 years (tax compliance) | Anonymized after expiry |
| Login logs | 180 days | Automatic rolling deletion |

### 6. Your Rights

Under applicable law (China PIPL, Civil Code, and equivalent regulations elsewhere), you have the right to:

- **Access**: View a copy of your personal data (in-app "Settings → My Data" exports JSON).
- **Correct**: Update inaccurate information.
- **Delete**: Close your account or delete specific data categories (privacy@huanxing.ai).
- **Export**: Download your data in a machine-readable format (JSON).
- **Withdraw consent**: Disable analytics / crash reporting / push in app settings.
- **Complain**: To the Cyberspace Administration or your local consumer protection authority; or contact us: privacy@huanxing.ai.

### 7. Data Security

- **In transit**: site-wide HTTPS (TLS 1.3).
- **At rest**: passwords use Argon2id; credentials (owner_api_key, JWT) are stored in device Android Keystore / iOS Keychain — **never written in plaintext**, **never transmitted out-of-band**.
- **Access control**: principle of least privilege; audit logs retained 180 days.
- **Crash redaction**: sensitive fields (owner_api_key / JWT / phone numbers) auto-redacted to `***REDACTED***`.

### 8. Minors

This product is not intended for children under 14. If we discover such collection, we will delete it immediately. Parents / guardians please contact privacy@huanxing.ai.

### 9. Changes to This Policy

When we update this policy we notify you via in-app modal + email. Material changes take effect 15 days after notice. Historical versions are kept at https://huanxing.ai/privacy/history .

### 10. Contact Us

- Email: privacy@huanxing.ai
- Website: https://huanxing.ai
- Data Protection Officer: dpo@huanxing.ai

---

*本文档为 M1 草案，发布前需法务过目。Last reviewed: 2026-04-21.*
