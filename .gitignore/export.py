import os

# --- Configuration ---
OUTPUT_FILE = "ai_project_export.txt"

# Folders to completely ignore to save space and context window
IGNORE_DIRS = {
    ".git", "__pycache__", "node_modules", "venv", ".venv", 
    "env", ".vscode", ".idea", "dist", "build", "coverage"
}

# Known non-text extensions to skip immediately
IGNORE_EXTENSIONS = {
    ".pyc", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", 
    ".zip", ".tar", ".gz", ".mp4", ".mp3", ".wav", ".sqlite3"
}

def is_text_file(filepath):
    """Checks if a file can be read as standard UTF-8 text."""
    try:
        with open(filepath, 'r', encoding='utf-8') as check_file:
            check_file.read(1024)
            return True
    except UnicodeDecodeError:
        return False

def generate_directory_tree(startpath, script_name):
    """Generates a visual tree string of the directory structure."""
    tree_str = "============================================================\n"
    tree_str += "--- PROJECT DIRECTORY TREE ---\n"
    tree_str += "============================================================\n\n"
    
    # Get the absolute root folder name
    root_name = os.path.basename(os.path.abspath(startpath)) or startpath
    tree_str += f"{root_name}/\n"
    
    def add_to_tree(current_path, prefix=""):
        nonlocal tree_str
        try:
            items = os.listdir(current_path)
        except PermissionError:
            return
        
        # Filter ignored dirs, the script itself, and the output file
        filtered_items = []
        for item in items:
            if item in IGNORE_DIRS:
                continue
            if item == script_name or item == OUTPUT_FILE:
                continue
            filtered_items.append(item)
        
        # Sort: Directories first, then files alphabetically
        filtered_items.sort(key=lambda x: (not os.path.isdir(os.path.join(current_path, x)), x.lower()))
        
        for index, item in enumerate(filtered_items):
            is_last = (index == len(filtered_items) - 1)
            connector = "└── " if is_last else "├── "
            tree_str += f"{prefix}{connector}{item}\n"
            
            item_path = os.path.join(current_path, item)
            if os.path.isdir(item_path):
                extension = "    " if is_last else "│   "
                add_to_tree(item_path, prefix + extension)

    add_to_tree(startpath)
    return tree_str + "\n\n"

def compile_project():
    script_name = os.path.basename(__file__)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        # 1. Generate and write the directory tree first
        tree_output = generate_directory_tree('.', script_name)
        outfile.write(tree_output)
        
        outfile.write("============================================================\n")
        outfile.write("--- FILE CONTENTS ---\n")
        outfile.write("============================================================\n\n")

        # 2. Walk through the directory tree and append file contents
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if file == script_name or file == OUTPUT_FILE:
                    continue
                
                _, ext = os.path.splitext(file)
                if ext.lower() in IGNORE_EXTENSIONS:
                    continue
                
                filepath = os.path.join(root, file)
                
                if is_text_file(filepath):
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                        outfile.write(f"\n{'='*60}\n")
                        outfile.write(f"--- FILE: {filepath} ---\n")
                        outfile.write(f"{'='*60}\n\n")
                        
                        outfile.write(content)
                        outfile.write("\n\n")
                    except Exception as e:
                        print(f"Warning: Could not read {filepath}: {e}")

    print(f"Success! Project extracted with directory tree to '{OUTPUT_FILE}'.")

if __name__ == "__main__":
    compile_project()