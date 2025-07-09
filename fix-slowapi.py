#!/usr/bin/env python3
"""
Script to fix SlowAPI rate limiting issues in all microservices
"""

import os
import re

def fix_service_imports(file_path):
    """Add Request import to FastAPI imports"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if Request is already imported
    if 'from fastapi import' in content and 'Request' not in content:
        # Find the FastAPI import line and add Request
        import_pattern = r'from fastapi import ([^)]+)(?!\s*Request)'
        def add_request(match):
            imports = match.group(1)
            if 'Request' not in imports:
                imports = imports.rstrip() + ', Request'
            return f'from fastapi import {imports}'
        
        content = re.sub(import_pattern, add_request, content)
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Fixed imports in {file_path}")

def fix_rate_limited_functions(file_path):
    """Fix rate limited function signatures to include Request parameter"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Pattern to match rate limited function definitions
    pattern = r'(@limiter\.limit\([^)]+\)\s*async def\s+\w+\([^)]*)\):'
    
    def fix_function_signature(match):
        full_match = match.group(0)
        signature_part = match.group(1)
        
        # Check if 'request: Request' is already in the signature
        if 'request: Request' in signature_part:
            return full_match
        
        # Add 'request: Request' as the first parameter after the function name
        # Find the opening parenthesis after the function name
        func_def_pattern = r'(@limiter\.limit\([^)]+\)\s*async def\s+)(\w+)\(([^)]*)\):'
        def add_request_param(m):
            decorator_and_def = m.group(1)
            func_name = m.group(2)
            params = m.group(3).strip()
            
            if params and not params.startswith('request: Request'):
                new_params = f'request: Request, {params}' if params else 'request: Request'
            elif not params:
                new_params = 'request: Request'
            else:
                new_params = params
            
            return f'{decorator_and_def}{func_name}({new_params}):'
        
        return re.sub(func_def_pattern, add_request_param, full_match)
    
    content = re.sub(pattern, fix_function_signature, content, flags=re.MULTILINE | re.DOTALL)
    
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Fixed rate limited functions in {file_path}")

def main():
    services_dir = "/Users/ssivared/MyResume/secure-ecommerce-microservices/services"
    
    # Find all app.py files in service directories
    for service in os.listdir(services_dir):
        service_path = os.path.join(services_dir, service)
        if os.path.isdir(service_path):
            app_py = os.path.join(service_path, "app.py")
            if os.path.exists(app_py):
                print(f"Processing {service}...")
                fix_service_imports(app_py)
                fix_rate_limited_functions(app_py)

if __name__ == "__main__":
    main()
