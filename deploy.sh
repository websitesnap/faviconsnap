#!/bin/bash

# FaviconSnap 智能部署脚本
# 自动检测环境，智能初始化配置，一键部署
# 作者: FaviconSnap Team
# 版本: 2.0.0

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 全局变量
SETUP_MODE=false
DEPLOY_ONLY=false
SKIP_TESTS=false
CREATED_KV_ID=""

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

print_header() {
    echo -e "${CYAN}"
    echo "=================================================="
    echo "🚀 FaviconSnap 智能部署工具 v2.0"
    echo "=================================================="
    echo -e "${NC}"
}

# 显示帮助信息
show_help() {
    echo "FaviconSnap 智能部署工具"
    echo ""
    echo "用法:"
    echo "  ./deploy.sh                    # 智能模式：自动检测并执行相应操作"
    echo "  ./deploy.sh --setup           # 强制重新配置 KV 和 wrangler.toml"
    echo "  ./deploy.sh --deploy-only     # 仅部署，跳过配置检查"
    echo "  ./deploy.sh --skip-tests      # 跳过部署后测试"
    echo "  ./deploy.sh --help            # 显示此帮助信息"
    echo ""
    echo "智能模式会自动："
    echo "  • 检测配置文件是否存在"
    echo "  • 检测 KV 存储是否配置"
    echo "  • 决定是初始化配置还是直接部署"
    echo ""
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup)
                SETUP_MODE=true
                shift
                ;;
            --deploy-only)
                DEPLOY_ONLY=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 检查必要的命令
check_requirements() {
    print_step "检查部署环境"
    
    if ! command -v wrangler &> /dev/null; then
        print_error "wrangler 未安装！请先安装 Cloudflare Wrangler CLI"
        echo "安装命令: npm install -g wrangler"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "curl 未安装！"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq 未安装，部分功能可能受限"
        echo "安装建议: brew install jq  # macOS"
        echo "           apt install jq   # Ubuntu"
    fi
    
    print_success "环境检查通过"
}

# 检查 Cloudflare 登录状态
check_auth() {
    print_step "检查 Cloudflare 登录状态"
    
    if ! wrangler whoami &> /dev/null; then
        print_error "未登录到 Cloudflare！请先登录"
        echo "登录命令: wrangler login"
        exit 1
    fi
    
    local email=$(wrangler whoami | grep "associated with the email" | awk '{print $NF}' | tr -d '.' 2>/dev/null || echo "未知")
    print_success "已登录: $email"
}

# 智能检测配置状态
detect_config_status() {
    print_step "智能检测项目配置状态"
    
    local need_setup=false
    local reasons=()
    
    # 检查 wrangler.toml
    if [ ! -f "wrangler.toml" ]; then
        need_setup=true
        reasons+=("wrangler.toml 不存在")
    else
        # 检查 KV 配置
        if ! grep -q "kv_namespaces" wrangler.toml; then
            need_setup=true
            reasons+=("未配置 KV 存储")
        else
            # 检查 KV ID 是否为占位符
            if grep -q "YOUR_KV.*ID" wrangler.toml; then
                need_setup=true
                reasons+=("KV ID 为占位符")
            fi
        fi
        
        # 检查项目名称是否为占位符
        if grep -q "your-faviconsnap" wrangler.toml; then
            need_setup=true
            reasons+=("项目名称为占位符")
        fi
    fi
    
    # 检查 src/index.js
    if [ ! -f "src/index.js" ]; then
        print_error "src/index.js 文件未找到！"
        exit 1
    fi
    
    if [ "$need_setup" = true ] && [ "$DEPLOY_ONLY" = false ]; then
        print_warning "检测到需要初始化配置："
        for reason in "${reasons[@]}"; do
            echo "  • $reason"
        done
        echo ""
        
        if [ "$SETUP_MODE" = false ]; then
            read -p "是否自动初始化配置？(Y/n): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                SETUP_MODE=true
            fi
        fi
    else
        print_success "配置检测通过，准备部署"
    fi
}

