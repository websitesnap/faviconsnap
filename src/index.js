// 增强版的缓存实现，使用 Cloudflare KV 存储
// 这个版本添加了持久化缓存功能

// 生成HTML内容的函数，支持不同语言
function generateHTML(lang = 'en') {
    const isEn = lang === 'en';
    
    // 国际化文本
    const texts = {
        zh: {
            title: 'FaviconSnap - 专业的网站图标获取API',
            description: '企业级favicon图标获取API服务，支持直接返回图片、JSON数据和重定向，全球CDN加速，毫秒级响应',
            subtitle: '企业级网站图标获取API • 全球CDN加速 • 毫秒级响应',
            currentLang: 'zh',
            otherLang: 'en',
            otherLangText: 'English',
            otherLangUrl: '/'
        },
        en: {
            title: 'FaviconSnap - Professional Favicon API',
            description: 'Enterprise favicon API service, supports direct image return, JSON data and redirect, global CDN acceleration, millisecond response',
            subtitle: 'Enterprise Favicon API • Global CDN • Millisecond Response',
            currentLang: 'en',
            otherLang: 'zh', 
            otherLangText: '中文',
            otherLangUrl: '/zh'
        }
    };
    
    const t = texts[lang];
    
    return `
<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'zh-CN'}"
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <meta name="description" content="${t.description}">
    <link rel="canonical" href="https://faviconsnap.com${lang === 'zh' ? '/zh' : ''}">
    <link rel="alternate" hreflang="en" href="https://faviconsnap.com/">
    <link rel="alternate" hreflang="zh" href="https://faviconsnap.com/zh">
    <link rel="alternate" hreflang="x-default" href="https://faviconsnap.com/">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }
        
        .header-top {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }
        
        .header-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .github-link {
            color: white;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        
        .github-link:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        
        .language-selector {
            display: flex;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }
        
        .lang-btn {
            background: transparent;
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            text-decoration: none;
            display: block;
        }
        
        .lang-btn:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .lang-btn.active {
            background: rgba(255,255,255,0.2);
            font-weight: 500;
        }
        
        .brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .logo {
            width: 48px;
            height: 48px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin: 0;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 1.5rem;
        }
        
        .features {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
        }
        
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
        }
        
        .main-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .demo-section {
            margin-bottom: 2rem;
        }
        
        .demo-section h2 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .input-group {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        input {
            flex: 2;
            min-width: 300px;
            padding: 1rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        input:focus {
            outline: none;
            border-color: #7033ff;
        }
        
        .format-select {
            flex: 1;
            min-width: 120px;
            padding: 1rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            background: white;
        }
        
        .format-select:focus {
            outline: none;
            border-color: #7033ff;
        }
        
        .api-preview {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .api-preview label {
            font-weight: 500;
            color: #495057;
            min-width: 100px;
        }
        
        .api-preview code {
            flex: 1;
            background: #e9ecef;
            padding: 0.5rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            word-break: break-all;
            min-width: 300px;
        }
        
        .copy-btn {
            padding: 0.5rem 1rem;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .copy-btn:hover {
            background: #218838;
        }
        
        .btn {
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #7033ff 0%, #9c27b0 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(112, 51, 255, 0.3);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(112, 51, 255, 0.4);
        }
        
        .result {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .favicon-display {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .favicon-display img {
            width: 32px;
            height: 32px;
        }
        
        .api-section {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .api-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .api-header h2 {
            color: #333;
            margin: 0;
        }
        
        .api-badges {
            display: flex;
            gap: 0.5rem;
        }
        
        .badge {
            background: linear-gradient(135deg, #7033ff 0%, #9c27b0 100%);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .api-overview {
            margin-bottom: 2rem;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .feature-item {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            border-left: 4px solid #7033ff;
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .feature-item h4 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .feature-item p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .api-endpoint {
            margin-bottom: 2rem;
        }
        
        .endpoint-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        
        .method {
            background: #28a745;
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .url {
            background: #e9ecef;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 1rem;
        }
        
        .api-params {
            margin-bottom: 2rem;
        }
        
        .params-table {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .param-row {
            display: grid;
            grid-template-columns: 1fr 80px 60px 2fr;
            gap: 1rem;
            padding: 1rem;
            align-items: center;
        }
        
        .param-row.header {
            background: #f8f9fa;
            font-weight: bold;
            color: #495057;
        }
        
        .param-row:not(.header) {
            border-top: 1px solid #dee2e6;
        }
        
        .param-name code {
            background: #e9ecef;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-weight: bold;
        }
        
        .param-type {
            color: #6f42c1;
            font-family: monospace;
            font-size: 0.9rem;
        }
        
        .required {
            color: #dc3545;
        }
        
        .optional {
            color: #6c757d;
        }
        
        .api-examples {
            margin-bottom: 2rem;
        }
        
        .example-tabs {
            display: flex;
            border-bottom: 2px solid #dee2e6;
            margin-bottom: 1rem;
        }
        
        .example-tab {
            padding: 0.8rem 1.5rem;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            color: #6c757d;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .example-tab.active {
            color: #7033ff;
            border-bottom-color: #7033ff;
        }
        
        .example-tab:hover {
            color: #7033ff;
        }
        
        .example-block {
            display: none;
        }
        
        .example-block.active {
            display: block;
        }
        
        .example-block pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            overflow-x: auto;
        }
        
        .example-block code {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .api-responses {
            margin-bottom: 2rem;
        }
        
        .response-type {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .response-type h4 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .response-info p {
            color: #666;
            margin-bottom: 1rem;
        }
        
        .response-headers, .response-example {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 1rem;
        }
        
        .response-headers pre, .response-example pre {
            margin: 0;
            background: transparent;
            border: none;
            padding: 0;
        }
        
        .api-performance {
            margin-bottom: 2rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .metric {
            text-align: center;
            background: linear-gradient(135deg, #7033ff 0%, #9c27b0 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .metric-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .endpoint {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .endpoint code {
            color: #e83e8c;
        }
        
        .examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .example {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
        }
        
        .example h4 {
            margin-bottom: 0.5rem;
            color: #495057;
        }
        
        .example code {
            display: block;
            background: #e9ecef;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .cache-info {
            color: #28a745;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .json-result, .redirect-result {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .json-result h4, .redirect-result h4 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .json-result pre {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 1rem;
            overflow-x: auto;
            margin-bottom: 1rem;
        }
        
        .json-result code {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            line-height: 1.4;
        }
        
        .redirect-result p {
            margin-bottom: 0.5rem;
        }
        
        .redirect-result strong {
            color: #495057;
        }
        
        .redirect-result a {
            color: #7033ff;
            text-decoration: none;
        }
        
        .redirect-result a:hover {
            text-decoration: underline;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .header-top {
                justify-content: center;
                margin-bottom: 1rem;
            }
            
            .header-controls {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .brand {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .features {
                gap: 1rem;
            }
            
            .input-group {
                flex-direction: column;
            }
            
            .input-group input {
                min-width: auto;
            }
            
            .api-preview {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .api-preview code {
                min-width: auto;
                word-break: break-all;
            }
            
            .param-row {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
            
            .param-row > div {
                padding: 0.5rem 0;
            }
            
            .param-row.header {
                display: none;
            }
            
            .example-tabs {
                flex-wrap: wrap;
            }
            
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <div class="header-controls">
                    <a href="https://github.com/websitesnap/faviconsnap" target="_blank" class="github-link" title="GitHub Repository">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                    </a>
                    <div class="language-selector">
                        <a href="/" class="lang-btn ${t.currentLang === 'en' ? 'active' : ''}" data-lang="en">English</a>
                        <a href="/zh" class="lang-btn ${t.currentLang === 'zh' ? 'active' : ''}" data-lang="zh">中文</a>
                    </div>
                </div>
            </div>
            <div class="brand">
                <svg class="logo" viewBox="0 0 1024 1024" width="48" height="48">
                    <path d="M811.707317 1024h-599.414634C94.907317 1024 0 929.092683 0 811.707317v-599.414634C0 94.907317 94.907317 0 212.292683 0h599.414634C929.092683 0 1024 94.907317 1024 212.292683v599.414634c0 117.385366-94.907317 212.292683-212.292683 212.292683zM212.292683 24.97561C109.892683 24.97561 24.97561 109.892683 24.97561 212.292683v599.414634C24.97561 914.107317 109.892683 999.02439 212.292683 999.02439h599.414634c102.4 0 187.317073-84.917073 187.317073-187.317073v-599.414634C999.02439 109.892683 914.107317 24.97561 811.707317 24.97561h-599.414634z" fill="#7033ff"></path>
                    <path d="M179.82439 1006.517073l82.419512-137.365853V89.912195h589.424391v147.356098H437.073171v202.302439h357.151219v144.858536H437.073171V949.073171H349.658537z" fill="#7033ff"></path>
                </svg>
                <h1>FaviconSnap</h1>
            </div>
            <p class="subtitle" data-i18n="subtitle">${t.subtitle}</p>
            <div class="features">
                <span class="feature" data-i18n="feature-cache">⚡ 三层缓存</span>
                <span class="feature" data-i18n="feature-global">🌍 全球加速</span>
                <span class="feature" data-i18n="feature-stats">📊 实时统计</span>
            </div>
        </div>
        
        <div class="main-card">
            <div class="demo-section">
                <h2 data-i18n="demo-title">🎯 在线演示</h2>
                <div class="input-group">
                    <input type="text" id="urlInput" data-i18n-placeholder="demo-placeholder" placeholder="输入网站URL，例如：www.google.com" value="www.google.com">
                    <select id="formatSelect" class="format-select">
                        <option value="" data-i18n="format-image">图片 (默认)</option>
                        <option value="json" data-i18n="format-json">JSON 数据</option>
                        <option value="redirect" data-i18n="format-redirect">重定向</option>
                    </select>
                    <button class="btn" onclick="getFavicon()" data-i18n="demo-button">获取图标</button>
                </div>
                <div class="api-preview">
                    <label data-i18n="api-preview-label">API 请求预览：</label>
                    <code id="apiPreview">https://faviconsnap.com/api/favicon?url=www.google.com</code>
                    <button class="copy-btn" onclick="copyApiUrl()" data-i18n="copy-button">📋 复制</button>
                </div>
                <div id="result" class="result" style="display: none;"></div>
            </div>
        </div>
        
        <div class="api-section">
            <div class="api-header">
                <h2 data-i18n="api-docs-title">📚 API 文档</h2>
                <div class="api-badges">
                    <span class="badge">REST API</span>
                    <span class="badge" data-i18n="badge-cdn">全球CDN</span>
                    <span class="badge" data-i18n="badge-speed">毫秒级响应</span>
                </div>
            </div>
            
            <div class="api-overview">
                <div class="feature-grid">
                    <div class="feature-item">
                        <div class="feature-icon">⚡</div>
                        <h4 data-i18n="feature-cache-title">三层缓存架构</h4>
                        <p data-i18n="feature-cache-desc">浏览器→边缘→KV存储，95%+缓存命中率</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🌍</div>
                        <h4 data-i18n="feature-global-title">全球加速</h4>
                        <p data-i18n="feature-global-desc">200+边缘节点，就近响应用户请求</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🔧</div>
                        <h4 data-i18n="feature-formats-title">多种格式</h4>
                        <p data-i18n="feature-formats-desc">支持图片、JSON、重定向三种返回格式</p>
                    </div>
                </div>
            </div>
            
            <div class="api-endpoint">
                <h3 data-i18n="api-endpoint-title">📍 API 端点</h3>
                <div class="endpoint-card">
                    <span class="method">GET</span>
                    <code class="url">https://faviconsnap.com/api/favicon</code>
                </div>
            </div>
            
            <div class="api-params">
                <h3 data-i18n="api-params-title">📝 请求参数</h3>
                <div class="params-table">
                    <div class="param-row header">
                        <div class="param-name" data-i18n="param-name">参数名</div>
                        <div class="param-type" data-i18n="param-type">类型</div>
                        <div class="param-required" data-i18n="param-required">必需</div>
                        <div class="param-desc" data-i18n="param-desc">说明</div>
                    </div>
                    <div class="param-row">
                        <div class="param-name"><code>url</code></div>
                        <div class="param-type">string</div>
                        <div class="param-required required">✅</div>
                        <div class="param-desc" data-i18n="param-url-desc">目标网站的URL</div>
                    </div>
                    <div class="param-row">
                        <div class="param-name"><code>format</code></div>
                        <div class="param-type">string</div>
                        <div class="param-required optional">❌</div>
                        <div class="param-desc" data-i18n="param-format-desc">返回格式: <code>image</code>(默认) | <code>json</code> | <code>redirect</code></div>
                    </div>
                    <div class="param-row">
                        <div class="param-name"><code>size</code></div>
                        <div class="param-type">integer</div>
                        <div class="param-required optional">❌</div>
                        <div class="param-desc" data-i18n="param-size-desc">图标大小: 16, 32(默认), 64, 128</div>
                    </div>
                    <div class="param-row">
                        <div class="param-name"><code>nocache</code></div>
                        <div class="param-type">boolean</div>
                        <div class="param-required optional">❌</div>
                        <div class="param-desc" data-i18n="param-nocache-desc">跳过缓存，强制重新获取</div>
                    </div>
                </div>
            </div>
            
            <div class="api-responses">
                <h3 data-i18n="response-title">📤 响应格式</h3>
                
                <div class="response-type">
                    <h4 data-i18n="response-image-title">🖼️ 图片格式 (默认)</h4>
                    <div class="response-info">
                        <p data-i18n="response-image-desc">直接返回 favicon 图片的二进制内容，可直接在 &lt;img&gt; 标签中使用</p>
                        <div class="response-headers">
                            <strong data-i18n="response-headers">响应头:</strong>
                            <pre><code>Content-Type: image/x-icon | image/png | image/svg+xml
X-Favicon-Source: html | direct | google
X-Favicon-Cached: true | false
Cache-Control: public, max-age=7200</code></pre>
                        </div>
                    </div>
                </div>
                
                <div class="response-type">
                    <h4 data-i18n="response-json-title">📋 JSON 格式 (format=json)</h4>
                    <div class="response-info">
                        <p data-i18n="response-json-desc">返回包含详细信息的JSON数据</p>
                        <div class="response-example">
                            <pre><code>{
  "success": true,
  "url": "https://github.com",
  "favicon": "https://github.com/favicon.ico",
  "size": "32x32",
  "source": "direct",
  "cached": true,
  "cacheSource": "kv",
  "cachedAt": "2025-08-03T10:30:00Z"
}</code></pre>
                        </div>
                    </div>
                </div>
                
                <div class="response-type">
                    <h4 data-i18n="response-redirect-title">🔄 重定向格式 (format=redirect)</h4>
                    <div class="response-info">
                        <p data-i18n="response-redirect-desc">302 重定向到原始 favicon URL</p>
                        <div class="response-headers">
                            <strong data-i18n="response-headers">响应头:</strong>
                            <pre><code>HTTP/1.1 302 Found
Location: https://github.com/favicon.ico</code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="api-performance">
                <h3 data-i18n="performance-title">⚡ 性能指标</h3>
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">20-50ms</div>
                        <div class="metric-label" data-i18n="perf-response-time">平均响应时间</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">95%+</div>
                        <div class="metric-label" data-i18n="perf-cache-hit">缓存命中率</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">200+</div>
                        <div class="metric-label" data-i18n="perf-nodes">全球节点</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">99.9%</div>
                        <div class="metric-label" data-i18n="perf-uptime">可用性保证</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // 更新API预览
        function updateApiPreview() {
            const url = document.getElementById('urlInput').value || 'www.google.com';
            const format = document.getElementById('formatSelect').value;
            
            let apiUrl = \`https://faviconsnap.com/api/favicon?url=\${encodeURIComponent(url)}\`;
            if (format) {
                apiUrl += \`&format=\${format}\`;
            }
            
            document.getElementById('apiPreview').textContent = apiUrl;
        }
        
        // 复制API URL
        function copyApiUrl() {
            const apiUrl = document.getElementById('apiPreview').textContent;
            navigator.clipboard.writeText(apiUrl).then(() => {
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.textContent;
                const copiedText = currentLang === 'en' ? '✅ Copied' : '✅ 已复制';
                btn.textContent = copiedText;
                btn.style.background = '#28a745';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#28a745';
                }, 2000);
            }).catch(() => {
                const failText = currentLang === 'en' ? 'Copy failed, please copy manually' : '复制失败，请手动复制';
                alert(failText);
            });
        }
        
        // 切换示例标签
        function showExample(type) {
            // 更新标签状态
            document.querySelectorAll('.example-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(\`[onclick="showExample('\${type}')"]\`).classList.add('active');
            
            // 更新内容显示
            document.querySelectorAll('.example-block').forEach(block => {
                block.classList.remove('active');
            });
            document.getElementById(\`example-\${type}\`).classList.add('active');
        }
        
        // 获取favicon
        async function getFavicon() {
            const url = document.getElementById('urlInput').value;
            const format = document.getElementById('formatSelect').value;
            const resultDiv = document.getElementById('result');
            
            const alertText = currentLang === 'en' ? 'Please enter a website URL' : '请输入网站URL';
            const loadingText = currentLang === 'en' ? '🔄 Getting favicon...' : '🔄 正在获取favicon...';
            
            if (!url) {
                alert(alertText);
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<p>' + loadingText + '</p>';
            
            try {
                let apiUrl = \`/api/favicon?url=\${encodeURIComponent(url)}\`;
                let displayFormat = format || 'image';
                
                if (displayFormat === 'json') {
                    // JSON格式：显示详细信息
                    const response = await fetch(apiUrl + '&format=json');
                    const data = await response.json();
                    
                    if (data.success) {
                        const cacheInfoText = currentLang === 'en' ? 
                            (data.cached ? '⚡ From cache (' + (data.cacheSource || 'unknown') + ')' : '🔄 Real-time fetch') :
                            (data.cached ? '⚡ 从缓存获取 (' + (data.cacheSource || 'unknown') + ')' : '🔄 实时获取');
                        const jsonTitleText = currentLang === 'en' ? '📋 JSON Response Data' : '📋 JSON 响应数据';
                        const cacheInfo = \`<div class="cache-info">\${cacheInfoText}</div>\`;
                        
                        resultDiv.innerHTML = \`
                            <div class="json-result">
                                <h4>\${jsonTitleText}</h4>
                                <pre><code>\${JSON.stringify(data, null, 2)}</code></pre>
                                \${cacheInfo}
                            </div>
                        \`;
                    } else {
                        const errorText = currentLang === 'en' ? 'Failed to get favicon' : '获取失败';
                        resultDiv.innerHTML = \`<p>❌ \${errorText}: \${data.error}</p>\`;
                    }
                } else if (displayFormat === 'redirect') {
                    // 重定向格式：显示重定向信息
                    const response = await fetch(apiUrl + '&format=json');
                    const data = await response.json();
                    
                    if (data.success) {
                        const redirectTitleText = currentLang === 'en' ? '🔄 Redirect Information' : '🔄 重定向信息';
                        const redirectUrlText = currentLang === 'en' ? 'Redirect URL:' : '重定向URL:';
                        const statusCodeText = currentLang === 'en' ? 'HTTP Status Code:' : 'HTTP状态码:';
                        const testRedirectText = currentLang === 'en' ? 'Test Redirect:' : '测试重定向:';
                        const clickTestText = currentLang === 'en' ? 'Click to test' : '点击测试';
                        
                        resultDiv.innerHTML = \`
                            <div class="redirect-result">
                                <h4>\${redirectTitleText}</h4>
                                <p><strong>\${redirectUrlText}</strong> <a href="\${data.favicon}" target="_blank">\${data.favicon}</a></p>
                                <p><strong>\${statusCodeText}</strong> 302 Found</p>
                                <p><strong>\${testRedirectText}</strong> <a href="\${apiUrl}&format=redirect" target="_blank">\${clickTestText}</a></p>
                            </div>
                        \`;
                    } else {
                        const errorText = currentLang === 'en' ? 'Failed to get favicon' : '获取失败';
                        resultDiv.innerHTML = \`<p>❌ \${errorText}: \${data.error}</p>\`;
                    }
                } else {
                    // 图片格式：显示图片和信息
                    const infoResponse = await fetch(apiUrl + '&format=json');
                    const data = await infoResponse.json();
                    
                    if (data.success) {
                        const cacheInfoText = currentLang === 'en' ? 
                            (data.cached ? '⚡ From cache (' + (data.cacheSource || 'unknown') + ')' : '🔄 Real-time fetch') :
                            (data.cached ? '⚡ 从缓存获取 (' + (data.cacheSource || 'unknown') + ')' : '🔄 实时获取');
                        const cacheInfo = \`<div class="cache-info">\${cacheInfoText}</div>\`;
                        
                        const successText = currentLang === 'en' ? '✅ Successfully got favicon' : '✅ 成功获取favicon';
                        const apiAddressText = currentLang === 'en' ? 'API Address:' : 'API地址:';
                        const originalUrlText = currentLang === 'en' ? 'Original URL:' : '原始URL:';
                        const sizeText = currentLang === 'en' ? 'Size:' : '大小:';
                        const sourceText = currentLang === 'en' ? 'Source:' : '来源:';
                        const unknownText = currentLang === 'en' ? 'Unknown' : '未知';
                        
                        resultDiv.innerHTML = \`
                            <div class="favicon-display">
                                <img src="\${apiUrl}" alt="favicon" onerror="this.src='\${data.favicon}'; this.onerror=null;">
                                <div>
                                    <p><strong>\${successText}</strong></p>
                                    <p>\${apiAddressText} <code>\${apiUrl}</code></p>
                                    <p>\${originalUrlText} <a href="\${data.favicon}" target="_blank">\${data.favicon}</a></p>
                                    <p>\${sizeText} \${data.size || unknownText}</p>
                                    <p>\${sourceText} \${data.source}</p>
                                    \${cacheInfo}
                                </div>
                            </div>
                        \`;
                    } else {
                        const errorText = currentLang === 'en' ? 'Failed to get favicon' : '获取失败';
                        resultDiv.innerHTML = \`<p>❌ \${errorText}: \${data.error}</p>\`;
                    }
                }
            } catch (error) {
                const requestFailedText = currentLang === 'en' ? 'Request failed' : '请求失败';
                resultDiv.innerHTML = \`<p>❌ \${requestFailedText}: \${error.message}</p>\`;
            }
        }
        
        // 国际化文本
        const i18nTexts = {
            zh: {
                'subtitle': '企业级网站图标获取API • 全球CDN加速 • 毫秒级响应',
                'feature-cache': '⚡ 三层缓存',
                'feature-global': '🌍 全球加速', 
                'feature-stats': '📊 实时统计',
                'demo-title': '🎯 在线演示',
                'demo-placeholder': '输入网站URL，例如：www.google.com',
                'demo-button': '获取图标',
                'format-image': '图片 (默认)',
                'format-json': 'JSON 数据',
                'format-redirect': '重定向',
                'api-preview-label': 'API 请求预览：',
                'copy-button': '📋 复制',
                'api-docs-title': '📚 API 文档',
                'badge-cdn': '全球CDN',
                'badge-speed': '毫秒级响应',
                'feature-cache-title': '三层缓存架构',
                'feature-cache-desc': '浏览器→边缘→KV存储，95%+缓存命中率',
                'feature-global-title': '全球加速',
                'feature-global-desc': '200+边缘节点，就近响应用户请求',
                'feature-formats-title': '多种格式',
                'feature-formats-desc': '支持图片、JSON、重定向三种返回格式',
                'api-endpoint-title': '📍 API 端点',
                'api-params-title': '📝 请求参数',
                'param-name': '参数名',
                'param-type': '类型',
                'param-required': '必需',
                'param-desc': '说明',
                'param-url-desc': '目标网站的URL',
                'param-format-desc': '返回格式: <code>image</code>(默认) | <code>json</code> | <code>redirect</code>',
                'param-size-desc': '图标大小: 16, 32(默认), 64, 128',
                'param-nocache-desc': '跳过缓存，强制重新获取',
                'examples-title': '💡 使用示例',
                'response-title': '📤 响应格式',
                'response-image-title': '🖼️ 图片格式 (默认)',
                'response-image-desc': '直接返回 favicon 图片的二进制内容，可直接在 <img> 标签中使用',
                'response-json-title': '📋 JSON 格式 (format=json)',
                'response-json-desc': '返回包含详细信息的JSON数据',
                'response-redirect-title': '🔄 重定向格式 (format=redirect)',
                'response-redirect-desc': '302 重定向到原始 favicon URL',
                'response-headers': '响应头:',
                'performance-title': '⚡ 性能指标',
                'perf-response-time': '平均响应时间',
                'perf-cache-hit': '缓存命中率',
                'perf-nodes': '全球节点',
                'perf-uptime': '可用性保证'
            },
            en: {
                'subtitle': 'Enterprise Favicon API • Global CDN • Millisecond Response',
                'feature-cache': '⚡ Triple Cache',
                'feature-global': '🌍 Global CDN',
                'feature-stats': '📊 Real-time Stats',
                'demo-title': '🎯 Live Demo',
                'demo-placeholder': 'Enter website URL, e.g.: www.google.com',
                'demo-button': 'Get Favicon',
                'format-image': 'Image (Default)',
                'format-json': 'JSON Data',
                'format-redirect': 'Redirect',
                'api-preview-label': 'API Request Preview:',
                'copy-button': '📋 Copy',
                'api-docs-title': '📚 API Documentation',
                'badge-cdn': 'Global CDN',
                'badge-speed': 'Millisecond Response',
                'feature-cache-title': 'Triple Cache Architecture',
                'feature-cache-desc': 'Browser→Edge→KV Storage, 95%+ cache hit rate',
                'feature-global-title': 'Global Acceleration',
                'feature-global-desc': '200+ edge nodes, nearest response to users',
                'feature-formats-title': 'Multiple Formats',
                'feature-formats-desc': 'Support image, JSON, redirect response formats',
                'api-endpoint-title': '📍 API Endpoint',
                'api-params-title': '📝 Request Parameters',
                'param-name': 'Parameter',
                'param-type': 'Type',
                'param-required': 'Required',
                'param-desc': 'Description',
                'param-url-desc': 'Target website URL',
                'param-format-desc': 'Response format: <code>image</code>(default) | <code>json</code> | <code>redirect</code>',
                'param-size-desc': 'Icon size: 16, 32(default), 64, 128',
                'param-nocache-desc': 'Skip cache, force refresh',
                'examples-title': '💡 Examples',
                'response-title': '📤 Response Formats',
                'response-image-title': '🖼️ Image Format (Default)',
                'response-image-desc': 'Returns favicon image binary directly, can be used in <img> tags',
                'response-json-title': '📋 JSON Format (format=json)',
                'response-json-desc': 'Returns JSON data with detailed information',
                'response-redirect-title': '🔄 Redirect Format (format=redirect)',
                'response-redirect-desc': '302 redirect to original favicon URL',
                'response-headers': 'Response Headers:',
                'performance-title': '⚡ Performance Metrics',
                'perf-response-time': 'Avg Response Time',
                'perf-cache-hit': 'Cache Hit Rate',
                'perf-nodes': 'Global Nodes',
                'perf-uptime': 'Uptime Guarantee'
            }
        };
        

        
        // 初始化当前语言
        const currentLang = '${lang}';
        
        // 初始化事件监听器
        document.addEventListener('DOMContentLoaded', function() {
            // 根据当前语言初始化页面
            initializePage(currentLang);
            
            // URL输入框变化时更新预览
            document.getElementById('urlInput').addEventListener('input', updateApiPreview);
            
            // 格式选择器变化时更新预览
            document.getElementById('formatSelect').addEventListener('change', updateApiPreview);
            
            // 回车键触发搜索
            document.getElementById('urlInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    getFavicon();
                }
            });
            
            // 初始化API预览
            updateApiPreview();
            
            // 页面加载完成后自动获取默认图标
            setTimeout(() => {
                getFavicon();
            }, 500); // 延迟500ms确保页面完全加载
        });
        
        // 初始化页面内容
        function initializePage(lang) {
            // 根据当前语言设置所有国际化文本
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (i18nTexts[lang] && i18nTexts[lang][key]) {
                    element.innerHTML = i18nTexts[lang][key];
                }
            });
            
            // 更新 placeholder
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (i18nTexts[lang] && i18nTexts[lang][key]) {
                    element.placeholder = i18nTexts[lang][key];
                }
            });
        }
    </script>
</body>
</html>
`;
}

