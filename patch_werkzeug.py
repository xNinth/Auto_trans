"""
补丁文件：修复werkzeug.urls模块中缺少url_quote函数的问题
此文件应该在任何导入Flask的代码之前运行
"""
import sys
import importlib.util

def apply_werkzeug_patch():
    """为werkzeug.urls模块添加url_quote函数"""
    try:
        # 首先尝试导入werkzeug.urls模块
        if importlib.util.find_spec('werkzeug.urls'):
            import werkzeug.urls
            
            # 检查是否缺少url_quote函数
            if not hasattr(werkzeug.urls, 'url_quote'):
                # 如果存在quote函数，将其作为url_quote的别名
                if hasattr(werkzeug.urls, 'quote'):
                    werkzeug.urls.url_quote = werkzeug.urls.quote
                    print("[PATCH] 已将werkzeug.urls.quote作为url_quote的别名", file=sys.stderr)
                # 否则从urllib.parse导入
                else:
                    import urllib.parse
                    werkzeug.urls.url_quote = urllib.parse.quote
                    print("[PATCH] 已从urllib.parse导入quote作为werkzeug.urls.url_quote", file=sys.stderr)
                
                print("[PATCH] 成功修补werkzeug.urls模块，添加了url_quote函数", file=sys.stderr)
                return True
            else:
                print("[PATCH] werkzeug.urls.url_quote已存在，不需要修补", file=sys.stderr)
                return False
        else:
            print("[PATCH] 未找到werkzeug.urls模块", file=sys.stderr)
            return False
    except Exception as e:
        print(f"[PATCH] 尝试修补werkzeug.urls模块时出错: {e}", file=sys.stderr)
        return False

# 自动应用补丁
apply_werkzeug_patch() 