# Auto_trans2 项目

这是一个自动翻译工具项目。

## Git 操作指南

由于本项目使用 GitHub Desktop 内置的 Git，所以需要使用完整的 Git 路径。以下是标准操作流程：

### 1. Git 环境设置

Git 可执行文件的标准路径：
```
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe
```

为了方便使用，建议将此路径设置为环境变量或创建别名。

### 2. 标准 Git 操作流程

#### 2.1 查看当前状态
```powershell
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe status
```

#### 2.2 添加更改
```powershell
# 添加单个文件
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe add [文件路径]

# 添加所有更改
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe add .
```

#### 2.3 提交更改
```powershell
# 使用单引号来避免中文字符的问题
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe commit -m '提交说明'
```

#### 2.4 推送到远程仓库
```powershell
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe push origin [分支名]
```

#### 2.5 标签管理
```powershell
# 创建标签
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe tag [标签名]

# 推送标签
C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe push origin [标签名]
```

### 3. 注意事项

1. 提交中文说明时使用单引号而不是双引号，避免字符编码问题
2. 每次操作前先用 `status` 命令检查仓库状态
3. 提交前确保已经添加(`add`)所有需要的文件
4. 推送前确保本地提交已完成
5. 如果遇到 PowerShell 控制台报错，可以尝试使用 `cmd /c` 前缀来执行命令

### 4. 常见问题解决

1. 如果提交时出现编码问题，尝试：
   ```powershell
   cmd /c "C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe commit -m '提交说明'"
   ```

2. 如果需要取消最后一次提交：
   ```powershell
   C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe reset HEAD~1
   ```

3. 如果需要切换分支：
   ```powershell
   C:\Users\[用户名]\AppData\Local\GitHubDesktop\app-[版本号]\resources\app\git\cmd\git.exe checkout [分支名]
   ```

记住：在执行任何 Git 操作之前，都建议先使用 `status` 命令检查当前状态，这样可以避免很多潜在的问题。

## 自动翻译机 (Auto Translator)

一个强大的多语言自动批量翻译工具，支持将文本翻译成多种语言的网页应用。

## 功能特性

- 支持多语言翻译：
  - 简体中文 (zh_CN)
  - 英语 (en_US)
  - 阿拉伯语 (AR)
  - 土耳其语 (TR)
  - 巴西葡萄牙语 (pt_BR)
  - 墨西哥西班牙语 (es_MX)
  - 繁体中文 (TC)

- Excel风格的界面：
  - 支持批量输入和翻译
  - 行对齐的表格展示
  - 支持动态增减行数
  - 支持复制粘贴批量输入

- 智能翻译：
  - 基于上下文的智能翻译
  - 支持说明补充，提高翻译准确度
  - 自动处理单复数等语法特性

- 现代化UI设计：
  - 玻璃态拟态设计风格
  - 响应式布局
  - 优雅的加载动画
  - 友好的操作反馈

## 使用说明

1. 在左侧表格中：
   - "说明"列：输入对原文的场景说明和上下文补充
   - "原文"列：输入需要翻译的文本内容

2. 支持批量操作：
   - 可以直接从其他文档复制多行内容粘贴
   - 使用"+"和"-"按钮增减行数

3. 点击"翻译"按钮：
   - 系统会自动处理所有输入的内容
   - 翻译结果会实时显示在右侧对应的语言列中

4. 翻译结果：
   - 自动保持与输入行对齐
   - 支持复制导出

## 项目启动方式

1. **通过 Python 启动（推荐）**：
   - 打开终端（命令提示符或 PowerShell）
   - 进入项目根目录
   - 运行命令：`python -m http.server 8000`
   - 在浏览器中访问：`http://localhost:8000`

2. **直接打开**：
   - 在文件管理器中找到项目根目录
   - 双击 `index.html` 文件
   - 使用浏览器打开（推荐使用 Chrome 浏览器）

## 技术栈

- 前端：HTML5, CSS3, JavaScript, Bootstrap 5
- AI模型：Grok 3
- 设计风格：Glass Morphism (玻璃态设计)

## 开发环境要求

- 操作系统：Windows 11
- 浏览器：Chrome 135.0.7049.85 或更高版本
- Python 3.x（用于启动本地服务器） 