const HTML_TEMPLATE = generateHTML('zh'); // 保持向后兼容

// 增强版 Favicon 服务类，支持 KV 存储缓存
class EnhancedFaviconService {
    constructor(kvStore) {
        this.kv = kvStore; // Cloudflare KV 存储绑定
        this.defaultSize = 32;
        this.supportedSizes = [16, 32, 64, 128];
        this.cacheExpiry = 7 * 24 * 60 * 60; // 7天缓存
    }
    
    // 生成缓存键
    generateCacheKey(url, size) {
        const domain = new URL(url).hostname;
        return `favicon:${domain}:${size}`;
    }
    
    // 从缓存获取 favicon
    async getFromCache(url, size) {
        if (!this.kv) return null;
        
        try {
            const cacheKey = this.generateCacheKey(url, size);
            const cachedData = await this.kv.get(cacheKey, 'json');
            
            if (cachedData && cachedData.favicon) {
                return {
                    ...cachedData,
                    cached: true,
                    cacheSource: 'kv'
                };
            }
        } catch (error) {
            console.error('缓存读取失败:', error);
        }
        
        return null;
    }
    
    // 保存到缓存
    async saveToCache(url, size, faviconData) {
        if (!this.kv) return;
        
        try {
            const cacheKey = this.generateCacheKey(url, size);
            const cacheData = {
                ...faviconData,
                cachedAt: new Date().toISOString(),
                cached: false // 保存时标记为非缓存状态
            };
            
            await this.kv.put(cacheKey, JSON.stringify(cacheData), {
                expirationTtl: this.cacheExpiry
            });
        } catch (error) {
            console.error('缓存保存失败:', error);
        }
    }
    
