# 🔗 FaviconSnap

**A free, fast, and reliable favicon API service powered by Cloudflare Workers.**

[🇨🇳 中文文档](README_ZH.md) | [📚 Detailed Docs](README_ZH.md) | [🌐 Live Demo](https://faviconsnap.com)

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/websitesnap/faviconsnap?style=social)](https://github.com/websitesnap/faviconsnap)

## ✨ Features

- 🚀 **Ultra Fast**: Global edge deployment with 20-50ms response time
- 🌍 **Global CDN**: 200+ edge nodes worldwide
- ⚡ **Triple Cache**: Browser → Edge → KV Storage (95%+ hit rate)
- 🔄 **Smart Fallback**: Multiple favicon sources ensure 99.9% success rate
- 📱 **Multi-Format**: Image, JSON, and redirect response formats
- 🛡️ **CORS Ready**: Direct browser integration support
- 💰 **Free Tier**: 100K requests/day at no cost

## 🚀 Quick Start

### Basic Usage

```bash
# Get favicon as JSON
curl "https://faviconsnap.com/api/favicon?url=https://github.com"

# Get direct image redirect
curl "https://faviconsnap.com/api/favicon?url=https://github.com&format=redirect"
```

### JavaScript Integration

```javascript
// Fetch favicon data
const response = await fetch('https://faviconsnap.com/api/favicon?url=https://github.com');
const data = await response.json();

if (data.success) {
  console.log('Favicon URL:', data.favicon);
}

// Direct image usage
document.getElementById('favicon').src = 
  'https://faviconsnap.com/api/favicon?url=https://github.com&format=redirect';
```

### HTML Integration

```html
<!-- Direct image element -->
<img src="https://faviconsnap.com/api/favicon?url=https://github.com&format=redirect" 
     alt="Site favicon" width="32" height="32">
```

## 📖 API Documentation

### Endpoint

```
GET https://faviconsnap.com/api/favicon
```

### Parameters

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `url` | string | ✅ | Target website URL | - |
| `size` | number | ❌ | Icon size (16/32/64/128) | 32 |
| `format` | string | ❌ | Response format (json/redirect) | json |
| `nocache` | boolean | ❌ | Skip cache, force refresh | false |

### Response Formats

#### JSON Response (default)
```json
{
  "success": true,
  "url": "https://github.com",
  "favicon": "https://github.githubassets.com/favicons/favicon.svg",
  "size": "32x32",
  "source": "html",
  "cached": true,
  "cacheSource": "kv",
  "cachedAt": "2024-01-15T10:30:00Z"
}
```

#### Redirect Response (format=redirect)
```http
HTTP/1.1 302 Found
Location: https://github.githubassets.com/favicons/favicon.svg
```

## 🏗️ Deploy Your Own

### Prerequisites

- [Node.js](https://nodejs.org/) 16+
- [Cloudflare Account](https://cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Quick Deploy

#### Smart Deploy (Recommended)

```bash
# Clone the repository
git clone https://github.com/websitesnap/faviconsnap.git
cd faviconsnap

# Login to Cloudflare
wrangler auth login

# Smart deployment - automatically detects and configures everything
./deploy.sh
```

#### Advanced Options

```bash
# Force reconfigure everything (KV storage, config files)
./deploy.sh --setup

# Deploy only (skip configuration checks)
./deploy.sh --deploy-only

# Skip post-deployment tests
./deploy.sh --skip-tests

# Show all available options
./deploy.sh --help
```

#### Manual Deploy (Alternative)

```bash
# Manual configuration
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your actual values
wrangler deploy
```

> 💡 **Smart Deploy**: The `deploy.sh` script intelligently detects your setup status and automatically initializes configuration or deploys accordingly. See `DEPLOY_USAGE.md` for detailed instructions.

### Smart Features

The intelligent deployment script automatically:

- **Detects Configuration**: Checks if wrangler.toml exists and is properly configured
- **Creates KV Storage**: Automatically creates and configures KV namespaces if needed
- **Validates Setup**: Performs comprehensive pre-deployment checks
- **Tests Deployment**: Verifies functionality after deployment
- **Provides Feedback**: Shows detailed deployment information and troubleshooting tips

> 📝 **For detailed deployment instructions**, see [README_ZH.md](README_ZH.md#部署指南)

## 🔧 Architecture

### Triple Cache System

```
User Request → [Browser Cache] → [Edge Cache] → [KV Storage] → Origin Fetch
                   1-2 hours        1 hour         7 days
```

### Favicon Detection Strategy

1. **HTML Parsing**: Extract favicon links from HTML `<link>` tags
2. **Standard Paths**: Check common paths (`/favicon.ico`, `/favicon.png`)
3. **Apple Touch Icon**: Support for mobile icons
4. **Third-party Services**: Google S2 and Yandex as fallbacks

## 📊 Performance

- **Response Time**: 20-50ms (cached), <500ms (uncached)
- **Cache Hit Rate**: 95%+
- **Global Coverage**: 200+ edge locations
- **Uptime**: 99.9% availability guarantee

## 🌟 Use Cases

- Website navigation tools
- Bookmark managers
- Link preview features
- Website analytics dashboards
- Browser extensions
- Mobile applications

## 💰 Cost Structure

**Cloudflare Workers Free Tier:**
- 100K requests/day: **Free**
- Additional requests: $5/month + $0.30/million requests

**KV Storage:**
- ~$1.50/month for typical usage
- Significant performance improvement

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](README_ZH.md#贡献指南).

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless edge computing platform
- [Google S2 Favicon API](https://www.google.com/s2/favicons) - Favicon service
- [Yandex Favicon Service](https://favicon.yandex.net/) - Alternative favicon service

## 📚 Documentation

- [🇨🇳 Complete Chinese Documentation](README_ZH.md)
- [⚡ Cache System Guide](README_ZH.md#缓存系统)
- [🚀 Deployment Guide](README_ZH.md#部署指南)
- [🔧 Configuration Guide](README_ZH.md#配置指南)
- [🧪 Testing & Monitoring](README_ZH.md#测试与监控)

## 🌐 Live Demo

Visit [https://faviconsnap.com](https://faviconsnap.com) to try the service online! (English interface with automatic favicon loading)

---

**If this project helps you, please consider giving it a ⭐ Star!**

Made with ❤️ by the FaviconSnap team