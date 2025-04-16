// API配置
const config = {
    // API基础URL
    API_BASE_URL: 'https://auto-trans2-backend-git-main-franks-projects-e196e717.vercel.app',
    
    // API端点
    ENDPOINTS: {
        translate: '/translate',
        health: '/'
    },
    
    // 翻译模型配置
    models: {
        grok: {
            name: 'Grok-3',
            maxLength: 2000
        },
        deepseek: {
            name: 'Deepseek-V3',
            maxLength: 2000
        }
    },
    
    // 翻译批次大小限制
    MAX_CHARS_PER_BATCH: 300,
    
    // 请求超时时间（毫秒）
    TIMEOUT: 30000,
    
    // 重试配置
    RETRY: {
        maxAttempts: 3,
        delay: 1000 // 毫秒
    }
};

// 防止配置被修改
Object.freeze(config);

export default config; 