    // 规范化URL
    normalizeUrl(url, lang = 'zh') {
        const isEn = lang === 'en';
        if (!url) throw new Error(isEn ? 'URL cannot be empty' : 'URL不能为空');
        
        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url;
        }
        
        try {
            const urlObj = new URL(url);
            return urlObj.origin;
        } catch (error) {
            throw new Error(isEn ? 'Invalid URL format' : '无效的URL格式');
        }
    }
    
    // 尝试多种favicon位置
    getFaviconUrls(baseUrl) {
        const urls = [];
        const urlObj = new URL(baseUrl);
        const domain = urlObj.hostname;
        
        urls.push(`${baseUrl}/favicon.ico`);
        urls.push(`${baseUrl}/favicon.png`);
        urls.push(`${baseUrl}/apple-touch-icon.png`);
        urls.push(`${baseUrl}/apple-touch-icon-precomposed.png`);
        
        // 第三方服务作为备选
        urls.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`);
        urls.push(`https://favicon.yandex.net/favicon/${domain}`);
        
        return urls;
    }
    
    // 从HTML中解析favicon链接
    async parseFaviconFromHtml(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; FaviconSnap/1.0)'
                },
                cf: {
                    timeout: 10000,
                    cacheTtl: 3600
                }
            });
            
            if (!response.ok) return null;
            
            const html = await response.text();
            const faviconRegex = /<link[^>]*rel=["\'](?:icon|shortcut icon|apple-touch-icon)[^>]*href=["\']([^"\']+)["\'][^>]*>/gi;
            const matches = [...html.matchAll(faviconRegex)];
            
            if (matches.length > 0) {
                let faviconUrl = matches[0][1];
                if (faviconUrl.startsWith('//')) {
                    faviconUrl = new URL(url).protocol + faviconUrl;
                } else if (faviconUrl.startsWith('/')) {
                    faviconUrl = new URL(url).origin + faviconUrl;
                } else if (!faviconUrl.startsWith('http')) {
                    faviconUrl = new URL(faviconUrl, url).href;
                }
                return faviconUrl;
            }
        } catch (error) {
            console.error('解析HTML失败:', error);
        }
        
        return null;
    }
    
    // 检查URL是否返回有效的图像
    async checkFaviconUrl(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                cf: {
                    timeout: 5000,
                    cacheTtl: 3600
                }
            });
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith('image/')) {
                    return {
                        url: url,
                        contentType: contentType,
                        size: response.headers.get('content-length')
                    };
                }
            }
        } catch (error) {
            // 忽略错误
        }
        
        return null;
    }
    
    // 主要的favicon获取方法（增强版）
    async getFavicon(url, size = 32, skipCache = false, lang = 'zh') {
        const normalizedUrl = this.normalizeUrl(url, lang);
        
        // 1. 尝试从缓存获取（除非跳过缓存）
        if (!skipCache) {
            const cachedResult = await this.getFromCache(normalizedUrl, size);
            if (cachedResult) {
                return cachedResult;
            }
        }
        
        let faviconResult = null;
        
        // 2. 尝试从HTML页面解析favicon
        const htmlFavicon = await this.parseFaviconFromHtml(normalizedUrl);
        if (htmlFavicon) {
            const result = await this.checkFaviconUrl(htmlFavicon);
            if (result) {
                faviconResult = {
                    success: true,
                    url: normalizedUrl,
                    favicon: result.url,
                    size: size + 'x' + size,
                    source: 'html',
                    cached: false
                };
            }
        }
        
        // 3. 尝试常见的favicon位置
        if (!faviconResult) {
            const faviconUrls = this.getFaviconUrls(normalizedUrl);
            
            for (const faviconUrl of faviconUrls) {
                const result = await this.checkFaviconUrl(faviconUrl);
                if (result) {
                    faviconResult = {
                        success: true,
                        url: normalizedUrl,
                        favicon: result.url,
                        size: size + 'x' + size,
                        source: faviconUrl.includes('google.com') ? 'google' : 
                               faviconUrl.includes('yandex.net') ? 'yandex' : 'direct',
                        cached: false
                    };
                    break;
                }
            }
        }
        
        // 4. 最后的备选方案
        if (!faviconResult) {
            const domain = new URL(normalizedUrl).hostname;
            faviconResult = {
                success: true,
                url: normalizedUrl,
                favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
                size: size + 'x' + size,
                source: 'google',
                cached: false
            };
        }
        
        // 5. 保存到缓存
        if (faviconResult && faviconResult.success) {
            await this.saveToCache(normalizedUrl, size, faviconResult);
        }
        
        return faviconResult;
    }
}

