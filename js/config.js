// API配置
const config = {
    models: {
        grok: {
            API_ENDPOINT: 'https://api.x.ai/v1/chat/completions',
            API_KEY: 'xai-oS4wR4bONkaeCWxjk1B9AtWwcSRe5QvDdbgAPqOky2YB32MZFgfPtrtXfbiDJE5r8DUCfEqL8zqbNtwX',
            MODEL: 'grok-3-latest'
        },
        deepseek: {
            API_ENDPOINT: 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions',
            API_KEY: '4c0ef95e-fd56-49f0-b31d-fb4f87cec2b5',
            MODEL: 'bot-20250213192545-kvpx2'
        }
    }
};

// 防止直接修改配置
Object.freeze(config);

export default config; 