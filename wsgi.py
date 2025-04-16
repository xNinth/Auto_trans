"""
WSGI入口文件，用于Vercel部署
在导入Flask应用之前先应用补丁
"""
# 首先应用werkzeug补丁
import patch_werkzeug

# 导入app实例
from app import app

# 为Vercel Serverless Functions导出应用
if __name__ == "__main__":
    app.run() 