// 主要的请求处理器（增强版）
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const hostname = url.hostname;
        
        // 设置CORS头
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };
        
        // 处理CORS预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        // www 重定向到主域名
        if (hostname === 'www.faviconsnap.com') {
            const redirectUrl = url.toString().replace('www.faviconsnap.com', 'faviconsnap.com');
            return Response.redirect(redirectUrl, 301);
        }
        
        // Favicon 路由
        if (pathname === '/favicon.ico' || pathname === '/favicon.svg') {
            const logoSvg = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1754189240029" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4649" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128"><path d="M811.707317 1024h-599.414634C94.907317 1024 0 929.092683 0 811.707317v-599.414634C0 94.907317 94.907317 0 212.292683 0h599.414634C929.092683 0 1024 94.907317 1024 212.292683v599.414634c0 117.385366-94.907317 212.292683-212.292683 212.292683zM212.292683 24.97561C109.892683 24.97561 24.97561 109.892683 24.97561 212.292683v599.414634C24.97561 914.107317 109.892683 999.02439 212.292683 999.02439h599.414634c102.4 0 187.317073-84.917073 187.317073-187.317073v-599.414634C999.02439 109.892683 914.107317 24.97561 811.707317 24.97561h-599.414634z" p-id="4650" fill="#7033ff"></path><path d="M179.82439 1006.517073l82.419512-137.365853V89.912195h589.424391v147.356098H437.073171v202.302439h357.151219v144.858536H437.073171V949.073171H349.658537z" p-id="4651" fill="#7033ff"></path></svg>`;
            
            return new Response(logoSvg, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=86400', // 缓存24小时
                    ...corsHeaders
                }
            });
        }

        // 主页路由 - 英文版 (/) 和中文版 (/zh)
        if (pathname === '/' || pathname === '/zh') {
            const lang = pathname === '/zh' ? 'zh' : 'en';
            const htmlContent = generateHTML(lang);
            
            return new Response(htmlContent, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Content-Language': lang,
                    'Vary': 'Accept-Language',
                    ...corsHeaders
                }
            });
        }
        
        // API路由
        if (pathname === '/api/favicon') {
            try {
                const targetUrl = url.searchParams.get('url');
                const size = parseInt(url.searchParams.get('size')) || 32;
                const format = url.searchParams.get('format') || '';
                const nocache = url.searchParams.get('nocache') === 'true';
                
                if (!targetUrl) {
                    // 检测语言 - 从请求路径或Accept-Language头判断
                    const acceptLang = request.headers.get('Accept-Language') || '';
                    const isZh = url.pathname.includes('/zh') || acceptLang.includes('zh-CN') || acceptLang.includes('zh');
                    const errorMsg = isZh ? '缺少url参数' : 'Missing url parameter';
                    
                    return new Response(JSON.stringify({
                        success: false,
                        error: errorMsg
                    }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            ...corsHeaders
                        }
                    });
                }
                
                // 检测语言
                const acceptLang = request.headers.get('Accept-Language') || '';
                const isZh = url.pathname.includes('/zh') || acceptLang.includes('zh-CN') || acceptLang.includes('zh');
                const lang = isZh ? 'zh' : 'en';
                
                // 使用增强版服务，传入 KV 存储绑定
                const faviconService = new EnhancedFaviconService(env.FAVICON_CACHE);
                const result = await faviconService.getFavicon(targetUrl, size, nocache, lang);
                
                // 如果请求格式是redirect，直接重定向到favicon
                if (format === 'redirect') {
                    return Response.redirect(result.favicon, 302);
                }
                
                // 默认返回图片，除非明确指定为json格式
                if (format !== 'json') {
                    try {
                        // 下载favicon图片
                        const imageResponse = await fetch(result.favicon, {
                            cf: {
                                timeout: 10000,
                                cacheTtl: result.cached ? 7200 : 3600
                            },
                            headers: {
                                'User-Agent': 'FaviconSnap/1.0 (faviconsnap.com)'
                            }
                        });
                        
                        if (!imageResponse.ok) {
                            throw new Error(`Failed to fetch image: ${imageResponse.status}`);
                        }
                        
                        // 获取图片内容
                        const imageBuffer = await imageResponse.arrayBuffer();
                        if (!imageBuffer || imageBuffer.byteLength === 0) {
                            throw new Error('Empty image response');
                        }
                        
                        // 获取图片内容类型
                        const contentType = imageResponse.headers.get('content-type') || 'image/x-icon';
                        
                        // 返回图片数据
                        return new Response(imageBuffer, {
                            headers: {
                                'Content-Type': contentType,
                                'Cache-Control': result.cached ? 
                                    'public, max-age=7200' : 
                                    'public, max-age=3600',
                                'X-Favicon-Source': result.source,
                                'X-Favicon-Cached': result.cached.toString(),
                                ...corsHeaders
                            }
                        });
                        
                    } catch (imageError) {
                        // 如果图片下载失败，回退到JSON格式
                        console.error('图片下载失败，回退到JSON:', imageError.message);
                        
                        // 返回JSON格式作为回退
                        return new Response(JSON.stringify({
                            success: true,
                            ...result,
                            error: '图片下载失败，已回退到JSON格式: ' + imageError.message,
                            imageDownloadFailed: true
                        }), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Cache-Control': result.cached ? 
                                    'public, max-age=7200' : 
                                    'public, max-age=3600',
                                'X-Favicon-Source': result.source,
                                'X-Favicon-Cached': result.cached.toString(),
                                ...corsHeaders
                            }
                        });
                    }
                } else {
                    // 明确指定format=json时返回JSON格式
                    return new Response(JSON.stringify(result), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': result.cached ? 
                                'public, max-age=7200' : // 缓存命中时设置更长的缓存时间
                                'public, max-age=3600',   // 实时获取时设置较短的缓存时间
                            ...corsHeaders
                        }
                    });
                }
                
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }
        }
        
        // 缓存统计API
        if (pathname === '/api/cache/stats') {
            try {
                // 这里可以添加缓存统计逻辑
                return new Response(JSON.stringify({
                    success: true,
                    message: '缓存统计功能开发中'
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }
        }
        
        // 404页面
        return new Response('404 Not Found', {
            status: 404,
            headers: corsHeaders
        });
    }
};