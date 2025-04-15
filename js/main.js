// 从配置文件导入API配置
import config from './config.js';

// 语言顺序配置
const languageOrders = {
    normal: ['zh_CN', 'en_US', 'AR', 'TR', 'pt_BR', 'es_MX', 'TC'],
    backend: ['zh_CN', 'TC', 'en_US', 'ar', 'tr', 'es_MX', 'pt_BR']
};

// 添加字符限制常量
const MAX_CHARS_PER_BATCH = 300;

// DOM元素
document.addEventListener('DOMContentLoaded', () => {
    const inputTable = document.getElementById('inputTable');
    const resultTable = document.getElementById('resultTable');
    const addRowBtn = document.getElementById('addRow');
    const translateBtn = document.getElementById('translate');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const copyAllResultsBtn = document.getElementById('copyAllResults');
    const clearAllBtn = document.getElementById('clearAll');
    const sortToggle = document.getElementById('sortToggle');
    const modelSelect = document.getElementById('modelSelect');

    // 初始化开关标签文本
    const sortLabel = document.querySelector('label[for="sortToggle"]');
    sortLabel.textContent = '切换为后台';

    // 绑定事件监听器
    addRowBtn.addEventListener('click', addNewRow);
    translateBtn.addEventListener('click', startTranslation);
    copyAllResultsBtn.addEventListener('click', copyAllResults);
    clearAllBtn.addEventListener('click', clearAll);
    sortToggle.addEventListener('change', handleSortToggle);
    setupDeleteRowHandlers();
    setupPasteHandler();

    // 获取当前选择的模型配置
    function getCurrentModelConfig() {
        const selectedModel = modelSelect.value;
        return config.models[selectedModel];
    }

    // 添加新行
    function addNewRow() {
        const tbody = inputTable.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <textarea class="form-control description" rows="2" placeholder="请输入说明..."></textarea>
            </td>
            <td>
                <textarea class="form-control original-text" rows="2" placeholder="请输入原文..."></textarea>
            </td>
            <td>
                <button class="btn btn-danger btn-sm delete-row">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(newRow);
        setupDeleteRowHandlers();
    }

    // 设置删除行按钮的事件处理
    function setupDeleteRowHandlers() {
        document.querySelectorAll('.delete-row').forEach(button => {
            button.onclick = function() {
                const row = this.closest('tr');
                row.remove();
            };
        });
    }

    // 处理粘贴事件
    function setupPasteHandler() {
        inputTable.addEventListener('paste', (e) => {
            // 只处理粘贴到原文列的情况
            if (!e.target.classList.contains('original-text')) return;
            
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const rows = pastedText.split(/\r\n|\r|\n/).filter(row => row.trim()); // 处理不同系统的换行符

            // 如果只有一行，直接粘贴
            if (rows.length === 1) {
                e.target.value = rows[0];
                return;
            }

            // 获取当前粘贴的单元格所在行
            const currentRow = e.target.closest('tr');
            const tbody = inputTable.querySelector('tbody');
            const allRows = Array.from(tbody.querySelectorAll('tr'));
            const currentRowIndex = allRows.indexOf(currentRow);

            // 删除当前行后的所有行
            allRows.slice(currentRowIndex + 1).forEach(row => row.remove());

            // 更新当前行的内容
            currentRow.querySelector('.original-text').value = rows[0];

            // 为剩余的每一行创建新行
            rows.slice(1).forEach(text => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>
                        <textarea class="form-control description" rows="2" placeholder="请输入说明..."></textarea>
                    </td>
                    <td>
                        <textarea class="form-control original-text" rows="2">${text}</textarea>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-row">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(newRow);
            });

            // 重新设置删除按钮的事件处理
            setupDeleteRowHandlers();
        });
    }

    // 处理排序切换
    function handleSortToggle() {
        const isBackendSort = sortToggle.checked;
        const currentOrder = isBackendSort ? languageOrders.backend : languageOrders.normal;
        
        // 更新开关标签文本
        sortLabel.textContent = isBackendSort ? '切换为正常' : '切换为后台';
        
        // 更新表头顺序
        const thead = resultTable.querySelector('thead tr');
        thead.innerHTML = '';
        currentOrder.forEach(lang => {
            const th = document.createElement('th');
            th.textContent = lang.toUpperCase();
            thead.appendChild(th);
        });

        // 重新排序现有数据
        const tbody = resultTable.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const newRow = document.createElement('tr');
            
            currentOrder.forEach(lang => {
                const cell = cells.find(cell => cell.dataset.lang.toLowerCase() === lang.toLowerCase());
                if (cell) {
                    newRow.appendChild(cell.cloneNode(true));
                }
            });
            
            row.replaceWith(newRow);
        });

        // 重新设置单元格复制功能
        setupCellCopyHandlers();
    }

    // 开始翻译
    async function startTranslation() {
        try {
            showLoading();
            
            // 记录开始时间和总行数
            const startTime = new Date();
            const rows = Array.from(inputTable.querySelectorAll('tbody tr'));
            const totalRows = rows.length;
            console.log(`[翻译日志] 开始时间: ${startTime.toLocaleString()}`);
            console.log(`[翻译日志] 总行数: ${totalRows}`);
            
            const translations = [];
            let currentRow = 0;
            
            // 处理每一行
            for (const row of rows) {
                const description = row.querySelector('.description').value.trim();
                const originalText = row.querySelector('.original-text').value.trim();
                
                if (!originalText) continue;
                
                // 调用API进行翻译
                const result = await translateText(description, originalText, currentRow, totalRows);
                translations.push(result);
                currentRow++;
                
                // 更新总体进度
                const overallProgress = Math.round((currentRow / totalRows) * 100);
                updateProgress(overallProgress);
            }
            
            // 记录完成时间
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000;
            console.log(`[翻译日志] 完成时间: ${endTime.toLocaleString()}`);
            console.log(`[翻译日志] 总耗时: ${duration}秒`);
            
            // 更新结果表格
            updateResultTable(translations);
            showToast('翻译完成！', 'success');
            
        } catch (error) {
            console.error('Translation error:', error);
            showToast('翻译过程中发生错误，请重试。', 'error');
        } finally {
            hideLoading();
        }
    }

    // 修改 translateText 函数
    async function translateText(description, originalText, currentRow, totalRows) {
        try {
            console.log(`[翻译日志] 开始处理第 ${currentRow + 1}/${totalRows} 行...`);
            
            // 按行分割文本
            const lines = originalText.split('\n');
            let currentBatch = [];
            let currentCharCount = 0;
            let batches = [];
            
            // 按行分组，确保每行完整
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineLength = line.length;
                
                // 如果当前行加入后超过限制，且当前批次不为空，则保存当前批次
                if (currentCharCount + lineLength > MAX_CHARS_PER_BATCH && currentBatch.length > 0) {
                    batches.push(currentBatch.join('\n'));
                    currentBatch = [];
                    currentCharCount = 0;
                }
                
                // 添加当前行到批次
                currentBatch.push(line);
                currentCharCount += lineLength;
                
                // 如果是最后一行，保存当前批次
                if (i === lines.length - 1) {
                    batches.push(currentBatch.join('\n'));
                }
            }
            
            console.log(`[翻译日志] 第 ${currentRow + 1} 行被分成 ${batches.length} 个批次进行翻译`);
            console.log(`[翻译日志] 第 ${currentRow + 1} 行总字符数: ${originalText.length}`);
            
            // 存储所有批次的翻译结果
            let allTranslations = {
                zh_CN: [],
                en_US: [],
                AR: [],
                TR: [],
                pt_BR: [],
                es_MX: [],
                TC: []
            };
            
            // 逐批翻译
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                console.log(`[翻译日志] 正在翻译第 ${currentRow + 1} 行的第 ${i + 1}/${batches.length} 批次，字符数: ${batch.length}`);
                
                const modelConfig = getCurrentModelConfig();
                const systemPrompt = `你是一位专业的翻译专家，精通多种语言。请将以下文本翻译成指定的语言。

需要翻译的语言：
- zh_CN（简体中文）
- en_US（英语）
- AR（阿拉伯语）
- TR（土耳其语）
- pt_BR（巴西葡萄牙语）
- es_MX（墨西哥西班牙语）
- TC（繁体中文）

翻译要求：
1. 准确理解原文和场景说明
2. 根据场景说明选择最合适的翻译
3. 注意单复数、语境等细节
4. 保持翻译的地道性和准确性

请严格按照以下JSON格式返回（不要返回其他任何内容）：
{
  "translations": {
    "zh_CN": "简体中文翻译",
    "en_US": "英语翻译",
    "AR": "阿拉伯语翻译",
    "TR": "土耳其语翻译",
    "pt_BR": "巴西葡萄牙语翻译",
    "es_MX": "墨西哥西班牙语翻译",
    "TC": "繁体中文翻译"
  }
}`;

                const userPrompt = `原文：${batch}
场景说明：${description}

请按照上述格式返回翻译结果。`;

                const response = await fetch(modelConfig.API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${modelConfig.API_KEY}`
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: userPrompt
                            }
                        ],
                        model: modelConfig.MODEL,
                        stream: false,
                        temperature: 0.3
                    })
                });

                if (!response.ok) {
                    throw new Error(`翻译请求失败: ${response.status}`);
                }

                const data = await response.json();
                const content = data.choices[0].message.content;
                
                // 解析翻译结果
                let parsedContent;
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsedContent = JSON.parse(jsonMatch[0]);
                    }
                } catch (parseError) {
                    console.error('JSON解析错误:', parseError);
                    throw new Error('翻译结果格式不正确');
                }

                // 合并翻译结果
                if (parsedContent && parsedContent.translations) {
                    Object.keys(allTranslations).forEach(lang => {
                        if (parsedContent.translations[lang]) {
                            allTranslations[lang].push(parsedContent.translations[lang]);
                        }
                    });
                }
                
                // 更新当前行的进度
                const rowProgress = Math.round(((i + 1) / batches.length) * 100);
                console.log(`[翻译日志] 第 ${currentRow + 1} 行进度: ${rowProgress}%`);
            }
            
            // 合并所有批次的翻译结果
            const finalTranslations = {};
            Object.keys(allTranslations).forEach(lang => {
                finalTranslations[lang] = allTranslations[lang].join('\n');
            });
            
            return finalTranslations;
        } catch (error) {
            console.error('翻译出错:', error);
            throw error;
        }
    }

    // 添加进度更新函数
    function updateProgress(progress) {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `翻译进度: ${progress}%`;
            
            // 当进度达到100%时，添加完成动画
            if (progress === 100) {
                progressBar.classList.add('progress-complete');
                setTimeout(() => {
                    progressBar.classList.remove('progress-complete');
                }, 500);
            }
        }
    }

    // 更新结果表格
    function updateResultTable(translations) {
        const tbody = resultTable.querySelector('tbody');
        tbody.innerHTML = '';

        // 获取当前排序顺序
        const currentOrder = sortToggle.checked ? languageOrders.backend : languageOrders.normal;

        // 获取输入表格的所有行
        const inputRows = Array.from(inputTable.querySelectorAll('tbody tr'));
        
        // 确保翻译结果与输入行一一对应
        translations.forEach((translation, index) => {
            const row = document.createElement('tr');
            
            currentOrder.forEach(lang => {
                const cell = document.createElement('td');
                cell.className = 'selectable';
                cell.dataset.lang = lang;
                
                const span = document.createElement('span');
                span.className = 'cell-content';
                span.textContent = translation[lang] || '';
                
                cell.appendChild(span);
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });

        // 设置单元格复制功能
        setupCellCopyHandlers();
    }

    // 设置单元格复制功能
    function setupCellCopyHandlers() {
        // 设置列选择功能
        document.querySelectorAll('thead th').forEach((th, index) => {
            th.addEventListener('click', function() {
                const rows = Array.from(resultTable.querySelectorAll('tbody tr'));
                const lang = this.textContent.trim(); // 获取表头的语言代码
                const columnContent = rows.map(row => {
                    const cell = row.querySelector(`td[data-lang="${lang}"] .cell-content`);
                    return cell ? cell.textContent : '';
                }).join('\n');
                
                navigator.clipboard.writeText(columnContent)
                    .then(() => {
                        showToast('已复制整列内容', 'success');
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                        showToast('复制失败，请重试', 'error');
                    });
            });
        });

        // 设置单元格点击事件
        document.querySelectorAll('.selectable').forEach(cell => {
            cell.addEventListener('click', function() {
                // 移除其他单元格的焦点
                document.querySelectorAll('.selectable').forEach(c => {
                    if (c !== this) {
                        c.classList.remove('focused');
                    }
                });
                
                // 添加当前单元格的焦点
                this.classList.add('focused');
                
                // 选中单元格内容
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(this.querySelector('.cell-content'));
                selection.removeAllRanges();
                selection.addRange(range);
            });
        });
    }

    // 复制所有结果
    function copyAllResults() {
        const rows = Array.from(resultTable.querySelectorAll('tbody tr'));
        if (rows.length === 0) {
            showToast('没有可复制的翻译结果', 'warning');
            return;
        }

        let csvContent = '';

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('.cell-content'));
            const rowContent = cells.map(cell => cell.textContent).join('\t');
            csvContent += rowContent + '\n';
        });

        navigator.clipboard.writeText(csvContent)
            .then(() => {
                showToast('已复制所有翻译结果', 'success');
            })
            .catch(err => {
                console.error('复制失败:', err);
                showToast('复制失败，请重试', 'error');
            });
    }

    // 清空所有行
    function clearAll() {
        const inputTbody = inputTable.querySelector('tbody');
        const resultTbody = resultTable.querySelector('tbody');
        
        // 清空输入表格，只保留一行
        inputTbody.innerHTML = `
            <tr>
                <td>
                    <textarea class="form-control description" rows="2" placeholder="请输入说明..."></textarea>
                </td>
                <td>
                    <textarea class="form-control original-text" rows="2" placeholder="请输入原文..."></textarea>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-row">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        // 清空结果表格
        resultTbody.innerHTML = '';
        
        // 重新设置删除按钮的事件处理
        setupDeleteRowHandlers();
        
        showToast('已清空所有内容', 'success');
    }

    // 显示加载动画
    function showLoading() {
        loadingOverlay.classList.remove('d-none');
    }

    // 隐藏加载动画
    function hideLoading() {
        loadingOverlay.classList.add('d-none');
    }

    // 显示Toast提示
    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast show`;
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // 3秒后自动消失
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // 创建Toast容器
    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}); 