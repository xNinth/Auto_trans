// API配置
const config = {
    API_ENDPOINT: 'https://api.x.ai/v1/chat/completions',
    API_KEY: 'xai-oS4wR4bONkaeCWxjk1B9AtWwcSRe5QvDdbgAPqOky2YB32MZFgfPtrtXfbiDJE5r8DUCfEqL8zqbNtwX', // 在生产环境中，这个值应该从环境变量或安全的配置管理系统中获取
    MODEL: 'grok-3-latest'
};

// 防止直接修改配置
Object.freeze(config);

export default config; 