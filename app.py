# 在导入Flask之前先应用补丁
import sys
import importlib.util

# Monkey patch werkzeug.urls以添加url_quote函数
try:
    # 首先尝试导入werkzeug.urls模块
    if importlib.util.find_spec('werkzeug.urls'):
        import werkzeug.urls
        
        # 检查是否缺少url_quote函数
        if not hasattr(werkzeug.urls, 'url_quote'):
            # 如果存在quote函数，将其作为url_quote的别名
            if hasattr(werkzeug.urls, 'quote'):
                werkzeug.urls.url_quote = werkzeug.urls.quote
            # 否则从urllib.parse导入
            else:
                import urllib.parse
                werkzeug.urls.url_quote = urllib.parse.quote
                
        print("已成功修补werkzeug.urls模块，添加了url_quote函数", file=sys.stderr)
except Exception as e:
    print(f"尝试修补werkzeug.urls模块时出错: {e}", file=sys.stderr)

# 现在导入Flask
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
import json
import logging
from logging.handlers import RotatingFileHandler
import time
from datetime import datetime

# ... 其余代码保持不变 ... 