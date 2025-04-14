// 从配置文件导入API配置
import config from './config.js';

// DOM元素
document.addEventListener('DOMContentLoaded', () => {
    const inputTable = document.getElementById('inputTable');
    const resultTable = document.getElementById('resultTable');
    const addRowBtn = document.getElementById('addRow');
    const translateBtn = document.getElementById('translate');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const copyAllResultsBtn = document.getElementById('copyAllResults');
    const clearAllBtn = document.getElementById('clearAll');

    // 绑定事件监听器
    addRowBtn.addEventListener('click', addNewRow);
    translateBtn.addEventListener('click', startTranslation);
    copyAllResultsBtn.addEventListener('click', copyAllResults);
    clearAllBtn.addEventListener('click', clearAll);
    setupDeleteRowHandlers();
    setupPasteHandler();

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

            // 自动调整所有文本框的高度
            document.querySelectorAll('.original-text').forEach(textarea => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });
    }

    // 开始翻译
    async function startTranslation() {
        try {
            showLoading();
            
            // 获取所有输入行
            const rows = Array.from(inputTable.querySelectorAll('tbody tr'));
            const translations = [];
            
            // 处理每一行
            for (const row of rows) {
                const description = row.querySelector('.description').value.trim();
                const originalText = row.querySelector('.original-text').value.trim();
                
                if (!originalText) continue;
                
                // 调用API进行翻译
                const result = await translateText(description, originalText);
                translations.push(result);
            }
            
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

    // 调用翻译API
    async function translateText(description, originalText) {
        try {
            console.log('Sending translation request...'); // 调试日志
            const systemPrompt = `你是一个专业的多语言翻译助手。请将文本翻译成多种语言，并以固定的JSON格式返回。

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

            const userPrompt = `原文：${originalText}
场景说明：${description}

请按照上述格式返回翻译结果。`;

            const response = await fetch(config.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.API_KEY}`
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
                    model: config.MODEL,
                    stream: false,
                    temperature: 0.3 // 降低温度以获得更稳定的输出
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // 调试日志
            
            // 初始化默认翻译结果
            const translations = {
                zh_CN: originalText, // 保持原文
                en_US: '',
                AR: '',
                TR: '',
                pt_BR: '',
                es_MX: '',
                TC: ''
            };

            try {
                // 解析API返回的内容
                const content = data.choices[0].message.content;
                let parsedContent;

                // 如果返回的是字符串，尝试解析JSON
                if (typeof content === 'string') {
                    try {
                        // 尝试找到JSON部分
                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            parsedContent = JSON.parse(jsonMatch[0]);
                        }
                    } catch (parseError) {
                        console.error('JSON parsing error:', parseError);
                    }
                } else {
                    parsedContent = content;
                }

                // 如果成功解析到translations对象，更新翻译结果
                if (parsedContent && parsedContent.translations) {
                    Object.keys(translations).forEach(lang => {
                        if (parsedContent.translations[lang]) {
                            translations[lang] = parsedContent.translations[lang];
                        }
                    });
                } else {
                    console.error('Invalid response format:', content);
                    showToast('翻译结果格式不正确，请重试', 'error');
                }
            } catch (error) {
                console.error('Error processing translation result:', error);
                showToast('处理翻译结果时出错，请重试', 'error');
            }
            
            return translations;
            
        } catch (error) {
            console.error('Translation API Error:', error);
            showToast('翻译服务出错，请重试', 'error');
            throw error;
        }
    }

    // 更新结果表格样式
    function updateResultTable(translations) {
        const tbody = resultTable.querySelector('tbody');
        tbody.innerHTML = '';

        translations.forEach(translation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="selectable" data-lang="zh_CN">
                    <span class="cell-content">${translation.zh_CN}</span>
                </td>
                <td class="selectable" data-lang="en_US">
                    <span class="cell-content">${translation.en_US}</span>
                </td>
                <td class="selectable" data-lang="AR">
                    <span class="cell-content">${translation.AR}</span>
                </td>
                <td class="selectable" data-lang="TR">
                    <span class="cell-content">${translation.TR}</span>
                </td>
                <td class="selectable" data-lang="pt_BR">
                    <span class="cell-content">${translation.pt_BR}</span>
                </td>
                <td class="selectable" data-lang="es_MX">
                    <span class="cell-content">${translation.es_MX}</span>
                </td>
                <td class="selectable" data-lang="TC">
                    <span class="cell-content">${translation.TC}</span>
                </td>
            `;
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