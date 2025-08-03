# 🔗 FaviconSnap - 完整中文文档

**基于 Cloudflare Workers 的免费、快速、可靠的网站图标获取 API 服务**

[🇺🇸 English README](README.md) | [🌐 在线服务](https://faviconsnap.com/zh)

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/websitesnap/faviconsnap?style=social)](https://github.com/websitesnap/faviconsnap)

## 📑 目录

- [功能特点](#功能特点)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [部署指南](#部署指南)
- [缓存系统](#缓存系统)
- [配置指南](#配置指南)
- [性能监控](#性能监控)
- [故障排查](#故障排查)
- [贡献指南](#贡献指南)
- [更新日志](#更新日志)

## ✨ 功能特点

- 🚀 **超快响应**：全球边缘部署，20-50ms 响应时间
- 🌍 **全球加速**：200+ 边缘节点，就近响应用户请求
- ⚡ **三层缓存**：浏览器 → 边缘 → KV 存储，95%+ 缓存命中率
- 🔄 **智能回退**：多重图标源保证 99.9% 成功率
- 📱 **多种格式**：支持图片、JSON、重定向三种返回格式
- 🛡️ **CORS 支持**：可直接在网页中调用
- 💰 **免费套餐**：每天 100,000 次请求免费
- 🔧 **易于部署**：一键部署到 Cloudflare Workers
- 📊 **实时监控**：完整的性能指标和日志
- 🎨 **现代界面**：响应式前端界面

## 🚀 快速开始

### 基础使用

```bash
# 获取 JSON 格式响应
curl "https://faviconsnap.com/api/favicon?url=https://www.google.com"

# 直接重定向到图标文件
curl "https://faviconsnap.com/api/favicon?url=https://www.google.com&format=redirect"

# 指定图标大小
curl "https://faviconsnap.com/api/favicon?url=https://www.google.com&size=64"
```

### JavaScript 集成

```javascript
// 获取详细信息
async function getFavicon(url) {
  const response = await fetch(`https://faviconsnap.com/api/favicon?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('图标URL:', data.favicon);
    console.log('缓存状态:', data.cached);
    console.log('响应时间:', data.cached ? '快速' : '正常');
  }
  
  return data;
}

// 直接在图片标签中使用
function setFavicon(url, imgElement) {
  imgElement.src = `https://faviconsnap.com/api/favicon?url=${encodeURIComponent(url)}&format=redirect`;
  imgElement.onerror = () => {
    imgElement.src = '/default-favicon.ico'; // 备用图标
  };
}
```

### HTML 使用示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>FaviconSnap 示例</title>
</head>
<body>
    <!-- 直接在 img 标签中使用 -->
    <img src="https://faviconsnap.com/api/favicon?url=https://www.baidu.com&format=redirect" 
         alt="百度" width="32" height="32">
    
    <!-- 动态加载示例 -->
    <div id="site-list"></div>
    
    <script>
        const sites = ['github.com', 'stackoverflow.com', 'zhihu.com'];
        const container = document.getElementById('site-list');
        
        sites.forEach(async (site) => {
            const data = await fetch(`https://faviconsnap.com/api/favicon?url=https://${site}`).then(r => r.json());
            
            if (data.success) {
                container.innerHTML += `
                    <div>
                        <img src="${data.favicon}" width="32" height="32" alt="${site}">
                        <span>${site}</span>
                        <small>(${data.cached ? '缓存' : '实时'})</small>
                    </div>
                `;
            }
        });
    </script>
</body>
</html>
```

## 📖 API 文档

### 接口地址

```
GET https://faviconsnap.com/api/favicon
```

### 请求参数

| 参数 | 类型 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| `url` | string | ✅ | 目标网站的URL | - |
| `size` | number | ❌ | 图标大小 (16/32/64/128) | 32 |
| `format` | string | ❌ | 响应格式 (json/redirect) | json |
| `nocache` | boolean | ❌ | 跳过缓存，强制重新获取 | false |

### 响应格式

#### JSON 格式响应 (默认)

```json
{
  "success": true,          // 是否成功
  "url": "https://www.google.com",     // 原始URL
  "favicon": "https://www.google.com/favicon.ico", // 图标URL
  "size": "32x32",          // 图标尺寸
  "source": "direct",       // 图标来源 (html/direct/google/yandex)
  "cached": true,           // 是否来自缓存
  "cacheSource": "kv",      // 缓存来源 (kv/edge/none)
  "cachedAt": "2024-01-15T10:30:00Z"  // 缓存时间
}
```

#### 重定向格式响应 (format=redirect)

```http
HTTP/1.1 302 Found
Location: https://www.google.com/favicon.ico
X-Favicon-Source: direct
X-Favicon-Cached: true
```

#### 错误响应

```json
{
  "success": false,
  "error": "无效的URL格式"
}
```

### 支持的图标类型

- **标准 favicon** (`/favicon.ico`)
- **PNG 格式图标** (`/favicon.png`)
- **Apple Touch Icon** (`/apple-touch-icon.png`)
- **HTML link 标签** (`<link rel="icon">`)
- **Google S2 服务** (备选方案)
- **Yandex 服务** (备选方案)

## 🏗️ 部署指南

### 环境要求

- [Node.js](https://nodejs.org/) 版本 16 或更高
- [Cloudflare 账户](https://cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### 快速部署

#### 智能部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/websitesnap/faviconsnap.git
cd faviconsnap

# 2. 登录 Cloudflare
wrangler auth login

# 3. 智能部署 - 自动检测并配置一切
./deploy.sh
```

#### 高级选项

```bash
# 强制重新配置所有设置（KV 存储、配置文件等）
./deploy.sh --setup

# 仅部署（跳过配置检查）
./deploy.sh --deploy-only

# 跳过部署后测试
./deploy.sh --skip-tests

# 查看所有选项
./deploy.sh --help
```

#### 手动部署（备选方案）

```bash
# 手动配置
cp wrangler.toml.example wrangler.toml
# 编辑 wrangler.toml 文件，填入实际配置
wrangler deploy
```

> 💡 **智能部署**: `deploy.sh` 脚本能智能检测你的配置状态，自动决定是初始化配置还是直接部署。详细说明请参见 `DEPLOY_USAGE.md`。

### 自定义域名配置

#### 1. 添加域名到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 "添加站点"
3. 输入域名并按指示配置 DNS

#### 2. 配置 wrangler.toml

```toml
# 修改项目名称
name = "your-faviconsnap"

# 添加自定义域名路由
[env.production]
name = "your-faviconsnap-prod"
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" },
  { pattern = "www.your-domain.com/*", zone_name = "your-domain.com" }
]
```

#### 3. 重新部署

```bash
wrangler deploy --env production
```

### 本地开发

```bash
# 启动本地开发服务器
npm run dev
# 或
wrangler dev

# 访问 http://localhost:8787 测试
```

## ⚡ 缓存系统

### 三层缓存架构

```
用户请求 → [浏览器缓存] → [Cloudflare边缘缓存] → [KV存储缓存] → 实际获取
             1-2小时          1小时              7天
```

### 系统架构

FaviconSnap 采用三层缓存架构，提供最佳性能：

| 缓存层级 | 缓存时长 | 作用 |
|---------|---------|------|
| 浏览器缓存 | 2小时 | 客户端快速响应 |
| 边缘缓存 | 1小时 | 全球节点就近服务 |
| KV 存储 | 7天 | 持久化存储，高命中率 |

**性能表现**：
- 响应时间：20-50ms（缓存命中时）
- 缓存命中率：95%+
- 全球可用性：99.9%

### 智能部署功能

智能部署脚本自动完成：

- **配置检测**: 检查 wrangler.toml 是否存在并正确配置
- **KV 存储创建**: 需要时自动创建和配置 KV 命名空间
- **设置验证**: 执行全面的部署前检查
- **部署测试**: 部署后验证功能是否正常
- **详细反馈**: 显示详细部署信息和故障排查提示

#### 手动配置 KV 存储

1. **创建 KV 存储**

```bash
# 创建 KV 命名空间
wrangler kv:namespace create FAVICON_CACHE
```

2. **更新配置文件**

```bash
# 复制配置文件模板
cp wrangler.toml.example wrangler.toml

# 编辑 wrangler.toml，替换占位符为实际值
# YOUR_KV_ID_HERE -> 实际的 KV ID
# your-faviconsnap -> 你的项目名称
# your-domain.com -> 你的域名（如果使用自定义域名）
```

3. **使用默认代码**

项目默认包含完整的三层缓存功能，无需额外配置。

4. **重新部署**

```bash
wrangler deploy
```

### 缓存管理

```bash
# 查看缓存内容
wrangler kv:key list --binding FAVICON_CACHE

# 查看特定缓存
wrangler kv:key get "favicon:google.com:32" --binding FAVICON_CACHE

# 清除特定缓存
wrangler kv:key delete "favicon:google.com:32" --binding FAVICON_CACHE

# 强制刷新缓存
curl "https://your-domain.com/api/favicon?url=https://google.com&nocache=true"
```

## 🔧 配置指南

### wrangler.toml 配置详解

```toml
# 基础配置
name = "faviconsnap"
main = "src/index.js"
compatibility_date = "2024-01-01"

# KV 存储绑定
[[kv_namespaces]]
binding = "FAVICON_CACHE"
id = "your-kv-id"

# 生产环境配置
[env.production]
name = "faviconsnap-prod"
routes = [
  { pattern = "faviconsnap.com/*", zone_name = "faviconsnap.com" },
  { pattern = "www.faviconsnap.com/*", zone_name = "faviconsnap.com" }
]

# 环境变量
[vars]
ENVIRONMENT = "production"
CACHE_TTL = "604800"  # 7天缓存

# 性能限制
[limits]
cpu_ms = 100  # CPU 时间限制（毫秒）
```

### 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ENVIRONMENT` | 运行环境 | "production" |
| `CACHE_TTL` | KV 缓存时间（秒） | "604800" (7天) |

## 📊 性能监控

### 监控指标

- **响应时间**：目标 <50ms (缓存命中)，<500ms (缓存未命中)
- **缓存命中率**：目标 >90%
- **错误率**：目标 <1%
- **可用性**：目标 99.9%

### 监控工具

```bash
# 实时日志监控
wrangler tail

# 查看部署状态
wrangler status

# 查看部署历史
wrangler deployments list
```

### Cloudflare Dashboard 监控

访问 [Cloudflare Dashboard](https://dash.cloudflare.com) > Workers & Pages：

- 📊 请求数量和性能指标
- 🚨 错误率和状态码分布
- 📈 CPU 使用时间统计
- 💰 成本使用情况

### 性能优化建议

1. **启用增强缓存**：显著提升响应速度
2. **设置合理的 CPU 限制**：避免超时和高费用
3. **监控缓存命中率**：调整缓存策略
4. **使用 CDN**：Cloudflare 自动提供全球加速

## 🚨 故障排查

### 常见问题

#### 1. 部署失败

```bash
# 检查 Wrangler 版本
wrangler --version

# 重新登录
wrangler auth login

# 验证配置文件
wrangler validate

# 清除缓存重试
rm -rf .wrangler
wrangler deploy
```

#### 2. API 响应缓慢

- 检查目标网站的响应速度
- 启用增强缓存系统
- 监控 CPU 使用时间

#### 3. 缓存不工作

```bash
# 检查 KV 配置
wrangler kv:namespace list

# 查看 Worker 日志
wrangler tail

# 测试缓存功能
curl "https://your-domain.com/api/favicon?url=https://test.com"  # 第一次
curl "https://your-domain.com/api/favicon?url=https://test.com"  # 第二次应该显示 cached: true
```

#### 4. 域名无法访问

- 确认域名 DNS 记录正确
- 检查 Cloudflare 代理状态（橙色云朵）
- 验证 `wrangler.toml` 路由配置

### 错误代码

| 状态码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 缺少必需参数 | 检查 URL 参数 |
| 500 | 服务器内部错误 | 查看日志，检查代码 |
| 502 | 网关错误 | 重新部署或联系支持 |

### 调试技巧

```bash
# 本地调试
wrangler dev --local

# 详细日志
wrangler tail --format=pretty

# 测试特定环境
wrangler dev --env production
```

## 💰 成本控制

### Cloudflare Workers 定价

**免费套餐**：
- 每天 100,000 次请求
- 每次请求最多 10ms CPU 时间

**付费套餐**：
- $5/月基础费用
- 每百万请求 $0.30
- 每秒 CPU 时间 $12.50

### KV 存储定价

**免费套餐**：
- 100,000 次读取/天
- 1,000 次写入/天
- 1GB 存储空间

**付费套餐**：
- 读取：$0.50/百万次
- 写入：$5.00/百万次
- 存储：$0.50/GB·月

### 成本估算

假设每天 10,000 个不同网站的请求：

**完整版本成本**：
- Worker 请求：10,000/天 × 30天 = 300K/月（免费套餐内）
- KV 写入：10,000/天 × 30天 = 300K/月（约 $1.50）
- KV 读取：90% 缓存命中 = 270K/月（免费套餐内）
- **总成本**：约 $1.50/月

**性能收益**：
- 响应时间提升：70-80%
- 缓存命中率：95%+
- 用户体验：显著改善

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **报告问题**：在 GitHub Issues 中报告 bug 或建议新功能
2. **提交代码**：Fork 项目并提交 Pull Request
3. **改进文档**：帮助改进文档和示例
4. **分享经验**：在社区分享使用经验

### 开发流程

```bash
# 1. Fork 并克隆项目
git clone https://github.com/your-username/faviconsnap.git
cd faviconsnap

# 2. 创建功能分支
git checkout -b feature/amazing-feature

# 3. 本地开发和测试
npm run dev

# 4. 提交更改
git commit -m 'Add: 新增惊人功能'

# 5. 推送分支
git push origin feature/amazing-feature

# 6. 创建 Pull Request
```

### 代码规范

- 使用 JavaScript ES6+ 语法
- 添加适当的注释和文档
- 遵循现有的代码风格
- 确保新功能有测试覆盖

### 提交信息规范

```
类型: 简短描述

详细描述（可选）

类型：
- Add: 新增功能
- Fix: 修复问题
- Update: 更新现有功能
- Docs: 文档相关
- Style: 代码格式
- Refactor: 代码重构
- Test: 测试相关
```

## 📝 更新日志

### [1.2.0] - 2024-01-XX

#### 新增
- ✨ 三层缓存系统
- 🔄 KV 存储持久化缓存
- 📊 详细的缓存状态信息
- 🛠️ 自动化配置脚本
- 🌍 中英文双语界面

#### 改进
- ⚡ 响应时间从 150-500ms 优化到 20-50ms
- 📈 缓存命中率提升至 95%+
- 🔧 更智能的 favicon 检测策略
- 📱 更好的移动端适配

#### 修复
- 🐛 修复某些网站 favicon 检测失败的问题
- 🔒 改进错误处理和安全性
- 📝 完善 API 文档和示例

### [1.1.0] - 2024-01-XX

#### 新增
- 📋 JSON 和重定向双格式支持
- 🎨 现代化响应式前端界面
- 🔧 多种图标大小支持
- 📖 完整的 API 文档

### [1.0.0] - 2024-01-XX

#### 新增
- 🎉 首个稳定版本发布
- 🌍 基于 Cloudflare Workers 全球部署
- 🚀 核心 favicon 获取功能
- 🛡️ CORS 支持
- 🔄 智能回退机制

## 📞 支持与反馈

### 获得帮助

- 📖 **文档**：查看本文档的详细说明
- 🐛 **问题报告**：[GitHub Issues](https://github.com/websitesnap/faviconsnap/issues)
- 💬 **讨论交流**：[GitHub Discussions](https://github.com/websitesnap/faviconsnap/discussions)
- 📧 **邮件支持**：contact@faviconsnap.com

### 社区

- 🌟 **GitHub**：[websitesnap/faviconsnap](https://github.com/websitesnap/faviconsnap)
- 🔗 **官网**：[https://faviconsnap.com](https://faviconsnap.com)

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Cloudflare Workers](https://workers.cloudflare.com/) - 强大的边缘计算平台
- [Google S2 Favicon API](https://www.google.com/s2/favicons) - 图标获取服务
- [Yandex Favicon Service](https://favicon.yandex.net/) - 备选图标服务
- 所有贡献者和用户的支持

---

**如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！**

*Made with ❤️ by FaviconSnap Team*