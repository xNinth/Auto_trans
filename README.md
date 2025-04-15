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

## 自动翻译机

一个支持多语言批量翻译的智能工具，使用先进的AI模型进行翻译。

## 功能特点

1. **多语言支持**
   - 支持简体中文、英语、阿拉伯语、土耳其语、巴西葡萄牙语、墨西哥西班牙语、繁体中文
   - 可切换语言显示顺序（正常/后台模式）

2. **批量翻译**
   - 支持多行文本同时翻译
   - 自动分批处理长文本
   - 实时显示翻译进度

3. **智能模型选择**
   - 支持 Deepseek-V3 和 Grok-3 模型
   - 翻译过程中显示当前使用的模型
   - 可随时切换模型

4. **用户友好的界面**
   - 玻璃态设计风格
   - 实时进度显示
   - 支持取消翻译操作
   - 复制翻译结果
   - 清空所有内容

## 使用方法

1. **输入文本**
   - 在左侧输入区域添加需要翻译的文本
   - 每行可以添加说明信息
   - 支持粘贴多行文本

2. **选择模型**
   - 从下拉菜单选择要使用的AI模型
   - 当前支持 Deepseek-V3 和 Grok-3

3. **开始翻译**
   - 点击"开始翻译"按钮
   - 查看实时翻译进度
   - 可以随时点击"取消翻译"按钮停止翻译

4. **查看结果**
   - 翻译结果会显示在右侧表格中
   - 可以切换语言显示顺序
   - 支持复制单个单元格或全部结果

## 技术特点

1. **分批处理机制**
   - 自动将长文本分成多个批次
   - 每批次限制字符数，确保翻译质量
   - 实时显示处理进度

2. **进度显示**
   - 显示总体翻译进度
   - 显示当前使用的模型
   - 支持取消操作

3. **错误处理**
   - 自动处理翻译错误
   - 显示友好的错误提示
   - 支持重试操作

## 界面说明

1. **输入区域**
   - 说明列：可添加翻译场景说明
   - 原文列：输入需要翻译的文本
   - 操作列：删除行按钮

2. **结果区域**
   - 多语言列：显示翻译结果
   - 排序切换：切换语言显示顺序
   - 操作按钮：复制结果、清空内容

3. **进度显示**
   - 加载动画：表示正在处理
   - 进度条：显示总体进度
   - 模型信息：显示当前使用的模型
   - 取消按钮：停止翻译操作

## 注意事项

1. 确保网络连接稳定
2. 长文本会自动分批处理
3. 可以随时取消翻译操作
4. 翻译结果会自动保存到表格中

## 更新日志

### 2024-04-15
- 添加翻译进度显示功能
- 添加取消翻译功能
- 添加当前模型显示功能
- 优化用户界面交互

## 未来计划

1. 添加更多AI模型支持
2. 优化翻译质量
3. 添加翻译历史记录
4. 支持更多语言

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