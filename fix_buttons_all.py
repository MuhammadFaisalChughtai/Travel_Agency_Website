import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    # Find ALL <button ...> tags that contain "submit" or "loading" and change py-X to h-[50px]
    def fix_btn(m):
        btn = m.group(0)
        # Check if it's the main submit button
        if 'type="submit"' in btn or 'loading' in btn.lower() or 'confirm' in btn.lower():
            # Replace py-4, py-5, py-6 with h-[50px]
            btn = re.sub(r'\bpy-[1-6](?:\.[5])?\b', 'h-[50px]', btn)
            # Remove any existing py-[XXpx]
            btn = re.sub(r'\bpy-\[.*?\]', 'h-[50px]', btn)
            return btn
        return btn

    new_content = re.sub(r'<button[\s\S]*?>', fix_btn, new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Fixed {filepath}")
