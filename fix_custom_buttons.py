import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    def fix_Btn(m):
        btn = m.group(0)
        # Check if it's the main submit button
        if 'type="submit"' in btn or 'loading' in btn.lower() or 'confirm' in btn.lower() or 'enquire' in btn.lower():
            # Replace py-4, py-5, py-6 with h-[50px]
            btn = re.sub(r'\bpy-[1-6](?:\.[5])?\b', 'h-[50px]', btn)
            btn = re.sub(r'\bpy-\[.*?\]', 'h-[50px]', btn)
            # Add h-[50px] to className if it doesn't exist
            if 'className=' in btn and 'h-[50px]' not in btn:
                btn = re.sub(r'(className="[^"]*)(")', r'\1 h-[50px]\2', btn)
            return btn
        return btn

    new_content = re.sub(r'<Button[\s\S]*?>', fix_Btn, new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Fixed <Button> in {filepath}")
