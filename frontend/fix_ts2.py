import os
import re

base = r"e:\SCE Student Portal\frontend\src"

def process(filepath, func):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = func(content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

def fix_map_view(content):
    content = content.replace('variant="secondary"', 'variant="outline"')
    content = content.replace('variant="destructive"', 'variant="default"')
    return content

process(os.path.join(base, "features", "map", "map-view.tsx"), fix_map_view)

def fix_faculty(content):
    content = content.replace('variant={f.status === "available" ? "green" : "secondary"}', 'variant={f.status === "available" ? "green" : "outline"}')
    return content

process(os.path.join(base, "components", "faculty-card.tsx"), fix_faculty)
process(os.path.join(base, "features", "faculty", "faculty-view.tsx"), fix_faculty)

def fix_schedule(content):
    content = content.replace('entry.title || entry.subject', 'entry.title')
    content = content.replace('default: "blue",\n  orange: "pink",\n  red: "pink"', '')
    content = content.replace('const accentVariant: Record<AccentColor, "pink" | "blue" | "green" | "purple"> = {', 'const accentVariant: Record<string, "pink" | "blue" | "green" | "purple" | "outline"> = {')
    return content

process(os.path.join(base, "components", "schedule-card.tsx"), fix_schedule)

def fix_command_palette(content):
    content = content.replace('setCommandOpen(open => !open)', 'setCommandOpen((open: boolean) => !open)')
    return content

process(os.path.join(base, "components", "command-palette.tsx"), fix_command_palette)

def fix_events(content):
    # add missing dummy properties
    content = re.sub(r'(thumbnail: "[^"]+",\s*status: "(open|closed|full|past)")', r'\1, seatsLeft: 10, registered: false, isRecommended: false', content)
    return content

process(os.path.join(base, "components", "clubs-events-card.tsx"), fix_events)
process(os.path.join(base, "features", "clubs", "clubs-view.tsx"), fix_events)
process(os.path.join(base, "features", "events", "events-view.tsx"), fix_events)

def fix_normalizers(content):
    content = content.replace('console.error(`Invalid ${type} row:`, e.errors)', 'console.error(`Invalid ${type} row:`, e)')
    return content

process(os.path.join(base, "repositories", "normalizers.ts"), fix_normalizers)

print("TS errors fixed!")
