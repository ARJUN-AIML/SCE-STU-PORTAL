import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # fix button and badge variants
    content = content.replace('variant="secondary"', 'variant="outline"')
    content = content.replace('variant="destructive"', 'variant="default"')
    
    # command palette fix
    content = content.replace('setCommandOpen(open => !open)', 'setCommandOpen((open: boolean) => !open)')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = r"e:\SCE Student Portal\frontend\src"
fix_file(os.path.join(base, "features", "clubs", "clubs-view.tsx"))
fix_file(os.path.join(base, "features", "map", "map-view.tsx"))
fix_file(os.path.join(base, "components", "command-palette.tsx"))
print("Done fixing TS errors.")
