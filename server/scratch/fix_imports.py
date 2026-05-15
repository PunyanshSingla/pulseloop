import os
import re

def update_imports(directory):
    import_regex = re.compile(r'(import|export)(.*?)from\s+["\'](\.\.?/[^"\']+)["\']', re.MULTILINE | re.DOTALL)
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                def replace_func(match):
                    keyword = match.group(1)
                    middle = match.group(2)
                    import_path = match.group(3)
                    
                    # Skip if it already has an extension
                    if any(import_path.endswith(ext) for ext in ['.js', '.json', '.css', '.ts']):
                        # If it ends in .ts, change to .js
                        if import_path.endswith('.ts'):
                            return f'{keyword}{middle}from "{import_path[:-3]}.js"'
                        return match.group(0)
                    
                    # If it's a directory import, we should ideally check for index.js but NodeNext expects full paths
                    # For now, let's just add .js
                    return f'{keyword}{middle}from "{import_path}.js"'

                new_content = import_regex.sub(replace_func, content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {path}")

if __name__ == "__main__":
    update_imports("src")
