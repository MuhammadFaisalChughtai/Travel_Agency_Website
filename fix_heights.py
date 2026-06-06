import glob
import re

# Update MathChallenge.tsx first
math_path = 'src/components/ui/MathChallenge.tsx'
with open(math_path, "r", encoding="utf-8") as f:
    math_content = f.read()

# Replace py-3 with h-[50px] in MathChallenge
math_content = re.sub(r'px-4 py-3 rounded-xl', r'px-4 h-[50px] rounded-xl', math_content)
with open(math_path, "w", encoding="utf-8") as f:
    f.write(math_content)


files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    # Find the submit button which follows the MathChallenge
    # We want to replace py-4, py-5, py-6, etc with h-[50px] on the submit buttons.
    # A safe regex: target the <button type="submit" ... className="...">
    
    def fix_button(m):
        btn = m.group(0)
        if 'disabled={status === "loading"}' in btn or 'type="submit"' in btn:
            # Replace padding with fixed height
            btn = re.sub(r'\bpy-[1-9](?:\.[5])?\b', 'h-[50px]', btn)
            btn = re.sub(r'\bpy-\[.*?\]', 'h-[50px]', btn)
            return btn
        return btn
        
    # We can match `<button type="submit"` block up to `className="...`
    # Let's just find `type="submit"` buttons and apply h-[50px] if not there
    if 'type="submit"' in new_content and '<MathChallenge' in new_content:
        new_content = re.sub(r'<button\s+type="submit"[^>]*className="[^"]*"', fix_button, new_content)
        
        # In case the button doesn't have type="submit" but is the submit button
        # e.g., FlightEnquireButton might just be <button onClick={...} >
        # We can just run a blanket replace for buttons near the status loading
        new_content = re.sub(r'<button\s+(?:[^>]*?)disabled={status === "loading"}(?:[^>]*?)className="([^"]*)"', fix_button, new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Fixed Button Height in {filepath}")