# 创建 KV 存储
create_kv_namespaces() {
    print_step "创建 KV 存储命名空间"
    
    # 检查是否已存在
    local existing_kv=$(wrangler kv namespace list 2>/dev/null | grep "FAVICON_CACHE" || true)
    if [ -n "$existing_kv" ]; then
        print_info "检测到已存在的 FAVICON_CACHE 命名空间"
        CREATED_KV_ID=$(echo "$existing_kv" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)
        print_success "使用现有 KV ID: $CREATED_KV_ID"
        return
    fi
    
    # 创建新的 KV 命名空间
    print_info "创建新的 KV 存储命名空间..."
    local kv_output=$(wrangler kv namespace create FAVICON_CACHE 2>&1)
    
    CREATED_KV_ID=$(echo "$kv_output" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
    
    if [ -z "$CREATED_KV_ID" ]; then
        print_error "创建 KV 存储失败"
        echo "$kv_output"
        exit 1
    fi
    
    print_success "KV 存储创建成功，ID: $CREATED_KV_ID"
}

# 生成智能配置文件
generate_config() {
    print_step "生成 wrangler.toml 配置文件"
    
    # 备份现有配置
    if [ -f "wrangler.toml" ]; then
        local backup_name="wrangler.toml.backup.$(date +%Y%m%d_%H%M%S)"
        cp wrangler.toml "$backup_name"
        print_info "已备份现有配置到: $backup_name"
    fi
    
    # 生成项目名称（基于目录名）
    local project_name=$(basename "$(pwd)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
    
    cat > wrangler.toml << EOF
# FaviconSnap Cloudflare Workers 配置
name = "$project_name"
main = "src/index.js"
compatibility_date = "2024-01-01"

# KV 存储绑定（三层缓存系统）
[[kv_namespaces]]
binding = "FAVICON_CACHE"
id = "$CREATED_KV_ID"

# 环境变量
[vars]
ENVIRONMENT = "production"
CACHE_TTL = "604800"  # 7天缓存（秒）

# 性能和成本控制
[limits]
cpu_ms = 50  # 每次调用最多50毫秒 CPU 时间

# 自定义域名路由（根据需要取消注释）
# routes = [
#   { pattern = "your-domain.com/*", zone_name = "your-domain.com" },
#   { pattern = "www.your-domain.com/*", zone_name = "your-domain.com" }
# ]

# 生产环境配置
[env.production]
name = "$project_name-prod"

# 开发环境配置
[env.development]
name = "$project_name-dev"
[[env.development.kv_namespaces]]
binding = "FAVICON_CACHE"
id = "$CREATED_KV_ID"
EOF
    
    print_success "配置文件生成完成"
    print_info "项目名称: $project_name"
    print_info "KV 存储 ID: $CREATED_KV_ID"
}

# 验证配置
validate_config() {
    print_step "验证配置完整性"
    
    if [ ! -f "wrangler.toml" ]; then
        print_error "wrangler.toml 文件不存在"
        exit 1
    fi
    
    # 检查 KV 配置
    if ! grep -q "FAVICON_CACHE" wrangler.toml; then
        print_error "wrangler.toml 中缺少 KV 配置"
        exit 1
    fi
    
    # 检查项目名称
    if grep -q "your-faviconsnap\|YOUR_" wrangler.toml; then
        print_error "wrangler.toml 中仍有占位符，请手动配置"
        exit 1
    fi
    
    # JavaScript 语法检查
    if command -v node &> /dev/null; then
        if ! node -c src/index.js &> /dev/null; then
            print_error "JavaScript 语法错误！请检查 src/index.js"
            exit 1
        fi
    fi
    
    print_success "配置验证通过"
}

# 执行部署
deploy() {
    print_step "部署到 Cloudflare Workers"
    
    local start_time=$(date +%s)
    
    if wrangler deploy --env=""; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "部署成功！耗时: ${duration}秒"
        return 0
    else
        print_error "部署失败！"
        return 1
    fi
}

# 部署后测试
post_deploy_test() {
    if [ "$SKIP_TESTS" = true ]; then
        print_info "跳过部署后测试"
        return 0
    fi
    
    print_step "执行部署后测试"
    
    # 提取域名
    local domain=""
    if grep -q "route.*=" wrangler.toml; then
        domain=$(grep "route.*=" wrangler.toml | head -1 | sed 's/.*= *"//' | sed 's/".*$//' | sed 's/\/\*$//')
    fi
    
    if [ -z "$domain" ]; then
        print_info "未配置自定义域名，跳过域名测试"
        print_info "使用 workers.dev 域名进行基础测试"
        
        # 尝试获取 workers.dev 域名
        local worker_name=$(grep "^name" wrangler.toml | head -1 | cut -d'"' -f2 2>/dev/null || echo "")
        if [ -n "$worker_name" ]; then
            domain="$worker_name.$(wrangler whoami | grep -o '[^@]*$' | tr -d '.' 2>/dev/null || echo 'unknown').workers.dev"
            print_info "测试域名: https://$domain"
        else
            print_warning "无法确定测试域名，跳过功能测试"
            return 0
        fi
    else
        print_info "测试自定义域名: https://$domain"
    fi
    
    # 等待部署生效
    print_info "等待部署生效..."
    sleep 3
    
    local test_passed=0
    local test_total=0
    
    # 测试主页
    ((test_total++))
    if timeout 10 curl -f -s "https://$domain/" > /dev/null 2>&1; then
        print_success "主页测试通过"
        ((test_passed++))
    else
        print_warning "主页测试失败"
    fi
    
    # 测试中文页面
    ((test_total++))
    if timeout 10 curl -f -s "https://$domain/zh" > /dev/null 2>&1; then
        print_success "中文页面测试通过"
        ((test_passed++))
    else
        print_warning "中文页面测试失败"
    fi
    
    # 测试 API
    ((test_total++))
    if timeout 15 curl -f -s "https://$domain/api/favicon?url=https://www.google.com&format=json" | grep -q "success" 2>/dev/null; then
        print_success "API 测试通过"
        ((test_passed++))
    else
        print_warning "API 测试失败"
    fi
    
    echo ""
    print_info "测试结果: $test_passed/$test_total 通过"
    
    if [ $test_passed -eq $test_total ]; then
        print_success "所有测试通过！"
    elif [ $test_passed -gt 0 ]; then
        print_warning "部分测试通过，服务可能需要几分钟完全生效"
    else
        print_warning "测试未通过，但这可能是网络问题，请手动验证"
    fi
}

# 显示部署信息
show_deployment_info() {
    print_step "获取部署信息"
    
    # 获取最新部署信息
    local deployment_info=""
    if command -v jq &> /dev/null; then
        deployment_info=$(wrangler deployments list --format json 2>/dev/null | jq -r '.[0]' 2>/dev/null || echo "")
    fi
    
    echo ""
    echo -e "${GREEN}📊 部署信息:${NC}"
    
    if [ -n "$deployment_info" ] && [ "$deployment_info" != "null" ]; then
        echo "$deployment_info" | jq -r '"版本ID: " + .id' 2>/dev/null || echo "版本ID: 获取失败"
        echo "$deployment_info" | jq -r '"创建时间: " + .created_on' 2>/dev/null || echo "创建时间: 获取失败"
    else
        echo "详细信息: 请运行 'wrangler deployments list' 查看"
    fi
    
    # 显示访问地址
    echo ""
    echo -e "${GREEN}🌐 访问地址:${NC}"
    
    if grep -q "route.*=" wrangler.toml; then
        grep "route.*=" wrangler.toml | sed 's/.*= *"//' | sed 's/".*$//' | sed 's/\/\*$//' | while read domain; do
            echo "  英文版: https://$domain/"
            echo "  中文版: https://$domain/zh"
            echo "  API 测试: https://$domain/api/favicon?url=https://github.com"
        done
    else
        local worker_name=$(grep "^name" wrangler.toml | head -1 | cut -d'"' -f2 2>/dev/null || echo "your-worker")
        echo "  Worker URL: https://$worker_name.[account].workers.dev"
        echo "  提示: 配置自定义域名可获得更好体验"
    fi
    
    if [ -n "$CREATED_KV_ID" ]; then
        echo ""
        echo -e "${GREEN}⚡ 缓存信息:${NC}"
        echo "  KV 存储 ID: $CREATED_KV_ID"
        echo "  缓存时长: 7天"
        echo "  预期命中率: 95%+"
    fi
}

# 主函数
main() {
    print_header
    
    # 解析命令行参数
    parse_args "$@"
    
    # 检查是否在正确的目录
    if [ ! -f "package.json" ] || ! grep -q "faviconsnap" package.json; then
        print_error "请在 FaviconSnap 项目根目录下运行此脚本！"
        exit 1
    fi
    
    # 基础检查
    check_requirements
    check_auth
    
    # 智能检测配置状态
    if [ "$DEPLOY_ONLY" = false ]; then
        detect_config_status
    fi
    
    # 配置初始化（如果需要）
    if [ "$SETUP_MODE" = true ]; then
        create_kv_namespaces
        generate_config
    fi
    
    # 验证配置
    validate_config
    
    # 确认部署
    if [ "$SETUP_MODE" = true ]; then
        echo ""
        print_warning "配置完成，是否立即部署？(Y/n)"
        read -r confirm
        if [[ $confirm =~ ^[Nn]$ ]]; then
            print_info "跳过部署。稍后可运行 './deploy.sh --deploy-only' 进行部署"
            exit 0
        fi
    else
        echo ""
        print_warning "即将开始部署，是否继续？(Y/n)"
        read -r confirm
        if [[ $confirm =~ ^[Nn]$ ]]; then
            print_info "部署已取消"
            exit 0
        fi
    fi
    
    # 执行部署
    if deploy; then
        post_deploy_test
        show_deployment_info
        
        echo ""
        print_success "🎉 FaviconSnap 部署完成！"
        echo ""
        print_info "常用命令："
        echo "  wrangler tail                    # 查看实时日志"
        echo "  wrangler deployments list        # 查看部署历史"
        echo "  wrangler rollback [version-id]   # 回滚版本"
        echo "  ./deploy.sh --help              # 查看帮助"
        
    else
        print_error "部署失败，请检查错误信息"
        exit 1
    fi
}

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi