# 📁 项目结构说明

本文档说明了 FaviconSnap 项目的目录结构和文件用途。

## 📂 目录结构

```
faviconsnap/
├── 📄 README.md                    # 英文版项目说明（GitHub 主页）
├── 📄 README_ZH.md                 # 中文版完整文档
├── 📄 DEPLOY_USAGE.md              # 部署脚本使用说明
├── 📄 CHANGELOG.md                 # 项目更新日志
├── 📄 LICENSE                      # MIT 开源许可证
├── 📄 package.json                 # Node.js 项目配置
├── 📄 wrangler.toml                # Cloudflare Workers 配置（.gitignore）
├── 📄 wrangler.toml.example        # 配置文件示例模板
├── 📄 .gitignore                   # Git 忽略文件配置
├── 📁 src/
│   ├── 📄 index.js                 # 主入口文件
│   └── 🖼️ logo.svg                 # 项目 Logo
└── 📄 deploy.sh                    # 🚀 智能部署脚本（.gitignore）
```

## 📋 文件说明

### 核心文档
- **README.md**: 英文版项目介绍，面向 GitHub 用户
- **README_ZH.md**: 中文版完整文档，包含详细的使用指南、API 文档、部署教程等
- **DEPLOY_USAGE.md**: 部署脚本详细使用说明（包含功能介绍、使用方法、故障排查）
- **CHANGELOG.md**: 版本更新记录

### 配置文件
- **package.json**: Node.js 项目依赖和脚本
- **wrangler.toml.example**: Cloudflare Workers 配置文件模板
- **.gitignore**: Git 版本控制忽略规则

### 源代码
- **src/index.js**: 主要的 Worker 代码（包含完整的三层缓存功能）

### 工具和示例
- **deploy.sh**: 🚀 **智能部署脚本**（推荐，已加入 .gitignore）
  - 智能检测配置状态，自动初始化或部署
  - 支持多种模式：智能模式、强制配置、仅部署
  - 环境检查、登录验证、配置验证
  - KV 存储创建、语法验证、功能测试
  - 详细的部署信息和测试结果展示
- **examples/**: 使用示例代码

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/websitesnap/faviconsnap.git
   cd faviconsnap
   ```

2. **查看文档**
   - 英文用户：阅读 [README.md](README.md)
   - 中文用户：阅读 [README_ZH.md](README_ZH.md)

3. **选择部署方式**
   - **推荐**: 运行 `./deploy.sh` 智能部署（自动检测并执行相应操作）
   - 强制配置：运行 `./deploy.sh --setup` 重新配置所有设置
   - 仅部署：运行 `./deploy.sh --deploy-only` 跳过配置检查
   - 查看帮助：运行 `./deploy.sh --help` 了解所有选项

## 📚 文档导航

- [🇺🇸 English Documentation](README.md)
- [🇨🇳 中文完整文档](README_ZH.md)
- [📝 更新日志](CHANGELOG.md)
- [⚖️ 开源许可](LICENSE)

## ✨ 特色功能

- **双语支持**: 完整的中英文文档
- **三层缓存**: 浏览器 → 边缘 → KV 存储
- **🚀 一键部署**: 全自动部署脚本（deploy.sh）
- **智能检查**: 自动环境验证和功能测试
- **全球加速**: Cloudflare 边缘网络
- **开源免费**: MIT 许可证

---

如需了解更多信息，请查看 [完整中文文档](README_ZH.md) 或 [English README](README.md)。